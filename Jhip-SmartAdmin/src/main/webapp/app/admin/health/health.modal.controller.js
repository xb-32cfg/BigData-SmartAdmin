'use strict';

angular.module('jhipsterbankApp')
    .controller('HealthModalController', function($scope, $uibModalInstance, currentHealth, baseName, subSystemName) {

        $scope.currentHealth = currentHealth;
        $scope.baseName = baseName, $scope.subSystemName = subSystemName;

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    });
