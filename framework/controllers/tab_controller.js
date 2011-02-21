/* -*- Mode: javascript; tab-width: 4; indent-tabs-mode: nil; */

//--------MODULE HEADER----------
(function(GLOBAL) {
    //===============================
    $.Controller.extend('JmvcMachinery.Framework.Controllers.Tab', {

    },
    {
        init: function(el) {
            this.container = $(el);

            this.container.html("<ul/>");
            this.container.tabs();
        },
        addTab: function(spec) {
            var label,
                tabId = "#tabs-" + _.uniqueId(),
                tab;

            if (_.isString(spec)) {
                label = spec;
            } else {
               label = spec.text || spec.Text;
            }

            this.container.tabs('add', tabId, label);
            tab = this.container.find('#' + tabId);
            tab.addClass("ui-helper-clearfix");
            return tab;
        },
        ".ui-tabs-panel showme" : function(el, evt){
            this.container.tabs("select", el[0].id);
        }

    });

    //===============================
} (window, (function() {
    return;
} ())));
//===============================
