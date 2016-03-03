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

                scope.isExpanded = false;
                scope.displayHeight = 250;
                
                var defaultHeight = 250;
                var expandedHeight = 400;
                
                var prevSelectedArtistID = -1;
                
                // Handle user selecting the card
                // Either move to expanded state, or return to normal if was already expanded
                scope.selectEventTile = function () {

                    if (scope.isExpanded) {
                        // reduce the size to normal
                        scope.displayHeight = defaultHeight;
                        scope.isExpanded = false;
                    } else {
                        // expand to big size
                        scope.displayHeight = expandedHeight;
                        scope.isExpanded = true;
                        
                        // tell the parent controller this has expanded
                        // allows other tiles to close
                        scope.selected({ tileID: scope.event.tileInfo.ID });
                    }
                    
                    console.log(scope.isExpanded);
                };
                
                // Handle an artist tile being selected
                // Either move to expanded state, or return to normal if was already expanded
                scope.selectArtistTile = function (eventTile, artistTile) {
                    
                    var prevArtist = scope.event.artists[prevSelectedArtistID];
                    
                    // Reset the old selected one
                    if(prevArtist !== undefined){
                        prevArtist.tileInfo.displaySpan = {
                            cols: prevArtist.tileInfo.defaultSpan.cols,
                            rows: prevArtist.tileInfo.defaultSpan.rows
                        };
                    }
                    
                    if (prevSelectedArtistID === artistTile.ID) {
                        // if we selected an expanded, reset the prev counter
                        prevSelectedArtistID = -1;
                    } else {
                        // expanded a new selected artists
                        artistTile.displaySpan = {
                            cols: artistTile.expandedSpan.cols,
                            rows: artistTile.expandedSpan.rows
                        };
                        prevSelectedArtistID = artistTile.ID;
                    }

                };
                
                // Called by the parent controller when this tile should collapse
                scope.collapse = function () {
                    console.log("collapsed");
                    scope.displayHeight = defaultHeight;
                    scope.isExpanded = false;
                };
            }
        };
    });
