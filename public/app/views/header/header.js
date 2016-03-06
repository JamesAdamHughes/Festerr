angular.module('HeaderView', ['ngMaterial', 'ngCookies'])
    .controller('HeaderCtrl', ['$scope', '$mdDialog', '$cookies', 'SpotifyService', HeaderController])
    .controller('SignupController', ['$scope', '$mdDialog', , SignupController]);

function HeaderController($scope, $mdDialog, $cookies, SpotifyService) {

    $scope.spotifyCodeExists = false;
    $scope.spotifyUserInfo = {};
    
    // Handle user clicking the signup button Displays a signup dialogue
    // If spotify code exists don't need to do this again
    // TODO some user auth to check if they are signed in already etc
    var parentEl = angular.element(document.body);
    $scope.showSignupDialog = function ($event) {

        // if (!$scope.spotifyCodeExists) {
            $mdDialog.show({
                parent: parentEl,
                clickOutsideToClose: true,
                templateUrl: "app/views/header/signupDialog.html",
                controller: SignupController,
                // onComplete: afterShowAnimation,
            });
        // }
    };
    
    // Check if spotify code exists, and get user info if true
    var accessCode = $cookies.get('spotifyAccessCode');
    if (accessCode) {
        console.log("already have a spotify code in cookies");
        $scope.spotifyCodeExists = true;
        
        SpotifyService.getUserInfo(accessCode).then(function(res){
            console.log(res);
            $scope.spotifyUserInfo = res;
            $scope.spotifyUserInfo.short_name = res.display_name.split(" ")[0];
        });      
    }
}

function SignupController($scope, $mdDialog) {
    
    // Whether to show the sign in view on the signup dialog
    $scope.showSignin = false;
    
    // Model that containers the entered user informtion from the signup sheet
    $scope.user = {
        username: "",
        email: "",
        password: "",
        password_conf: ""
    };
    
    // Only enable the resgiter button if all the fields have been filled
    $scope.registerEnabled = function () {
        if ($scope.user.username !== "" && $scope.user.email !== "" && $scope.user.password !== "" && $scope.user.password_conf !== "") {
            return true;
        }
        return false;
    };

       
    // Show the signin view when clicking the sign in button
    $scope.showSigninContainer = function () {
        $scope.showSignin = true;
    };
       
    // TODO acutally register the user
    $scope.register = function (user) {
        console.log(user);
    };
}
