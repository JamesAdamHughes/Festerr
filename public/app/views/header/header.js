angular.module('HeaderView', ['ngMaterial', 'ngCookies'])
    .controller('HeaderCtrl', ['$scope', '$mdDialog', '$cookies', 'SpotifyService', HeaderController])
    .controller('SignupController', ['$scope', '$mdDialog', , SignupController]);

function HeaderController($scope, $mdDialog, $cookies, SpotifyService) {

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
               
            // Display place holder if no user image given
            if(res.images.length === 0){
                $scope.spotifyUserInfo.images[0]= {
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
}

function SignupController($scope, $mdDialog) {
    // nothing to do here atm :)
}
