/* -*- Mode: javascript; tab-width: 4; indent-tabs-mode: nil; */

//--------MODULE HEADER----------
(function(GLOBAL, undefined) {
//===============================

GLOBAL.namespace("JmvcMachinery.Lid.Controllers.MixIns").DelegatedInputMethods = GLOBAL.mixIn(function(inputController){
    
    var target = this,
        delegatedMethods = ["focus", "readOnly", "valDisplay"];
    
    _(delegatedMethods).each(function(method){
        target.produce(method, _(inputController[method]).bind(inputController));
    });
    
    target.produce("val", _(inputController.val).chain().bind(inputController).wrap(fixEmptyString).value());
    
    function fixEmptyString(func, v) {
        var val = func(v);
        if (val === "") {
            return null;
        };
        return val;
    }
});

//===============================
} (window, (function() {
    return;
} ())));
//===============================
    
