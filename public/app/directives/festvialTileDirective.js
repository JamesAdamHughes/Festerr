angular.module('festivalTileDirective', [])
    .controller('festivalTileController', ['$scope', function($scope) {

    }])
    .directive('festivalTile', ['$window', function($window) {
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
                var defaultContainerFlexFlow;

                // default size of festival container
                var defaultContainerHeight;
                var defaultContainerWidth;

                // Size of festival container to expand to
                var expandedContainerHeight;
                var expandedContainerWidth;

                // Default festival card size
                var defaultFestivalHeight;
                var defaultFestivalWidth;

                // Size for festival card to expand to
                var expandedFestivalCardWidth;
                var expandedFestvivalCardHeight;

                scope.isExpanded = false;
                scope.showDetails = false;
                scope.showMouseOver = false;

                // Scope variables to control the DOM sizes
                scope.festivalDisplayHeight;
                scope.topMargin;
                scope.bottomMargin;
                scope.containerWidth;
                scope.festivalCardWidth;
                scope.containerHeight;
                scope.containerFlexFlow;
                scope.detailsCardWidth;
                scope.festivalDetailsDisplayHeight;
                
                // Sets the default sizes
                setElementSizes();           
                
                console.log(scope.event);     


                // Trim the eventname to fit on the cards
                if (scope.event.eventname.length > 20) {
                    scope.displayEventName = scope.event.eventname.substring(0, 17) + "...";
                } else {
                    scope.displayEventName = scope.event.eventname;
                }

                // Watch for window resizes, change element sizes to fit
                angular.element($window).bind('resize', function() {
                    setElementSizes();
                });

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
                
                function showMouseOver(){
                   var imageText = element[0].getElementsByClassName('festival-card-image-test');
                   angular.element(imageText).addClass("expanded-image-text");
                    
                }

                function setElementSizes() {
                    var screenWidth = $window.innerWidth;
                    var screenHeight = $window.innerHeight;

                    // Whether to show festival and details card as row or column                
                    defaultContainerFlexFlow = screenWidth < breakPoint ? "column" : "row";

                    // default size of festival container
                    defaultContainerHeight = "200px";
                    defaultContainerWidth = "250px";

                    // Size of festival container to expand to
                    expandedContainerHeight = screenWidth < breakPoint ? "1060px" : screenHeight - 200 + "px";
                    expandedContainerWidth = screenWidth + "px";

                    // Default festival card size
                    defaultFestivalHeight = defaultContainerHeight;
                    defaultFestivalWidth = "100%";

                    // Size for festival card to expand to
                    expandedFestivalCardWidth = screenWidth < breakPoint ? "100%" : "40%";
                    expandedFestvivalCardHeight = screenWidth < breakPoint ? "500px" : expandedContainerHeight;

                    scope.festivalDisplayHeight = defaultFestivalHeight;
                    scope.topMargin = defaultMargin;
                    scope.bottomMargin = defaultMargin;
                    scope.containerWidth = defaultContainerWidth;
                    scope.festivalCardWidth = defaultFestivalWidth;
                    scope.containerHeight = defaultContainerHeight;
                    scope.containerFlexFlow = defaultContainerFlexFlow;
                    scope.detailsCardWidth = screenWidth < breakPoint ? "100%" : "40%";
                    scope.festivalDetailsDisplayHeight = expandedFestvivalCardHeight.substring(0, expandedFestvivalCardHeight.length - 2) - 64 + "px";
                }

            }
        };
    }]);
