angular.module('HeaderView', ['ngMaterial', 'ngCookies'])
    .controller('HeaderCtrl', ['$scope', '$mdDialog', '$cookies', 'SpotifyService', HeaderController])
    .controller('SignupController', ['$scope', '$mdDialog', , SignupController]);

function HeaderController($scope, $mdDialog, $cookies, SpotifyService) {

    $scope.spotifyCodeExists = false;
    $scope.spotifyUserInfo = {};

    var dialogOpen = false;
    
    // Handle user clicking the signup button Displays a signup dialogue
    // If spotify code exists don't need to do this again
    // TODO some user auth to check if they are signed in already etc
    var parentEl = angular.element(document.body);
    $scope.showSignupDialog = function ($event) {

        if (!dialogOpen) {
            dialogOpen = true;
            $mdDialog.show({
                parent: parentEl,
                clickOutsideToClose: true,
                templateUrl: "app/views/header/signupDialog.html",
                controller: SignupController,
                // onComplete: afterShowAnimation,
            }).finally(function(){
                dialogOpen = false;
            });
        } else {
            console.log("dialog already open");
        }

    };
    
    // Check if spotify code exists, and get user info if true
    var accessCode = $cookies.get('spotifyAccessCode');
    if (accessCode) {
        console.log("already have a spotify code in cookies");
        $scope.spotifyCodeExists = true;

        SpotifyService.getUserInfo(accessCode).then(function (res) {
            console.log(res);
            $scope.spotifyUserInfo = res;
            $scope.spotifyUserInfo.short_name = res.display_name.split(" ")[0];
        });
    }
}

function SignupController($scope, $mdDialog) {
    // nothing to do here atm :)
}
