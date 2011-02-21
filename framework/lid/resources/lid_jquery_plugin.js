/* -*- Mode: javascript; tab-width: 4; indent-tabs-mode: nil; */

//--------MODULE HEADER----------
(function(GLOBAL, undefined) {
//===============================

$.extend({
    lid: function(el)
    {
        var ret = undefined;
        var wEl = '';
        if (_.isHTMLElement(el))
        {
            wEl = el;
        }
        else if (el && el.length > 0 && _.isHTMLElement(el[0]))
        {
            wEl = el[0];
        }

        if (JmvcMachinery.Class.Check(wEl, '.jmvc_machinery_lid_lid')){
            ret = $(wEl).controllers(JmvcMachinery.Lid.Controllers.LidController)[0];
        }
        else if (_.isHTMLElement(wEl))
        {
            ret = $(wEl).parents('.jmvc_machinery_lid_lid:first').controllers(JmvcMachinery.Lid.Controllers.LidController)[0];
        }

        return ret;
    }
});

$.fn.extend({
    lid: function(name)
    {
        if (name !== undefined) {
            if (!_.isString(name)) throw "[name] must be a String or undefined";            
        }

        var items = [];
        this.find('.jmvc_machinery_lid_lid').each(function()
        {
            var item = $(this).controllers(JmvcMachinery.Lid.Controllers.LidController)[0];
            if (item && (item.name() === name || name === undefined))
            {
                items.push(item);
            }
        });

        /*find a containing lid if no children were found*/
        if (items.length === 0)
        {
            var item = jQuery.lid(this);
            if (item && item.name() === name)
            {
                items.push(item);
            }
        }

        items.each = function(fn)
        {
            $.each(this, fn);
        };

        return items;
    }
});

//===============================
} (window, (function() {
    return;
} ())));
//===============================
