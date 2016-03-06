angular.module('festerrApp').factory('SpotifyService', function ($q, $location, $cookies) {

    var userID = "";
    var userInfo = {};

    function getUserInfo(accessCode) {
        var deferred = $q.defer();

        var request = new Request('https://api.spotify.com/v1/me', {
            headers: new Headers({ 'Authorization': 'Bearer ' + accessCode })
        });

        // use the access token to access the Spotify Web API
        // Save the user info for further spotify requests
        fetch(request).then(function (res) {
            return res.json();
        }).then(function (json) {
            userID = json.id;
            userInfo = json;
            deferred.resolve(json);
        }).catch(function (err) {
            console.error("Fetch failed");
            console.log(err);
        });

        return deferred.promise;
    }

    function getAllArtists() {

        fetch('/spotifyArtists?userID=' + userID, {
            method: 'get',
            credentials: 'include' //send the cookies with spotify access code
        }).then(function (res) {
            return res.json();
        }).then(function(json){
            console.log(json);
        }).catch(function(err){
            console.log(err);
        });
    }

    return {
        getUserInfo: getUserInfo,
        getAllArtists: getAllArtists
    };

});