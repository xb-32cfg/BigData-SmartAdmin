'use strict';

angular.module('SmartAdminWebapp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('activate', {
                parent: 'account',
                url: '/activate?key',
                data: {
                    authorities: [],
                    pageTitle: 'activate.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/account/activate/activate.html',
                        controller: 'ActivationController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('activate');
                        return $translate.refresh();
                    }]
                }
            });
    });
