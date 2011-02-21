/* -*- Mode: javascript; tab-width: 4; indent-tabs-mode: nil; */

//--------MODULE HEADER----------
(function(GLOBAL, undefined) {
//===============================

function toggleFocusGroupFor(el, toggle) {
    var focusGroup = el.closest("div.focus_group");
    
    if (focusGroup) {
        $("div.focus_group").toggleClass("ui-state-highlight", false);
        focusGroup.toggleClass("ui-state-highlight", toggle);
    };
}

jQuery.Controller.extend('JmvcMachinery.Framework.Controllers.FocusGroup', {
    "div.focus_group focusin" : function(el) {
        toggleFocusGroupFor(el, true);
    },
    "div.focus_group focusout": function(el) {
        toggleFocusGroupFor(el, false);
    },
    "input[type=checkbox] mousedown": function(el) {
       toggleFocusGroupFor(el, true);
    }
});

//===============================
} (window, (function() {
	return;
} ())));
//===============================
