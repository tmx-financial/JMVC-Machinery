steal.resources("//jmvc_machinery/framework/characteristics/new_characteristic_based_model_definition.js").then(function() {
    var n = JmvcMachinery.Framework.ModelDefinition.ModelConcepts.ModelConceptProcessors;
    describe("When defining a model with several producesCrossApplicantAttributesWithSpecializedGettersAndSetters characteristics", function() {
        var charNs;
        var attributeList = ["applicantFirstName", "coapplicantFirstName"];

        describe("The entire functionality should work", function() {
            it("should make the entire functionality work", function() {
                var model = makeModelFromCharacteristics();

                model.attr("isCarReallyOld", false);
                model.attr("applicantLastName", "Washington");
                model.attr("coapplicantLastName", "Lincoln");

                model.attr("applicantFirstName", "George");
                model.attr("coapplicantFirstName", "Abraham");

                expect(model.attr("applicantFirstName")).toBe("George");
                expect(model.attr("coapplicantFirstName")).toBe("Abraham");

                model.attr("isCarReallyOld", true);

                expect(model.attr("applicantFirstName")).toBe("Washington (car is really old)");
                expect(model.attr("coapplicantFirstName")).toBe("Lincoln (car is really old)");

                model.attr("applicantFirstName", "Used to be George");
                model.attr("coapplicantFirstName", "Used to be Abraham");

                expect(model.attr("applicantFirstName")).toBe("Washington (car is really old)");
                expect(model.attr("coapplicantFirstName")).toBe("Lincoln (car is really old)");

                model.attr("isCarReallyOld", false);

                expect(model.attr("applicantFirstName")).toBe("Used to be George");
                expect(model.attr("coapplicantFirstName")).toBe("Used to be Abraham");
            });
        });

        describe("It should fire events when any triggering attr changes and when you change the attribute itself", function() {
            it("should have fired the event 3 times", function() {
                var model = makeModelFromCharacteristics();
                var eventFireCount = 0;

                model.bind("applicantFirstName", function() {
                    eventFireCount = eventFireCount + 1;
                });

                model.attr("applicantLastName", "Jones");
                model.attr("isCarReallyOld", ! (!!model.attr("isCarReallyOld")));

                model.attr("applicantFirstName", "Bob");

                expect(eventFireCount).toBe(3);
            });
        });

        describe("Every attribute schema should exist", function() {
            var model = makeModelFromCharacteristics();

            _.each(attributeList, function(attr) {
                it("should have added the attribute schema for " + attr + " to the model schema", function() {
                    expect(model.Class.schema.properties.hasOwnProperty(attr)).toBe(true);
                });
            });
        });

        function makeModelFromCharacteristics() {
            charNs = {};
            makeCharacteristicList();
            var modelSpec = JmvcMachinery.Framework.Characteristics.newCharacteristicBasedModelDefinition();

            modelSpec.includePrimaryAttributes("isCarReallyOld",  "applicantLastName",  "coapplicantLastName");

            modelSpec.includeCharacteristics(charNs,
                "One", {whichApplicant: "BothApplicants"}
            );

            JmvcMachinery.Framework.ModelDefinition.defineModelClassFromCharacteristics("forUnitTests", modelSpec);
            var model = new forUnitTests();

            return model;
        }

        function makeCharacteristicList() {
            var storageForValuesSetNormally = {};

            makeCharacteristic("One", {
                firstName: {
                    dependsOnAttributes: ["isCarReallyOld"],
                    dependsOnCrossApplicantAttributes: ["lastName"],
                    getter: function() {
                        if(this.isCarReallyOld()) {
                            return this.lastName() + " (car is really old)";
                        } else {
                            return storageForValuesSetNormally[this.nameOfAttribute()];
                        }
                    },
                    setter: function(newValue) {
                        storageForValuesSetNormally[this.nameOfAttribute()] = newValue;
                        return this.getter();
                    }
                }
            });

            function makeCharacteristic(charName, charDef) {
                charDef = {
                    producesCrossApplicantAttributesWithSpecializedGettersAndSetters: charDef
                };
                var characteristic = JmvcMachinery.Framework.Characteristics.declareCrossApplicantCharacteristic(charNs, charName, charDef );
            }
        }
    });
});
