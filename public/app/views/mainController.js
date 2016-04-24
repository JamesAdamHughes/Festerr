angular.module('MainView', [])
    .controller('MainCtrl', ['$scope', MainController]);

function MainController($scope) {
    console.info("SPOTIFY SETUP");

    // Which view to show under the header
    var templateUrls = {
        festivalList: '/app/views/festivalList/festivalList.html',
        favourites:  '/app/views/favouritesList/favouritesList.html',
    };

    $scope.currentTabTemplate = templateUrls.festivalList;

    $scope.onTabSelected = function (tab) {
        if(tab === 0){
            $scope.currentTabTemplate = templateUrls.festivalList;
        } else if(tab === 2){
            $scope.currentTabTemplate = templateUrls.favourites;
        }
    };    

}

