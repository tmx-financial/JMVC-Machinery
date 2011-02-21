/* -*- Mode: javascript; tab-width: 4; indent-tabs-mode: nil; */

//--------MODULE HEADER----------
(function(GLOBAL, undefined) {
//===============================

JmvcMachinery.Framework.Controllers.Menu.extend("JmvcMachinery.Framework.Controllers.MainMenu",{
    init: function(el){
        this._super(el, "//jmvc_machinery/framework/views/main_menu.ejs");
        this.$container.toggleClass("ui-widget-header", false);
    },
    
    "button[name=new_application] click": function(){
        alert("New Application - Clicked");
    }
});

//===============================
} (window, (function() {
    return;
} ())));
//===============================
