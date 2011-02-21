steal.resources("//jmvc_machinery/framework/characteristics/new_characteristic_based_model_definition.js").then(function() {
    var n = JmvcMachinery.Framework.ModelDefinition.ModelConcepts.ModelConceptProcessors;
    describe("When defining a model with several runsCrossApplicantBlockAtModelInstanceInit characteristics", function() {
        var charNs;

        beforeEach(function() {
            JmvcMachinery.Framework.Characteristics.setAttributeUniverse(JmvcMachinery.Framework.FakeAttributeUniverse);
        });

        it("should run the block for each applicant, with the right params each time, at model instance init", function() {
            var model = makeModelWithThesePrimaryAttributes(["teamSlogan", "mascotName"]);

            expect(model).toBeDefined();
            jasmine.log("Here is the model: ", model.attrs());

            expect(model.attr("teamSlogan")).toBe("applicant -> PrimaryApplicantOnly");
            expect(model.attr("mascotName")).toBe("coapplicant -> CoapplicantOnly");
        });

    });

    function makeModelWithThesePrimaryAttributes(primaryAttributeList) {
        charNs = {};
        makeCharacteristicList();

        if(! primaryAttributeList) primaryAttributeList = [];

        var modelSpec = JmvcMachinery.Framework.Characteristics.newCharacteristicBasedModelDefinition();

        modelSpec.includePrimaryAttributes(primaryAttributeList);

        modelSpec.includeCharacteristics(charNs,
                "characteristicOne", {whichApplicant: "BothApplicants"}
                );

        JmvcMachinery.Framework.ModelDefinition.defineModelClassFromCharacteristics("forUnitTests", modelSpec);
        var model = new forUnitTests();

        return model;
    }

    function makeCharacteristicList() {

        var callCount = 0;

        makeCharacteristic("characteristicOne", function(prefix, applicantType) {
            if(callCount > 1){
                throw new Error("It has called the block too many times. Here's the count: " + callCount);
            }

            var attrNameToAffect = undefined;

            if(prefix === "applicant") {
                attrNameToAffect = "teamSlogan";
            } else {
                attrNameToAffect = "mascotName";
            }

            this.attr(attrNameToAffect, "" + prefix + " -> " + applicantType);

            callCount++;
        });

        function makeCharacteristic(charName, charDef) {
            charDef = {
                runsCrossApplicantBlockAtModelInstanceInit: charDef
            };
            var characteristic = JmvcMachinery.Framework.Characteristics.declareCrossApplicantCharacteristic(charNs, charName, charDef );
        }
    }
});
