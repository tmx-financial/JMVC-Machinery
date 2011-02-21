/* -*- Mode: javascript; tab-width: 4; indent-tabs-mode: nil; */

//--------MODULE HEADER----------
(function(GLOBAL, undefined){
    //===============================
    function numberMixing(controller)
    {
      
      controller.val = _(controller.val).wrap(function(_super, newValue){
        if(newValue !== undefined && _.isNaN(newValue)){
            newValue = null;
        } else if(newValue !== undefined && _.isNaN(Number(newValue))){
            newValue = null;
        }  
        
        var ret = _super(newValue);
        if(ret == ""){ ret = null;}
        if(ret != null) {ret =Number(ret);}
           
        return ret;
      });
    }
    
    JmvcMachinery.Lid.Controllers.Input.extend("JmvcMachinery.Lid.Controllers.Number", {

        },
    {
        init: function(el, schema){
            this._super(el, schema);
            
            numberMixing(this);
            
            this.mask = function(val){
                
                var result = undefined;
               result = schema.mask(val);
                   
                return result;
            };
            this.unmask = function(val){
                var result = undefined;
                result = schema.unmask(val);
                return result;
            };



        },
        "input keypress": function($el, e)
        {
            var inputstr = String.fromCharCode(e.which);
            if (!inputstr.match(/[\d\.\$,-]/)){
                e.preventDefault();
            }
        }

    });
    
    //===============================
} (window, (function(){
    return;
} ())));
//===============================
