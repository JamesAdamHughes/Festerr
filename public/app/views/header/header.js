angular.module('HeaderView', ['ngMaterial'])
    .controller('HeaderCtrl', ['$scope', '$mdDialog', HeaderController])
    .controller('SignupController', ['$scope', '$mdDialog', SignupController]);

function HeaderController($scope, $mdDialog) {
    
    // Handle user clicking the signup button
    // Displays a signup dialogue
    // TODO some user auth to check if they are signed in already etc
    var parentEl = angular.element(document.body);
    $scope.showSignupDialog = function ($event) {
        $mdDialog.show({
            parent: parentEl,
            clickOutsideToClose: true,
            templateUrl: "templates/signupDialog.html",           
            controller: SignupController,
            // onComplete: afterShowAnimation,
        });
    };
}

function SignupController($scope, $mdDialog) {
    $scope.employee = "James Hayes";
    $scope.showSignin = false;
    
    // Model that containers the entered user informtion from the signup sheet
    $scope.user = {
        username: "",
        email: "",
        password: "",
        password_conf: ""
    };
    
    $scope.registerEnabled = function(){
        if($scope.user.username !== "" && $scope.user.email !== "" && $scope.user.password !== ""  && $scope.user.password_conf !== ""){
            return true;
        }
        return false;
    };
    
    $scope.showSigninContainer = function(){
        $scope.showSignin = true;
    };
    
    $scope.register = function(user){
        console.log(user);
    };
}
