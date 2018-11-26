'use strict';

describe('Controller Tests', function() {

    describe('BankAccount Detail Controller', function() {
        var $scope, $rootScope;
        var MockEntity, MockBankAccount, MockOperation, MockUser;
        var createController;

        beforeEach(inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            MockEntity = jasmine.createSpy('MockEntity');
            MockBankAccount = jasmine.createSpy('MockBankAccount');
            MockOperation = jasmine.createSpy('MockOperation');
            MockUser = jasmine.createSpy('MockUser');


            var locals = {
                '$scope': $scope,
                '$rootScope': $rootScope,
                'entity': MockEntity ,
                'BankAccount': MockBankAccount,
                'Operation': MockOperation,
                'User': MockUser
            };
            createController = function() {
                $injector.get('$controller')("BankAccountDetailController", locals);
            };
        }));


        describe('Root Scope Listening', function() {
            it('Unregisters root scope listener upon scope destruction', function() {
                var eventType = 'SmartAdminWebapp:bankAccountUpdate';

                createController();
                expect($rootScope.$$listenerCount[eventType]).toEqual(1);

                $scope.$destroy();
                expect($rootScope.$$listenerCount[eventType]).toBeUndefined();
            });
        });
    });

});
