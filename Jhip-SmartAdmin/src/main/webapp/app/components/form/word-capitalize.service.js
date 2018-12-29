/**
 * Created by Zaman on 22/12/2018
 */

/*    Shared by all modules    */
"use strict";
angular.module('SmartAdminWebapp').directive('capitalizeEachWord', function (uppercaseFilter, $parse) {
    return {
        require: 'ngModel',
        scope: {
            ngModel: "="
        },
        link: function (scope, element, attrs, modelCtrl) {
            scope.$watch("ngModel", function () {
                if (scope.ngModel!=null){
                    scope.ngModel = scope.ngModel.toLowerCase();
                    scope.ngModel = scope.ngModel.replace(/^(.)|\s(.)/g, function(v){ return v.toUpperCase( ); });
                }
            });
        }
    };
});

"use strict";
angular.module('SmartAdminWebapp').directive('uppercase', function (uppercaseFilter, $parse) {
    return {
        require: 'ngModel',
        scope: {
            ngModel: "="
        },
        link: function (scope, element, attrs, modelCtrl) {
            scope.$watch("ngModel", function () {
                if (scope.ngModel!=null)
                    scope.ngModel = scope.ngModel.toUpperCase();
            });
        }
    };
});

"use strict";
angular.module('SmartAdminWebapp').directive('lowercase', function (uppercaseFilter, $parse) {
    return {
        require: 'ngModel',
        scope: {
            ngModel: "="
        },
        link: function (scope, element, attrs, modelCtrl) {
            scope.$watch("ngModel", function () {
                if (scope.ngModel!=null)
                    scope.ngModel = scope.ngModel.toLowerCase();
            });
        }
    };
});

"use strict";
angular.module('SmartAdminWebapp').directive('sentencecase', function(uppercaseFilter, $parse) {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {
            var capitalize = function(inputValue) {
                if(inputValue!=null){
                    var capitalized = inputValue.charAt(0).toUpperCase() + inputValue.substring(1);
                    if(capitalized !== inputValue) {
                        modelCtrl.$setViewValue(capitalized);
                        modelCtrl.$render();
                    }
                    return capitalized;
                }
            };
            var model = $parse(attrs.ngModel);
            modelCtrl.$parsers.push(capitalize);
            capitalize(model(scope));
        }
    };
});

