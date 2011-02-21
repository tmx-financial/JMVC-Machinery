/* -*- Mode: javascript; tab-width: 4; indent-tabs-mode: nil; */

//--------MODULE HEADER----------
(function(GLOBAL, undefined) {
    //===============================

    JmvcMachinery.Lid.Controllers.String.extend("JmvcMachinery.Lid.Controllers.Ssn", {
        "input keypress": function($el, e) {
            var inputstr = String.fromCharCode(e.which);
            if(e.which != 8 && e.which != 0){
              if (!inputstr.match(/[\d]/) || $el.val().length >= 9) {
                  e.preventDefault();
              }
            }
        }
    });

    //===============================
} (window, (function() {
    return;
} ())));
//===============================
