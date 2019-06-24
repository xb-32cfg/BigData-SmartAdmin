'use strict';

angular.module('SmartAdminWebapp')
	.controller('UserManagementDeleteController', function($scope, $state, $stateParams, User) {

        $scope.user = {};
        $scope.deleteUserForm = {};
        $scope.authorities = ["ROLE_USER", "ROLE_ADMIN", "ROLE_SHAREHOLDER", "ROLE_INVESTOR", "ROLE_DEFAULT"];


        /*********************************************
         *          LOAD DELETE FORM                 *
         *********************************************/
        $scope.loadDeleteForm = function () {
            var login = $stateParams.login;
            User.get({login: login}, function(result) {
                $scope.user = result;
                $scope.deleteUserForm = result;
            });
        };
        //$scope.load($stateParams.login);
        $scope.loadDeleteForm();


        /*********************************************
         *           DELETE USER                     *
         *********************************************/
        $scope.confirmDeleteUser = function () {
            var login = $scope.deleteUserForm.login;
            if (login != null) {
                //console.log("delete user id: "+login);
                BootstrapDialog.delete('', function(result){
                    if(result) {
                        User.delete({login: login}, onDeleteSuccess, onSaveError);
                    }
                });

            }
        };


        /*********************************************
         *         BACK BUTTON                       *
         *********************************************/
        $scope.back = function () {
            $state.go('user-management', null, { reload: true });
        };


        $scope.AddUserForm = function () {
            $state.go('user-management', null, { reload: true });
        };


        var onDeleteSuccess = function (result) {
            DeleteMessageDisplay(result);
            $scope.isSaving = true;
            $state.go('user-management', null, { reload: true });
        };
        var onSaveError = function (result) {
            $scope.isSaving = false;
        };

    });
