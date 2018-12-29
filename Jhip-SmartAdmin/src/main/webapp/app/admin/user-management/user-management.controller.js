'use strict';

angular.module('SmartAdminWebapp')
    .controller('UserManagementController',
    function ($scope, $state, Principal, User, ParseLinks, Language, $compile, $filter, DTOptionsBuilder, DTColumnBuilder) {
        var vm = this;
        vm.entity = {};
        $scope.page = 1;
        $scope.isSaving = false;
        $scope.users = [];
        $scope.addUserForm = {};
        $scope.authorities = ["ROLE_USER", "ROLE_ADMIN", "ROLE_STUDENT", "ROLE_PARENTS", "ROLE_DEFAULT"];
        Language.getAll().then(function (languages) {
            $scope.languages = languages;
        });
		
		Principal.identity().then(function(account) {
            $scope.currentAccount = account;
        });

        function loadAll () {
            User.query({page: $scope.page - 1, size: 20}, function (result, headers) {
                $scope.links = ParseLinks.parse(headers('link'));
                $scope.totalItems = headers('X-Total-Count');
                $scope.users = result;
            });
        };

        $scope.loadPage = function (page) {
            $scope.page = page;
            loadAll();
        };
        loadAll();


        /*********************************************
         *           RESET                           *
         *********************************************/
        $scope.clear = function () {
            $scope.isSaving = false;
            $scope.addUserForm = {};
            $scope.updateUserForm = {};
        };

        vm.manageUserHeaderText = "user-management.title";
        vm.createHeaderText = "user-management.addForm";
        vm.updateHeaderText = "user-management.updateForm";
        vm.deleteHeaderText = "user-management.deleteForm";
        vm.detailHeaderText = "user-management.detail";
        $scope.headerText = vm.manageUserHeaderText;
        $scope.showListOfUserForm= true;

        /*  Show List of User Form    */
        $scope.ListOfUserAccountForm = function(){
            $state.go('user-management', null, { reload: true });

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


        /*********************************************
         *           TABLE LIST                      *
         *********************************************/
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
            /*.withButtons([
                'print',
                'csv'
            ])*/
            .withBootstrap();

        vm.dtColumns = [
            DTColumnBuilder.newColumn('id'),
            DTColumnBuilder.newColumn('login'),
            DTColumnBuilder.newColumn('firstName'),
            DTColumnBuilder.newColumn('lastName'),
            DTColumnBuilder.newColumn('email'),
            DTColumnBuilder.newColumn('authorities'),
            DTColumnBuilder.newColumn('activated'),
            DTColumnBuilder.newColumn('createdDate').renderWith(function (data, type, full) {
                return $filter('date')(data, 'dd/MM/yyyy'); }), //date filter
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
            //console.log('---> '+ JSON.stringify($scope.addUserForm));
            if ( $('#addUserForm').data('bootstrapValidator').isValid() ) {
                BootstrapDialog.save('', function (result) {
                    if (result) {
                        User.save($scope.addUserForm, onSaveSuccess, onSaveError);
                    }
                });
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
            //console.log('---> '+ JSON.stringify($scope.updateUserForm));
            var id = $scope.updateUserForm.id;
            if (id != null) {
                BootstrapDialog.save('', function(result){
                    if(result) {
                        User.update($scope.updateUserForm, onUpdateSuccess, onSaveError);
                    }
                });
            }
        };


        /*********************************************
         *       DISPLAY CONFIRMATION MESSAGE        *
         *********************************************/
        var onSaveSuccess = function (result) {
            SuccessMessageDisplay(result);
            $scope.isSaving = true;
        };
        var onUpdateSuccess = function (result) {
            UpdatedMessageDisplay(result);
            $scope.isSaving = true;
        };
        var onSaveError = function (result) {
            $scope.isSaving = false;
        };

    });
