'use strict';

angular.module('jhipsterbankApp')
    .controller('BankAccountDetailController', function ($scope, $rootScope, $stateParams, entity, BankAccount, Operation, User) {
        $scope.bankAccount = entity;
        $scope.load = function (id) {
            BankAccount.get({id: id}, function(result) {
                $scope.bankAccount = result;
            });
        };
        var unsubscribe = $rootScope.$on('jhipsterbankApp:bankAccountUpdate', function(event, result) {
            $scope.bankAccount = result;
        });
        $scope.$on('$destroy', unsubscribe);

    });
