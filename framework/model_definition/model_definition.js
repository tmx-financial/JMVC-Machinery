//--------MODULE HEADER----------
(function(GLOBAL) {
"use strict";
//===============================
steal.resources('//jmvc_machinery/framework/resources/dataStructures').then(function() {
    function newModelDefinition() {

        var makerFuncs = {
            valueMustBeFunctionAsserter: function(theFunction) {
                if(! _.isFunction(theFunction)) throw new Error("The value you pass in for the 'theFunction' parameter must be a function.");
            },
            mapWithUniqueKeys: function(errorPrefix, valueOkAsserter) {
                if(! valueOkAsserter) valueOkAsserter = _.identity;
                var map = {};

                var result = {
                    add: function(key, theFunction) {
                        if(map.hasOwnProperty(key)) throw new Error(errorPrefix + ": '" + key + "' already exists.");
                        valueOkAsserter(theFunction);
                        map[key] = theFunction;
                    },
                    getMap: function() {
                        return map;
                    }
                };

                result.getInternalData = result.getMap;
                return result;
            },

            mapOfFunction: function(errorPrefix) {
                return makerFuncs.mapWithUniqueKeys(errorPrefix, makerFuncs.valueMustBeFunctionAsserter);
            },

            mapOfObject: function(errorPrefix) {
                return makerFuncs.mapWithUniqueKeys(errorPrefix);
            },

            mapOfStringSet: JmvcMachinery.mapToStringSet,

            arrayOfFunction: function() {
                var theArray = [];

                var result = {
                    add: function(functionToAdd) {
                        if(! _.isFunction(functionToAdd)) throw new Error("The items you add to this collection must be functions.");
                        theArray.push(functionToAdd);
                    },
                    getArray: function() {
                        return theArray;
                    }
                };

                result.getInternalData = result.getArray;
                return result;
            },

            stringSet: function() {
                var result = JmvcMachinery.stringSet();
                result.getInternalData = result.items;
                return result;
            }
        };

        var modelDefinitionElements = {
            attributeSetters: { type: "mapOfFunction" }, // blow up if overwrite attempted
            attributeGetters: { type: "mapOfFunction" },// blow up if overwrite attempted
            privateInstanceMembers: { type: "mapOfObject" },// blow up if overwrite attempted
            directBindAssociations  : { type: "mapOfStringSet" },
            verbProcessingBlocksForModelInstanceInit : { type: "arrayOfFunction" },
            requiredAttributes: { type: "mapOfStringSet" },
            modelSchema: { type: "mapOfObject" },// blow up if overwrite attempted
            primaryAttributes: { type: "stringSet" },
            derivedAttributes: { type: "stringSet" },
            schemasToFillInFromDefaultSchemaProvider: {type: "stringSet" },
            attributesWithPrivateSetters: {type: "stringSet" },
            businessLogicBlocksToRunAtModelInstanceInit: { type: "arrayOfFunction" },
            businessLogicBlocksToRunAtModelStaticInit: { type: "arrayOfFunction" },
            instanceMembersToAdd: {type: "mapOfObject"},
            staticMembersToAdd: {type: "mapOfObject"}
        };

        var elementCollections = {};
        var result = {};

        _.each(modelDefinitionElements, function(elementSpec, elementName) {
            var dataStruct = elementCollections[elementName] = makerFuncs[elementSpec.type]("An error occurred adding to " + elementName);

            var suffix = $.String.capitalize(elementName);
            var addToFuncName = "addTo" + suffix;
            result[addToFuncName] = elementCollections[elementName].add;

            var getDataFuncName = "getInternalDataFor" + suffix;
            result[getDataFuncName] = elementCollections[elementName].getInternalData;

            if(elementSpec.type === "stringSet"){
                var addRangeFuncName = "addRangeTo" + suffix;
                result[addRangeFuncName] = elementCollections[elementName].addRange;
            }

            if(elementName === "requiredAttributes") {
                result.theseAttributesAreRequiredByThisSource = function(arrayOfKeys, sourceName) {
                    if(! _.isArray(arrayOfKeys)) throw new Error("arrayOfKeys must be an array");
                    if(! _.isString(sourceName)) throw new Error("sourceName must be a string");

                    var map = dataStruct.getMap();

                    _.each(arrayOfKeys, function(key) {
                        dataStruct.add(key, [sourceName]);
                    });
                };
            }
        });

        return result;
    }

    GLOBAL.JmvcMachinery.Framework.ModelDefinition.newModelDefinition = newModelDefinition;
});

//===============================
} (function() {
    return this;
}()));
//===============================
