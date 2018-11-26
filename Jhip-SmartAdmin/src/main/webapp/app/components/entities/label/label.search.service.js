'use strict';

angular.module('SmartAdminWebapp')
    .factory('LabelSearch', function ($resource) {
        return $resource('api/_search/labels/:query', {}, {
            'query': { method: 'GET', isArray: true}
        });
    });
