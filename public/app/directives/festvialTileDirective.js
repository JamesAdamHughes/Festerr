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
            templateUrl: 'app/views/festivalList/eventTile.html',
            link: function(scope, element, attrs) {

                var defaultMargin = 10;

                // value to use column layout over row
                var breakPoint = 650;

                // Whether to show festival and details card as row or column                
                var defaultContainerFlexFlow;

                // default size of festival container
                var defaultContainerHeight;
                var defaultContainerWidth;

                // Default festival card size
                var defaultFestivalHeight;
                var defaultFestivalWidth;

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

               
                // NEW Selected Event, tells controller to move user to event detail page
                // Will replace the old selected code
                scope.selectEventTileToDetail = function() {
                    scope.selected({event: scope.event});
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

                    // Default festival card size
                    defaultFestivalHeight = defaultContainerHeight;
                    defaultFestivalWidth = "100%";
                 
                    scope.festivalDisplayHeight = defaultFestivalHeight;
                    scope.topMargin = defaultMargin;
                    scope.bottomMargin = defaultMargin;
                    scope.containerWidth = defaultContainerWidth;
                    scope.festivalCardWidth = defaultFestivalWidth;
                    scope.containerHeight = defaultContainerHeight;
                    scope.containerFlexFlow = defaultContainerFlexFlow;
                    scope.detailsCardWidth = screenWidth < breakPoint ? "100%" : "40%";                 
                }
            }
        };
    }]);
