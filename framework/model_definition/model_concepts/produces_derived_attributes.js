/* -*- Mode: jasmine; tab-width: 4; indent-tabs-mode: nil; */

//--------MODULE HEADER----------
(function(GLOBAL, undefined) {
    "use strict";
    //===============================

steal.resources("//jmvc_machinery/framework/resources/dataStructures.js").then(function() {
    var n = JmvcMachinery.Framework.ModelDefinition.ModelConcepts.ModelConceptProcessors;

    n.registerConceptProcessor("producesDerivedAttributes", function(modelDefinition) {
        var customConsequences = {}, haveWeRegisteredAnInitActionYet = false, attrNames = [];

        function addAttributeName(modelDefinition, attrName) {
            modelDefinition.addToDerivedAttributes(attrName);
            attrNames.push(attrName);
        }

        function registerToRunInitAction(modelDefinition) {
            if(! haveWeRegisteredAnInitActionYet) {
                modelDefinition.addToVerbProcessingBlocksForModelInstanceInit(performInstanceInitActions);
                haveWeRegisteredAnInitActionYet = true;
            }
        }

        function performInstanceInitActions(modelInstance) {
            _.each(attrNames, function(attr) {
                modelInstance.Class.schema.properties[attr].readOnly = true;
            });
        }

        return {
            interpret: function(verbSourceName, concept) {
                _.each(concept.producesDerivedAttributes, function(attrSpec, attrName) {

                    if(attrSpec.hasOwnProperty("schema")) {
                        var revisedSchema = attrSpec.schema;
                        revisedSchema.readOnly = true;
                        modelDefinition.addToModelSchema(attrName, revisedSchema);
                    } else {
                        modelDefinition.addToSchemasToFillInFromDefaultSchemaProvider(attrName);
                    }

                    addAttributeName(modelDefinition, attrName);

                    modelDefinition.theseAttributesAreRequiredByThisSource(attrSpec.dependsOnAttributes, verbSourceName);

                    var proxy = JmvcMachinery.Framework.Characteristics.Proxy.newProxy(attrName, attrSpec.dependsOnAttributes, attrSpec.proxyAliases);

                    var getterName = "get" + $.String.capitalize(attrName);

                    var getter = function() {
                        var modelInstance = this;
                        return proxy.callWith(attrSpec.getter, modelInstance);
                    };

                    modelDefinition.addToAttributeGetters(getterName, getter);

                    var setterName = "set" + $.String.capitalize(attrName);

                    var blowUpSetter = function() {
                        throw new Error("The '" + attrName + "' attribute is a derived attribute and cannot be set.");
                    };

                    modelDefinition.addToAttributeSetters(setterName, blowUpSetter);

                    _.each(attrSpec.dependsOnAttributes, function(triggerAttr) {
                        modelDefinition.addToDirectBindAssociations(triggerAttr, [ attrName ]);
                    });

                    registerToRunInitAction(modelDefinition);
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
