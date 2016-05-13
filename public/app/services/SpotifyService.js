angular.module('festerrApp').factory('SpotifyService', function($q, $location, $cookies, $interval, NetworkService) {

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
        var methodURL = '/spotify/artists';

        if (userArtists.length === 0) {
            call(methodURL, {
                method: 'get',
                credentials: 'include'
            }).then(function(res) {
                console.log(res);
                userArtists = res.artists;
                deferred.resolve(res.artists);
            }).catch(function(err) {
                console.log("Error getting all artists: %o", err);
                deferred.reject(err);
            });
        } else {
            deferred.resolve(userArtists);
        }

        return deferred.promise;
    }

    // Takes a list of artists, returns 2 filtered arrays
    // One with artists in the user's list, one with artists who don't appear in the user's list
    function filterUserArtists(allArtistsInEvent) {
        var userArtistsInEvent = [];
        var otherArtistsInEvent = [];

        return getAllArtists().then(function(userArtists) {
            //Only need to calculate user artists if there are any
            if (userArtists.length !== 0) {
                
                var names = [];
                
                console.info(userArtists);
                
                //Break event artist list into ones from the user's spotify and the rest
                allArtistsInEvent.forEach(function(eventArtist){
                    
                    names.push(eventArtist.name);
                    
                    if(userArtists.indexOf(eventArtist.name) !== -1){
                        userArtistsInEvent.push(eventArtist);       
                    } else {
                        otherArtistsInEvent.push(eventArtist);
                    }
                });
                
                console.log(names);    

                return({ user: userArtistsInEvent, other: otherArtistsInEvent });
            } else {
               return ({ user: [], other: allArtistsInEvent });
            }
        }).catch(function(err) {
            // problem logging in, just return all the artists as other artists
            return({ user: [], other: allArtistsInEvent });
        });
    }

    /* 
        Calls a given url with options
        Returns the json response
    */
    function call(url, options) {
        
        var deferred = $q.defer();
        
        // Add cookies only when no other cookie options set
        if (options.credentials === undefined) {
            options.credentials = 'include'; //send the cookies with spotify access code
        }

        NetworkService.callAPI(url, options).then(function(res) {
            if (res.status === 401 || res.ok === false) {
                console.log("Unath spotify access, need new access token or user unregistered");
                deferred.reject(res);
            } else {
                deferred.resolve(res);
            }
        });
        
        return deferred.promise;
    }

    /*
        Called when the page loads
        
        Checks if the user has spotify info in cookies  
            If so, refresh them always (for session purposes)
    */
    function setup() {
        var deferred = $q.defer();
        var spotifyAccessToken = $cookies.get('spotifyAccessToken');

        console.info("CHECKING SPOTIFY TOKEN");

        if (spotifyAccessToken) {
            return refreshAccessToken();
        } else {
            deferred.resolve();
            return deferred.promise;
        }
    }

    // returns number of seconds until spotify access token expires
    // function accessTokenTimeLeft() {
    //     return Math.floor($cookies.get('spotifyTokenExpireAt') - (Date.now() / 1000));
    // }

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