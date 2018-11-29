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

