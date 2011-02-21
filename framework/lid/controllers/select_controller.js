/* -*- Mode: javascript; tab-width: 4; indent-tabs-mode: nil; */

//--------MODULE HEADER----------
(function(GLOBAL, undefined) {
    //===============================
    function mixInChoiceAndVal(that, select, title) {
        var choices;
        var $select = $(select);

        that.valDisplay = function() {
            var val = that.val(),
                display = _(choices).detect(function(item) {
                return item.value == val;
            });

            return display.text;
        };

        that.val = function(newValue) {
            var tempVal, vals;

            if (newValue !== undefined) {
                
                if (newValue === "") newValue = null;
                vals = _(choices).pluck("value");

                if (_(vals).detect(function(item) {
                    return item == newValue;
                }) === undefined) {
                    throw new Error(newValue + " is not an available choice for " + title + ". Must specify a value that is within choices.");
                }
                select.val(newValue);
            }

            tempVal = select.val();
            if (tempVal === "") {
                tempVal = null;
            }
            return tempVal;
        };

        that.setChoices = function(newChoices) {
            var val = that.val();

            choices = _(newChoices).map(function(opt) {
                if (_(opt).isObject()) {
                    return {
                        value: opt.value,
                        text: (opt.text || opt.label)
                    };                    
                };
                return {
                    value: opt,
                    text: opt
                };
            });

            choices.unshift({
                value: null,
                text: "------ SELECT ------"
            });

            $select.children().remove();

            _(choices).each(function(item) {
                $select.append($("<option/>").attr("value", item.value === null ? "" : item.value + "").text(item.text));
            });

            that.val(val);
        };

    }

    function drawSelect($target, schema) {
        var select, htmlOptions = {
            'class': JmvcMachinery.Lid.SchemaTools.getClassName(schema)
        };

        JmvcMachinery.Lid.SchemaTools.updateHtmlOptions(htmlOptions, schema);

        $target.append("//jmvc_machinery/framework/lid/views/select.ejs", {
            fieldName: schema.name,
            htmlOptions: htmlOptions
        });

        select = $target.find('select');
        select.addClass("ui-corner-right");
        return select;
    }

    $.Controller.extend("JmvcMachinery.Lid.Controllers.Select", {
        init: function(el, schema) {
            var that = this,
                $el = $(el), 
                selectElement = drawSelect($el, schema);

            JmvcMachinery.Lid.Controllers.MixIns.ReadOnlyApi.mixIn(this, {
                inputElement: selectElement
            });
            JmvcMachinery.Lid.Controllers.MixIns.StandardFocusApi.mixIn(this, {
                inputElement: selectElement
            });

            mixInChoiceAndVal(this, selectElement, schema.title);

            if (_.isFunction(schema.options)) {
                this.setChoices(schema.options());
            } else {
                this.setChoices(schema.options);
            }
            
            this.mixIntoParentLid = function(parent){
              parent.setChoices = _(this.setChoices).bind(that);
            };
        }
    });

    //===============================
} (window, (function() {
    return;
} ())));
//===============================
