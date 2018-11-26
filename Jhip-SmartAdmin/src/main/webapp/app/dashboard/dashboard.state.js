'use strict';

angular.module('SmartAdminWebapp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('dashboard', {
                parent: 'site',
                url: '/dashboard',
                data: {
                    authorities: ['ROLE_USER'],
                    title: 'Dashboard'
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
