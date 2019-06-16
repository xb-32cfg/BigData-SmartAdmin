'use strict';

angular.module('SmartAdminWebapp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('home', {
                parent: 'site',
                url: '/home',
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'global.menu.home'
                },
                views: {
                    'content': {
                        templateUrl: 'app/home/home.html',
                        controller: 'HomeController'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate,$translatePartialLoader) {
                        $translatePartialLoader.addPart('dashboard');
                        return $translate.refresh();
                    }]
                }
            });


    });
