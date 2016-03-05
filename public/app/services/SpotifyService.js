angular.module('festerrApp').factory('SpotifyService', function ($q, NetworkService) {
    
    // Login to the spotify api    
    function login() {
        NetworkService.callAPI({
            url: '/spotifyLogin',
            method: 'GET'
        }).then(function (res) {
            console.log(res);
        });
    }

    return {
        login: login
    };
    
});