'use strict';

angular.module('SmartAdminWebapp')
    .factory('BankAccountSearch', function ($resource) {
        return $resource('api/_search/bankAccounts/:query', {}, {
            'query': { method: 'GET', isArray: true}
        });
    });
