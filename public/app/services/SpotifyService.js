angular.module('festerrApp').factory('SpotifyService', function($q, $location, $cookies, $interval) {

    var userID = undefined;
    var userInfo = {};
    var userArtists = [];
    var refreshTokenTimer;
    
    return {
        getUserInfo: getUserInfo,
        getAllArtists: getAllArtists,
        filterUserArtists: filterUserArtists,
        refreshAccessToken: refreshAccessToken,
        setup: setup
    };

    // Returns user's spotify info
    function getUserInfo() {
        var deferred = $q.defer();

        var accessToken = $cookies.get('spotifyAccessToken');

        if (userID === undefined) {
            if (accessToken === undefined) {
                // no access code given, user hasn't authed with spotify, return empty
                deferred.reject({
                    message: "user not authed with Spotify, no access token given"
                });
            } else {
                console.log("Getting spotify user info");

                // access code give, but no existing details, get user details
                call('https://api.spotify.com/v1/me', {
                    headers: new Headers({ 'Authorization': 'Bearer ' + accessToken }),
                    credentials: 'none'
                }).then(function(json) {
                    userID = json.id;
                    userInfo = json;
                    deferred.resolve(json);
                }).catch(function(err) {
                    console.error("Error authorizing Spotify account %o", err);
                    deferred.reject(err);
                });
            }
        } else {
            // already logged in, return their details
            deferred.resolve(userInfo);
        }

        return deferred.promise;
    }


    // Returns all of a user's artists
    // Only make network request if not already retrived artists
    function getAllArtists() {
        var deferred = $q.defer();
        var methodURL = '/spotify/Artists?userID=';
        
        getUserInfo().then(function(userInfo) {
            // only make request if we don't already have the data
            if (userArtists.length === 0) {
                call(methodURL + userInfo.id, {
                    method: 'get',
                    credentials: 'include'
                }).then(function(res) {
                    console.log("Got " + res.artists.length + " Spotify Artists %o", res.artists);
                    userArtists = res.artists;
                    deferred.resolve(userArtists);
                }).catch(function(err) {
                    deferred.reject(err);
                    console.error("Error getting all artists: %o", err);
                });
            } else {
                deferred.resolve(userArtists);
            }
        }).catch(function(err) {
            // can't get user details, user not authed
            deferred.reject(err);
        });

        return deferred.promise;
    }

    // Takes a list of artists, returns 2 filtered arrays
    // One with artists in the user's list, one with artists who don't appear in the user's list
    function filterUserArtists(allArtistsInEvent) {
        var userArtistsInEvent = [];
        var otherArtistsInEvent = [];

        var deferred = $q.defer();

        getAllArtists().then(function(userArtists) {
            //Only need to calculate user artists if there are any
            if (userArtists.length !== 0) {

                //Break event artist list into ones from the user's spotify and the rest
                userArtistsInEvent = allArtistsInEvent.filter(function(eventArtist) {
                    return (userArtists.indexOf(eventArtist.name) !== -1);
                });
                otherArtistsInEvent = allArtistsInEvent.filter(function(eventArtist) {
                    return (userArtists.indexOf(eventArtist.name) === -1);
                });

                deferred.resolve({ user: userArtistsInEvent, other: otherArtistsInEvent });
            } else {
                deferred.resolve({ user: [], other: allArtistsInEvent });
            }
        }).catch(function(err) {
            // problem logging in, just return all the artists as other artists
            deferred.resolve({ user: [], other: allArtistsInEvent });
        });

        return deferred.promise;
    }



    // Calls a given url with opens
    // Returns the json response
    function call(url, options) {

        // Add cookies only when no other cookie options set
        if (options.credentials === undefined) {
            options.credentials = 'include'; //send the cookies with spotify access code
        }

        var request = new Request(url, options);

        return fetch(request).then(function(res) {
            if (res.ok) {
                return res.json();
            } else {
                if (res.status === 401) {
                    console.error("Unath spotify access, need new access token");
                }
                throw res;
            }
        });
    }

    function setup() {
        var deferred = $q.defer();
        var spotifyAccessToken = $cookies.get('spotifyAccessToken');

        console.info("CHECKING SPOTIFY TOKEN");

        if (spotifyAccessToken) {
            // If token has run out or about to (5 mins), get new one
            if (accessTokenTimeLeft() < (5 * 60)) {
                console.info("NEEDED NEW TOKEN");
                return refreshAccessToken().then(function(res) {
                });
            } {
                deferred.resolve();
                return deferred.promise;
            }
        } else {
            deferred.resolve();
            return deferred.promise;
        }

    }

    // returns number of seconds until spotify access token expires
    function accessTokenTimeLeft() {
        return Math.floor($cookies.get('spotifyTokenExpireAt') - (Date.now() / 1000));
    }

    // Sets a timer to get new access token using expiry time in cookies
    function setrefreshTokenTimer() {
        // set auth code refresh timeout from cookie
        var timeout = Math.floor($cookies.get('spotifyTokenExpireAt') - (Date.now() / 1000));
        console.info('setting auth code refresh timeout for ' + timeout + " seconds");
        // Cancel any exisiting one
        $interval.cancel(refreshTokenTimer);
        refreshTokenTimer = $interval(refreshAccessToken, timeout * 1000);
    }

    // Gets a new access token from spotify api
    function refreshAccessToken() {
        var refeshToken = $cookies.get('spotifyRefreshToken');
        var methodURL = '/spotify/refreshToken?refresh_token=' + refeshToken;

        $interval.cancel(refreshTokenTimer);

        return call(methodURL, {}).then(function(res) {

            //reset the access token and expirey time
            console.info("Got new spotify access token");
            $cookies.put('spotifyAccessToken', res.accessToken);
            $cookies.put('spotifyTokenExpireAt', res.expire_at);

            // set auth code refresh timeout from cookie
            setrefreshTokenTimer();
        });
    }

});