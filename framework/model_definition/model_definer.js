/* -*- Mode: javascript; tab-width: 4; indent-tabs-mode: nil; */

//--------MODULE HEADER----------
(function(GLOBAL) {
"use strict";
//===============================

steal.resources("//jmvc_machinery/framework/characteristics/attribute_universe_reference.js").then(function() {

    var n = JmvcMachinery.Framework.ModelDefinition.ModelConcepts.ModelConceptProcessors;

    var defineModelClass = GLOBAL.namespace("JmvcMachinery.Framework.ModelDefinition").defineModelClass = function(modelName, modelSpec, defaultSchemaSource, metaProgrammingHook) {
        var theSingleVerbSource = [
            {
                getDescription: function() {
                    return "The model spec you provided";
                },
                produceVerbList: function() {
                    var result = [];
                    _.each(modelSpec, function(verbBody, verbName) {
                        var fullVerb = {};
                        fullVerb[verbName] = verbBody;
                        result.push(fullVerb);
                    });

                    return result;
                }
            }
        ];
        return defineModelClassFromVerbSources(modelName, theSingleVerbSource, defaultSchemaSource, metaProgrammingHook);
    };

    var defineModelClassFromCharacteristics = GLOBAL.namespace("JmvcMachinery.Framework.ModelDefinition").defineModelClassFromCharacteristics = function(modelName, characteristicBasedModelDef, metaProgrammingHook) {
        var primaryAttrSpec = {
            primaryAttributes: {
            }
        };

        var paSet = primaryAttrSpec.primaryAttributes;
        var primaries = characteristicBasedModelDef.clonePrimaryAttributeList();

        _.each(primaries, function(attr) {
            paSet[attr] = {};
        });

        var primaryAttrVerbSource = {
            getDescription: function() {
                return "The primary attribute specification set";
            },
            produceVerbList: function() {
                return [primaryAttrSpec];
            }
        };

        var fullVerbList = characteristicBasedModelDef.cloneCharacteristicList();
        fullVerbList.push(primaryAttrVerbSource);

        return defineModelClassFromVerbSources(modelName, fullVerbList, JmvcMachinery.Framework.Characteristics.attributeUniverse(), metaProgrammingHook);
    };

    var defineModelClassFromVerbSources = GLOBAL.namespace("JmvcMachinery.Framework.ModelDefinition").defineModelClassFromVerbSources = function(modelName, arrayOfVerbSources, defaultSchemaSource, metaProgrammingHook) {
        if(! arrayOfVerbSources) throw new Error("You must pass an 'arrayOfVerbSources'");
        if(! _.isArray(arrayOfVerbSources)) throw new Error("The 'arrayOfVerbSources' parameter must be an array.");

        var modelDefinition = JmvcMachinery.Framework.ModelDefinition.newModelDefinition();

        processVerbBundle(arrayOfVerbSources, modelDefinition);

        var schema = {
            "description": "Application",
            "type": "object",
            "properties" : modelDefinition.getInternalDataForModelSchema()
        };

        var schemasToGetFromDefaultSource = modelDefinition.getInternalDataForSchemasToFillInFromDefaultSchemaProvider();
        _.each(schemasToGetFromDefaultSource, function(attr) {
            var theSchema = defaultSchemaSource.getSchema(attr);
            schema.properties[attr] = theSchema;
        });

        if(_.isFunction(metaProgrammingHook)) {
            metaProgrammingHook(modelDefinition, modelName);
        }

        (function performConsistencyCheck(){
            var raStruct = modelDefinition.getInternalDataForRequiredAttributes();
            var requiredAttrs = _.keys(raStruct);
            var actualAttributes = _.keys(schema.properties);
            var missingAttributesThatAreRequired = _.filter(requiredAttrs, function(ra) { return ! _.contains(actualAttributes, ra); });

            if(missingAttributesThatAreRequired.length !== 0) {
                var lines = [];
                lines.push("The following errors occurred in the model definition:");

                var index = 1;
                _.each(missingAttributesThatAreRequired, function(attr) {
                    var whoRequiredThisAttr = raStruct[attr].items();
                    var whoRequiredThisAsText = whoRequiredThisAttr.join(", ");
                    lines.push(index + ") An attribute named '" + attr + "' is required to be present by: " + whoRequiredThisAsText);
                    index++;
                });

                var message = lines.join("\r\n");
                throw new Error(message);
            }
        }());

        var staticMembers = {}, prototypeMembers = {};

        var staticMembersToAdd = modelDefinition.getInternalDataForStaticMembersToAdd();
        addTheseAsMembers(staticMembersToAdd, staticMembers, "static");

        var getters = modelDefinition.getInternalDataForAttributeGetters();
        var setters = modelDefinition.getInternalDataForAttributeSetters();
        addTheseAsMembers(setters, prototypeMembers, "prototype");
        addTheseAsMembers(getters, prototypeMembers, "prototype");

        var instanceMembersToAdd = modelDefinition.getInternalDataForInstanceMembersToAdd();
        addTheseAsMembers(instanceMembersToAdd, prototypeMembers, "prototype");

        staticMembers.init = function() {
            var thisModelKlass = this;
            this._setSchema(schema);
            this.attributesWithPrivateSetters = modelDefinition.getInternalDataForAttributesWithPrivateSetters();
            this.derivedAttributes = modelDefinition.getInternalDataForDerivedAttributes();

            var businessLogicBlocks = modelDefinition.getInternalDataForBusinessLogicBlocksToRunAtModelStaticInit();
            _.each(businessLogicBlocks, function(block) {
                block.call(thisModelKlass);
            });
        };

        var privateInstanceMembersToAdd = modelDefinition.getInternalDataForPrivateInstanceMembers();

        prototypeMembers.init = function() {
            var thisModelInstance = this;
            _.each(privateInstanceMembersToAdd, function(memberDef, memberName) {
                var memberToAdd = memberDef;

                if(_.isFunction(memberDef)) {
                    memberToAdd = _.bind(memberDef, thisModelInstance);
                }

                thisModelInstance._privateInstanceMembers()[memberName] = memberToAdd;
            });

            var directBindAssociations = modelDefinition.getInternalDataForDirectBindAssociations();

            _.each(directBindAssociations, function(cascadeStringSet, nameOfAttrWhoseChangeCausesTheCascade) {
                var cascadeChangeEventsToFire = cascadeStringSet.items();
                thisModelInstance.observeAll(nameOfAttrWhoseChangeCausesTheCascade, function() {
                    _.each(cascadeChangeEventsToFire, function(eventToFire) {
                        $(thisModelInstance).triggerHandler(eventToFire, thisModelInstance.attr(eventToFire));
                    });
                });
            });

            (function initializeAllPrimaryAttrsToNullIfTheyAreNotYetInitializedDueToWrap() {
                var primaryAttributes = modelDefinition.getInternalDataForPrimaryAttributes();
                _.each(primaryAttributes, function(pa) {
                    if(thisModelInstance.attr(pa) === undefined) thisModelInstance.attr(pa, null);
                });
            }());

            _.each(modelDefinition.getInternalDataForVerbProcessingBlocksForModelInstanceInit(), function(entry) {
                entry.call(thisModelInstance, thisModelInstance);
            });

            var businessLogicBlocks = modelDefinition.getInternalDataForBusinessLogicBlocksToRunAtModelInstanceInit();
            _.each(businessLogicBlocks, function(block) {
                block.call(thisModelInstance, thisModelInstance);
            });
        };

        var constructorForTheNewModel = $.Model.extend(modelName, staticMembers, prototypeMembers);

        return constructorForTheNewModel;
    };

    var newProcessorTable = function(verbRegistry) {
        if(! verbRegistry) verbRegistry = n;

        var processorTable = {};

        var getProcessorFor = function(verbName, modelDefinition) {
            if(! processorTable.hasOwnProperty(verbName)) {
                processorTable[verbName] = verbRegistry.newProcessorFor(verbName, modelDefinition);
            }
            return processorTable[verbName];
        };

        return {
            getProcessorFor: getProcessorFor
        };
    };

    GLOBAL.namespace("JmvcMachinery.Framework.ModelDefinition.InternalForUnitTesting").newProcessorTable = newProcessorTable;

    var processVerbBundleInternal = function(arrayOfVerbSources, modelDefinition, processorTable) {
        if(! arrayOfVerbSources) throw new Error("You must pass an 'arrayOfVerbSources'");

        if(! _.every(arrayOfVerbSources, function(vs) {
            if(! vs.hasOwnProperty("getDescription")) return false;
            if(! _.isFunction(vs.getDescription)) return false;
            return true;
        })) throw new Error("Every verbSource you pass in must have a function member called getDescription().");

        if(! _.isArray(arrayOfVerbSources)) throw new Error("The 'arrayOfVerbSources' parameter must be an array.");
        if(! modelDefinition) throw new Error("You must pass in a modelDefinition.");
        if(! processorTable) processorTable = newProcessorTable();

        _.each(arrayOfVerbSources, function(verbSource) {
            var verbList = verbSource.produceVerbList();
            _.each(verbList, function(verb) {
                processSingleVerbInternal(verbSource, verb, modelDefinition, processorTable);
            });
        });
    };

    GLOBAL.namespace("JmvcMachinery.Framework.ModelDefinition.InternalForUnitTesting").processVerbBundleInternal = processVerbBundleInternal;
    var processVerbBundle = GLOBAL.namespace("JmvcMachinery.Framework.ModelDefinition").processVerbBundle = function(arrayOfVerbSources, modelDefinition) {
        return processVerbBundleInternal(arrayOfVerbSources, modelDefinition);
    };

    var processSingleVerbInternal = function(verbSource, verb, modelDefinition, processorTable) {
        if(! processorTable) processorTable = newProcessorTable();
        if(! verb) throw new Error("You must pass in a verb");
        if(! modelDefinition) throw new Error("You must pass in a modelDefinition.");

        var verbName = _.keys(verb)[0];
        var processor = processorTable.getProcessorFor(verbName, modelDefinition);
        processor.interpret(verbSource.getDescription(), verb);
    };

    GLOBAL.namespace("JmvcMachinery.Framework.ModelDefinition.InternalForUnitTesting").processSingleVerbInternal = processSingleVerbInternal;

    GLOBAL.namespace("JmvcMachinery.Framework.ModelDefinition").processSingleVerb = function(verb, modelDefinition) {
        processSingleVerbInternal(verb, modelDefinition);
    };

    function addTheseAsMembers(members, target, targetDescription) {
        _.each(members, function(memberValue, memberName) {
            if(target.hasOwnProperty(memberName)) throw new Error("Trying to define a model, and attempting to define a " + targetDescription + " member called '" + memberName + "' more than once.");
            target[memberName] = memberValue;
        });
    }
});

//===============================
} (function() {
    return this;
}()));
//===============================
