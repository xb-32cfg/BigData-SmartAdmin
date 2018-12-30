/**
 * Created by Zaman on 12/30/2018.
 */
'use strict';

angular.module('SmartAdminWebapp')
    .directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.bind('change', function(){
                    $parse(attrs.fileModel).assign(scope,element[0].files);
                    scope.$apply();
                });
            }
        };
    }]);
