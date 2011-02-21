/* -*- Mode: javascript; tab-width: 4; indent-tabs-mode: nil; */

//--------MODULE HEADER----------
(function(GLOBAL, undefined) {
"use strict";
//===============================

namespace("JmvcMachinery.Lid").reshow = function(){
    if(JmvcMachinery.Lid.__lastFocused){
        JmvcMachinery.Lid.__lastFocused.showMe();
    }
};

//===============================
} (function() {
    return this;
}(),
(function() {
    return;
} ())));
//===============================
