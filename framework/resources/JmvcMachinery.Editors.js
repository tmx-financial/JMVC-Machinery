/* -*- Mode: javascript; tab-width: 4; indent-tabs-mode: nil; */

//--------MODULE HEADER----------
(function(GLOBAL, undefined) {
    //===============================
    GLOBAL.namespace("JmvcMachinery").Editors = {};

    /*
    These are the view helpers that become available only inside our "2-phase render" process that is triggered by $.Controller.prototype.lidView().
    THESE SHOULD NOT BE CALLED DIRECTLY!!
*/

    var theHelpers = makeHelpers();

    JmvcMachinery.Editors._dataAttributePrep = function(obj) {
        var result = {};
        
        _(obj).chain().keys().each(function(key) {
            if (/data-/.test(key)) {
                result[key] = obj[key];
            } else {
                result["data-" + key] = _(obj[key] + "").escapeHtml();                
            };
        });            

        return result;
    };

    JmvcMachinery.Editors._addLidHelpersToTarget = function(target) {
        if (!target) throw "You must pass a target.";
        $.extend(target, theHelpers);
    };

    JmvcMachinery.Editors._removeLidHelpersFromTarget = function(target) {
        var keys = $.scanMembers(theHelpers).own().keys();
        $.each(keys, function(i, key) {
            delete target[key];
        });
    };

    function makeHelpers() {
        var helpers = {
            basicLid: function(fieldName, attributes) {
                var result = [];

                attributes = JmvcMachinery.Editors._dataAttributePrep(attributes);

                result.push(this.tag('div', _(attributes).extend({
                    Class: 'lid_container',
                    name: fieldName
                })));

                result.push(this.tag_end('div'));

                return result.join('');
            }
        };
        
        helpers.EditorFor = helpers.basicLid;

        return helpers;
    }

    //===============================
} (window, (function() {
    return;
} ())));
//===============================
