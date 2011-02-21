/* -*- Mode: jasmine; tab-width: 4; indent-tabs-mode: nil; */
//--------MODULE HEADER----------
(function(GLOBAL, undefined) {
    "use strict";
    //===============================

steal.resources("//jmvc_machinery/framework/resources/dataStructures.js").then(function() {
    var n = JmvcMachinery.Framework.ModelDefinition.ModelConcepts.ModelConceptProcessors;

    n.registerConceptProcessor("morphsAttributeSchemas", function(modelDefinition) {
        var customConsequences = {}, haveWeRegisteredAnInitActionYet = false;
        var morphSpecs = {};

        function addMorphSpec(attrName, attrSpec) {
            morphSpecs[attrName] = attrSpec;
        }

        function initBlockThatEnforcesTheMorph(thisModelDefinition) {
            _.each(morphSpecs, function(attrSpec, attrName) {
                if(attrSpec.hasOwnProperty("optionFilter")) {
                    var modelSchemaForAttr = thisModelDefinition.Class.schema.properties[attrName];
                    var filteredOptions = _.filter(modelSchemaForAttr.options, attrSpec.optionFilter);
                    thisModelDefinition.Class.schema.properties[attrName].options = filteredOptions;
                }
            });
        }

        function registerToRunInitActionToWireUpConditions(modelDefinition) {
            if(! haveWeRegisteredAnInitActionYet) {
                modelDefinition.addToVerbProcessingBlocksForModelInstanceInit(initBlockThatEnforcesTheMorph);
                haveWeRegisteredAnInitActionYet = true;
            }
        }

        return {
            interpret: function(verbSourceName, concept) {
                if(! _.isString(verbSourceName)) throw new Error("You must pass in a verbSourceName, and it must be a string.");

                registerToRunInitActionToWireUpConditions(modelDefinition);

                _.each(concept.morphsAttributeSchemas, function(attrSpec, attrName) {
                    modelDefinition.theseAttributesAreRequiredByThisSource([attrName], verbSourceName);
                    addMorphSpec(attrName, attrSpec);
                });
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
