angular.module('festerrApp').factory('SpotifyService', function ($q, $location) {
    
    function getUserInfo(accessCode){
        var deferred = $q.defer();
        
        var request = new Request('https://api.spotify.com/v1/me', {
            headers: new Headers({ 'Authorization': 'Bearer ' + accessCode })
        });

        // use the access token to access the Spotify Web API
        fetch(request).then(function (res) {
            deferred.resolve(res.json());
        }).catch(function (err) {
            console.error("Fetch failed");
            console.log(err);
        });
        
        return deferred.promise;
    }
 
    return {
        getUserInfo: getUserInfo
    };
    
});