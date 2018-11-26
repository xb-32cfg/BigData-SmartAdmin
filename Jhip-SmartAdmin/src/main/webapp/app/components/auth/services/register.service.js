'use strict';

angular.module('SmartAdminWebapp')
    .factory('Register', function ($resource) {
        return $resource('api/register', {}, {
        });
    });


