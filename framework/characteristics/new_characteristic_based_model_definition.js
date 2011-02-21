/* -*- Mode: javascript; tab-width: 4; indent-tabs-mode: nil; */

//--------MODULE HEADER----------
(function(GLOBAL) {
//===============================

    steal.resources("//jmvc_machinery/framework/resources/dataStructures.js").then(function() {

        var stringSet = JmvcMachinery.stringSet;

        var CharacteristicBasedModelDefinition = function() {
            var thisAppDefinition = this;
            if( ! (this instanceof CharacteristicBasedModelDefinition)) return new CharacteristicBasedModelDefinition();

            var primaryAttributes = stringSet(), characteristicList = [];

            this.includePrimaryAttributes = function() {
                var attributes = (arguments.length === 1 && _(arguments[0]).isArray()) ? arguments[0] : _.toArray(arguments);
                _.each(attributes, function(attribute, index) {
                    if(! _.isString(attribute)) throw new Error("The values you pass to this method must be strings, but item number " + index + " is not a string.");
                    JmvcMachinery.Framework.Characteristics.attributeUniverse().assertHasAttribute(attribute);
                    primaryAttributes.add(attribute);
                });
            };

            this.includeCharacteristics = function(namespace) {
                if( _.isString(namespace)) throw new Error("The first parameter must not be a string. Rather, it must be the namespace object where the included Characteristics live.");
                if( ! namespace) throw new Error("The first parameter must be the namespace object where the included Characteristics live.");

                var array = _.toArray(arguments).slice(1);

                for(var nextIndex=0; nextIndex < array.length; nextIndex++) {
                    var characteristicName = array[nextIndex], possibleArgs = array[nextIndex + 1], areThereArgsForThisCharacteristic = ! _.isString(possibleArgs),
                        instantiatorName = "instantiate" + $.String.capitalize(characteristicName) + "Characteristic",
                        instantiatorFunction = namespace[instantiatorName];

                    if(! instantiatorFunction) throw new Error("There is no instantiator function for this Characteristic. Check for typos and make sure the Characteristic has been loaded. Expected to find the instantiator function " + instantiatorName  + " in the namespace object you provided.");
                    var newCharacteristicInstance = instantiatorFunction();

                    var characteristicInitilizationArg = areThereArgsForThisCharacteristic ?  possibleArgs : undefined;
                    newCharacteristicInstance.init.call(newCharacteristicInstance, characteristicInitilizationArg);

                    characteristicList.push(newCharacteristicInstance);

                    if(areThereArgsForThisCharacteristic) nextIndex++;
                }
            };

            this.clonePrimaryAttributeList = function() {
                return primaryAttributes.items();
            };

            this.cloneCharacteristicList = function() {
                return _.clone(characteristicList);
            };

            return this;
        };

        var newCharacteristicBasedModelDefinition = function() {
            return new CharacteristicBasedModelDefinition();
        };

        GLOBAL.namespace("JmvcMachinery.Framework.Characteristics").newCharacteristicBasedModelDefinition = newCharacteristicBasedModelDefinition;

    });
//===============================
} (window, (function() {
    return;
} ())));
//===============================
