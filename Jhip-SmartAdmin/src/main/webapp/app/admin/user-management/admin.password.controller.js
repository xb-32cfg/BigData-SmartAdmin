'use strict';

angular.module('SmartAdminWebapp')
    .controller('PwdChangeControllerByAdmin', function ($scope, $state, $stateParams, Auth, Principal, User) {
        Principal.identity().then(function(account) {
            $scope.account = account;
        });

        var vm = this;
        vm.changePwdHeaderText = "password.title";
        $scope.headerText = vm.changePwdHeaderText;

        $scope.user = {};
        $scope.changePwdForm = {};

        /*********************************************
         *         LOAD CHANGE PASSWORD FORM         *
         *********************************************/
        $scope.loadChangePasswordForm = function () {
            var login = $stateParams.login;
            User.get({login: login}, function(result) {
                $scope.user = result;
                $scope.changePwdForm = result;
                $scope.changePwdUserName = result.firstName +' '+ result.lastName;
            });
        };
        $scope.loadChangePasswordForm();



        /*********************************************
         *         UPDATE NEW PASSWORD               *
         *********************************************/
        $scope.changePasswordByAdmin = function () {
            if ($scope.userPassword !== $scope.confirmPwd) {
                $scope.doNotMatch = 'Password did not match. Please recheck both password.';
            }
            if ( $('#changePwdForm').data('bootstrapValidator').isValid() ){
                BootstrapDialog.update('', function(result){
                    /*if(result) {
                        User.update({login: login}, onDeleteSuccess, onSaveError);
                    }*/
                });

            }
        };

        /*$scope.success = null;
        $scope.error = null;
        $scope.doNotMatch = null;
        $scope.changePasswordByAdmin = function () {
            if ($scope.password !== $scope.confirmPassword) {
                $scope.error = null;
                $scope.success = null;
                $scope.doNotMatch = 'ERROR';
            } else {
                $scope.doNotMatch = null;
                Auth.changePassword($scope.password).then(function () {
                    $scope.error = null;
                    $scope.success = 'OK';
                }).catch(function () {
                    $scope.success = null;
                    $scope.error = 'ERROR';
                });
            }
        };*/

        var onDeleteSuccess = function (result) {
            DeleteMessageDisplay(result);
            $scope.isSaving = true;
            $state.go('user-management', null, { reload: true });
        };
        var onSaveError = function (result) {
            $scope.isSaving = false;
        };

    });
