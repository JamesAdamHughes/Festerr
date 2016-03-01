angular.module('HeaderView', ['ngMaterial'])
    .controller('HeaderCtrl', ['$scope', '$mdDialog', HeaderController])
    .controller('SignupController', ['$scope', '$mdDialog', SignupController]);

function HeaderController($scope, $mdDialog) {
    var alert;

    $scope.showSignupDialog = function ($event) {
        $mdDialog.show({
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
