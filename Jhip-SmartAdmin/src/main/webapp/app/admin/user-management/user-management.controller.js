'use strict';

angular.module('SmartAdminWebapp')
    .controller('UserManagementController', function ($scope, Principal, User, ParseLinks, Language,
                                                      $compile, DTOptionsBuilder, DTColumnBuilder) {
        $scope.users = [];
        $scope.authorities = ["ROLE_USER", "ROLE_ADMIN"];
        Language.getAll().then(function (languages) {
            $scope.languages = languages;
        });
		
		Principal.identity().then(function(account) {
            $scope.currentAccount = account;
        });
        $scope.page = 1;
        $scope.loadAll = function () {
            User.query({page: $scope.page - 1, size: 20}, function (result, headers) {
                $scope.links = ParseLinks.parse(headers('link'));
                $scope.totalItems = headers('X-Total-Count');
                $scope.users = result;
            });
        };

        $scope.loadPage = function (page) {
            $scope.page = page;
            $scope.loadAll();
        };
        $scope.loadAll();

        $scope.setActive = function (user, isActivated) {
            user.activated = isActivated;
            User.update(user, function () {
                $scope.loadAll();
                $scope.clear();
            });
        };

        $scope.clear = function () {
            $scope.user = {
                id: null, login: null, firstName: null, lastName: null, email: null,
                activated: null, langKey: null, createdBy: null, createdDate: null,
                lastModifiedBy: null, lastModifiedDate: null, resetDate: null,
                resetKey: null, authorities: null
            };
            $scope.editForm.$setPristine();
            $scope.editForm.$setUntouched();
        };

        $scope.showListOfUserForm= true;

        var vm = this;
        /*vm.dtOptions = DTOptionsBuilder
            .fromSource('app/admin/user-management/data.json')
            // Add Bootstrap compatibility
            .withOption('aaSorting',[0,'asc']) // for default sorting column
            .withDisplayLength(10) // Page size
            .withPaginationType('full_numbers')
            .withDOM('frtlip')
            .withBootstrap();*/

        /*User.query({page: $scope.page - 1, size: 20}, function (result, headers) {
            $scope.links = ParseLinks.parse(headers('link'));
            $scope.totalItems = headers('X-Total-Count');
            $scope.users = result;
        });*/
        vm.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
            url: '/api/users/', // Url to get data
            type: 'GET'
        }).withOption('processing', true) //for show progress bar
            .withDisplayLength(2) // Page size
            .withPaginationType('full_numbers')
        .withBootstrap();

        vm.dtColumns = [
            DTColumnBuilder.newColumn('id').withTitle('ID').withClass('text-danger'),
            DTColumnBuilder.newColumn('login').withTitle('Login'),
            DTColumnBuilder.newColumn('firstName').withTitle('firstName'),
            DTColumnBuilder.newColumn('lastName').withTitle('lastName'),
            DTColumnBuilder.newColumn('email').withTitle('email'),
            DTColumnBuilder.newColumn('activated').withTitle('activated')
        ];

    });
