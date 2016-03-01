angular.module('HeaderView', ['ngMaterial'])
    .controller('HeaderCtrl', ['$scope', '$mdDialog', HeaderController])
    .controller('SignupController', ['$scope', '$mdDialog', SignupController]);

function HeaderController($scope, $mdDialog) {
    var alert;

    $scope.showSignupDialog = function ($event) {
        $mdDialog.show({
            clickOutsideToClose: true,
            template:
            '<md-dialog>' +
            '  <md-dialog-content>' +
            '     Signup :) {{employee}}' +
            '  </md-dialog-content>' +
            '</md-dialog>',
            controller: SignupController,
            // onComplete: afterShowAnimation,
        });
    };
}

function SignupController($scope, $mdDialog) {
    $scope.employee = "Big fucktard";
}
