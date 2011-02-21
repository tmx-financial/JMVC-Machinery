/* -*- Mode: javascript; tab-width: 4; indent-tabs-mode: nil; */

//--------MODULE HEADER----------
(function(GLOBAL, undefined) {
//===============================

GLOBAL.namespace("JmvcMachinery.Lid.Controllers.MixIns").ReadOnlyApi = GLOBAL.mixIn(function(inputElement){
    this.produce("readOnly", function(v){
      if (v !== undefined) {
          inputElement.toggleClass("ui-state-disabled", !!v);
          inputElement.attr('disabled', !!v);
      };  
      return !!inputElement.attr('disabled');
    });
});

//===============================
} (window, (function() {
    return;
} ())));
//===============================
