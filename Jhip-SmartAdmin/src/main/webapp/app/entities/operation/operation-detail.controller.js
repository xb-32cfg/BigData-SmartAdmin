'use strict';

angular.module('jhipsterbankApp')
    .controller('OperationDetailController', function ($scope, $rootScope, $stateParams, entity, Operation, BankAccount, Label) {
        $scope.operation = entity;
        $scope.load = function (id) {
            Operation.get({id: id}, function(result) {
                $scope.operation = result;
            });
        };
        var unsubscribe = $rootScope.$on('jhipsterbankApp:operationUpdate', function(event, result) {
            $scope.operation = result;
        });
        $scope.$on('$destroy', unsubscribe);

    });
