

'use strict';
angular.module('jhipsterbankApp').factory('AuthLoginUser', function ($http, $q, APP_CONFIG, $cookies) {
    var dfd = $q.defer();
    var UserModel = {
        initialized: dfd.promise,
        username: undefined,
        picture: undefined
    };

     $http.get(APP_CONFIG.apiRootUrl + '/user.json').then(function(response){

         var username = $cookies.get('username');
         UserModel.username = 'Nuruzzaman';

         UserModel.picture= response.data.picture;
         dfd.resolve(UserModel)
     });

    return UserModel;
});


