'use strict';

angular.module('jhipsterbankApp')
    .controller('DashboardController', function ($scope, $state, Principal, ENV) {

        console.log("you are at dashboard controller ");

        $scope.isAuthenticated = Principal.isAuthenticated;
        $scope.$state = $state;
        $scope.inProduction = ENV === 'prod';


    });
