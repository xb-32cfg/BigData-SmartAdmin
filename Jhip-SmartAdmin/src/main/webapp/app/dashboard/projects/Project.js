"use strict";

angular.module('SmartAdminWebapp').factory('Project', function($http, APP_CONFIG){
    return {
        list: $http.get(APP_CONFIG.apiRootUrl + '/projects.json')
    }
});