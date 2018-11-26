 'use strict';

angular.module('SmartAdminWebapp')
    .factory('notificationInterceptor', function ($q, AlertService) {
        return {
            response: function(response) {
                var alertKey = response.headers('X-SmartAdminWebapp-alert');
                if (angular.isString(alertKey)) {
                    AlertService.success(alertKey, { param : response.headers('X-SmartAdminWebapp-params')});
                }
                return response;
            }
        };
    });
