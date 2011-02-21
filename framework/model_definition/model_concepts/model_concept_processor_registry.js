/* -*- Mode: jasmine; tab-width: 4; indent-tabs-mode: nil; */

//--------MODULE HEADER----------
(function(GLOBAL, undefined) {
    "use strict";
    //===============================
    var n = GLOBAL.namespace("JmvcMachinery.Framework.ModelDefinition.ModelConcepts.ModelConceptProcessors");

    firstMakeItPossibleToInstantiateNewInstancesOfTheModelConceptProcessorRegistry();
    thenUseThatCapabilityToCreateAPublicRegistryInTheModelConceptProcessorsNameSpace();

    function firstMakeItPossibleToInstantiateNewInstancesOfTheModelConceptProcessorRegistry() {
        var newModelConceptProcessorRegistry = function() {
            var conceptProcessors = {};

            return {
                registerConceptProcessor : function(conceptName, instantiator) {
                    if(conceptProcessors.hasOwnProperty(conceptName)) throw new Error("The ModelConceptProcessor for the concept named '" + conceptName + "' already exists.");
                    if(! _.isFunction(instantiator)) throw new Error("The value you pass for 'instantiator' must be a function. It should return a new instance of your processor whenever called.");
                    conceptProcessors[conceptName] = instantiator;
                },

                newProcessorFor : function(conceptName, modelDefinition) {
                    if(! conceptName) throw new Error("You must pass a concept name!");
                    if(! conceptProcessors.hasOwnProperty(conceptName)) throw new Error("There is no known concept called '" + conceptName + "'.");
                    if(! modelDefinition) throw new Error("You must pass in a modelDefinition, which this verb processor will use to write its non-custom consequences to.");
                    return (conceptProcessors[conceptName](modelDefinition));
                },

                hasVerb: function(verbName) {
                    if(! verbName) throw new Error("You must pass a verb name.");
                    return conceptProcessors.hasOwnProperty(verbName);
                }
            };
        };

        n.newModelConceptProcessorRegistry = newModelConceptProcessorRegistry;
    }

    function thenUseThatCapabilityToCreateAPublicRegistryInTheModelConceptProcessorsNameSpace() {
        var publicRegistry = n.newModelConceptProcessorRegistry();
        $.extend(n, publicRegistry);
    }

    //===============================
} (function() {
    return this;
}(),
(function() {
    return;
} ())));
//===============================
