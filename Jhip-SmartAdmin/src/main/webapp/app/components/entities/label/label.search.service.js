'use strict';

angular.module('jhipsterbankApp')
    .factory('LabelSearch', function ($resource) {
        return $resource('api/_search/labels/:query', {}, {
            'query': { method: 'GET', isArray: true}
        });
    });
