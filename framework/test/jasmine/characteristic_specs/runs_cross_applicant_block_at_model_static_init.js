steal.resources("//jmvc_machinery/framework/characteristics/new_characteristic_based_model_definition.js").then(function() {
    var n = JmvcMachinery.Framework.ModelDefinition.ModelConcepts.ModelConceptProcessors;

    describe("When defining a model with a runsCrossApplicantBlockAtModelStaticInit characteristic", function() {
        var charNs;

        beforeEach(function() {
            JmvcMachinery.Framework.Characteristics.setAttributeUniverse(JmvcMachinery.Framework.FakeAttributeUniverse);
        });

        it("should run the block for each applicant, with the right params each time, at model static init", function() {

            var model = makeModelWithThesePrimaryAttributes(["teamSlogan", "mascotName"]);

            expect(model).toBeDefined();

            expect(model.Class.applicant__PrimaryApplicantOnly).toBe(42);
            expect(model.Class.coapplicant__CoapplicantOnly).toBe(42);
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

            var staticPropertyToAddToProveWeHaveBeenHere = "" + prefix + "__" + applicantType;
            this[staticPropertyToAddToProveWeHaveBeenHere] = 42;
            callCount++;
        });

        function makeCharacteristic(charName, charDef) {
            charDef = {
                runsCrossApplicantBlockAtModelStaticInit: charDef
            };
            var characteristic = JmvcMachinery.Framework.Characteristics.declareCrossApplicantCharacteristic(charNs, charName, charDef );
        }
    }
});
