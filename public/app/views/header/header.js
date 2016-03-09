angular.module('HeaderView', ['ngMaterial', 'ngCookies'])
    .controller('HeaderCtrl', ['$scope', '$q', '$mdDialog', '$cookies', 'SpotifyService', 'SearchService', '$rootScope', HeaderController])
    .controller('SignupController', ['$scope', '$mdDialog', , SignupController]);

function HeaderController($scope, $q, $mdDialog, $cookies, SpotifyService, SearchService, $rootScope) {

    $scope.spotifyCodeExists = false;
    $scope.spotifyDetailsRetrieved = false;
    $scope.spotifyUserInfo = {
        short_name: "No Name Available",
        images: [
            {
                url: "http://buira.org/assets/images/shared/default-profile.png"
            }
        ]
    };

    $scope.selectedChips = [];
    $scope.selectedChip = null;
    $scope.searchText = null;
    $scope.searchQuery = undefined;
    $scope.pendingSearch;
    $scope.searching = false;
    $scope.cancelSearch = angular.noop;
    $scope.lastSearch;

    var dialogOpen = false;

    // Handle user clicking the signup button Displays a signup dialogue
    // If spotify code exists don't need to do this again
    // TODO some user auth to check if they are signed in already etc
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
                // onComplete: afterShowAnimation,
            }).finally(function() {
                dialogOpen = false;
            });
        } else {
            console.log("dialog already open");
        }

    };

    // Check if spotify code exists, and get user info if true
    var accessCode = $cookies.get('spotifyAccessToken');
    if (accessCode) {
        console.log("already have a spotify code in cookies");
        $scope.spotifyCodeExists = true;

        // Get user info then set it for the header to display
        SpotifyService.getUserInfo().then(function(res) {
            console.log(res);
            $scope.spotifyDetailsRetrieved = true;
            $scope.spotifyUserInfo = res;

            // TODO sort out these defaults in spotify Service
            // Display place holder if no user image given
            if (res.images.length === 0) {
                $scope.spotifyUserInfo.images[0] = {
                    url: "http://buira.org/assets/images/shared/default-profile.png"
                }
            }

            // Handle no display name given
            if (res.display_name !== null) {
                $scope.spotifyUserInfo.short_name = res.display_name.split(" ")[0];
            } else {
                $scope.spotifyUserInfo.short_name = "No Name Given"
            }

        });
    }

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
}

function SignupController($scope, $mdDialog) {
    // nothing to do here atm :)
}
