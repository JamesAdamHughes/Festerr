angular.module('festivalTileDirective', [])
    .controller('festivalTileController', ['$scope', function ($scope) {

    }])
    .directive('festivalTile', ['SpotifyService', function (SpotifyService) {
        return {
            restrict: 'E',
            scope: {
                event: '=',
                selected: '&',
                collapse: '=',
                artistList: '='
            },
            templateUrl: 'templates/eventTile.html',
            link: function (scope, element, attrs) {

                var margin = 100;
                var defaultMargin = 10;
                var defaultHeight = 300;
                var expandedHeight = 550;

                scope.isExpanded = false;
                scope.displayHeight = 250;
                scope.topMargin = defaultMargin;
                scope.bottomMargin = defaultMargin;
                scope.showDetails = false;
                
                scope.transform = 0;
                
                var prevSelectedArtistID = -1;
                
                // Handle user selecting the card
                // Either move to expanded state, or return to normal if was already expanded
                scope.selectEventTile = function () {
                    if (scope.isExpanded) {
                        // reduce the size to normal
                        scope.collapse();
                    } else {
                        // expand to big size
                        scope.expand();
                    }                    
                    // tell the parent controller this has expanded
                    scope.selected({ tileID: scope.event.tileInfo.ID });
                };
                
                // Handle an artist tile being selected
                // Either move to expanded state, or return to normal if was already expanded
                scope.selectArtistTile = function (eventTile, artistTile) {

                    var prevArtist = scope.event.artists[prevSelectedArtistID];
                    
                    // Reset the old selected one
                    if (prevArtist !== undefined) {
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

                // scope.setMargins = function (margins) {
                //     scope.topMargin = margins.top;
                //     scope.bottomMargin = margins.bottom;
                // };
                
                // Called by the parent controller when this tile should collapse
                scope.collapse = function () {
                    scope.isExpanded = false;
                    scope.displayHeight = defaultHeight;
                    scope.topMargin = defaultMargin;
                    scope.bottomMargin = defaultMargin;
                    scope.showDetails = false;

                };

                scope.expand = function () {
                    scope.displayHeight = expandedHeight;
                    scope.isExpanded = true;
                    scope.topMargin = margin;
                    scope.bottomMargin = margin;
                    scope.showDetails = true;
                };
            }
        };
    }]);
