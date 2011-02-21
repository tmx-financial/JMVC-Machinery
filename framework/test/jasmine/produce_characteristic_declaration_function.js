//--------MODULE HEADER----------
(function(GLOBAL, undefined) {
    "use strict";
    //===============================

    describe("The 'produceCharacteristicDeclarationFunction' function", function() {
        it("should respond to the happy path correctly", function() {
            var resultingFunction = JmvcMachinery.Framework.Characteristics.produceCharacteristicDeclarationFunction("Standard", {
                verbsInOrderOfProcessing : ["producesAttributesWithPrivateSetters", "addsStaticMembers", "addsInstanceMembers", "runsBlockAtModelStaticInit", "runsBlockAtModelInstanceInit", "productMustHaveTheseAttributes", "producesDerivedAttributes", "morphAttributeSchemas", "forcesAttributesToBeReadonlyWhen"]
            });

            expect(_.isFunction(resultingFunction)).toBe(true);
        });
    });





    //===============================
} (function() {
    return this;
}(),
(function() {
    return;
} ())));
//===============================
