/* -*- Mode: javascript; tab-width: 4; indent-tabs-mode: nil; */

//--------MODULE HEADER----------
(function(GLOBAL) {
    //===============================
    $.Controller.extend("JmvcMachinery.Lid.Controllers.Textarea", {

    },
    {
        init: function(el, schema) {
            var that = this;
            var $el = $(el);
            this.$container = $el;

            var options = {
                name: schema.name,
                title: (schema.title || schema.name),
                rows: schema.lines
            };

            options = JmvcMachinery.Lid.SchemaTools.updateHtmlOptions(options, schema);
            options.Class = JmvcMachinery.Class.Add(JmvcMachinery.Lid.SchemaTools.getClassName(schema), options.Class);

            var viewModel = {
                fieldName: schema.name,
                options: options,
                type: 'text'
            };

            var inputField;
            $el.append("//jmvc_machinery/framework/lid/views/text_area.ejs", viewModel);
            inputField = $el.find('textarea');
            inputField.addClass("ui-corner-right");
            JmvcMachinery.Lid.Controllers.MixIns.ReadOnlyApi.mixIn(this, {
                inputElement: inputField
            });
            JmvcMachinery.Lid.Controllers.MixIns.StandardFocusApi.mixIn(this, {
                inputElement: inputField
            });

            var val = this.val = function(newValue) {
                //return unmasked
                var ret;
                if (newValue !== undefined) {
                    inputField.val(newValue);
                }
                ret = inputField.val();
                return ret.toUpperCase();
            };
            this.valDisplay = _(val).bind(this, undefined);
        }
    });

    //===============================
} (window, (function() {
    return;
} ())));
//===============================
