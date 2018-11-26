'use strict';

angular.module('SmartAdminWebapp')
    .controller('DashboardController', function ($scope, $state, Principal, ENV) {

        Principal.identity().then(function(account) {
            $scope.account = account;
            $scope.isAuthenticated = Principal.isAuthenticated;
        });


    });
