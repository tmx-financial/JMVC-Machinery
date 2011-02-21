/* -*- Mode: jasmine; tab-width: 4; indent-tabs-mode: nil; */

//--------MODULE HEADER----------
(function(GLOBAL, undefined) {
    "use strict";
    //===============================

    describe("model concept registration machinery", function() {
        var registry;
        var stub = {};
        var stubFunc = function() { return stub; };

        var makeConceptProcessorForThisTest = function(name, processorInstantiator) {
            registry.registerConceptProcessor(name, processorInstantiator);
        };

        beforeEach(function() {
            registry = JmvcMachinery.Framework.ModelDefinition.ModelConcepts.ModelConceptProcessors.newModelConceptProcessorRegistry();
        });

        afterEach(function() {
        });

        it("should throw if you do not give it a function for the processInstantiator", function() {
            expect(function() {
                makeConceptProcessorForThisTest("something", {});
            }).toThrow("The value you pass for 'instantiator' must be a function. It should return a new instance of your processor whenever called.");
        });

        it("should be possible to register a concept and then find its processorInstantiator", function() {
            makeConceptProcessorForThisTest("something", stubFunc);
            expect(registry.newProcessorFor("something", {})).toEqual(stub);
        });

        it("should error if you try to redefine a concept", function() {
            makeConceptProcessorForThisTest("something", stubFunc);
            expect(function() {
                makeConceptProcessorForThisTest("something", stubFunc);
            }).toThrow("The ModelConceptProcessor for the concept named '" + "something" + "' already exists.");

        });

        it("should error if you try to find a processorInstantiator for a concept that has not been defined", function() {
            expect(function() {
                registry.newProcessorFor("aintThere", {});
            }).toThrow("There is no known concept called '" + "aintThere" + "'.");
        });

        it("should be making sure there is no carry over of stuff between tests", function() {
            expect(function() {
                registry.newProcessorFor("something", stubFunc);
            }).toThrow("There is no known concept called '" + "something" + "'.");
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
