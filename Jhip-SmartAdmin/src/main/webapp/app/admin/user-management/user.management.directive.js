/**
 * Created by Zaman on 11/29/2018.
 */

"use strict";
angular.module('SmartAdminWebapp').directive('listOfUsersForm', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'app/admin/user-management/list-of-users-form.tpl.html',
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
                    }
                }  //.fields
            }).on('success.form.bv', function(e) {
                e.preventDefault();
            }).on('change', '[name="login"]', function(e) {
                form.data('bootstrapValidator').resetForm();
            });
        }
    }
});

"use strict";
angular.module('SmartAdminWebapp').directive('addUserForm', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'app/admin/user-management/add-user-form.tpl.html',
        link: function(scope, form, attributes){
            form.bootstrapValidator({
                feedbackIcons : {
                    valid: 'fa fa-check',
                    invalid: 'fa fa-times',
                    validating: 'fa fa-refresh'
                },
                fields : {
                    loginId : {
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
                    firstName : {
                        validators : {
                            notEmpty : {
                                message : 'This field is required'
                            }
                        }
                    },
                    userPassword : {
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
                    confirmPwd : {
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
                    },
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

                }  //.fields
            }).on('success.form.bv', function(e) {
                e.preventDefault();
            }).on('change', '[name="login"]', '[name="firstName"]', '[name="password"]', '[name="emailAddress"]',
                '[name="authority"]', function(e) {
                form.data('bootstrapValidator').resetForm();
            }).find('button[data-toggle]').on('click', function() {
                    var $target = $($(this).attr('data-toggle'));
                    // Show or hide the additional fields
                    // They will or will not be validated based on their visibilities
                    $target.toggle();
                    if (!$target.is(':visible')) {
                        // Enable the submit buttons in case additional fields are not valid
                        form.data('bootstrapValidator').disableSubmitButtons(false);
                    }
                });
        }
    }
});

"use strict";
angular.module('SmartAdminWebapp').directive('updateUserForm', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'app/admin/user-management/update-user-form.tpl.html',
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


"use strict";
angular.module('SmartAdminWebapp').directive('changePwdForm', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'app/admin/user-management/change-password-form.tpl.html',
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
                    userPassword : {
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
                    confirmPwd : {
                        validators : {
                            notEmpty : {
                                message : 'This field is required'
                            },
                            stringLength : {
                                min : 4,
                                message : 'Must be more than 4 characters'
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


