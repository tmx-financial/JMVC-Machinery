/* -*- Mode: javascript; tab-width: 4; indent-tabs-mode: nil; */

//--------MODULE HEADER----------
(function(GLOBAL, undefined) {
//===============================

GLOBAL.namespace("JmvcMachinery.Lid.Controllers.MixIns").StandardFocusApi = GLOBAL.mixIn(function(inputElement){
    inputElement = $(inputElement);
    inputElement.bind("focusin", function(){
        inputElement.trigger("lidfocused");
    });
    this.produce("focus", function(highlight){
      inputElement.focus();
      inputElement.trigger("focusin");
      if (highlight) {
          inputElement.effect("highlight", {}, 2000);
      };
    });
});

//===============================
} (window, (function() {
    return;
} ())));
//===============================
