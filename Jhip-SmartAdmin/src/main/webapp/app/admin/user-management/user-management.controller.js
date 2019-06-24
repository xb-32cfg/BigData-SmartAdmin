'use strict';

angular.module('SmartAdminWebapp')
    .controller('UserManagementController',
        function ($scope, $state, $http, Principal, User, ParseLinks, Language, $compile, APP_CONFIG,
                  $filter, fileReader, DTOptionsBuilder, DTColumnBuilder) {
            var vm = this;
            var today = new Date();
            var config = {
                transformRequest: angular.identity,
                transformResponse: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            };

            $scope.page = 1;
            $scope.isSaving = false;
            $scope.users = [];
            $scope.authorities = ["ROLE_USER", "ROLE_ADMIN", "ROLE_SHAREHOLDER", "ROLE_INVESTOR", "ROLE_DEFAULT"];
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
                $scope.changePwdForm = {};
                $('#addUserForm').data('bootstrapValidator').resetForm();
                $('#updateUserForm').data('bootstrapValidator').resetForm();
                $('#changePwdForm').data('bootstrapValidator').resetForm();
            };

            vm.manageUserHeaderText = "user-management.title";
            vm.createHeaderText = "user-management.addForm";
            vm.updateHeaderText = "user-management.updateForm";
            vm.deleteHeaderText = "user-management.deleteForm";
            vm.changePwdHeaderText = "user-management.changePassword";
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
                $scope.addUserForm.activated = false;
                $scope.addUserForm.maxLogin = 0;
                $scope.addUserForm.maxFailAttemptsAllow = 0;
                $scope.addUserForm.langKey = 'en';
                $scope.addUserForm.accActivationDate = new Date();
                $scope.addUserForm.passwordExpDate = new Date(new Date().setDate(today.getDate() + 365));
                $('#addUserForm').data('bootstrapValidator').resetForm();
            };
            /*  Show Update User Form    */
            $scope.UpdateUserForm = function(){
                $scope.headerText = vm.updateHeaderText;
                $scope.showAddUserForm = false;
                $scope.showListOfUserForm = false;
                $scope.showUserDetailForm = false;
                $scope.showUpdateUserForm = true;
                $scope.showChangePwdForm = false;
                $scope.updateUserForm = {};
                $scope.updateUserForm.maxLogin = 0;
                $scope.updateUserForm.maxFailAttemptsAllow = 0;
                $('#updateUserForm').data('bootstrapValidator').resetForm();
            };
            /*  Show Change User Password Form    */
            $scope.ChangePasswordForm = function(){
                $scope.headerText = vm.changePwdHeaderText;
                $scope.showAddUserForm = false;
                $scope.showListOfUserForm = false;
                $scope.showUserDetailForm = false;
                $scope.showUpdateUserForm = false;
                $scope.showChangePwdForm = true;
                $scope.updateUserForm = {};
                $scope.updateUserForm.maxLogin = 0;
                $scope.updateUserForm.maxFailAttemptsAllow = 0;
                $('#updateUserForm').data('bootstrapValidator').resetForm();
            };


            /*    Set Password Expired Date    */
            $scope.newPasswordExpDate = function(myFormName) {
                if(myFormName=="addUserForm"){
                    var accActivationDate = $scope.addUserForm.accActivationDate;
                    if(accActivationDate < today){
                        $scope.addUserForm.accActivationDate = new Date();
                    }
                    var new_exp_date =  moment(accActivationDate).add(365,'days').format('MM-DD-YYYY');
                    $scope.addUserForm.passwordExpDate = new Date(new_exp_date);

                }else if(myFormName=="updateUserForm"){
                    var accActivationDate = $scope.updateUserForm.accActivationDate;
                    var new_exp_date =  moment(accActivationDate).add(365,'days').format('MM-DD-YYYY');
                    $scope.updateUserForm.passwordExpDate = new Date(new_exp_date);
                }
            };
            /*    Upload Photo    */
            $scope.files = "";
            $scope.$on("fileProgress", function(e, progress) {
                $scope.progress = progress.loaded / progress.total;
            });


            /*********************************************
             *          ANGULAR-JS DATATABLE LIST                      *
             *********************************************/
            vm.dtInstance = {};
            vm.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                url: '/api/users/',
                type: 'GET'
            }).withOption('createdRow', function(row, data, dataIndex) {
                    $compile(angular.element(row).contents())($scope);
                })
                .withOption('headerCallback', function(header) {
                    if (!vm.headerCompiled) {
                        // Use this headerCompiled field to only compile header once
                        vm.headerCompiled = true;
                        $compile(angular.element(header).contents())($scope);
                    }
                })
                .withOption('aLengthMenu', [10, 20, 50, 100,500])
                .withDisplayLength(10)
                .withPaginationType('full_numbers')
                .withDOM("<'dt-toolbar'<'col-xs-6 col-sm-6'f><'col-sm-6 col-xs-6 hidden-xs'l>r>" +
                    "t" +
                    "<'dt-toolbar-footer'<'col-sm-6 col-xs-6 hidden-xs'i><'col-xs-6 col-sm-6'p>>")
                .withColReorder()
                .withColReorderOption('iFixedColumnsLeft', 1)
                .withColReorderOption('iFixedColumnsRight', 1) // Fix last right column
                .withOption('responsive', true) // Adding 'Plus' button
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
                    return '<img style="width:40px;height:40px;" src='+APP_CONFIG.uploadUrl + data +'.png' + ' />';
                }),
                DTColumnBuilder.newColumn('authorities'),
                DTColumnBuilder.newColumn(null).withTitle('Account Status').notSortable().renderWith(function(data, type, full, meta){
                    var status = data.activated;
                    if(status == true){
                        return '<span class=\'label label-success\' ng-click="activateUserAccountById({login:' + data.id + ', status:' + data.activated +'})">ACTIVE</span>';
                    }else{
                        return '<span class=\'label label-warning\' ng-click="activateUserAccountById({login:' + data.id + ', status:' + data.activated +'})">DEACTIVATE</span>';
                    }
                }),
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
                return '<button class="btn btn-info bg-color-purple btn-xs" data-tooltip-placement="bottom" data-uib-tooltip="Update" ' +
                    'ng-click="loadUpdateFormById({login:' + data.id + '})"> <i class="fa fa-edit"></i></button>&nbsp;' +
                    /*'<button class="btn btn-info btn-xs" ui-sref="user-management-detail({login:' + data.id + '})">' +
                    '   <i class="fa fa-eye"></i>' +
                    '</button>&nbsp;' +*/
                    '<button class="btn btn-danger btn-xs" data-tooltip-placement="bottom" data-uib-tooltip="Delete" ' +
                    'ui-sref="user-management.delete({login:' + data.id + '})"> <i class="fa fa-trash-o"></i></button>&nbsp;' +

                    '<button class="btn btn-danger bg-color-orange btn-xs" data-tooltip-placement="bottom" data-uib-tooltip="Change Password" ' +
                    'ng-click="loadChangePasswordForm({login:' + data.id + '})"> <i class="fa fa-key"></i></button>';
            }


            /*********************************************
             *        CREATE NEW USER                    *
             *********************************************/
            $scope.saveUser = function () {
                //console.log("create user--> "+JSON.stringify($scope.addUserForm));
                var data = new FormData();
                data.append("login", $scope.addUserForm.loginId);
                data.append("firstName", $scope.addUserForm.firstName);
                data.append("middleName", $scope.addUserForm.middleName);
                data.append("lastName", $scope.addUserForm.lastName);
                data.append("nationalId", $scope.addUserForm.nationalId);
                data.append("emailAddress", $scope.addUserForm.emailAddress);
                data.append("password", $scope.addUserForm.userPassword);
                data.append("phone", $scope.addUserForm.phone);
                data.append("activated", $scope.addUserForm.activated);
                data.append("passwordExpDate", $scope.addUserForm.passwordExpDate);
                data.append("maxLogin", $scope.addUserForm.maxLogin);
                data.append("maxFailAttemptsAllow", $scope.addUserForm.maxFailAttemptsAllow);
                data.append("accActivationDate", $scope.addUserForm.accActivationDate);
                data.append("langKey", $scope.addUserForm.langKey);
                data.append("authorities", $scope.addUserForm.authority);
                data.append("comments", $scope.addUserForm.adminComment);
                data.append("files",  $scope.files[0]);

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

            /***********************************************
             *     USER ACCOUNT ACTIVATE / DEACTIVATE      *
             ***********************************************/
            $scope.activateUserAccountById = function(id){
                var statusUpdateURL = "";
                if(id.status==true){
                    // if user account is activated... then lock it
                    statusUpdateURL = APP_CONFIG.serverUrl+"/api/users/userAccountLockById/";
                }else{
                    // if user account is lock... then activate it
                    statusUpdateURL = APP_CONFIG.serverUrl+"/api/users/userAccountActivationById/";
                }
                $http.put(statusUpdateURL + id.login, config).then(
                    function(response) {
                        onSaveSuccess(response);
                        $state.go('user-management', null, { reload: true });
                    },
                    function(errResponse) {
                        onSaveError(errResponse);
                    });

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
                if ( $('#updateUserForm').data('bootstrapValidator').isValid() ){
                    BootstrapDialog.update('', function(result){
                        if(result) {
                            User.update($scope.updateUserForm, onUpdateSuccess, onSaveError);
                        }
                    });
                }
            };


            /*********************************************
             *         LOAD CHANGE PASSWORD FORM         *
             *********************************************/
            $scope.loadChangePasswordForm = function (id) {
                this.ChangePasswordForm();
                var loginId = id.login;
                User.get({login: loginId}, function(result) {
                    $scope.user = result;
                    $scope.changePwdForm = result;
                    $scope.changePwdUserName = result.firstName +' '+ result.lastName;
                });
            };


            /*********************************************
             *         BACK BUTTON                       *
             *********************************************/
            $scope.back = function () {
                $state.go('user-management', null, { reload: true });
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
