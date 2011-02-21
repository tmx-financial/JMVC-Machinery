/* -*- Mode: jasmine; tab-width: 4; indent-tabs-mode: nil; */

//--------MODULE HEADER----------
(function(GLOBAL, undefined) {
    "use strict";
    //===============================

steal.resources("//jmvc_machinery/framework/resources/dataStructures.js").then(function() {

    var newProxy = function(nameOfAttribute, realAttributeNames, attributeAliases) {
        if(! _.isString(nameOfAttribute)) throw new Error("You must provide the 'nameOfAttribute' parameter, and it must be a string.");
        if(! attributeAliases) attributeAliases = {};

        var modelInstance = undefined;

        var setModelInstance = function(newModelInstance) {
            if(! newModelInstance) throw new Error("You must provide a value for newModelInstance.");
            modelInstance = newModelInstance;
        };

        var clearModelInstance = function() {
            modelInstance = undefined;
        };

        var proxyContents = {};

        _.each(realAttributeNames, function(realAttrName) {
            var nameOnProxy = realAttrName;
            if(attributeAliases.hasOwnProperty(realAttrName)) nameOnProxy = attributeAliases[realAttrName];
            proxyContents[nameOnProxy] = function() {
                return modelInstance.attr(realAttrName);
            };
        });

        proxyContents.nameOfAttribute = function() {
            return nameOfAttribute;
        };

        proxyContents._privateInstanceMembers = function() {
            return modelInstance._privateInstanceMembers();
        };

        var publicInterface = {
            callWith : function(theConditionFunction, theModelInstance) {
                           setModelInstance(theModelInstance);
                           var returnValue = theConditionFunction.call(proxyContents);
                           clearModelInstance();
                           return returnValue;
                       }
        };

        return publicInterface;
    };

    GLOBAL.namespace("JmvcMachinery.Framework.Characteristics.Proxy").newProxy = newProxy;
});


    //===============================
} (function() {
    return this;
}(),
(function() {
    return;
} ())));
//===============================
