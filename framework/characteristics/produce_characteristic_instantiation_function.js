//--------MODULE HEADER----------
(function(GLOBAL, undefined) {
    "use strict";
    //===============================

    GLOBAL.namespace("JmvcMachinery.Framework.Characteristics").produceCharacteristicInstantiationFunction = function(characteristicName, characteristicType, characteristicDefinition) {
        "use strict";

        if(! _.isString(characteristicName)) throw new Error("You must pass a string for characteristicName");
        if(! characteristicType) throw new Error("You must pass a characteristicType");
        if(! characteristicDefinition) throw new Error("You must pass a characteristicDefinition");

        var instantiationFunction = function() {
            "use strict";

            var newCharacteristicInstance = {};
            var isInitialized = false;
            var verbList = undefined;

            newCharacteristicInstance.getDescription = function() { return "The Characteristic named '" + newCharacteristicInstance.getCharacteristicName() + "'"; };
            newCharacteristicInstance.getCharacteristicName = function() { return characteristicName; };
            newCharacteristicInstance.context = {};

            newCharacteristicInstance.init = function(options) {
                var optionsProvided = options ? _.keys(options) : [];
                if(isInitialized) throw new Error("This Characteristic is already initialized. You cannot initialize a Characteristic more than once.");

                if(characteristicType.requiresInitParameters) {
                    if(! options) throw new Error("This characteristic requires some initialization parameters, but you have not provided any.");
                    var missingInitParameters = _.filter(characteristicType.requiresInitParameters, function(param) { return ! _.contains(optionsProvided, param); });
                    if(missingInitParameters.length !== 0) throw new Error("This Characteristic requires you to provide the following parameters at init time: " + missingInitParameters.join(", "));
                    $.extend(newCharacteristicInstance.context, options);
                }

                if(characteristicType.init) characteristicType.init.call(newCharacteristicInstance, options);
                if(options) options.getCharacteristicName = function() { return characteristicName; };
                if(characteristicDefinition.init) characteristicDefinition.init.call(characteristicDefinition, options);

                validateCharacteristicDefinition(characteristicDefinition); 

                verbList = [];
                _.each(characteristicDefinition, function(verbBody, verbName) {
                    if(verbName !== "init") {
                        var fullVerb = {};
                        fullVerb[verbName] = verbBody;

                        if(verbName.indexOf("CrossApplicant") !== -1) {

                            var verbsFromCaVerb = JmvcMachinery.Framework.Characteristics.Application.CrossApplicant.translateCrossApplicantVerbToCorrespondingSetOfPrimitiveVerbs(fullVerb, options.whichApplicant);

                            _.each(verbsFromCaVerb, function(primitiveVerb) {
                                verbList.push(primitiveVerb);
                            });
                        } else {
                            verbList.push(fullVerb);
                        }
                    }
                });

                isInitialized = true;
            };

            newCharacteristicInstance.isInitialized = function() { return isInitialized; };

            newCharacteristicInstance.produceVerbList = function() {
                if(! newCharacteristicInstance.isInitialized()) throw new Error("You cannot obtain the verb list from a Characteristic until after it has been initialized.");
                if(verbList === undefined) throw new Error("There is a program logic error. This Characteristic *has* been initialized, but it still does not know its verb list. For a properly implemented Characteristic this should never happen.");
                return verbList;
            };

            function validateCharacteristicDefinition(characteristicDefinition) {
                var unknownActionsTheyCalled = _.reject(_.keys(characteristicDefinition), function(key) {
                    return characteristicType.isThisVerbAllowed(key);
                });

                if(unknownActionsTheyCalled.length > 0) throw new Error("This characteristic doesn't understand the following verbs in your definition: " + unknownActionsTheyCalled.join(", "));
            }

            return newCharacteristicInstance;
        };

        return instantiationFunction;
    };

    //===============================
} (function() {
    return this;
}(),
(function() {
    return;
} ())));
//===============================
