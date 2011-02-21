/* -*- Mode: javascript; tab-width: 4; indent-tabs-mode: nil; */

//--------MODULE HEADER----------
(function(GLOBAL, $, undefined) {
    //===============================
    /* -*- Mode: javascript; tab-width: 4; indent-tabs-mode: nil; */

    jQuery.Controller.extend('JmvcMachinery.Framework.Controllers.Menu',
    /*Static*/
    {

    },

    /*ProtoType*/
    {
        init: function(el, menuView, menuOptions) {
            var $el = this.$container = $(el);

            $el.toggleClass('ui-widget-header', true).toggleClass("jmvc-machinery-menu-marker", true);

            $el.html(menuView, {});

            $el.menubar(menuOptions);
        }
    });

    //===============================
} (window, jQuery, (function() {
    return;
} ())));
//===============================
