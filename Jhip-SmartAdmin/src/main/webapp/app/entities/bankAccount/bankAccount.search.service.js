'use strict';

angular.module('SmartAdminApp')
    .factory('BankAccountSearch', function ($resource) {
        return $resource('api/_search/bankAccounts/:query', {}, {
            'query': { method: 'GET', isArray: true}
        });
    });
