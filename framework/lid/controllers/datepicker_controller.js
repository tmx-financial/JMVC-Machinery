/* -*- Mode: javascript; tab-width: 4; indent-tabs-mode: nil; */

//--------MODULE HEADER----------
(function(GLOBAL, undefined) {
    //===============================
    $.Controller.extend("JmvcMachinery.Lid.Controllers.Datepicker", {

    },
    {
        init: function(el, schema) {
            var that = this;
            var $el = $(el);

            var viewModel = {
                fieldName: schema.name,
                htmlAttributes: {}
            };

            var inputField;
            $el.append("//jmvc_machinery/framework/lid/views/datepicker.ejs", viewModel);
            inputField = $el.find('input');
            inputField.addClass("ui-corner-right");
            JmvcMachinery.Lid.Controllers.MixIns.ReadOnlyApi.mixIn(this, {inputElement: inputField});
            JmvcMachinery.Lid.Controllers.MixIns.StandardFocusApi.mixIn(this, {inputElement: inputField});

            inputField.datepicker({
                changeMonth: true,
                changeYear: true,
                onClose: function(){
                    that.val(that.val());
                }
            });

            //HACK/FIX: Removing this class allows the datepicker to show up... Not sure why we need to do this
            $('#ui-datepicker-div').toggleClass("ui-helper-hidden-accessible", false);

            this.valDisplay = function() {
                return inputField.val();
            };

            var val = this.val = function(newValue) {
                var currentVal;
                
                if (newValue !== undefined){
                    inputField.datepicker('setDate', newValue);
                    inputField.datepicker('refresh');
                }
                
                return inputField.datepicker('getDate');
            };
            
        },
        "input keypress": function($el, e) {
            var inputstr = String.fromCharCode(e.which);
            var hasSelection;
            if (inputstr.match(/(\d|\/)/)){
                hasSelection = $el[0].selectionStart !== $el[0].selectionEnd;
                if ($el.val().length < 10 || hasSelection) {    
                    return;
                }   
            } 
            e.preventDefault();
        }
    });
    //===============================
} (window, (function() {
    return;
} ())));
//===============================
