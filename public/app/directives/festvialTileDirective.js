angular.module('festivalTileDirective', [])
    .controller('festivalTileController', ['$scope', function($scope) {

    }])
    .directive('festivalTile', function() {
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
            link: function(scope, element, attrs) {

                var prevSelectedArtistID = -1;                
                var margin = 100;
                var defaultMargin = 10;
                
                // value to use column layout over row
                var breakPoint = 650;         
                // Whether to show festival and details card as row or column                
                var defaultContainerFlexFlow = window.innerWidth < breakPoint ? "column" : "row"

                // default size of festival container
                var defaultContainerHeight = "250px";
                var defaultContainerWidth = "300px";

                // Size of festival container to expand to
                var expandedContainerHeight = window.innerWidth < breakPoint ? "1060px" :  window.innerHeight - 200 + "px";
                var expandedContainerWidth = window.innerWidth + "px";
                  
                // Default festival card size
                var defaultFestivalHeight = "250px";
                var defaultFestivalWidth = "100%";
                
                // Size for festival card to expand to
                var expandedFestivalCardWidth = window.innerWidth < breakPoint ? "100%" : "40%";
                var expandedFestvivalCardHeight =  window.innerWidth < breakPoint ? "500px" : expandedContainerHeight;
                
                scope.isExpanded = false;
                scope.showDetails = false;
                
                // Scope variables to control the DOM sizes
                scope.festivalDisplayHeight = defaultFestivalHeight;
                scope.topMargin = defaultMargin;
                scope.bottomMargin = defaultMargin;
                scope.containerWidth = defaultContainerWidth;
                scope.festivalCardWidth = defaultFestivalWidth;
                scope.containerHeight = defaultContainerHeight;
                scope.containerFlexFlow = defaultContainerFlexFlow;
                scope.detailsCardWidth = window.innerWidth < breakPoint ? "100%" : "40%"
                scope.festivalDetailsDisplayHeight = expandedFestvivalCardHeight.substring(0, expandedFestvivalCardHeight.length-2) - 64 + "px"; 
                 
                // Trim the eventname to fit on the cards
                if (scope.event.eventname.length > 20) {
                    scope.displayEventName = scope.event.eventname.substring(0, 17) + "...";
                } else {
                    scope.displayEventName = scope.event.eventname;
                }

                // Handle user selecting the card
                // Either move to expanded state, or return to normal if was already expanded
                scope.selectEventTile = function() {
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
                scope.selectArtistTile = function(eventTile, artistTile) {

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
                scope.collapse = function() {
                    scope.isExpanded = false;
                    scope.showDetails = false;

                    scope.topMargin = defaultMargin;
                    scope.bottomMargin = defaultMargin;

                    scope.festivalCardWidth = defaultFestivalWidth;
                    scope.festivalDisplayHeight = defaultFestivalHeight;

                    scope.containerWidth = defaultContainerWidth;
                    scope.containerHeight = defaultContainerHeight;
                };

                scope.expand = function() {
                    scope.isExpanded = true;
                    scope.showDetails = true;

                    scope.topMargin = margin;
                    scope.bottomMargin = margin;

                    scope.containerWidth = expandedContainerWidth;
                    scope.containerHeight = expandedContainerHeight;

                    scope.festivalDisplayHeight = expandedFestvivalCardHeight;
                    scope.festivalCardWidth = expandedFestivalCardWidth;
                };

            }
        };
    });
