angular.module('MainView', [])
    .controller('MainCtrl', ['$scope', 'SpotifyService', MainController]);
    
function MainController($scope, SpotifyService) {
    console.info("SPOTIFY SETUP");
}

