'use strict';

angular.module('SmartAdminWebapp')
    .controller('LayoutController', function ($scope, $location, $state, Auth, Principal, ENV) {

        $scope.isAuthenticated = Principal.isAuthenticated;
        $scope.$state = $state;
        $scope.inProduction = ENV === 'prod';

        /*    Logout  */
        $scope.logout = function () {
            Auth.logout();
            $state.go('login');
        };

        /*    Logoff  */
        $scope.Logoff = function () {
            Auth.logout();
            $state.go('logoff');
        };

    });
