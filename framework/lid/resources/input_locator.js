/* -*- Mode: javascript; tab-width: 4; indent-tabs-mode: nil; */

//--------MODULE HEADER----------
(function(GLOBAL, undefined) {
    //===============================
    $.Class.extend("JmvcMachinery.Lid.InputLocator",
    //Static
    {
        hookup: function(el, schema) {
            var builder;
            el = $(el);

            builder = function() {
                switch (schema.type.toLowerCase()) {
                case "boolean":
                    return el.jmvc_machinery_lid_checkbox(schema);
                case "number":
                case "integer":
                    if (schema.options) {
                        return el.jmvc_machinery_lid_select(schema);
                    } else {
                        return el.jmvc_machinery_lid_number(schema);
                    }
                case "string":

                    switch (schema.format) {
                    case "ssn":
                        return el.jmvc_machinery_lid_ssn(schema);
                    }

                    if (schema.options) {
                        return el.jmvc_machinery_lid_select(schema);
                    } else if (schema.lines && schema.lines > 1) {
                        return el.jmvc_machinery_lid_textarea(schema);
                    } else {
                        return el.jmvc_machinery_lid_string(schema);
                    }

                case "date":
                    return el.jmvc_machinery_lid_datepicker(schema);
                default:
                    throw "Unknown Schema Type: " + schema.type + " for " + schema.name;
                }
            };

            return _(builder().controllers()).last();
        }
    },
    //Prototype
    {

    });

    //===============================
} (window, (function() {
    return;
} ())));
//===============================
