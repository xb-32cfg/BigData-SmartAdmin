'use strict';

angular.module('SmartAdminWebapp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('student-management', {
                parent: 'site',
                url: '/student-management',
                data: {
                    authorities: ['ROLE_ADMIN'],
                    pageTitle: 'user-management.title'
                },
                views: {
                    'content': {
                        templateUrl: 'app/admin/student-management/student-management.html',
                        controller: 'StudentManagementController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('student.management');
                        return $translate.refresh();
                    }]
                },
                scripts: function(lazyScript){
                    return lazyScript.register([
                        'build/vendor.ui.js',
                        'bootstrap-validator'
                    ])

                }
            })


    });
