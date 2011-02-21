/* -*- Mode: jasmine; tab-width: 4; indent-tabs-mode: nil; */

//--------MODULE HEADER----------
(function(GLOBAL, undefined) {
    "use strict";
    //===============================

steal.resources("//jmvc_machinery/framework/characteristics/attribute_universe_reference.js", 
    "//jmvc_machinery/framework/test/jasmine/fake_attribute_universe.js").then(function() {

    JmvcMachinery.Framework.Characteristics.setAttributeUniverse(JmvcMachinery.Framework.FakeAttributeUniverse);

});


    //===============================
} (function() {
    return this;
}(),
(function() {
    return;
} ())));
//===============================
