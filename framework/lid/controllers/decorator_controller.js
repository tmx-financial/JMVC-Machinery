/* -*- Mode: javascript; tab-width: 4; indent-tabs-mode: nil; */

//--------MODULE HEADER----------
(function(GLOBAL, undefined) {
    //===============================

    function refreshMessageDisplay($container, messages, parent) {
        var levelcount = {},
            levelKey, messageList = '',
            api, itemClass;

        _(messages).each(function(msg) {
            levelKey = msg.level.toString().toLowerCase();

            if (!levelcount[levelKey]) {
                levelcount[levelKey] = {
                    count: 1,
                    messageList: JmvcMachinery.Messages.Api.messageTemplate(levelKey,msg.message)
                };
            } else {
                levelcount[levelKey].count += 1;
                levelcount[levelKey].messageList += messageListItem(msg.message, levelKey);
            }
        });

        _(_(levelcount).keys()).each(function(key) {
            messageList += levelcount[key].messageList;
        });

        if(parent.tooltipCreate)
        {
                api = $(parent.tooltip).qtip("api");
                if (messageList != '') {
                    api.updateContent(messageList);
                } else{
                    api.destroy();
                    parent.tooltipCreate = false;
                }
                
        }
        else if (messageList != ''){
                parent.tooltip = parent.$container.qtip({
                    content: messageList,
                    position: { target:'mouse', corner: { target: 'bottomRight', tooltip: 'topLeft'}},
                    show: 'mouseover', hide: 'mouseout', style: { name: 'themeroller'}
                });
                parent.tooltipCreate = true;
        }

    };

    $.Controller.extend("JmvcMachinery.Lid.Controllers.DecoratorController", {

    },
    {
        init: function(el, name) {
            var $el = $(el);
            this.$container = $el;
            return this;
        },
        messages: undefined,
        decorateCallback: function(parent) {
            var that = this;
            return function() {
                that.$container.empty();
                that.$container.show();
                that.$container.append("<span class='ui-widget' />");
                var target = that.$container.children(':first');
                _(parent.messages).chain().pluck("level").unique().sort().each(function(level) {
                    target.append(JmvcMachinery.Messages.Api.messageSummaryIcon(level));
                });
                target.append("&nbsp;"); //HACK: There needs to be a character in this span to get it to layout correctly... Feel free to fix this!
                refreshMessageDisplay(that.$container, parent.messages, parent);
            };
        }
    });

    //===============================
} (window, (function() {
    return;
} ())));
//===============================
