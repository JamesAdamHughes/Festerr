angular.module('festivalTileDirective', []).directive('festivalTile', function(){
    return {
        restrict: 'E',
        scope: {
            event: '='
        },
        templateUrl: 'templates/eventTile.html',
        link: function(scope, element, attrs) {
            console.log(scope);   
        }        
    };
});