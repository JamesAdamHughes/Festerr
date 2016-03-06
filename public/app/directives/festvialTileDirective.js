angular.module('festivalTileDirective', [])
    .controller('festivalTileController', ['$scope', function ($scope) {

    }])
    .directive('festivalTile', function () {
        return {
            restrict: 'E',
            replace: true,
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
                var defaultHeight = 250;
                var defaultWidth = 30;
                var expandedHeight = 550;
                var prevSelectedArtistID = -1;
                var expandedWidth = 40;

                scope.isExpanded = false;
                scope.displayHeight = defaultHeight;
                scope.topMargin = defaultMargin;
                scope.bottomMargin = defaultMargin;
                scope.showDetails = false;
                scope.containerWidth = defaultWidth;
                scope.festivalCardWidth = 100;
                scope.spotifyArtists = [];
                
                // watch artist list as retreived async from spotify
                scope.$watch('artistList', function (newVal, oldVal) {
                    if (newVal) {
                        findSpotifyArtistsInFestival(newVal);
                    }
                }, true);             
                
                // Trim the eventname to fit on the cards
                if (scope.event.eventname.length > 20) {
                    scope.displayEventName = scope.event.eventname.substring(0, 20) + "...";
                } else {
                    scope.displayEventName = scope.event.eventname;
                }          
                
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

                // Called by the parent controller when this tile should collapse
                scope.collapse = function () {
                    scope.isExpanded = false;
                    scope.displayHeight = defaultHeight;
                    scope.topMargin = defaultMargin;
                    scope.bottomMargin = defaultMargin;
                    scope.showDetails = false;
                    scope.containerWidth = defaultWidth;
                    scope.festivalCardWidth = 100;
                };

                scope.expand = function () {
                    scope.displayHeight = expandedHeight;
                    scope.isExpanded = true;
                    scope.topMargin = margin;
                    scope.bottomMargin = margin;
                    scope.showDetails = true;
                    scope.containerWidth = 100;
                    scope.festivalCardWidth = expandedWidth;
                };
                
                // Find all spotify artists who are also in this events artist list
                function findSpotifyArtistsInFestival(spotifyArtists) {
                    if (spotifyArtists.length > 0) {
                        scope.spotifyArtists = scope.event.artists.filter(function (eventArtist) {
                            return (spotifyArtists.indexOf(eventArtist.name) !== -1);
                        });
                    }
                }
            }
        };
    });
