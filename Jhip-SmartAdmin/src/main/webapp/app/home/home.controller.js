'use strict';

angular.module('SmartAdminApp')
    .controller('HomeController', function ($scope, Principal) {

        Principal.identity().then(function(account) {
            $scope.account = account;
            $scope.isAuthenticated = Principal.isAuthenticated;
        });

    });
