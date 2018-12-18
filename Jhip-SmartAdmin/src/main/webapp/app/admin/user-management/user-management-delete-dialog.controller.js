'use strict';

angular.module('SmartAdminWebapp')
	.controller('UserManagementDeleteController', function($scope, $stateParams, User) {

        $scope.user = {};
        $scope.loadDeleteForm = function () {
            var login = $stateParams.login;
            User.get({login: login}, function(result) {
                $scope.user = result;
                $scope.deleteUserForm = result;
            });
        };
        //$scope.load($stateParams.login);
        $scope.loadDeleteForm();

        $scope.confirmDeleteUser = function (login) {
            User.delete({login: login},
                function () {
                    console.log("deleted");
                });
        };


    });
