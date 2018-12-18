'use strict';

angular.module('SmartAdminWebapp')
    .controller('UserManagementController',
    function ($scope, $state, Principal, User, ParseLinks, Language, $compile, $filter, DTOptionsBuilder, DTColumnBuilder) {
        var vm = this;
        vm.entity = {};
        $scope.users = [];
        $scope.addUserForm = {};
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

        vm.manageUserHeaderText = "user-management.title";
        vm.createHeaderText = "user-management.createForm";
        vm.updateHeaderText = "user-management.updateForm";
        vm.deleteHeaderText = "user-management.deleteForm";
        vm.detailHeaderText = "user-management.detail";
        $scope.headerText = vm.manageUserHeaderText;
        $scope.showListOfUserForm= true;

        /*  Show List of User Form    */
        $scope.ListOfUserAccountForm = function(){
            $scope.headerText = vm.manageUserHeaderText;
            $scope.showAddUserForm = false;
            $scope.showUpdateUserForm = false;
            $scope.showUserDetailForm = false;
            $scope.showListOfUserForm = true;
        };
        /*  Show Create New User Form    */
        $scope.AddUserForm = function(){
            $scope.headerText = vm.createHeaderText;
            $scope.showListOfUserForm= false;
            $scope.showUpdateUserForm = false;
            $scope.showUserDetailForm = false;
            $scope.showAddUserForm = true;
        };
        /*  Show Update User Form    */
        $scope.UpdateUserForm = function(){
            $scope.headerText = vm.updateHeaderText;
            $scope.showAddUserForm = false;
            $scope.showListOfUserForm = false;
            $scope.showUserDetailForm = false;
            $scope.showUpdateUserForm = true;
        };


        vm.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
            url: '/api/users/',
            type: 'GET'
        })  .withOption('createdRow', createdRow)
            .withDisplayLength(10)
            .withPaginationType('full_numbers')
            .withDOM("<'dt-toolbar'<'col-xs-6 col-sm-6'f><'col-sm-6 col-xs-6 hidden-xs'l>r>" +
            "t" +
            "<'dt-toolbar-footer'<'col-sm-6 col-xs-6 hidden-xs'i><'col-xs-6 col-sm-6'p>>")
            .withColReorder()
            .withColReorderOption('iFixedColumnsLeft', 1)
            .withColReorderOption('iFixedColumnsRight', 1) // Fix last right column
            .withOption('responsive', true)
            //.withDOM('frtip') // disable select [10,20,30,50]
            .withButtons([
                'print',
                'csv',
                'pdf'
            ])
            .withBootstrap();

        vm.dtColumns = [
            DTColumnBuilder.newColumn('id'),
            DTColumnBuilder.newColumn('login'),
            DTColumnBuilder.newColumn('firstName'),
            DTColumnBuilder.newColumn('lastName'),
            DTColumnBuilder.newColumn('email'),
            DTColumnBuilder.newColumn('createdDate').renderWith(function (data, type, full) {
                return $filter('date')(data, 'dd/MM/yyyy'); }), //date filter
            DTColumnBuilder.newColumn('authorities'),
            DTColumnBuilder.newColumn('activated'),
            DTColumnBuilder.newColumn('langKey').withTitle('Lang').withClass('none'),
            DTColumnBuilder.newColumn('lastModifiedBy').withTitle('Modified By').withClass('none'),
            DTColumnBuilder.newColumn('lastModifiedDate').renderWith(function (data, type, full) {
                return $filter('date')(data, 'dd/MM/yyyy'); }).withTitle('Modified Date').withClass('none'),
            DTColumnBuilder.newColumn(null).notSortable().renderWith(actionButtons)
        ];

        // Action buttons added to the last column: to edit and delete rows ui-sref="user-management.edit({login:user.login})"
        function actionButtons(data, type, full, meta) {
            vm.entity[data.id] = data;
            return '<button class="btn btn-info btn-xs" ng-click="loadUpdateFormById({login:' + data.id + '})">' +
                '   <i class="fa fa-edit"></i>' +
                '</button>&nbsp;' +
                /*'<button class="btn btn-info btn-xs" ui-sref="user-management-detail({login:' + data.id + '})">' +
                '   <i class="fa fa-eye"></i>' +
                '</button>&nbsp;' +*/
                '<button class="btn btn-danger btn-xs" ui-sref="user-management.delete({login:' + data.id + '})">' +
                '   <i class="fa fa-trash-o"></i>' +
                '</button>';
        }
        function createdRow(row, data, dataIndex) {
            $compile(angular.element(row).contents())($scope);
        }

        /*********************************************
         *        CREATE NEW USER                    *
         *********************************************/
        $scope.saveUser = function () {
            $scope.isSaving = true;
            console.log('---> '+ JSON.stringify($scope.addUserForm));
            var id = $scope.addUserForm.id;
            if (id == null) {
                User.save($scope.addUserForm, onSaveSuccess, onSaveError);
            }
        };


        /*********************************************
         *           UPDATE                          *
         *********************************************/
        $scope.loadUpdateFormById = function(loginId){
            this.UpdateUserForm();
            User.get(loginId, function(result) {
                $scope.updateUserForm = result;
            });
        };
        $scope.updateUser = function () {
            $scope.isSaving = true;
            var id = $scope.updateUserForm.id;
            if (id != null) {
                User.update($scope.updateUserForm, onSaveSuccess, onSaveError);
            }
        };

        var onSaveSuccess = function (result) {
            $scope.isSaving = false;
        };
        var onSaveError = function (result) {
            $scope.isSaving = false;
        };


    });
