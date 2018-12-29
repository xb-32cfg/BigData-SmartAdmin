/**
 * Created by Zaman on 12/30/2018.
 */
'use strict';

angular.module('SmartAdminWebapp')
    .directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;
                console.log("file model----> "+attrs.fileModel);

                element.bind('change', function(){
                    scope.$apply(function(){
                        modelSetter(scope, element[0].files[0]);
                        console.log("element[0].files[0]--> "+element[0].files[0]);
                    });
                });
            }
        };
    }]);
