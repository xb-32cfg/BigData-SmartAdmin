/*
/!**
 * Created by Zaman on 11/25/2018.
 *!/

"use strict";
angular.module('jhipsterbankApp')

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('site', {
                abstract: true,
                views: {
                    'root@': {
                        templateUrl: 'app/layout/layout.tpl.html',
                        controller: 'LayoutController'
                    }
                },
                resolve: {
                    authorize: ['Auth',
                        function (Auth) {
                            return Auth.authorize();
                        }
                    ],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('global');
                    }],
                    scripts: function (lazyScript) {
                        return lazyScript.register([
                            'sparkline',
                            'easy-pie'
                        ]);
                    }
                }
            });
        /!*  Specify startup page here  *!/
        $urlRouterProvider.otherwise('/');
    });
*/
