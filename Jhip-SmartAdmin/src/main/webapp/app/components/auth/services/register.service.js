'use strict';

angular.module('jhipsterbankApp')
    .factory('Register', function ($resource) {
        return $resource('api/register', {}, {
        });
    });


