/**
 * Created by Zaman on 11/29/2018.
 */

"use strict";
angular.module('SmartAdminWebapp').directive('listOfStudentsForm', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'app/admin/student-management/list-of-students-form.tpl.html',
        link: function(scope, form){
            form.bootstrapValidator({
                feedbackIcons : {
                    valid: 'fa fa-check',
                    invalid: 'fa fa-times',
                    validating: 'fa fa-refresh'
                }
            }).on('success.form.bv', function(e) {
                e.preventDefault();
            });
        }
    }
});

"use strict";
angular.module('SmartAdminWebapp').directive('addStudentForm', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'app/admin/student-management/add-student-form.tpl.html',
        link: function(scope, form){
            form.bootstrapValidator({
                feedbackIcons : {
                    valid: 'fa fa-check',
                    invalid: 'fa fa-times',
                    validating: 'fa fa-refresh'
                },
                fields : {
                    amount : {
                        validators : {
                            notEmpty : {
                                message : 'This field is required'
                            }
                        }
                    },
                    price : {
                        validators : {
                            notEmpty : {
                                message : 'This field is required'
                            }
                        }
                    }
                }//.fields
            }).on('success.form.bv', function(e) {
                e.preventDefault();
            });
        }
    }
});

"use strict";
angular.module('SmartAdminWebapp').directive('updateStudentForm', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'app/admin/student-management/update-student-form.tpl.html',
        link: function(scope, form){
            form.bootstrapValidator({
                feedbackIcons : {
                    valid: 'fa fa-check',
                    invalid: 'fa fa-times',
                    validating: 'fa fa-refresh'
                },
                fields : {
                    text: {
                        // All the fields has 'isSearchSelector' class
                        selector: '.isSearchSelector',
                        validators: {
                            callback: {
                                message: 'You must enter at least one value',
                                callback: function(value, validator, $field) {
                                    var isEmpty = true,
                                    // Get the list of fields
                                        $fields = validator.getFieldElements('text');
                                    for (var i = 0; i < $fields.length; i++) {
                                        if ($fields.eq(i).val() !== '') {
                                            isEmpty = false;
                                            break;
                                        }
                                    }
                                    if (!isEmpty) {
                                        // Update the status of callback validator for all fields
                                        validator.updateStatus('text', validator.STATUS_VALID, 'callback');
                                        return true;
                                    }
                                    return false;
                                }
                            },
                            isSearchSelector: {
                                message: 'The value is not valid'
                            }
                        }
                    },
                    login : {
                        validators : {
                            notEmpty : {
                                message : 'This field is required'
                            }
                        }
                    },
                    firstName : {
                        validators : {
                            notEmpty : {
                                message : 'This field is required'
                            }
                        }
                    },
                    password : {
                        validators : {
                            notEmpty : {
                                message : 'This field is required'
                            },
                            stringLength : {
                                min : 4,
                                message : 'Must be more than 4 characters'
                            }
                        }
                    },
                    repassword : {
                        validators : {
                            notEmpty : {
                                message : 'This field is required'
                            },
                            stringLength : {
                                min : 4,
                                message : 'Must be more than 4 characters'
                            }
                        }
                    },
                    emailAddress : {
                        validators : {
                            notEmpty : {
                                message : 'This field is required'
                            },
                            regexp: {
                                regexp: '^[^@\\s]+@([^@\\s]+\\.)+[^@\\s]+$',
                                message: 'Please enter a valid Email Address'
                            }
                        }
                    },
                    authority : {
                        validators : {
                            notEmpty : {
                                message : 'This field is required'
                            }
                        }
                    }
                }  //.fields
            }).on('success.form.bv', function(e) {
                e.preventDefault();
            });/*.on('change', function(e) {
                form.data('bootstrapValidator').resetForm();
            });*/
        }
    }
});
