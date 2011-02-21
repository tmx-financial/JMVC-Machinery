/* -*- Mode: javascript; tab-width: 4; indent-tabs-mode: nil; */

//--------MODULE HEADER----------
(function(GLOBAL, undefined) {
    //===============================
    $.Controller.extend("JmvcMachinery.Lid.Controllers.Checkbox", {

    },
    {
        init: function(el, schema) {
            var that = this;
            var $el = $(el);
            this.$container = $el;

            var options = {
                name: schema.name,
                title: (schema.title || schema.name)
            };

            options.Layout = 'width: fixed; height: fixed';

            options = JmvcMachinery.Lid.SchemaTools.updateHtmlOptions(options, schema);

            options.Class = JmvcMachinery.Class.Add(JmvcMachinery.Lid.SchemaTools.getClassName(schema), options.Class);

            var viewModel = {
                fieldName: schema.name,
                options: options,
                type: 'checkbox'
            };

            var inputField;

            $el.append("//jmvc_machinery/framework/lid/views/checkbox.ejs", viewModel);
            inputField = $el.find('input');
            JmvcMachinery.Lid.Controllers.MixIns.ReadOnlyApi.mixIn(this, {
                inputElement: inputField
            });
            JmvcMachinery.Lid.Controllers.MixIns.StandardFocusApi.mixIn(this, {
                inputElement: inputField
            });

            var val = this.val = function(newValue) {
                //return unmasked
                var ret = undefined;
                if (newValue != undefined) {

                    if (newValue === true) {
                        inputField.attr('checked', 'checked');
                        inputField.attr('value', 'true');
                    } else {
                        inputField.removeAttr('checked');
                        inputField.attr('value', 'false');
                    }

                }
                ret = ((inputField.attr('checked')) ? true : false);

                return ret;
            };
            this.valDisplay = _(val).bind(this, undefined);
        }

    });

    //===============================
} (window, (function() {
    return;
} ())));
//===============================
