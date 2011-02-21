/* -*- Mode: jasmine; tab-width: 4; indent-tabs-mode: nil; */

//--------MODULE HEADER----------
(function(GLOBAL, undefined) {
    "use strict";
    //===============================

    var attributeUniverseReference = null, wrapper;

    var setAttributeUniverse = function(attrUniverse) {
        if(! attrUniverse) throw new Error("You must pass in a reference to the attribute universe.");

        attributeUniverseReference = attrUniverse;
    };

    var attributeUniverse = function() {
        if(attributeUniverseReference === null) throw new Error("The framework must be initialized with an AttributeUniverse before you can run framework code that uses an AttributeUniverse. The initialization should be done by calling JmvcMachinery.Framework.Characteristics.setAttributeUniverse(universe).");

        wrapper = {
            getSchema: attributeUniverseReference.getSchema,
            hasAttribute: attributeUniverseReference.hasAttribute,
            assertHasAttribute: attributeUniverseReference.assertHasAttribute
        };

        return wrapper;
    };

    var ns = GLOBAL.namespace("JmvcMachinery.Framework.Characteristics");
    ns.setAttributeUniverse = setAttributeUniverse;
    ns.attributeUniverse = attributeUniverse;


    //===============================
} (function() {
    return this;
}(),
(function() {
    return;
} ())));
//===============================
