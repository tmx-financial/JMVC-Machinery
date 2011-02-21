/* -*- Mode: jasmine; tab-width: 4; indent-tabs-mode: nil; */

//--------MODULE HEADER----------
(function(GLOBAL, undefined) {
    "use strict";
    //===============================

steal.resources("//jmvc_machinery/framework/resources/dataStructures.js").then(function() {
    var n = JmvcMachinery.Framework.ModelDefinition.ModelConcepts.ModelConceptProcessors;

    n.registerConceptProcessor("productMustHaveTheseAttributes", function(modelDefinition) {

        return {
            interpret: function(verbSourceName, concept) {
                modelDefinition.theseAttributesAreRequiredByThisSource(concept.productMustHaveTheseAttributes, verbSourceName);
            },

            getInternalDataForTesting: function() {
                return customConsequences;
            }
        };
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
