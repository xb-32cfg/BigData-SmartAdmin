'use strict';

angular.module('SmartAdminApp')
    .factory('Register', function ($resource) {
        return $resource('api/register', {}, {
        });
    });


