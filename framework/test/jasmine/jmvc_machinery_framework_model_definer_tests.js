/* -*- Mode: javascript; tab-width: 4; indent-tabs-mode: nil; */

//--------MODULE HEADER----------
(function(GLOBAL) {
"use strict";
//===============================

describe("The model definition machinery", function() {
    describe("the setup / file-loading stuff", function() {
        it("should make the defineModelClass function available", function() {
            expect(JmvcMachinery.Framework.ModelDefinition.defineModelClass).toBeDefined();
            expect(_.isFunction(JmvcMachinery.Framework.ModelDefinition.defineModelClass)).toBe(true);
        });
    });

    describe("When defining a model that contains primary attributes and readonly attributes", function() {
        var modelSpec;

        beforeEach(function() {
            modelSpec = {
                primaryAttributes: {
                    cellPhone: {
                        schema: {
                            title: "Cell Phone",
                            type: "string"
                        }
                    },
                    canWeSendYouTextMessages: {
                        schema: {
                            title: "Can we send you text messages?",
                            type: "boolean"
                        }
                    },
                    doesCustomerForbidAllMarketingContact: {
                        schema: {
                            title: "Has the customer forbidden all marketing contact?",
                            type: "boolean"
                        }
                    },
                    isTheCustomerInActiveBankruptcy: {
                        schema: {
                            title: "Is the Customer in Active Bankruptcy?",
                            type: "boolean"
                        }
                    }
                },
                forcesAttributesToBeReadonlyWhen: {
                    canWeSendYouTextMessages: [
                        {
                            dependsOnAttributes: ["cellPhone"],
                            condition: function() {
                                return (this.cellPhone() === null);
                            }
                        },
                        {
                            dependsOnAttributes: ["doesCustomerForbidAllMarketingContact"],
                            condition: function() {
                                return this.doesCustomerForbidAllMarketingContact();
                            }
                        },
                        {
                            dependsOnAttributes: ["isTheCustomerInActiveBankruptcy"],
                            condition: function() {
                                return this.isTheCustomerInActiveBankruptcy();
                            }
                        }
                    ]
                }
            };
        });

        describe("should fulfill all expectations regarding readonly", function() {

            var modelInstance;

            beforeEach(function() {
                if(GLOBAL.testModel) delete GLOBAL[testModel];
                JmvcMachinery.Framework.ModelDefinition.defineModelClass("testModel", modelSpec);
                modelInstance = new testModel();
            });

            var truthTable = [
                { cellPhone: null, doesCustomerForbidAllMarketingContact: true, isTheCustomerInActiveBankruptcy: true, shouldBeReadonly: true },
                { cellPhone: null, doesCustomerForbidAllMarketingContact: true, isTheCustomerInActiveBankruptcy: false, shouldBeReadonly: true },
                { cellPhone: null, doesCustomerForbidAllMarketingContact: false, isTheCustomerInActiveBankruptcy: true, shouldBeReadonly: true },
                { cellPhone: null, doesCustomerForbidAllMarketingContact: false, isTheCustomerInActiveBankruptcy: false, shouldBeReadonly: true },
                { cellPhone: "7705554444", doesCustomerForbidAllMarketingContact: true, isTheCustomerInActiveBankruptcy: true, shouldBeReadonly: true },
                { cellPhone: "7705554444", doesCustomerForbidAllMarketingContact: true, isTheCustomerInActiveBankruptcy: false, shouldBeReadonly: true },
                { cellPhone: "7705554444", doesCustomerForbidAllMarketingContact: false, isTheCustomerInActiveBankruptcy: true, shouldBeReadonly: true },
                { cellPhone: "7705554444", doesCustomerForbidAllMarketingContact: false, isTheCustomerInActiveBankruptcy: false, shouldBeReadonly: false }
            ];

            _.each(truthTable, function(row) {
                it("should make readonly be *" + row.shouldBeReadonly + "* when: [cellphone: " + row.cellPhone+ "] and [doesCustomerForbidAllMarketingContact: " + row.doesCustomerForbidAllMarketingContact + "] and [isTheCustomerInActiveBankruptcy: " + row.isTheCustomerInActiveBankruptcy + "]", function() {
                    _.each(row, function(attrValue, attrName) {
                        if(attrName != "shouldBeReadonly") {
                            modelInstance.attr(attrName, attrValue);
                        }
                    });

                    jasmine.log(modelInstance.attrs());

                    if(row.shouldBeReadonly) {
                        expect(modelInstance.getSchemaFor("canWeSendYouTextMessages").readOnly).toBe(true);
                    } else {
                        expect(modelInstance.getSchemaFor("canWeSendYouTextMessages").readOnly).toBeFalsy();
                    }
                });
            });

            
        });
    });
});


//===============================
} (function() {
    return this;
}()));
//===============================
