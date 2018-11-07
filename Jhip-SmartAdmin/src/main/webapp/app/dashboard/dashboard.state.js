'use strict';

angular.module('jhipsterbankApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('dashboard', {
                parent: 'site',
                url: '/',
                data: {
                    authorities: []
                },
                views: {
                    'content@': {
                        templateUrl: 'app/dashboard/dashboard.html',
                        controller: 'DashboardController'
                    }
                }
            });
    });
