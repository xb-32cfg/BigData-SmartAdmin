/**
 * Created by Zaman on 11/23/2018.
 */
'use strict';

angular.module('jhipsterbankApp').controller('LayoutController', function ($scope, $state, Principal, ENV) {

console.log('Layout Controller ');

    $scope.isAuthenticated = Principal.isAuthenticated;
    $scope.$state = $state;
    $scope.inProduction = ENV === 'prod';


});

