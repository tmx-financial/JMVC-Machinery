//--------MODULE HEADER----------
(function(GLOBAL, undefined) {
    "use strict";
    //===============================

    var n = JmvcMachinery.Framework.ModelDefinition.ModelConcepts.ModelConceptProcessors;

    n.registerConceptProcessor("primaryAttributes", function(modelDefinition) {
        var consequences = {};

        return {
            interpret: function(verbSourceName, concept) {
                _.each(concept.primaryAttributes, function(attrSpec, attrName) {
                    modelDefinition.addToPrimaryAttributes(attrName);

                    var schema = attrSpec.schema;
                    if(schema) {
                        validateSchema(schema);
                        modelDefinition.addToModelSchema(attrName, schema);
                    } else {
                        modelDefinition.addToSchemasToFillInFromDefaultSchemaProvider(attrName);
                    }
                });

            },

            getInternalDataForTesting: function() {
                return consequences;
            }
        };
    });

    function validateSchema(schema) {
        //TODO FILL IN SCHEMA VALIDATION (REFERENCE SOME OTHER FUNCTION THAT DOES IT)
    }

    //===============================
} (function() {
    return this;
}(),
(function() {
    return;
} ())));
//===============================
