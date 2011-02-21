//--------MODULE HEADER----------
(function(GLOBAL, undefined) {
    "use strict";
    //===============================

    describe("The 'produceCharacteristicInstantiationFunction' function", function() {
        var instantiatorFunction;

        beforeEach(function() {
            instantiatorFunction = JmvcMachinery.Framework.Characteristics.produceCharacteristicInstantiationFunction("ForUnitTest", "CrossApplicant", {});
        });

        it("should respond to the happy path correctly", function() {
            expect(_.isFunction(instantiatorFunction)).toBe(true);
        });

        it("should produce a function that can be called successfully", function() {
            var charInstance = instantiatorFunction();
            jasmine.log(charInstance);

            expect(charInstance.getCharacteristicName()).toBe("ForUnitTest");
            expect(charInstance.isInitialized()).toBe(false);
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
