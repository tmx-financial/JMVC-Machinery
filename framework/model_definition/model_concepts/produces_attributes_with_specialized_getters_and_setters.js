/* -*- Mode: jasmine; tab-width: 4; indent-tabs-mode: nil; */

//--------MODULE HEADER----------
(function(GLOBAL, undefined) {
    "use strict";
    //===============================

steal.resources("//jmvc_machinery/framework/resources/dataStructures.js").then(function() {
    var n = JmvcMachinery.Framework.ModelDefinition.ModelConcepts.ModelConceptProcessors;

    n.registerConceptProcessor("producesAttributesWithSpecializedGettersAndSetters", function(modelDefinition) {
        var customConsequences = {}, haveWeRegisteredAnInitActionYet = false, setterNames = [], attrNames = [];

        function addAttributeName(modelDefinition, attrName) {
            attrNames.push(attrName);
        }

        return {
            interpret: function(verbSourceName, concept) {
                _.each(concept.producesAttributesWithSpecializedGettersAndSetters, function(attrSpec, attrName) {

                    if(attrSpec.hasOwnProperty("schema")) {
                        var revisedSchema = attrSpec.schema;
                        revisedSchema.readOnly = true;
                        modelDefinition.addToModelSchema(attrName, revisedSchema);
                    } else {
                        modelDefinition.addToSchemasToFillInFromDefaultSchemaProvider(attrName);
                    }

                    addAttributeName(modelDefinition, attrName);

                    var getterProxy = JmvcMachinery.Framework.Characteristics.Proxy.newProxy(attrName, attrSpec.dependsOnAttributes, attrSpec.proxyAliases);
                    var getterName = "get" + $.String.capitalize(attrName);
                    var getter = function() {
                        var thisModelInstance = this;
                        return getterProxy.callWith(attrSpec.getter, thisModelInstance);
                    };

                    modelDefinition.addToAttributeGetters(getterName, getter);

                    var setterName = "set" + $.String.capitalize(attrName);

                    var setter = function(newValue) {
                        var thisModelInstance = this;
                        var oldMemberNamedGetter = thisModelInstance.getter;
                        thisModelInstance.getter = function() {
                            return thisModelInstance.attr(attrName);
                        };

                        var oldMemberNamedNameOfAttribute = thisModelInstance.nameOfAttribute;
                        thisModelInstance.nameOfAttribute = function() {
                            return attrName;
                        };

                        var setterResult = attrSpec.setter.call(thisModelInstance, newValue);

                        thisModelInstance.getter = oldMemberNamedGetter;
                        thisModelInstance.nameOfAttribute= oldMemberNamedNameOfAttribute;

                        return setterResult;
                    };

                    modelDefinition.addToAttributeSetters(setterName, setter);

                    _.each(attrSpec.dependsOnAttributes, function(triggerAttr) {
                        modelDefinition.addToDirectBindAssociations(triggerAttr, [ attrName ]);
                    });
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
