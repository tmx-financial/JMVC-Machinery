steal.resources("//jmvc_machinery/framework/characteristics/new_characteristic_based_model_definition.js").then(function() {
    var n = JmvcMachinery.Framework.ModelDefinition.ModelConcepts.ModelConceptProcessors;
    describe("When defining a model with several forcesCrossApplicantAttributesToBeRequiredWhen characteristics", function() {
        var charNs, index = 0;

        beforeEach(function() {
        });

        var truthTable = [
            { isCarReallyOld: null, applicantLastName: null, applicantMiddleName: null, shouldApplicantFirstNameBeRequired: false},
            { isCarReallyOld: true, applicantLastName: null, applicantMiddleName: null, shouldApplicantFirstNameBeRequired: true},
            { isCarReallyOld: false, applicantLastName: null, applicantMiddleName: null, shouldApplicantFirstNameBeRequired: false},
            { isCarReallyOld: null, applicantLastName: null, applicantMiddleName: "Steve", shouldApplicantFirstNameBeRequired: false},
            { isCarReallyOld: true, applicantLastName: null, applicantMiddleName: "Steve", shouldApplicantFirstNameBeRequired: true},
            { isCarReallyOld: false, applicantLastName: null, applicantMiddleName: "Steve", shouldApplicantFirstNameBeRequired: false},

            { isCarReallyOld: null, applicantLastName: "short", applicantMiddleName: null, shouldApplicantFirstNameBeRequired: false},
            { isCarReallyOld: true, applicantLastName: "short", applicantMiddleName: null, shouldApplicantFirstNameBeRequired: true},
            { isCarReallyOld: false, applicantLastName: "short", applicantMiddleName: null, shouldApplicantFirstNameBeRequired: true},
            { isCarReallyOld: null, applicantLastName: "short", applicantMiddleName: "Steve", shouldApplicantFirstNameBeRequired: false},
            { isCarReallyOld: true, applicantLastName: "short", applicantMiddleName: "Steve", shouldApplicantFirstNameBeRequired: true},
            { isCarReallyOld: false, applicantLastName: "short", applicantMiddleName: "Steve", shouldApplicantFirstNameBeRequired: true},

            { isCarReallyOld: null, applicantLastName: "sixteen chars   ", applicantMiddleName: null, shouldApplicantFirstNameBeRequired: false},
            { isCarReallyOld: true, applicantLastName: "sixteen chars   ", applicantMiddleName: null, shouldApplicantFirstNameBeRequired: true},
            { isCarReallyOld: false, applicantLastName: "sixteen chars   ", applicantMiddleName: null, shouldApplicantFirstNameBeRequired: true},
            { isCarReallyOld: null, applicantLastName: "sixteen chars   ", applicantMiddleName: "Steve", shouldApplicantFirstNameBeRequired: true},
            { isCarReallyOld: true, applicantLastName: "sixteen chars   ", applicantMiddleName: "Steve", shouldApplicantFirstNameBeRequired: true},
            { isCarReallyOld: false, applicantLastName: "sixteen chars   ", applicantMiddleName: "Steve", shouldApplicantFirstNameBeRequired: true},


            { isCarReallyOld: null, coapplicantLastName: null, coapplicantMiddleName: null, shouldCoapplicantFirstNameBeRequired: false},
            { isCarReallyOld: true, coapplicantLastName: null, coapplicantMiddleName: null, shouldCoapplicantFirstNameBeRequired: true},
            { isCarReallyOld: false, coapplicantLastName: null, coapplicantMiddleName: null, shouldCoapplicantFirstNameBeRequired: false},
            { isCarReallyOld: null, coapplicantLastName: null, coapplicantMiddleName: "Steve", shouldCoapplicantFirstNameBeRequired: false},
            { isCarReallyOld: true, coapplicantLastName: null, coapplicantMiddleName: "Steve", shouldCoapplicantFirstNameBeRequired: true},
            { isCarReallyOld: false, coapplicantLastName: null, coapplicantMiddleName: "Steve", shouldCoapplicantFirstNameBeRequired: false},

            { isCarReallyOld: null, coapplicantLastName: "short", coapplicantMiddleName: null, shouldCoapplicantFirstNameBeRequired: false},
            { isCarReallyOld: true, coapplicantLastName: "short", coapplicantMiddleName: null, shouldCoapplicantFirstNameBeRequired: true},
            { isCarReallyOld: false, coapplicantLastName: "short", coapplicantMiddleName: null, shouldCoapplicantFirstNameBeRequired: true},
            { isCarReallyOld: null, coapplicantLastName: "short", coapplicantMiddleName: "Steve", shouldCoapplicantFirstNameBeRequired: false},
            { isCarReallyOld: true, coapplicantLastName: "short", coapplicantMiddleName: "Steve", shouldCoapplicantFirstNameBeRequired: true},
            { isCarReallyOld: false, coapplicantLastName: "short", coapplicantMiddleName: "Steve", shouldCoapplicantFirstNameBeRequired: true},

            { isCarReallyOld: null, coapplicantLastName: "sixteen chars   ", coapplicantMiddleName: null, shouldCoapplicantFirstNameBeRequired: false},
            { isCarReallyOld: true, coapplicantLastName: "sixteen chars   ", coapplicantMiddleName: null, shouldCoapplicantFirstNameBeRequired: true},
            { isCarReallyOld: false, coapplicantLastName: "sixteen chars   ", coapplicantMiddleName: null, shouldCoapplicantFirstNameBeRequired: true},
            { isCarReallyOld: null, coapplicantLastName: "sixteen chars   ", coapplicantMiddleName: "Steve", shouldCoapplicantFirstNameBeRequired: true},
            { isCarReallyOld: true, coapplicantLastName: "sixteen chars   ", coapplicantMiddleName: "Steve", shouldCoapplicantFirstNameBeRequired: true},
            { isCarReallyOld: false, coapplicantLastName: "sixteen chars   ", coapplicantMiddleName: "Steve", shouldCoapplicantFirstNameBeRequired: true}
        ];

        describe("when you check it against the truth table", function() {
            _.each(truthTable, function(testCase, index) {
                charNs = {};
                var characteristicList = makeCharacteristicList();
                var model = makeModelFromCharacteristics();
                var text = jasmine.pp(testCase);
                it("should correctly handle case # " + index + ", as: " + text, function() {
                    applyTestCasePreconditions(model, testCase);
                    assertTestCaseExpectations(model, testCase);
                });
                delete window.forUnitTests;
            });
        });

        function makeModelFromCharacteristics() {
            var modelSpec = JmvcMachinery.Framework.Characteristics.newCharacteristicBasedModelDefinition();
            modelSpec.includePrimaryAttributes([
                    "applicantFirstName", "applicantMiddleName", "applicantLastName",
                    "coapplicantFirstName", "coapplicantMiddleName", "coapplicantLastName",
                    "isCarReallyOld"
                    ]);

            modelSpec.includeCharacteristics(charNs, 
                "conditionOne", {whichApplicant: "BothApplicants"}, 
                "conditionTwo", {whichApplicant: "BothApplicants"},
                "conditionThree", {whichApplicant: "BothApplicants"}
            );

            JmvcMachinery.Framework.ModelDefinition.defineModelClassFromCharacteristics("forUnitTests", modelSpec);
            var model = new forUnitTests();
            return model;
        }

        function applyTestCasePreconditions(model, testCase) {
            _.each(testCase, function(theValue, theAttrName) {
                if(theAttrName.indexOf("should") === -1) {
                    model.attr(theAttrName, theValue);
                }
            });
        }

        function assertTestCaseExpectations(model, testCase) {
            var expectationMap = {
                "shouldApplicantFirstNameBeRequired" : "applicantFirstName",
                "shouldCoapplicantFirstNameBeRequired" : "coapplicantFirstName"
            };

            _.each(expectationMap, function(attrName, shouldKeyName) {
                if(testCase.hasOwnProperty(shouldKeyName)) {
                    var expectedValue = testCase[shouldKeyName];
                    if(expectedValue) {
                        expect(model.getSchemaFor(attrName).required).toBe(true);
                    } else {
                        expect(model.getSchemaFor(attrName).required).toBeFalsy();
                    }
                }
            });
        }

        function makeCharacteristicList() {
            makeCharacteristic("conditionOne", {
                firstName: [{
                    dependsOnAttributes: ["isCarReallyOld"],
                    condition: function() {
                        return this.isCarReallyOld(); 
                    }
                }]
            });

            makeCharacteristic("conditionTwo", {
                firstName:[ {
                    dependsOnCrossApplicantAttributes: ["lastName", "middleName"],
                    condition: function() {
                        if(! this.lastName()) return false;
                        if(! this.middleName()) return false;

                        return (this.lastName().length + this.middleName().length) > 20; 
                    }
                }]
            });

            makeCharacteristic("conditionThree", {
                firstName:[ {
                    dependsOnAttributes: ["isCarReallyOld"],
                    dependsOnCrossApplicantAttributes: ["lastName"],
                    condition: function() {
                        if(this.isCarReallyOld() === null) return false;
                        return (!! this.lastName() && ! this.isCarReallyOld());
                    }
                }]
            });

            function makeCharacteristic(charName, charDef) {
                charDef = {
                    forcesCrossApplicantAttributesToBeRequiredWhen: charDef
                };
                var characteristic = JmvcMachinery.Framework.Characteristics.declareCrossApplicantCharacteristic(charNs, charName, charDef );
            }

        }
    });
});
