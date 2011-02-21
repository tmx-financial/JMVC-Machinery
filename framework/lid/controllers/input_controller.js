/* -*- Mode: javascript; tab-width: 4; indent-tabs-mode: nil; */

//--------MODULE HEADER----------
 (function(GLOBAL, undefined){
    //===============================
    $.Controller.extend("JmvcMachinery.Lid.Controllers.Input", {

        },
    {
        init: function(el, schema){
            var that = this;
            var $el = $(el);

            this.$container = $el;

            var options = {
                name: schema.name,
                title: (schema.title || schema.name)
            };

            options = JmvcMachinery.Lid.SchemaTools.updateHtmlOptions(options, schema);

            options.Class = JmvcMachinery.Class.Add(JmvcMachinery.Lid.SchemaTools.getClassName(schema), options.Class);

            var viewModel = {
                fieldName: schema.name,
                options: options,
                type: 'text'
            };

            var inputField;

            $el.append("//jmvc_machinery/framework/lid/views/input.ejs", viewModel);
            inputField = $el.find('input');
            inputField.addClass("ui-corner-right");
            JmvcMachinery.Lid.Controllers.MixIns.ReadOnlyApi.mixIn(this, {inputElement: inputField});
            JmvcMachinery.Lid.Controllers.MixIns.StandardFocusApi.mixIn(this, {inputElement: inputField});

            var isValueNull = true;

            this.valDisplay = function(){
                return inputField.val();
            };

            var val = this.val = function(newValue){
                var retUnmask;
                var ret = undefined;
                var getterCall = false;
                if (newValue !== undefined){

                    if (newValue != undefined && newValue != null && newValue !== ""){
                        retUnmask = that.unmask(newValue);
                    }
                    if (retUnmask){
                        newValue = retUnmask;
                        var retmask = that.mask(newValue);
                        if (retmask){
                            newValue = retmask;
                        }
                    }
                    inputField.val(newValue);
                    isValueNull = newValue === null || newValue === "" ;
                }
                else
                {
                    getterCall = true;
                }

                ret = inputField.val();
                
                if (ret != "" && ret != undefined && ret != null && (getterCall  || !isValueNull )){ 
                    retUnmask = that.unmask(ret);
                    if (retUnmask){
                        ret = retUnmask;
                    }
                    isValueNull = false;
                }
    
                if(!getterCall && newValue != null && newValue != ret)
                { 
                    $(inputField).change();
                }
                if (isValueNull){
                    return null;
                } else {
                    return ret.toUpperCase();
                }

            };
            this._onFocus = function(){
                inputField.val(val());
            };
            this._blur = function(){
                that.val(val());
            };
        },

        "input focus": function($el, ev){
            this._lastValue = $el.val();
            this._onFocus();
        },
        "input blur": function($el, ev){
            this._blur();
            if (this._lastValue !== $el.val()) {
                $el.trigger("userchanged");  
            };
        }
    });
    //===============================
} (window, (function(){
    return;
} ())));
//===============================
