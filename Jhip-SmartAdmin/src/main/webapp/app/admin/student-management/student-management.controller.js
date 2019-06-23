'use strict';

angular.module('SmartAdminWebapp')
    .controller('StudentManagementController',
    function ($scope, $state, $http, Principal, Student, ParseLinks, Language, $compile, APP_CONFIG,
              $filter, fileReader, DTOptionsBuilder, DTColumnBuilder) {
        var vm = this;
        vm.entity = {};
        var today = new Date();
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
            Student.query({page: $scope.page - 1, size: 20}, function (result, headers) {
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
        $scope.studentFormClear = function () {
            console.log("student clear reset");
            $scope.isSaving = false;
            $scope.updateStudentForm = {};

            $('#updateStudentForm').data('bootstrapValidator').resetForm();
            var validator = $('#updateStudentForm').validate();
            validator.resetForm();

        };

        vm.manageStudentHeaderText = "student-management.title";
        vm.createHeaderText = "student-management.addForm";
        vm.updateHeaderText = "student-management.updateForm";
        vm.deleteHeaderText = "student-management.deleteForm";
        vm.detailHeaderText = "student-management.detail";
        $scope.headerText = vm.manageStudentHeaderText;
        $scope.showListOfStudentForm= true;

        /*  Show List of Student Form    */
        $scope.ListOfStudentAccountForm = function(){
            $state.go('student-management', null, { reload: true });

            $scope.headerText = vm.manageStudentHeaderText;
            $scope.showAddStudentForm = false;
            $scope.showUpdateStudentForm = false;
            $scope.showStudentDetailForm = false;
            $scope.showListOfStudentForm = true;
        };
        /*  Show Create New Student Form    */
        $scope.AddStudentForm = function(){
            $scope.headerText = vm.createHeaderText;
            $scope.showListOfStudentForm= false;
            $scope.showUpdateStudentForm = false;
            $scope.showStudentDetailForm = false;
            $scope.showAddStudentForm = true;
            $scope.addStudentForm = {};
            $scope.addStudentForm.activated = false;
            $scope.addStudentForm.maxLogin = 0;
            $scope.addStudentForm.maxFailAttemptsAllow = 0;
            $scope.addStudentForm.langKey = 'en';
            $scope.addStudentForm.accActivationDate = new Date();
            $scope.addStudentForm.passwordExpDate = new Date(new Date().setDate(today.getDate() + 365));
            //$('#addStudentForm').data('bootstrapValidator').resetForm();
        };
        /*  Show Update Student Form    */
        $scope.UpdateStudentForm = function(){
            $scope.headerText = vm.updateHeaderText;
            $scope.showAddStudentForm = false;
            $scope.showListOfStudentForm = false;
            $scope.showStudentDetailForm = false;
            $scope.showUpdateStudentForm = true;
            $scope.updateStudentForm = {};
            $scope.updateStudentForm.maxLogin = 0;
            $scope.updateStudentForm.maxFailAttemptsAllow = 0;
            //$('#updateStudentForm').data('bootstrapValidator').resetForm();
        };
        /*    Set Password Expired Date    */
        $scope.newPasswordExpDate = function(myFormName) {
            if(myFormName=="addStudentForm"){
                var accActivationDate = $scope.addStudentForm.accActivationDate;
                if(accActivationDate < today){
                    $scope.addStudentForm.accActivationDate = new Date();
                }
                var new_exp_date =  moment(accActivationDate).add(365,'days').format('MM-DD-YYYY');
                $scope.addStudentForm.passwordExpDate = new Date(new_exp_date);

            }else if(myFormName=="updateStudentForm"){
                var accActivationDate = $scope.updateStudentForm.accActivationDate;
                var new_exp_date =  moment(accActivationDate).add(365,'days').format('MM-DD-YYYY');
                $scope.updateStudentForm.passwordExpDate = new Date(new_exp_date);
            }
        };
        /*    Upload Photo    */
        $scope.files = "";
        $scope.$on("fileProgress", function(e, progress) {
            $scope.progress = progress.loaded / progress.total;
        });


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

        // Action buttons added to the last column: to edit and delete rows ui-sref="student-management.edit({login:user.login})"
        function actionButtons(data, type, full, meta) {
            vm.entity[data.id] = data;
            return '<button class="btn btn-info btn-xs" ng-click="loadUpdateFormById({login:' + data.id + '})">' +
                '   <i class="fa fa-edit"></i>' +
                '</button>&nbsp;' +
                /*'<button class="btn btn-info btn-xs" ui-sref="student-management-detail({login:' + data.id + '})">' +
                '   <i class="fa fa-eye"></i>' +
                '</button>&nbsp;' +*/
                '<button class="btn btn-danger btn-xs" ui-sref="student-management.delete({login:' + data.id + '})">' +
                '   <i class="fa fa-trash-o"></i>' +
                '</button>';
        }
        function createdRow(row, data, dataIndex) {
            $compile(angular.element(row).contents())($scope);
        }

        /*********************************************
         *        CREATE NEW STUDENT                  *
         *********************************************/
        $scope.saveStudent = function () {
            //console.log("create Student--> "+JSON.stringify($scope.addStudentForm));
            var data = new FormData();
            data.append("login", $scope.addStudentForm.loginId);
            data.append("firstName", $scope.addStudentForm.firstName);
            data.append("middleName", $scope.addStudentForm.middleName);
            data.append("lastName", $scope.addStudentForm.lastName);
            data.append("nationalId", $scope.addStudentForm.nationalId);
            data.append("emailAddress", $scope.addStudentForm.emailAddress);
            data.append("password", $scope.addStudentForm.studentPassword);
            data.append("phone", $scope.addStudentForm.phone);
            data.append("activated", $scope.addStudentForm.activated);
            data.append("passwordExpDate", $scope.addStudentForm.passwordExpDate);
            data.append("maxLogin", $scope.addStudentForm.maxLogin);
            data.append("maxFailAttemptsAllow", $scope.addStudentForm.maxFailAttemptsAllow);
            data.append("accActivationDate", $scope.addStudentForm.accActivationDate);
            data.append("langKey", $scope.addStudentForm.langKey);
            data.append("authorities", $scope.addStudentForm.authority);
            data.append("comments", $scope.addStudentForm.adminComment);
            data.append("files",  $scope.files[0]);

            var config = {
                transformRequest: angular.identity,
                transformResponse: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            };

            if ( $('#addStudentForm').data('bootstrapValidator').isValid() ) {
                BootstrapDialog.save('', function (result) {
                    if (result) {
                        //Student.save($scope.addStudentForm, onSaveSuccess, onSaveError);
                        $http.post(APP_CONFIG.serverUrl+"/api/Students", data, config).then(
                            function(response) {
                                console.log('Student created successfully');
                                onSaveSuccess(response);
                            },
                            function(errResponse) {
                                console.error('Error while creating Student');
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
            this.UpdateStudentForm();
            Student.get(loginId, function(result) {
                $scope.updateStudentForm = result;
            });
        };
        $scope.updateStudent = function () {
            console.log('---> '+ JSON.stringify($scope.updateStudentForm));
            var id = $scope.updateStudentForm.id;
            if (id != null) {
                BootstrapDialog.save('', function(result){
                    if(result) {
                        Student.update($scope.updateStudentForm, onUpdateSuccess, onSaveError);
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
