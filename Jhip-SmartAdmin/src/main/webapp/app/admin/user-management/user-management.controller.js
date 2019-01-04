'use strict';

angular.module('SmartAdminWebapp')
    .controller('UserManagementController',
    function ($scope, $state, $http, Principal, User, ParseLinks, Language, $compile, APP_CONFIG,
              $filter, fileReader, DTOptionsBuilder, DTColumnBuilder) {
        var vm = this;
        vm.entity = {};
        $scope.page = 1;
        $scope.isSaving = false;
        $scope.users = [];
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
            $('#addUserForm').data('bootstrapValidator').resetForm();
            $('#updateUserForm').data('bootstrapValidator').resetForm();
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
            $scope.addUserForm = {};
            $('#addUserForm').data('bootstrapValidator').resetForm();
        };
        /*  Show Update User Form    */
        $scope.UpdateUserForm = function(){
            $scope.headerText = vm.updateHeaderText;
            $scope.showAddUserForm = false;
            $scope.showListOfUserForm = false;
            $scope.showUserDetailForm = false;
            $scope.showUpdateUserForm = true;
            $scope.updateUserForm = {};
            $('#updateUserForm').data('bootstrapValidator').resetForm();
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
            DTColumnBuilder.newColumn('emailAddress'),
            DTColumnBuilder.newColumn('imageName').renderWith(function (data, type, full) {
                return '<img style="width:40px;height:40px;" src='+APP_CONFIG.uploadUrl + data + ' />';
            }),
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
        $scope.files = "";
        $scope.$on("fileProgress", function(e, progress) {
            $scope.progress = progress.loaded / progress.total;
        });
        $scope.saveUser = function () {
            var data = new FormData();
            data.append("login", $scope.addUserForm.login);
            data.append("firstName", $scope.addUserForm.firstName);
            data.append("middleName", $scope.addUserForm.middleName);
            data.append("lastName", $scope.addUserForm.lastName);
            data.append("nationalId", $scope.addUserForm.nationalId);
            data.append("emailAddress", $scope.addUserForm.emailAddress);
            data.append("password", $scope.addUserForm.password);
            data.append("phone", $scope.addUserForm.phone);
            data.append("activated", $scope.addUserForm.activated);
            data.append("passwordExpDate", $scope.addUserForm.passwordExpDate);
            data.append("maxLogin", $scope.addUserForm.maxLogin);
            data.append("maxFailAttemptsAllow", $scope.addUserForm.maxFailAttemptsAllow);
            data.append("accActivationDate", $scope.addUserForm.accActivationDate);
            data.append("langKey", $scope.addUserForm.langKey);
            data.append("authorities", $scope.addUserForm.authority);
            data.append("comments", $scope.addUserForm.comments);
            data.append("files",  $scope.files[0]);

            var config = {
                transformRequest: angular.identity,
                transformResponse: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            };

            if ( $('#addUserForm').data('bootstrapValidator').isValid() ) {
                BootstrapDialog.save('', function (result) {
                    if (result) {
                        //User.save($scope.addUserForm, onSaveSuccess, onSaveError);
                        $http.post(APP_CONFIG.serverUrl+"/api/users", data, config).then(
                            function(response) {
                                console.log('User created successfully');
                                onSaveSuccess(response);
                            },
                            function(errResponse) {
                                console.error('Error while creating User');
                                onSaveError(errResponse);
                            });
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
            console.log('---> '+ JSON.stringify($scope.updateUserForm));
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
