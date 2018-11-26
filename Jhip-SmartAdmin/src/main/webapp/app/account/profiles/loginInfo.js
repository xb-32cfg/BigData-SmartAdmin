"use strict";

angular.module('SmartAdminWebapp').directive('loginInfo', function(AuthLoginUser){

    return {
        restrict: 'A',
        templateUrl: 'app/account/profiles/login-info.tpl.html',
        link: function(scope, element){
            AuthLoginUser.initialized.then(function(){
                scope.user = AuthLoginUser;
            });
        }
    }
});
