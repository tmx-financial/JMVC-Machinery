//--------MODULE HEADER----------
(function(GLOBAL, undefined) {
    "use strict";
    //===============================

    steal.plugins(
        "//jmvc_machinery/framework/characteristics/application/cross_applicant/cross_applicant_functional_helpers.js",
        "//jmvc_machinery/framework/model_definition/model_concepts/morphs_attribute_schemas.js",
        "//jmvc_machinery/framework/model_definition/model_concepts/adds_instance_members.js",
        "//jmvc_machinery/framework/model_definition/model_concepts/adds_static_members.js",
        "//jmvc_machinery/framework/model_definition/model_concepts/runs_block_at_model_static_init.js",
        "//jmvc_machinery/framework/model_definition/model_concepts/runs_block_at_model_instance_init.js",
        "//jmvc_machinery/framework/model_definition/model_concepts/product_must_have_these_attributes.js",
        "//jmvc_machinery/framework/model_definition/model_concepts/produces_attributes_with_specialized_getters_and_setters.js",
        "//jmvc_machinery/framework/model_definition/model_concepts/produces_derived_attributes.js",
        "//jmvc_machinery/framework/model_definition/model_concepts/forces_attributes_to_be_readonly_when.js",
        "//jmvc_machinery/framework/model_definition/model_concepts/produces_attributes_with_private_setters.js",
        "//jmvc_machinery/framework/model_definition/model_concepts/produces_attributes_with_private_setters.js",
        "//jmvc_machinery/framework/characteristics/produce_characteristic_declaration_function.js",
        "//jmvc_machinery/framework/characteristics/application/cross_applicant/cross_applicant_translation.js"
        ).then(function() {

            var functionalHelpers = JmvcMachinery.Framework.Characteristics.Application.CrossApplicant.crossApplicantFunctionalHelpers;

            var characteristicTypes = {
                CrossApplicant: {
                    //verbsInOrderOfProcessing : ["runsAtModelStaticInit", "runsAtModelInstanceInit", "runsCrossApplicantBlockAtModelInstanceInit", "productMustHaveTheseCrossApplicantAttributes", "productMustHaveTheseAttributes",
                        //"producesCrossApplicantDerivedAttributes", "addsCrossApplicantValidation", "forcesCrossApplicantAttributesToBeReadonlyWhen", "producesCrossApplicantAttributesWithSpecializedGettersAndSetters"],
                    verbsInOrderOfProcessing : [
                        "forcesAttributesToBeReadonlyWhen", "forcesCrossApplicantAttributesToBeReadonlyWhen",
                        "forcesAttributesToBeRequiredWhen", "forcesCrossApplicantAttributesToBeRequiredWhen",
                        "producesAttributesWithPrivateSetters", "producesCrossApplicantAttributesWithPrivateSetters",
                        "producesDerivedAttributes", "producesCrossApplicantDerivedAttributes",
                        "producesAttributesWithSpecializedGettersAndSetters", "producesCrossApplicantAttributesWithSpecializedGettersAndSetters",
                        "productMustHaveTheseAttributes", "productMustHaveTheseCrossApplicantAttributes",
                        "runsBlockAtModelInstanceInit", "runsCrossApplicantBlockAtModelInstanceInit",
                        "runsBlockAtModelStaticInit", "runsCrossApplicantBlockAtModelStaticInit",
                        "addsStaticMembers", "addsInstanceMembers"
                    ],
                    requiresInitParameters: ["whichApplicant"],
                    init: function(options) {
                        functionalHelpers.validateWhichApplicantParameter(options.whichApplicant);
                    },
                    verbRegistries: [JmvcMachinery.Framework.ModelDefinition.ModelConcepts.ModelConceptProcessors, 
                                        JmvcMachinery.Framework.Characteristics.CharacteristicVerbs
                                    ]
                },
                Standard: {
                    //verbsInOrderOfProcessing : ["addsAttributesWithPrivateSetters", "addsStaticMembers", "addsInstanceMembers", "runsAtModelStaticInit", "runsAtModelInstanceInit", "productMustHaveTheseAttributes", "producesDerivedAttributes", "morphAttributeSchemas", "forcesAttributesToBeReadonlyWhen"],
                    verbsInOrderOfProcessing: [
                        "forcesAttributesToBeReadonlyWhen",
                        "forcesAttributesToBeRequiredWhen",
                        "producesAttributesWithPrivateSetters",
                        "producesDerivedAttributes",
                        "producesAttributesWithSpecializedGettersAndSetters",
                        "productMustHaveTheseAttributes",
                        "runsBlockAtModelInstanceInit",
                        "runsBlockAtModelStaticInit",
                        "addsStaticMembers", "addsInstanceMembers",
                        "morphsAttributeSchemas"
                    ],
                    verbRegistries: [JmvcMachinery.Framework.ModelDefinition.ModelConcepts.ModelConceptProcessors, 
                                        JmvcMachinery.Framework.Characteristics.CharacteristicVerbs
                                    ]
                }
                //RequiresOverrideAuthorization: {
                    //verbsInOrderOfProcessing: ["requiresOverrideAuthorization"],
                    //verbRegistries: [JmvcMachinery.Framework.ModelDefinition.ModelConcepts.ModelConceptProcessors 
                                        ////,JmvcMachinery.Framework.Characteristics.CharacteristicVerbs
                                    //]
                //}
            };

            _.each(characteristicTypes, function(characteristicTypeDefinition, characteristicTypeName) {
                assertThatCharacteristicTypeDefinitionIsValid(characteristicTypeDefinition);

                characteristicTypeDefinition.verbsInOrderOfProcessing.unshift("init");

                characteristicTypeDefinition.isThisVerbAllowed = function(verb) {
                    return _.contains(characteristicTypeDefinition.verbsInOrderOfProcessing, verb);
                };

                var declareFunctionName = "declare" + $.String.capitalize(characteristicTypeName) + "Characteristic";
                var declareFunction = JmvcMachinery.Framework.Characteristics.produceCharacteristicDeclarationFunction(characteristicTypeName, characteristicTypeDefinition);

                GLOBAL.namespace("JmvcMachinery.Framework.Characteristics")[declareFunctionName] = declareFunction;

                function doesThisVerbExistInVerbRegistries(verbName) {
                    var retval = false;
                    _.each(characteristicTypeDefinition.verbRegistries, function(vr) {
                        if(vr.hasVerb(verbName)) {
                            retval = true;
                        }
                    });

                    return retval;
                }

                function assertThatCharacteristicTypeDefinitionIsValid(characteristicTypeDefinition) {
                    "use strict";
                    var definitionValidator = {
                        verbsInOrderOfProcessing: function(verbList) {
                            if(! verbList) throw new Error("You must provide a list of verbs for this CharacteristicType, in the order they should be processed.");
                            if(! _.isArray(verbList)) throw new Error("The verbList you provide for the CharacteristicType named " + characteristicTypeName + " must be an array.");

                            _.each(verbList, function(verb) {
                                if(! doesThisVerbExistInVerbRegistries(verb)) throw new Error("The CharacteristicType " + characteristicTypeName + " specifies that it allows a verb called " + verb + " but that is not one of the known verbs.");
                            });
                        },
                        requiresInitParameters: function(listOfRequiredParameters) {
                                                    if(! listOfRequiredParameters) throw new Error("You must provide a list of required parameters if you are using the 'requiresIntiParameters' term.");
                                                    if(! _.isArray(listOfRequiredParameters)) throw new Error("The value you provide for 'requiresInitParameters' must be an array.");
                                                },
                        init: function(theirInitFunction) {
                                  if(! _.isFunction(theirInitFunction)) throw new Error("If you provide an init in a CharacteristicType definition, as you have for " + characteristicTypeName + ", then the value you provide for init must be a function.");
                              },
                        verbRegistries: function(theirVerbRegistryArray) {
                                            if(! _.isArray(theirVerbRegistryArray)) throw new Error("You must pass an array for verbRegistries.");
                                        }
                    };

                    definitionValidator.verbsInOrderOfProcessing.isOptional = false;
                    definitionValidator.requiresInitParameters.isOptional = true;
                    definitionValidator.init.isOptional = true;
                    definitionValidator.verbRegistries.isOptional = false;

                    var allowedTerms = _.keys(definitionValidator);
                    var unknownActionsTheyCalled = _.filter(_.keys(characteristicTypeDefinition), function(value, key) { return ! allowedTerms.hasOwnProperty(key); });
                    var missingTerms = _.reject(allowedTerms, function(key) { return characteristicTypeDefinition.hasOwnProperty(key); } );

                    var missingTermsThatWereRequired = _.filter(missingTerms, function(term) { return definitionValidator[term].isOptional === false; });

                    if(unknownActionsTheyCalled.length !== 0) throw new Error("The CharacteristicType named '" + characteristicTypeName + "' has these unknown actions in its definition: " + unknownActionsTheyCalled.join(", "));
                    if(missingTermsThatWereRequired.length !== 0) throw new Error("The CharacteristicType named '" + characteristicTypeName + "' is missing the following required parameters: " + missingTermsThatWereRequired.join(", "));

                    _.each(characteristicTypeDefinition, function(value, key) {
                        definitionValidator[key](value);
                    });
                }
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
