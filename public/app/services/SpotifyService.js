angular.module('festerrApp').factory('SpotifyService', function ($q, $location, $cookies) {

    var userID = undefined;
    var userInfo = {};
    var userArtists = [];
    
    // Returns user's spotify info
    function getUserInfo() {
        var deferred = $q.defer();

        var accessCode = $cookies.get('spotifyAccessCode');

        if (userID === undefined) {
            if (accessCode === undefined) {
                // no access code given, user hasn't authed with spotify, return empty
                deferred.reject({
                    message: "user not authed with Spotify, no access token given"
                });
            } else {
                console.log("Getting spotify user info");
                
                // access code give, but no existing details, get user details
                call('https://api.spotify.com/v1/me', {
                    headers: new Headers({ 'Authorization': 'Bearer ' + accessCode }),
                    credentials: 'none'
                }).then(function (json) {
                    userID = json.id;
                    userInfo = json;
                    deferred.resolve(json);
                }).catch(function (err) {
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
        
        console.log("Getting spotify artists");

        getUserInfo().then(function (userInfo) {
            // only make request if we don't already have the data
            if (userArtists.length === 0) {
                call(methodURL + userInfo.id, {
                    method: 'get',
                    credentials: 'include'
                }).then(function (res) {
                    console.log("Got " + res.artists.length + " Spotify Artists ");
                    userArtists = res.artists;
                    deferred.resolve(userArtists);
                }).catch(function (err) {
                    deferred.reject(err);
                    console.error("Error getting all artists: %o", err);
                    
                    // get new access token
                });
            } else {
                deferred.resolve(userArtists);
            }
        }).catch(function (err) {
            // can't get user details, user not authed
            deferred.reject(err);
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

        return fetch(request).then(function (res) {
            if(res.ok){
                return res.json();
            } else {
                if(res.status === 401) {
                    console.error("Unath spotify access, getting new access token");  
                    // get new access token
                    var refeshToken = $cookies.get('spotifyRefreshToken');
                    var methodURL = '/spotify/refreshToken?refresh_token=' + refeshToken;
                    call(methodURL, {}).then(function(res){
                        console.log(res);
                    });
                                      
                }
                throw new Error(res)
            }
        });
    }

    return {
        getUserInfo: getUserInfo,
        getAllArtists: getAllArtists
    };

});