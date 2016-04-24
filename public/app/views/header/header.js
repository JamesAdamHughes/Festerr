angular.module('HeaderView', ['ngMaterial', 'ngCookies'])
    .controller('HeaderCtrl', ['$scope', '$q', '$window', '$interval', '$mdDialog', 'SpotifyService', 'SearchService', '$rootScope', HeaderController])
    .controller('SignupController', ['$scope', '$mdDialog', SignupController]);

function HeaderController($scope, $q, $window, $interval, $mdDialog, SpotifyService, SearchService, $rootScope) {

    $scope.spotifyLoggedIn = false;
    $scope.spotifyUserInfo = {
        short_name: "No Name Available",
        images: [
            {
                url: "http://buira.org/assets/images/shared/default-profile.png"
            }
        ]
    };

    $scope.selectedChips = [];
    $scope.selectedChip = undefined;
    $scope.searchText = undefined;
    $scope.searchQuery = undefined;
    $scope.pendingSearch;
    $scope.searching = false;
    $scope.cancelSearch = angular.noop;
    $scope.lastSearch;
    
    // Variables for the scrolling header bar
    var dialogOpen = false;
    var didScroll = false;
    var lastScrollTop = 0;
    var delta = 5;
    var navbarHeight = document.getElementById('tabs-header-bar').offsetHeight;

    // Handle user clicking the signup button Displays a signup dialogue
    // If spotify code exists don't need to do this again
    var parentEl = angular.element(document.body);
    $scope.showSignupDialog = function($event) {
        if (!dialogOpen) {
            // only open if not already open
            dialogOpen = true;
            $mdDialog.show({
                parent: parentEl,
                clickOutsideToClose: true,
                templateUrl: "app/views/header/signupDialog.html",
                controller: SignupController,
            }).finally(function() {
                dialogOpen = false;
            });
        } else {
            console.log("dialog already open");
        }

    };

    // Get user info then set it for the header to display
    SpotifyService.getUserInfo().then(function(res) {
        // console.log(res);
        $scope.spotifyLoggedIn = true;
        $scope.spotifyUserInfo = res;

        // TODO sort out these defaults in spotify Service
        // Display place holder if no user image given
        if (res.images.length === 0) {
            $scope.spotifyUserInfo.images[0] = {
                url: "http://buira.org/assets/images/shared/default-profile.png"
            };
        }

        // Handle no display name given
        if (res.display_name !== undefined) {
            $scope.spotifyUserInfo.short_name = res.display_name.split(" ")[0];
        } else {
            $scope.spotifyUserInfo.short_name = "Anon";
        }

    }).catch(function(){
    });

    // Performs chipSearch asynchronously so as not to hang the browser
    $scope.asyncChipSearch = function(query) {

        // Only perform a new search if there isn't one already happening
        if (!$scope.searching || !$scope.debounceSearch()) {
            $scope.cancelSearch();
            // Run chipSearch async
            return $scope.pendingSearch = $q(function(resolve, reject) {

                $scope.cancelSearch = reject;

                // Search the events and artists for the given query 
                // Returns with possible suggestions that match the query, for autocomplete
                resolve(SearchService.chipSearch(query, $scope.eventList, $scope.artistList));
                
                $scope.refreshDebounce();
            });
        }

        return $scope.pendingSearch;
    };
    
    // Watch if user has started seaching, emit the search onto the rotscope
    $scope.$watch('selectedChips', function(oldV, newV) {
        if (newV) {
            $rootScope.$emit('header searchItemsUpdated', $scope.selectedChips);
        }
    }, true);

    // Debounce search if querying faster than 300ms
    $scope.debounceSearch = function() {
        var now = new Date().getMilliseconds();
        $scope.lastSearch = $scope.lastSearch || now;
        return ((now - $scope.lastSearch) < 300);
    };

    // Seach completed, refresh debounce
    $scope.refreshDebounce = function() {
        $scope.lastSearch = 0;
        $scope.searching = false;
        $scope.cancelSearch = angular.noop;
    };
    
    /*
        Scrolling Logic to hide the tabs bar
    */

    angular.element($window).bind("scroll", function() {
        didScroll = true;
    }); 
    
    // Only update every .25seconds   
    $interval(function() {
        if (didScroll) {
            hasScrolled();
            didScroll = false;
        }
    }, 250);
    
    // Hide or show the bar on scrolling
    function hasScrolled() {
        var st = $window.pageYOffset;

        // Make sure they scroll more than delta
        if (Math.abs(lastScrollTop - st) <= delta)
            return;

        // If they scrolled down and are past the navbar, add class .nav-up.
        // This is necessary so you never see what is "behind" the navbar.
        if (st > lastScrollTop && st > navbarHeight) {
            // Scroll Down
            angular.element(document.getElementById('tabs-header-bar')).removeClass('nav-down').addClass('nav-up');
        } else {
            // Scroll Up
            var B = document.body,
                H = document.documentElement,
                height;

            if (typeof document.height !== 'undefined') {
                height = document.height; // For webkit browsers
            } else {
                height = Math.max(B.scrollHeight, B.offsetHeight, H.clientHeight, H.scrollHeight, H.offsetHeight);
            }
            if (st + $window.innerHeight < height) {
                angular.element(document.getElementById('tabs-header-bar')).removeClass('nav-up').addClass('nav-down');
            }
        }
        lastScrollTop = st;
    }
}

function SignupController($scope, $mdDialog) {
    // nothing to do here atm :)
}
