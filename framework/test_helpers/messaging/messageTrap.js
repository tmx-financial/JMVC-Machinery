/* -*- Mode: javascript; tab-width: 4; indent-tabs-mode: nil; */

//--------MODULE HEADER----------
(function(GLOBAL, S, undefined) {
//===============================

GLOBAL.namespace("TestHelpers.Messaging").MessageTrap = function() {
    var trappedMsgs = [];

    this.clear = function() {
        trappedMsgs = [];
    };

    function buildPredicate(criteria) {
        if(criteria === undefined) {
            return function() { return true; };
        }

        if(typeof(criteria) === "string") {
            return function(msg) { return msg.name === criteria; };
        }
        if(typeof(criteria) === "function") {
            return criteria;
        }

        throw "The criteria are not understood by the message trap";
    }

    this.get = function(criteria) {
        return _(trappedMsgs).select(buildPredicate(criteria));
    };

    this.getNames = function(criteria) {
        return _(trappedMsgs).chain()
            .select(buildPredicate(criteria))
            .pluck('name')
            .value();
    };

    this.count = function(criteria) {
        return _(trappedMsgs).select(buildPredicate(criteria)).length;
    };

    this.trapMessage = function(type, source, name, data) {
        trappedMsgs.push({
            type: type,
            source: source,
            name: name,
            data: data
        });
    };

    this.trapBusMessage = function(source, name, data) {
        this.trapMessage("Message", source, name, data);
    };

    this.trapJQueryEvent = function(evt, data, source) {
        var name = "";
        if(typeof(evt) === "string") {
            name = evt;
        }
        if(typeof(evt) === "object" && evt.type) {
            name = evt.type;
        }
        // if(typeof(evt) === "object" && evt.originalEvent && evt.originalEvent.type) {
        //     name = evt.type;
        // }
        this.trapMessage("jQuery Event", source, name, data);
    };

    this.listenToOpenAjax = function () {
        var that = this;

        var proxied = OpenAjax.hub.publish;

        spyOn(OpenAjax.hub, 'publish')
            .andCallFake(function(e,o) {
                that.trapBusMessage("Local", e, o);
                proxied.apply(OpenAjax.hub, arguments);
            });
    };

    // this.startTrappingRemoteBusMessages = function () {
    //     var that = this;
    //     
    //     var remoteHub = S.evaluate("OpenAjax.hub");
    //     
    //     var proxied = remoteHub.publish;
    //     
    //     spyOn(remoteHub, "publish")
    //         .andCallFake(function(e,o) { 
    //             that.trapBusMessage("Remote", e, o); 
    //             //proxied.apply(remoteHub, arguments);
    //         });
    // };

    this.listenToJQuery = function() {
        var that = this;

        var proxied = jQuery.event.trigger;

        spyOn(jQuery.event, "trigger")
            .andCallFake(function(evt, data, src) {
                that.trapJQueryEvent(evt, data, src);
                proxied.apply(jQuery.event, arguments);
            });
    };

    // this.startTrappingRemoteEvents = function() {
    //     var that = this;
    //     
    //     var remoteJQueryEventHelper = S.evaluate("jQuery.event");
    //     
    //     var proxied = remoteJQueryEventHelper.trigger;
    //     
    //     spyOn(remoteJQueryEventHelper, "trigger")
    //         .andCallFake(function(evt, data, src) {
    //             that.trapJQueryEvent(evt, data, src);
    //             //proxied.apply(remoteJQueryEventHelper, arguments);
    //         });
    // };

    this.listenTo = function(target) {
        var that = this;
        var eventSource = null;

        if(target.bind) {
            eventSource = target;
        }
        else if(target.funcunit) {
            throw new Error("listening to remote jQuery events is not supported")
        }
        else {
            eventSource = jQuery(target);
        }

        return {
            andTrap : function(interestingEvents) {
                eventSource.bind(interestingEvents, function(eventName, eventData) {
                    that.trapJQueryEvent(eventName, eventData, eventSource);
                });
            }
        };
    };
};

//===============================
} (window, FuncUnit, (function() {
    return;
} ())));
//===============================
