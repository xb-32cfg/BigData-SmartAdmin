'use strict';

angular.module('SmartAdminApp').controller('BankAccountDialogController',
    ['$scope', '$stateParams', '$uibModalInstance', 'entity', 'BankAccount', 'Operation', 'User',
        function($scope, $stateParams, $uibModalInstance, entity, BankAccount, Operation, User) {

        $scope.bankAccount = entity;
        $scope.operations = Operation.query();
        $scope.users = User.query();
        $scope.load = function(id) {
            BankAccount.get({id : id}, function(result) {
                $scope.bankAccount = result;
            });
        };

        var onSaveSuccess = function (result) {
            $scope.$emit('SmartAdminApp:bankAccountUpdate', result);
            $uibModalInstance.close(result);
            $scope.isSaving = false;
        };

        var onSaveError = function (result) {
            $scope.isSaving = false;
        };

        $scope.save = function () {
            $scope.isSaving = true;
            if ($scope.bankAccount.id != null) {
                BankAccount.update($scope.bankAccount, onSaveSuccess, onSaveError);
            } else {
                BankAccount.save($scope.bankAccount, onSaveSuccess, onSaveError);
            }
        };

        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
}]);
