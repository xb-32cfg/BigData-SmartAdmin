/**
 * Created by Zaman on 11/25/2018.
 */

"use strict";
angular.module('SmartAdminWebapp')

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
                    }]
                }
            });
        /*  Specify startup page here  */
        $urlRouterProvider.otherwise('/login');

    });
