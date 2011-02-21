/* -*- Mode: javascript; tab-width: 4; indent-tabs-mode: nil; */

//--------MODULE HEADER----------
(function(GLOBAL, undefined) {
    //===============================
    JmvcMachinery.Lid.Controllers.Input.extend("JmvcMachinery.Lid.Controllers.String", {

    },
    {
        init: function(el, schema) {
            this._super(el, schema);

            this.mask = function(val) {
                var result = undefined; 
                result = schema.mask(val);
                return result;
            };
            this.unmask = function(val) {
                var result = undefined;
                result = schema.unmask(val);
                return result;
            };
        }
    });

    //===============================
} (window, (function() {
    return;
} ())));
//===============================
