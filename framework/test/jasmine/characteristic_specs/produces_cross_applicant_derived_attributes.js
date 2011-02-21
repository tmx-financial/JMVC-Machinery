steal.resources("//jmvc_machinery/framework/characteristics/new_characteristic_based_model_definition.js").then(function() {
    var n = JmvcMachinery.Framework.ModelDefinition.ModelConcepts.ModelConceptProcessors;
    describe("When defining a model with several producesCrossApplicantDerivedAttributes characteristics", function() {
        var charNs;

        var expectedAttrs = [
            {applicantFullNameWithSpaces: "Fred Flintstone (car is old)"}, 
            {applicantFullNameWithCommas: "Flintstone, Fred (car is old)"},
            {coapplicantFullNameWithSpaces: "Wilma Flintstone (car is old)"},
            {coapplicantFullNameWithCommas: "Flintstone, Wilma (car is old)"}
        ];

        describe("Getters should work", function() {
            var model = makeModelFromCharacteristics();

            _.each(expectedAttrs, function(testCase) {
                var attrName = _.keys(testCase)[0];
                var expectedValue = testCase[attrName];
                it("should compute " + attrName + " correctly", function() {
                    expect(model.attr(attrName)).toEqual(expectedValue);
                });
            });
        });

        describe("It should fire events when any triggering attr changes", function() {
            it("should have fired the event 3 times", function() {
                var model = makeModelFromCharacteristics();
                var eventFireCount = 0;

                model.bind("applicantFullNameWithSpaces", function() {
                    eventFireCount = eventFireCount + 1;
                });

                model.attr("applicantFirstName", "Bob");
                model.attr("applicantLastName", "Jones");
                model.attr("isCarReallyOld", ! (model.attr("isCarReallyOld")));

                expect(eventFireCount).toBe(3);
            });
        });

        describe("Setters should blow up", function() {
            var model = makeModelFromCharacteristics();

            _.each(expectedAttrs, function(testCase) {
                var attr = _.keys(testCase)[0];
                var expectedValue = testCase[attr];
                it("should throw if you try to set " + attr, function() {
                    expect(function() {
                        model.attr(attr, "Some string");
                    }).toThrow("The '" + attr + "' attribute is a derived attribute and cannot be set.");
                });
            });
        });

        describe("Every such attribute should appear in the static 'derivedAttributes' list", function() {
            var model = makeModelFromCharacteristics();

            _.each(expectedAttrs, function(testCase) {
                var attr= _.keys(testCase)[0];
                var expectedValue = testCase[attr];
                it("should have put " + attr + " into derivedAttributes", function() {
                    expect(model.Class.derivedAttributes).toContain(attr);
                });
            });
        });

        describe("Every attribute schema should exist", function() {
            var model = makeModelFromCharacteristics();

            _.each(expectedAttrs, function(testCase) {
                var attr= _.keys(testCase)[0];
                var expectedValue = testCase[attr];
                it("should have added the attribute schema for " + attr + " to the model schema", function() {
                    expect(model.Class.schema.properties.hasOwnProperty(attr)).toBe(true);
                });
            });
        });

        describe("Every schema should be readonly", function() {
            var model = makeModelFromCharacteristics();

            _.each(expectedAttrs, function(testCase) {
                var attr= _.keys(testCase)[0];
                var expectedValue = testCase[attr];
                it("should have ensured that the schema for " + attr + " is readOnly", function() {
                    expect(model.Class.schema.properties[attr].readOnly).toBeDefined();
                    expect(model.Class.schema.properties[attr].readOnly).toBe(true);
                });
            });
        });

        function makeModelFromCharacteristics() {
            charNs = {};
            makeCharacteristicList();
            var modelSpec = JmvcMachinery.Framework.Characteristics.newCharacteristicBasedModelDefinition();

            modelSpec.includePrimaryAttributes("isCarReallyOld", "applicantFirstName", "applicantLastName", "coapplicantFirstName", "coapplicantLastName");

            modelSpec.includeCharacteristics(charNs,
                "One", {whichApplicant: "BothApplicants"},
                "Two", {whichApplicant: "BothApplicants"}
            );

            JmvcMachinery.Framework.ModelDefinition.defineModelClassFromCharacteristics("forUnitTests", modelSpec);
            var model = new forUnitTests();

            model.attr("applicantFirstName", "Fred");
            model.attr("applicantLastName", "Flintstone");

            model.attr("coapplicantFirstName", "Wilma");
            model.attr("coapplicantLastName", "Flintstone");

            model.attr("isCarReallyOld", true);

            return model;
        }

        function makeCharacteristicList() {
            makeCharacteristic("One", {
                fullNameWithSpaces: {
                    dependsOnAttributes: ["isCarReallyOld"],
                    dependsOnCrossApplicantAttributes: ["firstName", "lastName"],
                    getter: function() {
                        return this.firstName() + " " + this.lastName() + " " + "(car is" + (this.isCarReallyOld() ? "" : " not") + " old)";
                    }
                }
            });

            makeCharacteristic("Two", {
                fullNameWithCommas: {
                    dependsOnAttributes: ["isCarReallyOld"],
                    dependsOnCrossApplicantAttributes: ["firstName", "lastName"],
                    getter: function() {
                        return this.lastName() + ", " + this.firstName() + " " + "(car is" + (this.isCarReallyOld() ? "" : " not") + " old)";
                    }
                }
            });

            function makeCharacteristic(charName, charDef) {
                charDef = {
                    producesCrossApplicantDerivedAttributes: charDef
                };
                var characteristic = JmvcMachinery.Framework.Characteristics.declareCrossApplicantCharacteristic(charNs, charName, charDef );
            }
        }
    });
});
