steal.resources("//jmvc_machinery/framework/characteristics/new_characteristic_based_model_definition.js").then(function() {
    var n = JmvcMachinery.Framework.ModelDefinition.ModelConcepts.ModelConceptProcessors;
    describe("When defining a model with several producesCrossApplicantAttributesWithPrivateSetters characteristics", function() {
        var charNs;

        var expectedAttrs = [
            "applicantFirstName", "applicantLastName", "applicantMiddleName",
            "coapplicantFirstName", "coapplicantLastName", "coapplicantMiddleName"
        ];

        describe("Every value should be initialized to null", function() {
            var model = makeModelFromCharacteristics();

            _.each(expectedAttrs, function(attr) {
                it("should have initialized " + attr + " to null", function() {
                    expect(model.attr(attr)).toBeNull();
                });
            });
        });

        describe("It should have all of the expected private setters", function() {
            var model = makeModelFromCharacteristics();

            _.each(expectedAttrs, function(attr) {
                var setterName = "set" + $.String.capitalize(attr);
                it("should have have a private setter called " + setterName, function() {
                    expect(model._privateInstanceMembers()[setterName]).toBeDefined();
                });
            });
        });

        describe("Every value should be settable privately", function() {
            var model = makeModelFromCharacteristics();

            _.each(expectedAttrs, function(attr) {
                var setterName = "set" + $.String.capitalize(attr);
                it("The setter for " + attr + " should work", function() {
                    expect(model.attr(attr)).toBeNull();
                    model._privateInstanceMembers()[setterName]("hi there");
                    expect(model.attr(attr)).toEqual("hi there");
                });
            });
        });

        describe("Attempting to set them externally should throw", function() {
            var model = makeModelFromCharacteristics();

            _.each(expectedAttrs, function(attr) {
                it("should throw if you try to set " + attr + " externally", function() {
                    var setterName = "set" + $.String.capitalize(attr);
                    expect(function() {
                        model.attr(attr, "Some string");
                    }).toThrow("You cannot set the attribute '" + attr + "' directly. It is an Attribute with a private setter. Only code inside the model instance can set it, using 'this._privateInstanceMembers()." + setterName + "()'.");
                });
            });
        });

        describe("Every such attribute should appear in the static 'attributesWithPrivateSetters' list", function() {
            var model = makeModelFromCharacteristics();

            _.each(expectedAttrs, function(attr) {
                it("should have put " + attr + " into attributesWithPrivateSetters", function() {
                    expect(model.Class.attributesWithPrivateSetters).toContain(attr);
                });
            });
        });

        describe("Every attribute schema should exist", function() {
            var model = makeModelFromCharacteristics();

            _.each(expectedAttrs, function(attr) {
                it("should have added the attribute schema for " + attr + " to the model schema", function() {
                    expect(model.Class.schema.properties.hasOwnProperty(attr)).toBe(true);
                });
            });
        });

        describe("Every schema should be readonly", function() {
            var model = makeModelFromCharacteristics();

            _.each(expectedAttrs, function(attr) {
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

            modelSpec.includeCharacteristics(charNs,
                "One", {whichApplicant: "BothApplicants"},
                "Two", {whichApplicant: "BothApplicants"},
                "Three", {whichApplicant: "BothApplicants"}
            );

            JmvcMachinery.Framework.ModelDefinition.defineModelClassFromCharacteristics("forUnitTests", modelSpec);
            var model = new forUnitTests();
            return model;
        }

        function makeCharacteristicList() {
            makeCharacteristic("One", {
                firstName: {
                    schema: {
                        type: "string",
                        maxLength: 30
                    }
                }
            });

            makeCharacteristic("Two", {
                middleName: { }
            });

            makeCharacteristic("Three", {
                lastName: { }
            });

            function makeCharacteristic(charName, charDef) {
                charDef = {
                    producesCrossApplicantAttributesWithPrivateSetters: charDef
                };
                var characteristic = JmvcMachinery.Framework.Characteristics.declareCrossApplicantCharacteristic(charNs, charName, charDef );
            }

        }
    });
});
