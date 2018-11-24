/**
 * Created by Zaman on 11/24/2018.
 */

"use strict";

angular.module('jhipsterbankApp')
    .config(function ($urlRouterProvider, $stateProvider) {

        $stateProvider
            .state('site11', {
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
