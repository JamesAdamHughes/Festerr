angular.module('festivalTile', []).directive('festivalTileDirective', function(){
    return {
        restrict: 'E',
        templateUrl: 'templates/eventTile.html'
    };
});