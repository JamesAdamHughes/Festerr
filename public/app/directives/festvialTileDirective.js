angular.module('festivalTileDirective', [])
    .controller('festivalTileController', ['$scope', function ($scope) {      
        
    }])
    .directive('festivalTile', function () {
        return {
            restrict: 'E',
            scope: {
                event: '=',
                selected: '&',
                collapse: '='
            },
            templateUrl: 'templates/eventTile.html',
            link: function (scope, element, attrs) {

                var isExpanded = false;
                
                // Handle user selecting the tile
                // Either move to expanded state, or return to normal if was already expanded
                scope.selectEventTile = function () {
                      
                    if (isExpanded) {
                        // reduce the size to normal
                        scope.event.tileInfo.displaySpan = {
                            cols: scope.event.tileInfo.defaultSpan.cols,
                            rows: scope.event.tileInfo.defaultSpan.rows
                        };
                        isExpanded = false;
                    } else {
                        // expand to big size
                        scope.event.tileInfo.displaySpan = {
                            cols: scope.event.tileInfo.expandedSpan.cols,
                            rows: scope.event.tileInfo.expandedSpan.rows
                        };
                        isExpanded = true;
                        
                        scope.selected({tileID: scope.event.tileInfo.ID});
                    }
                    //TODO make old span when clicking off
                };
                
                // Called by the parent controller when this tile should collapse
                scope.collapse = function () {
                    scope.event.tileInfo.displaySpan = {
                        cols: scope.event.tileInfo.defaultSpan.cols,
                        rows: scope.event.tileInfo.defaultSpan.rows
                    };
                    isExpanded = false;
                };
            }
        };
    });
