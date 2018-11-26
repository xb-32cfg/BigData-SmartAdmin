'use strict';

angular.module('SmartAdminWebapp')
    .controller('HomeController', function ($scope, Principal) {

        Principal.identity().then(function(account) {
            $scope.account = account;
            $scope.isAuthenticated = Principal.isAuthenticated;
        });

    });
