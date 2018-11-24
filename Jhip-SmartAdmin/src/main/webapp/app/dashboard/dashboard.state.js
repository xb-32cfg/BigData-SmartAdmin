'use strict';

angular.module('jhipsterbankApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('dashboard', {
                parent: 'site',
                url: '/dashboard',
                data: {
                    authorities: []
                },
                views: {
                    'content': {
                        templateUrl: 'app/dashboard/dashboard.html',
                        controller: 'DashboardController'
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
