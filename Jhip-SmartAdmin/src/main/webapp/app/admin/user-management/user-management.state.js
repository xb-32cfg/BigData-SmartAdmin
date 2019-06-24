'use strict';

angular.module('SmartAdminWebapp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('user-management', {
                parent: 'site',
                url: '/user-management',
                data: {
                    authorities: ['ROLE_ADMIN'],
                    pageTitle: 'user-management.title'
                },
                views: {
                    'content': {
                        templateUrl: 'app/admin/user-management/user-management.html',
                        controller: 'UserManagementController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('user.management');
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

            .state('user-management.delete', {
                parent: 'site',
                url: '/user-management/delete/:login',
                data: {
                    authorities: ['ROLE_ADMIN'],
                    pageTitle: 'user-management.deleteForm'
                },
                views: {
                    'content': {
                        templateUrl: 'app/admin/user-management/delete-user-form.tpl.html',
                        controller: 'UserManagementDeleteController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('user.management');
                        return $translate.refresh();
                    }]
                }
            });

            /*.state('user-management.changePassword', {
                parent: 'site',
                url: '/user-management/chgpwd/:login',
                data: {
                    authorities: ['ROLE_ADMIN'],
                    pageTitle: 'global.menu.account.password'
                },
                views: {
                    'content': {
                        templateUrl: 'app/admin/user-management/change-password-form.tpl.html',
                        controller: 'PwdChangeControllerByAdmin'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('password');
                        return $translate.refresh();
                    }]
                },
                scripts: function(lazyScript){
                    return lazyScript.register([
                        'build/vendor.ui.js',
                        'bootstrap-validator'
                    ])
                }
            });*/


    });
