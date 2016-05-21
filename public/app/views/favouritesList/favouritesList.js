angular.module('FavouriteListView', ['ngMaterial'])
    .controller('FavouriteListCtrl', ['$scope', '$q', 'NetworkService', "$location", "SpotifyService", "DateFormatService", FavouriteListController]);


function FavouriteListController($scope, $q, NetworkService, $location, SpotifyService, DateFormatService) {

    $scope.eventsLoaded = false;
    $scope.authedUser = false;
    
    $scope.formatDate = function (date) {
        return DateFormatService.format(date);
    };
    
    $scope.favouriteClicked = function(event){
        window.location.href = "#/event/?id=" + event.id;
    };

    NetworkService.callAPI("/event/likes", {
        method: 'GET', credentials: 'include'
    }).then(function (res) {
        console.log(res);
        $scope.eventsLoaded = true;
        if (res.ok) {
            $scope.favouriteEvents = res.events;
            $scope.authedUser = true;
        } else {
            // User not logged in
            $scope.authedUser = false;
        }
    }).catch(function (err) {
        console.log(err);
    });
}

