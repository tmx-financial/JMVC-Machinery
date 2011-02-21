//--------MODULE HEADER----------
(function(GLOBAL) {
    "use strict";
//===============================

    var helpers = JmvcMachinery.Framework.Characteristics.Application.CrossApplicant.crossApplicantFunctionalHelpers;
    var parsers = makeParsers();

    var knownCaVerbs = ["productMustHaveTheseCrossApplicantAttributes", "producesCrossApplicantDerivedAttributes",
        "forcesCrossApplicantAttributesToBeReadonlyWhen", "forcesCrossApplicantAttributesToBeRequiredWhen", "producesCrossApplicantAttributesWithPrivateSetters",
        "producesCrossApplicantAttributesWithSpecializedGettersAndSetters", "runsCrossApplicantBlockAtModelInstanceInit", "runsCrossApplicantBlockAtModelStaticInit"

    ];

    function hasVerb(verbName) {
        return _.contains(knownCaVerbs, verbName);
    }

    GLOBAL.namespace("JmvcMachinery.Framework.Characteristics.CharacteristicVerbs").hasVerb = hasVerb;

    function translate(originalVerb, whichApplicant) {
        var translatedVerbs = [];

        var topLevelProcessorName = "process" + $.String.capitalize(_.keys(originalVerb)[0]);
        helpers.perApplicantType(whichApplicant, function(prefix, applicantType) {
            parsers.setApplicantType(applicantType);
            var singleTranslatedVerb = parsers[topLevelProcessorName](originalVerb);
            translatedVerbs.push(singleTranslatedVerb);
        });

        return translatedVerbs;
    }

    GLOBAL.namespace("JmvcMachinery.Framework.Characteristics.Application.CrossApplicant").translateCrossApplicantVerbToCorrespondingSetOfPrimitiveVerbs = translate;

    function makeParsers() {
        var applicantType = undefined;

        var makeShellOfTranslatedVerb = function(verbBody) {
            var caVerb = _.keys(verbBody)[0];
            var primitiveVerb = helpers.translateCrossApplicantVerbNameIntoCorrespondingPrimitiveVerb(caVerb);
            var translationResult = {};
            var translatedVerbBody = translationResult[primitiveVerb] = {};

            return {
                translatedVerbBody: translatedVerbBody,
                caVerb: caVerb,
                primitiveVerb: primitiveVerb,
                entireTranslationResult: translationResult
            };
        };

        var processVerbThatIsAStraightSetOfAttributeSpecs = function(verbBody) {
            var shell = makeShellOfTranslatedVerb(verbBody);

            _.each(verbBody[shell.caVerb], function(attributeSpec, rawAttributeName) {
                var translatedAttributeName = helpers.resolveCrossApplicantNames([rawAttributeName], applicantType)[0];
                var translatedAttrSpec = shell.translatedVerbBody[translatedAttributeName] = {};
                parsers.processAttributeSpec(attributeSpec, translatedAttrSpec);
            });

            return shell.entireTranslationResult;
        };

        var processVerbThatIsAStraightSetOfAttributeDeclarations = function(verbBody) {
            var shell = makeShellOfTranslatedVerb(verbBody);

            _.each(verbBody[shell.caVerb], function(attributeSpec, rawAttributeName) {
                parsers.processAttributeDeclaration(rawAttributeName, attributeSpec, shell.translatedVerbBody);
            });

            return shell.entireTranslationResult;
        };


        var makeProcessorForRunCrossApplicantBlock = function(staticOrInit) {
            if(staticOrInit !== "Static" && staticOrInit !== "Instance") throw new Error("You passed an invalid value for 'staticOrInit': " + staticOrInit);

            var verbName = "runsCrossApplicantBlockAtModel" + staticOrInit + "Init";
            var primitiveVerb = helpers.translateCrossApplicantVerbNameIntoCorrespondingPrimitiveVerb(verbName);

            return function(verbBody) {
                var prefix = {
                    PrimaryApplicantOnly: "applicant",
                    CoapplicantOnly: "coapplicant"
                }[applicantType];

                if(! prefix) throw new Error("Unable to determine prefix from applicantType of " + applicantType);

                var blockToRegister = (function(applicantTypeToCapture) {
                    return function() {
                        var theInstancePassedIn = this;
                        verbBody[verbName].call(theInstancePassedIn, prefix, applicantTypeToCapture);
                    };
                }(applicantType));

                var result = {};
                result[primitiveVerb] = blockToRegister;

                return result;
            };
        };

        var parsers = {
            setApplicantType: function(targetApplicantType) {
                helpers.validateWhichApplicantParameter(targetApplicantType);
                if(targetApplicantType === "BothApplicants") throw new Error("It is illegal to specify 'BothApplicants' here. This function expects to be told whether it applies to PrimaryApplicantOnly or CoapplicantOnly. A higher level loop must be used if you wish to apply this to both applicants.");
                applicantType = targetApplicantType;
            },
            processRunsCrossApplicantBlockAtModelInstanceInit: function(verbBody) {
                var f = makeProcessorForRunCrossApplicantBlock("Instance");
                return f(verbBody);
            },
            processRunsCrossApplicantBlockAtModelStaticInit: function(verbBody) {
                var f = makeProcessorForRunCrossApplicantBlock("Static");
                return f(verbBody);
            },
            processProducesCrossApplicantAttributesWithPrivateSetters: processVerbThatIsAStraightSetOfAttributeDeclarations,
            processProductMustHaveTheseCrossApplicantAttributes: function(verbBody) {
                var shell = makeShellOfTranslatedVerb(verbBody);
                shell.entireTranslationResult[shell.primitiveVerb] = helpers.resolveCrossApplicantNames(verbBody[shell.caVerb], applicantType);
                return shell.entireTranslationResult;
            },
            processProducesCrossApplicantAttributesWithSpecializedGettersAndSetters: processVerbThatIsAStraightSetOfAttributeSpecs,
            processProducesCrossApplicantDerivedAttributes: processVerbThatIsAStraightSetOfAttributeSpecs,
            processForcesCrossApplicantAttributesToBeReadonlyWhen: processVerbThatIsAStraightSetOfAttributeDeclarations,
            processForcesCrossApplicantAttributesToBeRequiredWhen: processVerbThatIsAStraightSetOfAttributeDeclarations,
            processAttributeDeclaration: function(rawAttributeName, arrayOfAttrSpecs, target) {
                var translatedAttributeName = helpers.resolveCrossApplicantNames([rawAttributeName], applicantType)[0];
                var translatedArrayOfAttrSpec = [];
                target[translatedAttributeName] = translatedArrayOfAttrSpec;
                parsers.processArrayOfAttributeSpecs(arrayOfAttrSpecs, translatedArrayOfAttrSpec);
            },
            processArrayOfAttributeSpecs: function(originalArrayOfAttrSpecs, translatedArrayOfAttrSpecs) {
                if(! _.isArray(originalArrayOfAttrSpecs)) originalArrayOfAttrSpecs = [originalArrayOfAttrSpecs];
                _.each(originalArrayOfAttrSpecs, function(originalAttrSpec) {
                    var translatedAttrSpec = {};
                    translatedArrayOfAttrSpecs.push(translatedAttrSpec);
                    parsers.processAttributeSpec(originalAttrSpec, translatedAttrSpec);
                });
            },
            processAttributeSpec: function(originalAttrSpec, translatedAttrSpec) {
                parsers.moveEverythingOverExcept(originalAttrSpec, translatedAttrSpec, ["dependsOnCrossApplicantAttributes"]);
                parsers.processDependsOnCrossApplicantAttributes(originalAttrSpec.dependsOnCrossApplicantAttributes, translatedAttrSpec);
            },
            processDependsOnCrossApplicantAttributes: function(dependsOnCrossApplicantAttributesBlurb, translatedAttrSpec) {
                if(! dependsOnCrossApplicantAttributesBlurb) return;
                if(! _.isArray(dependsOnCrossApplicantAttributesBlurb)) throw new Error("dependsOnCrossApplicantAttributes must be an array.");
                var translatedList = helpers.resolveCrossApplicantNames(dependsOnCrossApplicantAttributesBlurb, applicantType);
                translatedAttrSpec.dependsOnAttributes = (translatedAttrSpec.dependsOnAttributes || []).concat(translatedList);
                translatedAttrSpec.proxyAliases = {};

                _.each(translatedList, function(resolvedAttrName, index) {
                    var aliasName = dependsOnCrossApplicantAttributesBlurb[index];
                    translatedAttrSpec.proxyAliases[resolvedAttrName] = aliasName;
                });
            },
            moveEverythingOverExcept: function(originalAttrSpec, translatedAttrSpec, listOfKeysToExclude) {
                _.each(originalAttrSpec, function(v, k) {
                    if(! _.contains(listOfKeysToExclude, k)) {
                        translatedAttrSpec[k] = v;
                    }
                });
            }
        };

        return parsers;
    }

//===============================
} (function() {
    return this;
}()));
//===============================
