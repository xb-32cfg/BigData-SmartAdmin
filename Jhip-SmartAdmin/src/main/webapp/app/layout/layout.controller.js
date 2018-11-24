/**
 * Created by Zaman on 11/23/2018.
 */
'use strict';

angular.module('app.layout').controller('LayoutController', function ($scope, $state, Auth) {


    $scope.logout = function () {
        console.log('LayoutController page ');
        Auth.logout();
        $state.go('login');
    };

});

