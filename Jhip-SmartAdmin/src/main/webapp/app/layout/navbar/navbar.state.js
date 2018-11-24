/**
 * Created by Zaman on 11/24/2018.
 */

'use strict';

angular.module('jhipsterbankApp')
    .config(function ($urlRouterProvider, $stateProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider.state('site', {
            'abstract': true,
            views: {
                /*'navbar@': {
                 templateUrl: 'app/layout/navbar/loginNavbar.html',
                 controller: 'NavbarController'
                 }*/
                'root@': {
                    templateUrl: 'app/layout/navbar/loginNavbar.html',
                    controller: 'NavbarController'
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

    });
