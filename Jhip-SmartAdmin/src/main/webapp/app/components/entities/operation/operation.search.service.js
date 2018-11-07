'use strict';

angular.module('jhipsterbankApp')
    .factory('OperationSearch', function ($resource) {
        return $resource('api/_search/operations/:query', {}, {
            'query': { method: 'GET', isArray: true}
        });
    });
