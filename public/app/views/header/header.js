angular.module('HeaderView', ['ngMaterial'])
    .controller('HeaderCtrl', ['$scope', '$mdDialog', HeaderController])
    .controller('SignupController', ['$scope', '$mdDialog', 'SpotifyService', SignupController]);

function HeaderController($scope, $mdDialog) {
    
    // Handle user clicking the signup button
    // Displays a signup dialogue
    // TODO some user auth to check if they are signed in already etc
    var parentEl = angular.element(document.body);
    $scope.showSignupDialog = function ($event) {
        $mdDialog.show({
            parent: parentEl,
            clickOutsideToClose: true,
            templateUrl: "app/views/header/signupDialog.html",           
            controller: SignupController,
            // onComplete: afterShowAnimation,
        });
    };
}

function SignupController($scope, $mdDialog, SpotifyService) {
    
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
    $scope.registerEnabled = function(){
        if($scope.user.username !== "" && $scope.user.email !== "" && $scope.user.password !== ""  && $scope.user.password_conf !== ""){
            return true;
        }
        return false;
    };
       
    // Show the signin view when clicking the sign in button
    $scope.showSigninContainer = function(){
        $scope.showSignin = true;
    };
       
    // TODO acutally register the user
    $scope.register = function(user){
        console.log(user);
    };
    
    $scope.spotifySignin = function(){
        SpotifyService.login();
    };
}
