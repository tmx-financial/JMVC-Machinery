/* -*- Mode: javascript; tab-width: 4; indent-tabs-mode: nil; */

//--------MODULE HEADER----------
(function(GLOBAL, undefined) {
//===============================

$.extend(GLOBAL.namespace("JmvcMachinery"),
{
    WebServerPath: '',

    Browser:
    {
        Chrome: false,
        IE: false,
        FireFox: false,
        Safari: false,
        Opera: false
    },

    Alert: function(Info) {
        if (typeof Info == 'string') {
            Info = {
                'Message': Info
            };
        }
        if (JmvcMachinery._NotificationHandler.length == 0) {
            alert(Info.Message);
        } else {
            for (var i = 0; i < JmvcMachinery._NotificationHandler.length; i++)
            JmvcMachinery._NotificationHandler[i](Info);
        }
    },

    _NotificationHandler: new Array(),
    NotificationHandler: function(Handler){
        JmvcMachinery._NotificationHandler.push(Handler);
    },

    Navigate: function(URL){
        JmvcMachinery.MasterPage.ActivityIndicator.Show();

        var lcURL = URL.toLowerCase();
        if (lcURL.indexOf('http://') == -1 && lcURL.indexOf('https://') == -1){
            if (URL.indexOf(JmvcMachinery.WebServerPath) == -1)
            URL = JmvcMachinery.WebServerPath + URL;
        }

        try{
            window.location = URL;
        } catch(Er)
        //IE throws Unspecified Error if the user cancels the Navigation
        {
            JmvcMachinery.EventLog.Add({
                Where: 'JmvcMachinery.Navigate',
                What: JmvcMachinery.Objects.toString(Er, '<br />')
            });
        }
    },

    Strings:
    {
        Format: function(String, data){
            var Ret = (String == undefined ? '': String);

            if (!_.isArray(data))
            data = [data];

            for (var i = 0; i < data.length; i++){
                var aFind = data[i].find.split('');
                for (var n = 0; n < aFind.length; n++)
                if (aFind[n].match(/[\[\\\^\$\.\|\?\*\+\(\)\{\}\]]/))
                aFind[n] = '\\' + aFind[n];
                Ret = Ret.replace(new RegExp(aFind.join(''), 'g'), data[i].replace);
            }
            return Ret;
        }

    },
    Class:
    {
        Check: function(ObjClass, ClassName){
            var wObjClass = ' ' + (ObjClass ? (ObjClass.className ? ObjClass.className: ObjClass) : '') + ' ';
            var wClassName = ' ' + (ClassName ? ClassName: '') + ' ';

            if (wObjClass.indexOf(wClassName) == -1)
            return false;
            else
            return true;
        },

        Remove: function(ObjClass, ClassName){
            if (ObjClass == undefined || ClassName == undefined)
            return ObjClass;

            var wObjClass = ' ' + (ObjClass ? (ObjClass.className ? ObjClass.className: ObjClass) : '') + ' ';
            var wClassName = ' ' + (ClassName ? ClassName: '') + ' ';

            var sFormat = []
            sFormat.push({
                find: wClassName,
                replace: ' '
            });

            var ret = _.trim(JmvcMachinery.Strings.Format(wObjClass, sFormat));
            
            if (ObjClass && ObjClass.className)
            ObjClass.className = ret;

            return ret;
        },

        Add: function(ObjClass, ClassName){
            var wObjClass = ' ' + (ObjClass ? (ObjClass.className ? ObjClass.className: ObjClass) : '') + ' ';
            if (!JmvcMachinery.Class.Check(ObjClass, ClassName)){
                wObjClass = ' ' + (wObjClass ? wObjClass: '');
                var wClassName = ' ' + (ClassName ? ClassName: '');

                wObjClass += wClassName;
            }

            var ret = _.trim(wObjClass);

            if (ObjClass && ObjClass.className)
            ObjClass.className = ret;

            return ret;
        },

        Replace: function(ObjClass, OldClassName, NewClassName){
            var wObjClass = ' ' + (ObjClass ? (ObjClass.className ? ObjClass.className: ObjClass) : '') + ' ';

            wObjClass = JmvcMachinery.Class.Remove(wObjClass, OldClassName);
            wObjClass = JmvcMachinery.Class.Add(wObjClass, NewClassName);

            if (ObjClass && ObjClass.className)
            ObjClass.className = wObjClass;

            return wObjClass;
        }
    },
    Objects:
    {
        toString: function(Obj, Sep){
            var sArray = new Array();

            function _AddParameters(depth, key, Obj){
                if (_.isNumber(key))
                key = '[' + key + ']';

                if (key.indexOf('_') == 0)
                return;

                var Spacer = '';
                for (var i = 0; i < depth; i++)
                Spacer += '.';

                if (Obj == undefined || Obj == null)
                sArray.push(Spacer + key + ' = undefined');
                else if (_.isFunction(Obj))
                sArray.push(Spacer + key + ' = function{}');
                else if (_.isHTMLElement(Obj))
                sArray.push(Spacer + key + ' = HTMLElement');
                else if (_.isBoolean(Obj))
                sArray.push(Spacer + key + ' = ' + (Obj ? 'true': 'false'));
                else if (_.isString(Obj))
                sArray.push(Spacer + key + ' = "' + Obj + '"');
                else if (_.isNumber(Obj))
                sArray.push(Spacer + key + ' = ' + Obj);
                else if (_.isArray(Obj)){
                    sArray.push(Spacer + key);
                    sArray.push(Spacer + '[');
                    for (var i = 0; i < Obj.length; i++){
                        try{
                            _AddParameters((depth + 1), i, Obj[i]);
                        } catch(Er){
                            }
                    }
                    sArray.push(Spacer + ']');
                } else if (_.isObject(Obj)){
                    sArray.push(Spacer + key);
                    sArray.push(Spacer + '{');
                    for (var i in Obj){
                        try{
                            _AddParameters((depth + 1), i, Obj[i]);
                        } catch(Er){
                            }
                    }
                    sArray.push(Spacer + '}');
                } else
                sArray.push(Spacer + key + ' = ' + Obj.toString());
            }

            try{
                _AddParameters(0, '', Obj);
            } catch(Er){
                }

            Sep = (!Sep ? '': Sep);
            return sArray.join(Sep) + Sep;
        },

        Match: function(Obj, Criteria){

            if (!_.isObject(Criteria)) return true;
            if (!_.isObject(Obj)) return false;

            var Ret = true;
            for (var k in Criteria){
                if (_.isFunction(Obj[k])){
                    var cFn = '';
                    if (_.isFunction(Criteria[k])){
                        cFn = Criteria[k].toString();
                    }
                    if (cFn != Obj[k].toString()){
                        Ret = false;
                        break;
                    }
                }
                else if (_.isObject(Obj[k])){
                    if (!JmvcMachinery.Objects.Match(Obj[k], Criteria[k])){
                        Ret = false;
                        break;
                    }
                }
                else if (Criteria[k] != Obj[k]){
                    Ret = false;
                    break;
                }
            }

            return Ret;
        },

        clone: function(obj){
            if (obj == undefined) return undefined;

            if (_.isArray(obj))
            return obj.splice(0);

            var rtn = new Object();

            for (var i in obj){
                if (obj[i] == undefined){
                    rtn[i] = undefined;
                }
                else if (_.isObject(obj[i]) || _.isArray(obj[i])){
                    rtn[i] = JmvcMachinery.Objects.clone(obj[i]);
                }
                else{
                    rtn[i] = obj[i];
                }
            }

            return rtn;
        }
    },
   
    Events:
    {
        Add: function(El, eventName, fn){
            if (!fn)
            return;

            var HandleName = 'Events_eventName_';
            var Enum = 0;

            while (El[HandleName + Enum])
            Enum++;

            HandleName += Enum;

            if (typeof fn === "string")
            El[HandleName] = new Function(fn);
            else
            El[HandleName] = fn;

            if (El.addEventListener)
            //W3C Standard
            El.addEventListener(eventName,
            function(e){
                e = JmvcMachinery.Events.Get(e);
                El[HandleName](e);
            },
            false);

            else
            //IE
            El.attachEvent("on" + eventName,
            function(e){
                e = JmvcMachinery.Events.Get(e);
                El[HandleName](e);
            });

            return HandleName;
        },

        Get: function(e){
            if (window.event)
            e = window.event;

            if (!e.target)
            e.target = JmvcMachinery.Events._Source(e);

            return e;
        },

        Cancel: function(e){
            e = JmvcMachinery.Events.Get(e);

            if (e){
                e.cancelBubble = true;
                if (e.stopPropagation)
                e.stopPropagation();
                if (e.preventDefault)
                e.preventDefault();
            }
        },

        _Source: function(e){
            var T;
            if (e.target)
            T = e.target;
            else if (e.srcElement)
            T = e.srcElement;
            else if (e.currentTarget)
            T = e.currentTarget;

            /* Safari Bug : Allows Text Nodes to report as Target */
            if (T.nodeType == 3)
            T = T.parentNode;

            return T;
        }
    },

    EventLog:
    {
        Events: new Array(),
        Add: function(Event){
            if (!Event)
            return;
            if (!Event.EventDate)
            Event.EventDate = JmvcMachinery.Format.Date(undefined, 'HH:MM:ss.lll');
            JmvcMachinery.EventLog.Events.push(Event);
        },

        Clear: function(){
            JmvcMachinery.EventLog.Events = new Array();
        },

        toHTML: function(){
            var HTML = new Array();

            HTML.push('<div>');

            for (var i = 0; i < JmvcMachinery.EventLog.Events.length; i++)
            HTML.push(JmvcMachinery.Objects.toString(JmvcMachinery.EventLog.Events[i], '<br/>'));

            HTML.push('</div>');
            return HTML.join('');
        }

    },
    LocalStore:
    {
        Get: function(Key){
            var Value = undefined;
            if (_.isNumeric(Key))
            JmvcMachinery.Alert('LocalStore Key can not be numeric');

            if (window.localStorage)
            Value = window.localStorage.getItem(Key);
            else
            JmvcMachinery.EventLog.Add({
                where: 'JmvcMachinery.LocalStore',
                what: 'unable to connect to window.localStorage'
            });

            return Value;
        },

        Save: function(Key, Value){
            if (_.isNumeric(Key))
            JmvcMachinery.Alert('LocalStore Key can not be numeric');

            if (window.localStorage){
                window.localStorage.removeItem(Key);
                if (Value != undefined)
                window.localStorage.setItem(Key, Value);
            }
        },

        Remove: function(Key){
            if (_.isNumeric(Key))
            JmvcMachinery.Alert('LocalStore Key can not be numeric');

            window.localStorage.removeItem(Key);
        }

    }
   
});

////Determine Browser
GLOBAL.namespace("JmvcMachinery").Browser =
{
    Chrome: /chrome/.test(navigator.userAgent.toLowerCase()),
    Safari: /webkit/.test(navigator.userAgent.toLowerCase()) && !/chrome/.test(navigator.userAgent.toLowerCase()),
    Opera: /opera/.test(navigator.userAgent.toLowerCase()),
    IE: /msie/.test(navigator.userAgent.toLowerCase()) && !/opera/.test(navigator.userAgent.toLowerCase()),
    FireFox: /mozilla/.test(navigator.userAgent.toLowerCase()) && !/(compatible|webkit)/.test(navigator.userAgent.toLowerCase())
};


//===============================
} (window, (function() {
    return;
} ())));
//===============================
