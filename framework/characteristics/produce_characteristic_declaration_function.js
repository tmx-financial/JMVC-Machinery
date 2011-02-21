//--------MODULE HEADER----------
var x = 42;

(function(GLOBAL, undefined) {
    "use strict";
    //===============================

    GLOBAL.namespace("JmvcMachinery.Framework.Characteristics").produceCharacteristicDeclarationFunction = function(characteristicTypeName, characteristicTypeDefinition) {

        var declarationFunction = function(characteristicNamespace, characteristicName, characteristicDefinition) {
            if(! characteristicNamespace) throw new Error("The first param must be the namespace into which you want the new Characteristic to go.");
            if(! characteristicName) throw new Error("You must pass a characteristicName for the Characteristic.");
            if(! characteristicDefinition) throw new Error("You must pass a characteristicDefinition");

            if(characteristicDefinition.hasOwnProperty("init")) {
                if(! _.isFunction(characteristicDefinition.init)) throw new Error("If your characteristicDefinition includes 'init', then 'init' must be a function.");
            }

            var instantiatorName = "instantiate" + $.String.capitalize(characteristicName) + "Characteristic";

            function isCharacteristicAlreadyDeclared() {
                return ! (characteristicNamespace[instantiatorName] === undefined);
            }

            if(isCharacteristicAlreadyDeclared()){
                throw new Error("A Characteristic named " + characteristicName + " has already been declared.");
            }

            if(! characteristicDefinition) throw new Error("You must pass a characteristicDefinition for the characteristic.");

            characteristicNamespace[instantiatorName] = JmvcMachinery.Framework.Characteristics.produceCharacteristicInstantiationFunction(characteristicName, characteristicTypeDefinition, characteristicDefinition);

            return characteristicNamespace[instantiatorName];
        };

        return declarationFunction;
    };

    //===============================
} (function() {
    return this;
}(),
(function() {
    return;
} ())));
//===============================
