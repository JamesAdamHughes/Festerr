angular.module('MainView', [])
    .controller('MainCtrl', ['$scope', 'SpotifyService', MainController]);
    
function MainController($scope) {
    console.info("SPOTIFY SETUP");
    
    // Which view to show under the header
    $scope.currentTabTemplate = '/app/views/festivalList/festivalList.html';
    //  $scope.currentTabTemplate = '/app/views/eventDetail/eventDetail.html';
   
}

