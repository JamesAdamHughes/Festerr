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
}
