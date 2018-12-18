'use strict';

angular.module('SmartAdminWebapp')
    .factory('User', function ($resource) {
        return $resource('api/users/:login', {}, {
                'query' : { method: 'GET', isArray: true},
                'get'   : { method: 'GET', url: 'api/loginUser/:login'},
                'save'  : { method: 'POST' },
                'update': { method: 'PUT' },
                'delete': { method: 'DELETE' }
            });
        });
