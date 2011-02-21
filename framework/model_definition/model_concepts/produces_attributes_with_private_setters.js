/* -*- Mode: jasmine; tab-width: 4; indent-tabs-mode: nil; */

//--------MODULE HEADER----------
(function(GLOBAL, undefined) {
    "use strict";
    //===============================

steal.resources("//jmvc_machinery/framework/resources/dataStructures.js").then(function() {
    var n = JmvcMachinery.Framework.ModelDefinition.ModelConcepts.ModelConceptProcessors;

    n.registerConceptProcessor("producesAttributesWithPrivateSetters", function(modelDefinition) {
        var customConsequences = {}, haveWeRegisteredAnInitActionYet = false, setterNames = [], attrNames = [];

        function addAttributeName(modelDefinition, attrName) {
            modelDefinition.addToAttributesWithPrivateSetters(attrName);
            attrNames.push(attrName);
        }

        function addPrivateSetter(modelDefinition, setterName, privateSetter) {
            modelDefinition.addToPrivateInstanceMembers(setterName, privateSetter);
            setterNames.push(setterName);
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

            _.each(setterNames, function(setter) {
                modelInstance._privateInstanceMembers()[setter](null);
            });
        }

        return {
            interpret: function(verbSourceName, concept) {
                _.each(concept.producesAttributesWithPrivateSetters, function(attrSpec, attrName) {

                    if(attrSpec.hasOwnProperty("schema")) {
                        var revisedSchema = attrSpec.schema;
                        revisedSchema.readOnly = true;
                        modelDefinition.addToModelSchema(attrName, revisedSchema);
                    } else {
                        modelDefinition.addToSchemasToFillInFromDefaultSchemaProvider(attrName);
                    }

                    addAttributeName(modelDefinition, attrName);

                    var setterName = "set" + $.String.capitalize(attrName);

                    var blowUpSetter = function() {
                        throw new Error("You cannot set the attribute '" + attrName + "' directly. It is an Attribute with a private setter. Only code inside the model instance can set it, using 'this._privateInstanceMembers()." + setterName + "()'.");
                    };

                    modelDefinition.addToAttributeSetters(setterName, blowUpSetter);

                    var privateSetter = function(newValue) {
                        var thisModelInstance = this, oldValue = thisModelInstance.attr(attrName);
                        thisModelInstance._updateProperty(attrName, newValue, oldValue);
                    };

                    addPrivateSetter(modelDefinition, setterName, privateSetter);

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
