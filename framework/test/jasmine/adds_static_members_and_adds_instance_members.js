steal.resources("//jmvc_machinery/framework/characteristics/new_characteristic_based_model_definition.js").then(function() {
    var n = JmvcMachinery.Framework.ModelDefinition.ModelConcepts.ModelConceptProcessors;
    describe("When defining a model with a characteristic that adds static and instance members", function() {
        var charNs;

        it("should create the corresponding members", function() {
            var model = makeModelWithThesePrimaryAttributes(["teamSlogan", "mascotName"]);

            expect(model).toBeDefined();

            expect(model.anInstanceMember).toBe(42);
            expect(model.Class.aStaticMember).toBe(42);
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
        makeCharacteristic("characteristicOne", {
            addsStaticMembers: {
                aStaticMember: 42
            },
            addsInstanceMembers: {
                anInstanceMember: 42
            }
        });

        function makeCharacteristic(charName, charDef) {
            var characteristic = JmvcMachinery.Framework.Characteristics.declareCrossApplicantCharacteristic(charNs, charName, charDef );
        }
    }
});
