'use strict';

angular.module('jhipsterbankApp')
    .controller('MainController', function ($scope, Principal) {

        Principal.identity().then(function(account) {
            $scope.account = account;
            $scope.isAuthenticated = Principal.isAuthenticated;
        });

    });
