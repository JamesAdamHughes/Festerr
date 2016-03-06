angular.module('festerrApp').factory('SpotifyService', function ($q, $location, $cookies) {

    var userID = undefined;
    var userInfo = {};
    var userArtists = [];
    
    // Returns user's spotify info
    function getUserInfo(accessCode) {
        var deferred = $q.defer();

        call('https://api.spotify.com/v1/me', {
            headers: new Headers({ 'Authorization': 'Bearer ' + accessCode }),
            credentials: 'none'
        }).then(function (json) {
            userID = json.id;
            userInfo = json;
            deferred.resolve(json);
        }).catch(function (err) {
            deferred.reject(err);
            console.error("Error authorizing spotify account");
        });

        return deferred.promise;
    }
    
    // Returns all of a user's artists
    // Only make network request if not already retrived artists
    function getAllArtists() {
        var deferred = $q.defer();
        
        // check if the user has spotify authed
        if (userID !== undefined) {
            // only make request if we don't already have the data
            if (userArtists.length === 0) {
                call('/spotifyArtists?userID=' + userID, {
                    method: 'get',
                    credentials: 'include'
                }).then(function (res) {
                    console.log("Got " + res.artists.length + " Spotify Artists ");
                    userArtists = res.artists;
                    deferred.resolve(userArtists);
                }).catch(function (err) {
                    deferred.reject(err);
                    console.err("Error getting all artists");
                });
            } else {
                deferred.resolve(userArtists);
            }
        } else {
             deferred.resolve(userArtists);
        }
        
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
            return res.json();
        });
    }

    return {
        getUserInfo: getUserInfo,
        getAllArtists: getAllArtists
    };

});