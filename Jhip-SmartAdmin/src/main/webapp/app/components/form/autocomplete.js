/**
 * Created by Zaman on 14/12/2015.
 */


/*        States Auto Complete     */
'use strict';
angular.module('SmartAdminWebapp').directive('autocompleteStates', function ($http) {
    return {
        restrict: 'A',
        scope: {
            'source': '='
        },
        link: function (scope, element, attributes) {
            $http.get("json/common/states-my.json").then(function(response) {
                element.autocomplete({
                    source: response.data.data
                });
            });
        }
    }
});


angular.module('SmartAdminWebapp').factory('SearchStates', function($http, $cacheFactory, APP_CONFIG) {
    return {
        get: function(payload, successCallback){
            var key = 'search_' + payload.q;
            if($cacheFactory.get(key) == undefined || $cacheFactory.get(key) == ''){
                $http.get(APP_CONFIG.apiRootUrl+'/common/states-my.json', {params: payload}).then(function(data){
                    $cacheFactory(key).put('result', data.data);
                    console.log("app.systemSetting USER Mangt Ctrl-----------"+data.data);
                    successCallback(data.data);
                });
            }else{
                successCallback($cacheFactory.get(key).get('result'));
            }
        }
    }
});

