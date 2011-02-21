/* -*- Mode: jasmine; tab-width: 4; indent-tabs-mode: nil; */

//--------MODULE HEADER----------
(function(GLOBAL, undefined) {
    "use strict";
    //===============================

steal.resources("//jmvc_machinery/framework/resources/dataStructures.js").then(function() {
    var n = JmvcMachinery.Framework.ModelDefinition.ModelConcepts.ModelConceptProcessors;

    n.registerConceptProcessor("forcesAttributesToBeReadonlyWhen", makeProcessorForVotingVerb("forcesAttributesToBeReadonlyWhen", "readOnly"));
    n.registerConceptProcessor("forcesAttributesToBeRequiredWhen", makeProcessorForVotingVerb("forcesAttributesToBeRequiredWhen", "required"));

    function makeProcessorForVotingVerb(verbName, schemaSettingToAffect) {
        if(! verbName) throw new Error("You must pass a verbName.");
        if(! schemaSettingToAffect) throw new Error("You must pass the name of the schemaSettingToAffect (such as 'readOnly' or 'required').");

        return function(modelDefinition) {
            var customConsequences = {}, haveWeRegisteredAnInitActionYet = false;
            var mapTriggeringAttrsToAffectedAttrs = customConsequences.mapTriggeringAttrsToAffectedAttrs = JmvcMachinery.customMapToStringSet({
                getKeys: "getTriggeringAttributes",
                getListByKey: "getAttributesAffectedBy",
                associateManyKeysWithOneValue: "theseAttributesTriggerThatOne",
                associateOneKeyWithManyValues: "thisAttributeTriggersThoseAttributes"
            });

            var mapTargetAttrsToConditionList = customConsequences.mapTargetAttrsToConditionList = JmvcMachinery.customMapToArray({
                getKeys: "getTargetAttributes",
                getListByKey: "getConditionsFor",
                associateManyKeysWithOneValue: "theseTargetAttributesHaveThisCondition",
                associateOneKeyWithManyValues: "thisTargetAttributeHasTheseConditions",
                associateOneKeyToOneValue: "thisTargetAttributeHasThisCondition",
                getUnderlyingDataStructure: "getUnderlyingDataStructure"
            });

            function bindToEventsForEnforcement(modelInstance) {
                _(mapTriggeringAttrsToAffectedAttrs.getTriggeringAttributes()).each(function(triggeringAttr) {
                    modelInstance.observeAll(triggeringAttr, function() {
                        enforceRulesUponAttributeChange(triggeringAttr, modelInstance);
                    });
                });
            }

            function enforceRulesUponAttributeChange(nameOfAttributeThatTriggeredTheCheck, modelInstance) {
                var candidateAttributesWhoseStatusMayHaveChanged = mapTriggeringAttrsToAffectedAttrs.getAttributesAffectedBy(nameOfAttributeThatTriggeredTheCheck);

                _(candidateAttributesWhoseStatusMayHaveChanged).each(function(attr) {
                    var rules = mapTargetAttrsToConditionList.getConditionsFor(attr);
                    var shouldAttrRemainUnforced = true;

                    $.each(rules, function(index, aRule) {
                        shouldAttrRemainUnforced = ! (aRule.conditionProxy.callWith(aRule.condition, modelInstance));
                        return shouldAttrRemainUnforced;  // Break early if we have determined it should become forced (one voice singing in the darkness)
                    });

                    var shouldAttrBecomeForced = ! shouldAttrRemainUnforced;
                    var currentSetting = modelInstance.getSchemaFor(attr)[schemaSettingToAffect] || false;

                    if(shouldAttrBecomeForced !== currentSetting) {
                        var schemaChange = {};
                        schemaChange[schemaSettingToAffect] = shouldAttrBecomeForced;
                        modelInstance._privateInstanceMembers()._changeSchemaFor(attr, schemaChange);
                    }
                });
            }

            function theseAttributesTriggerThatOne(arrayOfTriggeringAttributes, affectedAttribute) {
                mapTriggeringAttrsToAffectedAttrs.theseAttributesTriggerThatOne(arrayOfTriggeringAttributes, affectedAttribute);
            }

            function addConditionForThisAttribute(targetAttribute, conditionInfo) {
                var array = mapTargetAttrsToConditionList.thisTargetAttributeHasThisCondition(targetAttribute, conditionInfo);
            }

            function registerToRunInitActionToWireUpConditions(modelDefinition) {
                if(! haveWeRegisteredAnInitActionYet) {
                    modelDefinition.addToVerbProcessingBlocksForModelInstanceInit(bindToEventsForEnforcement);
                    haveWeRegisteredAnInitActionYet = true;
                }
            }

            return {
                interpret: function(verbSourceName, concept) {
                    if(! _.isString(verbSourceName)) throw new Error("You must pass in a verbSourceName, and it must be a string.");

                    _.each(concept[verbName], function(arrayOfSpecsForAttr, attrName) {
                        _.each(arrayOfSpecsForAttr, function(attrSpec) {
                            if(! attrSpec.hasOwnProperty("dependsOnAttributes")) attrSpec.dependsOnAttributes = [];

                            modelDefinition.theseAttributesAreRequiredByThisSource(attrSpec.dependsOnAttributes, verbSourceName);
                            modelDefinition.addToRequiredAttributes(attrName, [verbSourceName]);
                            registerToRunInitActionToWireUpConditions(modelDefinition);

                            theseAttributesTriggerThatOne(attrSpec.dependsOnAttributes, attrName);

                            addConditionForThisAttribute(attrName, {
                                condition: attrSpec.condition,
                                conditionProxy: JmvcMachinery.Framework.Characteristics.Proxy.newProxy(attrName, attrSpec.dependsOnAttributes, attrSpec.proxyAliases),
                                attributeSpec: attrSpec
                            });
                        });
                    });
                },

                getInternalDataForTesting: function() {
                    return customConsequences;
                }
            };
        };
    }
});


    //===============================
} (function() {
    return this;
}(),
(function() {
    return;
} ())));
//===============================
