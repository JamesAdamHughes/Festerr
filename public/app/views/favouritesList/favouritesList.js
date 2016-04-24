angular.module('FavouriteListView', ['ngMaterial'])
    .controller('FavouriteListCtrl', ['$scope', '$q', 'NetworkService', "$location", "SpotifyService", "DateFormatService", FavouriteListController]);


function FavouriteListController($scope, $q, NetworkService, $location, SpotifyService, DateFormatService) {

    $scope.eventsLoaded = true;
    $scope.favouriteEvents = [{
        eventname: "Test Event",
        entryprice: "£129.87",
        venue: "My na's house ya fecker"
    }];

    NetworkService.call("/event/likes", {
        method: 'GET', credentials: 'include'
    }).then(function (res) {
        console.log(res);
    });


}

