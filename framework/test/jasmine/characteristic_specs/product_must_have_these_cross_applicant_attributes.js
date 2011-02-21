steal.resources("//jmvc_machinery/framework/characteristics/new_characteristic_based_model_definition.js").then(function() {
    var n = JmvcMachinery.Framework.ModelDefinition.ModelConcepts.ModelConceptProcessors;
    describe("When defining a model with several productMustHaveTheseCrossApplicantAttributes characteristics", function() {
        var charNs;

        describe("When the specified attributes *do* exist in the model", function() {
            it("should successfully make the model", function() {
                var model = makeModelWithThesePrimaryAttributes(["applicantFirstName", "applicantLastName", "coapplicantFirstName", "coapplicantLastName"]);
                expect(model).toBeDefined();
                jasmine.log("The model is just fine! Here: ", model.attrs());
            });
        });

        describe("When some of the specified attributes are missing", function() {
            it("should throw the correct error", function() {
                var lines = [];
                lines.push("The following errors occurred in the model definition:");
                lines.push("1) An attribute named 'applicantFirstName' is required to be present by: The Characteristic named 'One'");
                lines.push("2) An attribute named 'applicantLastName' is required to be present by: The Characteristic named 'One'");
                lines.push("3) An attribute named 'coapplicantFirstName' is required to be present by: The Characteristic named 'One'");
                lines.push("4) An attribute named 'coapplicantLastName' is required to be present by: The Characteristic named 'One'");

                var expectedMessage = lines.join("\r\n");

                expect(function() {
                    var model = makeModelWithThesePrimaryAttributes();
                }).toThrow(expectedMessage);
            });
        });

        function makeModelWithThesePrimaryAttributes(primaryAttributeList) {
            if(! primaryAttributeList) primaryAttributeList = [];

            charNs = {};
            makeCharacteristicList();
            var modelSpec = JmvcMachinery.Framework.Characteristics.newCharacteristicBasedModelDefinition();

            modelSpec.includePrimaryAttributes(primaryAttributeList);

            modelSpec.includeCharacteristics(charNs,
                "One", {whichApplicant: "BothApplicants"}
            );

            JmvcMachinery.Framework.ModelDefinition.defineModelClassFromCharacteristics("forUnitTests", modelSpec);
            var model = new forUnitTests();

            model.attr("applicantFirstName", "Fred");
            model.attr("applicantLastName", "Flintstone");

            model.attr("coapplicantFirstName", "Wilma");
            model.attr("coapplicantLastName", "Flintstone");

            return model;
        }

        function makeCharacteristicList() {
            makeCharacteristic("One", ["firstName", "lastName"]);

            function makeCharacteristic(charName, charDef) {
                charDef = {
                    productMustHaveTheseCrossApplicantAttributes: charDef
                };
                var characteristic = JmvcMachinery.Framework.Characteristics.declareCrossApplicantCharacteristic(charNs, charName, charDef );
            }
        }
    });
});
