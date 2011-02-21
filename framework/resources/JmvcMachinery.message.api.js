/* -*- Mode: javascript; tab-width: 4; indent-tabs-mode: nil; */

//--------MODULE HEADER----------
(function(GLOBAL, undefined) {
    //===============================
    
    function getClassNameAndIcon(levelKey)
    {
        var retObj = {itemClass :'',iconClass:''};  
        switch (levelKey) {
        case "error":
            retObj.itemClass = "ui-state-error";
            retObj.iconClass = "ui-icon-notice";
            break;
        case "warnings":
            retObj.itemClass = "ui-state-highlight";
            retObj.iconClass = "ui-icon-alert";
            break;
        case "information":
            retObj.itemClass = "ui-state-highlight";
            retObj.iconClass = "ui-icon-info";
            break;
        default:
            throw "Don't know how to draw a message for " + levelKey;
        }
        return retObj; 
    }
    GLOBAL.namespace("JmvcMachinery.Messages.Api").messageSummaryIcon = function(levelKey, levelCount) {
        var countSpan = "";

        var classNames = getClassNameAndIcon(levelKey);
                 
        if (levelCount) {
            countSpan = "<span>" + levelCount + "</span>";
        } else {
            countSpan = "&lrm;";
        };
        return _("<span class='%s ui-corner-all' ><span class='ui-icon %s' style='float: left;'></span>%s</span>").sprintf(classNames.itemClass, classNames.iconClass, countSpan);
    }
    
    GLOBAL.namespace("JmvcMachinery.Messages.Api").messageTemplate = function(levelKey, message) {
        var classNames = getClassNameAndIcon(levelKey);
        return _("<p class='%s'><span class='ui-icon %s' style='float: left; margin-right: 2px;'></span>%s</p>").sprintf(classNames.itemClass, classNames.iconClass, message);
    }
    
    
    GLOBAL.namespace("JmvcMachinery.Messages.Api").mixIn = function(target, redrawCallback) {
        var messageQueue = _([]);

        var defaultMessage = {
            'source': null,
            'level': null,
            'message': null
        };

        function buildMessageArrayFromValidator(messages) {
            var messageList = [];
            if (_.isArray(messages)) {
                _(messages).each(function(msg) {
                    if (_.isArray(msg)) {
                        _(msg).each(function(innerMessage) {
                            messageList.push(innerMessage);
                        });
                    } else {
                        messageList.push(msg);
                    }
                });
            } else if(messages != null) {
                messageList.push(messages);
            }
            return messageList;
        }


        function buildMessageArray(targetArray, criteria) {
            targetArray.splice(0, targetArray.length);

            messageQueue.each(function(item) {
                if (JmvcMachinery.Objects.Match(item, criteria)) {
                    targetArray.push(item);
                }
            });
        }



        function buildMessages(messages, defaultObject) {
            if (!_.isArray(messages)) {
                messages = [messages];
            }
            messages = _(messages);
            messages = messages.map(function(msg) {

                if (_.isString(msg)) {
                    msg = {
                        'message': msg
                    };
                }
                return _.extend(_.clone(defaultObject), msg);
            });

            return messages;
        }



        function messagesProperty() {
            var r = [];
            buildMessageArray(r);

            r.clearMessages = function(criteria, replacementMessages) {
                var that = this;
                var matches = [];
                var changed = false;
                var compareWithList = false;
                if (replacementMessages && replacementMessages.length > 0) {
                    replacementMessages = _(replacementMessages);
                    compareWithList = true;
                }

                for (var i = 0; i < that.length; i++) {
                    if (JmvcMachinery.Objects.Match(this[i], criteria) && (!compareWithList || (compareWithList && !replacementMessages.any(function(msg) {
                        return _.isEqual(that[i], msg);
                    })))) {
                        matches.push({
                            index: i
                        });
                    }
                }
                for (var i = matches.length - 1; i > -1; i--) {
                    //console.log(target.__proto__.Class.fullName + "|Remove: " + matches[i].index + ", " + messageQueue.toArray()[matches[i].index].message);
                    messageQueue.splice(matches[i].index, 1);
                    changed = true;
                  
                }
                return changed;
            }

            r.clear = function(criteria) {
                if (this.clearMessages(criteria))
                  this.refresh();
            };

            r.add = function(messages,refreshRequired) {
                var changed = (refreshRequired || false);
                messages = buildMessageArrayFromValidator(messages);
                messages = _(messages).select(function(msg) {
                    return !!msg.message;
                })
                messages = buildMessages(messages, defaultMessage);

                _(messages).each(function(msg) {
                    if (!messageQueue.any(function(existingMsg) {
                        return msg.message ===  existingMsg.message && msg.level ===  existingMsg.level && msg.source === existingMsg.source;
                    })) {
                        //console.log(target.__proto__.Class.fullName + "|Add (" + messageQueue.size() + "): "+ msg.message);
                        messageQueue.push(msg);
                        changed = true;
                    }
                });
                
                if(changed){
                    this.refresh();
                }
                return changed;
            },
            r.set = function(messages, criteria) {
                messages = buildMessageArrayFromValidator(messages);
                var refreshRequired = this.clearMessages(criteria, messages);
                this.add(messages,refreshRequired);
            },
            r.refresh = function() {
                buildMessageArray(this);
                if (redrawCallback) {
                    redrawCallback();
                }
                //if(messageQueue.size()) console.log(target.__proto__.Class.fullName + "|redrawCallback count : " + messageQueue.size());
            }
            return r;
        };



        function messagesByLevel(lvl) {
            var dE1 = {
                'level': lvl
            };

            var r = new Array();
            buildMessageArray(r, dE1);

            r.from = function(src) {
                var _dE1 = JmvcMachinery.Objects.clone(dE1);
                var dE2 = jQuery.extend(_dE1, {
                    'source': src
                });

                var rFrom = new Array();
                buildMessageArray(rFrom, dE2);

                rFrom.clearMessages = function(criteria, replacementMessages) {
                    criteria = jQuery.extend((criteria || {}), dE2);
                    return target.messages.clearMessages(criteria, buildMessages(replacementMessages, dE2));
                }

                rFrom.clear = function(criteria) {
                    this.clearMessages(criteria);
                    this.refresh();
                    r.refresh();
                };
                rFrom.add = function(messages,refreshRequired) {
                    var changed = (refreshRequired || false);
                    messages = buildMessageArrayFromValidator(messages);
                    changed = target.messages.add(buildMessages(messages, dE2),refreshRequired);

                    if(changed)
                    {
                      this.refresh();
                      r.refresh();
                    }
                    return changed;
                },
                rFrom.set = function(messages, criteria) {
                    messages = buildMessageArrayFromValidator(messages);
                    // if(messages && messages.length > 0)
                    // {
                    //   console.log(target.__proto__.Class.fullName + "|Set: " + messages[0].message);
                    // }
                    var refreshRequired = this.clearMessages(criteria, messages);
                    this.add(messages,refreshRequired);
                },
                rFrom.refresh = function() {
                    buildMessageArray(this, dE2);
                }
                return rFrom;
            };
            r.clearMessages = function(criteria, replacementMessages) {
                criteria = jQuery.extend((criteria || {}), dE1);
                return target.messages.clearMessages(criteria, buildMessages(replacementMessages, dE1));
            }
            r.clear = function(criteria) {
                if(this.clearMessages(criteria)){
                  this.refresh();
                }
            };
            r.add = function(messages,refreshRequired) {
                var changed =  (refreshRequired || false);
                messages = buildMessageArrayFromValidator(messages);
                changed = target.messages.add(buildMessages(messages, dE1),changed );
                if(changed){
                  this.refresh();
                }
                return changed;
            },
            r.set = function(messages, criteria) {
                messages = buildMessageArrayFromValidator(messages);
                var changed  = this.clearMessages(criteria, messages);
                this.add(messages,changed);
            },
            r.refresh = function() {
                buildMessageArray(this, dE1);
                redrawCallback();
            }
            return r;
        };

        target.messages = messagesProperty();
        target.errors = messagesByLevel('error');
        target.warnings = messagesByLevel('warnings');
        target.information = messagesByLevel('information');
    };

    //===============================
} (window, (function() {
    return;
} ())));
//===============================
