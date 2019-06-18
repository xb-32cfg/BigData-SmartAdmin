

'use strict';
angular.module('SmartAdminWebapp').factory('AuthLoginUser', function ($http, $q, APP_CONFIG, $cookies, $rootScope) {
    var dfd = $q.defer();
    var UserModel = {
        initialized: dfd.promise,
        username: undefined,
        picture: undefined
    };

     $http.get(APP_CONFIG.apiRootUrl + '/user.json').then(function(response){

         var username="";
         username = $rootScope.loginUserName;
         console.log("Login User Name: "+username);
         UserModel.username = username;

         UserModel.picture= response.data.picture;
         dfd.resolve(UserModel)
     });

    return UserModel;
});
