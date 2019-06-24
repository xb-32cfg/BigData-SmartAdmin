'use strict';

angular.module('SmartAdminWebapp')
    .controller('LoginController', function ($rootScope, $scope, $state, $timeout, $translate, Auth, Principal, ENV) {
        $scope.user = {};
        $scope.errors = {};
        $scope.rememberMe = true;
        $timeout(function (){angular.element('[ng-model="username"]').focus();});

        $scope.isAuthenticated = Principal.isAuthenticated;
        $scope.$state = $state;
        $scope.inProduction = ENV === 'prod';


        $scope.login = function (event) {
            event.preventDefault();
            Auth.login({
                username: $scope.username,
                password: $scope.password,
                rememberMe: $scope.rememberMe

            }).then(function () {
                $scope.authenticationError = false;
                if ($rootScope.previousStateName === 'register') {
                    $state.go('login');
                } else {
                    //$rootScope.back();
                    $state.go('home');
                    $rootScope.loginUserName = $scope.username;
                }
            }).catch(function () {
                $scope.authenticationError = true;
            });
        };

        /*   New User Registration  */
        $scope.success = null;
        $scope.error = null;
        $scope.doNotMatch = null;
        $scope.errorUserExists = null;
        $scope.registerAccount = {};
        $timeout(function (){angular.element('[ng-model="registerAccount.login"]').focus();});

        $scope.register = function () {
            if ($scope.registerAccount.password !== $scope.confirmPassword) {
                $scope.doNotMatch = 'ERROR';
            } else {
                $scope.registerAccount.langKey = $translate.use();
                $scope.doNotMatch = null;
                $scope.error = null;
                $scope.errorUserExists = null;
                $scope.errorEmailExists = null;

                //console.log(JSON.stringify($scope.registerAccount));
                Auth.createAccount($scope.registerAccount)
                    .then(function () {
                        $scope.success = 'OK';
                    })
                    .catch(function (response) {
                        $scope.success = null;
                        if (response.status === 400 && response.data === 'login already in use') {
                            $scope.errorUserExists = 'ERROR';
                        } else if (response.status === 400 && response.data === 'e-mail address already in use') {
                            $scope.errorEmailExists = 'ERROR';
                        } else {
                            $scope.error = 'ERROR';
                        }
                    });
            }
        };


    });
