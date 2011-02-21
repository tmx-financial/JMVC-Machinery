/* -*- Mode: javascript; tab-width: 4; indent-tabs-mode: nil; */

//--------MODULE HEADER----------
(function(GLOBAL, undefined) {
    //===============================
    $.Class.extend("JmvcMachinery.Lid.SchemaTools", {
        getClassName: function(schema) {
            schema = (schema || {});
            var type = (schema.type || 'string').toLowerCase();
            var format = ' ' + (schema.format || '') + ' ';
            var Ret = '';

            switch (type) {
            case 'num':
            case 'number':
                Ret = JmvcMachinery.Class.Add(Ret, 'JmvcMachinery-Number');
                break;
            case 'bool':
            case 'boolean':
                break;
            case 'date':
                break;
            case 'str':
            case 'string':
            default:
                break;
            }

            if (_.readBoolean(schema.required)) Ret = JmvcMachinery.Class.Add(Ret, 'Field-Required');

            return Ret;
        },

        updateHtmlOptions: function(options, schema) {
            schema = (schema || {});
            var type = (schema.type || 'string').toLowerCase();

            if (schema.readonly || schema.ReadOnly || schema.readOnly || schema.READONLY) {
                options.disabled = 'disabled';
            }

            return options;
        }
    },
    {
        //No Instance
    });

    //===============================
} (window, (function() {
    return;
} ())));
//===============================
