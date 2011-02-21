/* -*- Mode: javascript; tab-width: 4; indent-tabs-mode: nil; */

//--------MODULE HEADER----------
(function(GLOBAL) {
//===============================

/*
* Date Format 1.2.3
* (c) 2007-2009 Steven Levithan <stevenlevithan.com>
* MIT license
*
* Includes enhancements by Scott Trenda <scott.trenda.net>
* and Kris Kowal <cixar.com/~kris.kowal/>
*
* Accepts a date, a mask, or a date and a mask.
* Returns a formatted version of the given date.
* The date defaults to the current date/time.
* The mask defaults to dateFormat.masks.default.
*/

GLOBAL.namespace("JmvcMachinery").Format =
{
    //Predefined character definitions
    definitions: {
        '9': "[0-9]",
        'a': "[A-Za-z]",
        '*': "[A-Za-z0-9]"
    },
    maskedPlaceHolder: '_',
    unmaskedPlaceHolder: ' ',

    formats: {

        'phone':      {format: "(999) 999-9999",regEx: {unmask:/\d{10}/,mask:/\(([0-9]{3})\)[ \-]?([0-9]{3})\-([0-9]{4})/} },
        'phoneextn':  {format: "(999) 999-9999 X:999?99"},
        'ssn':        {format: "***-**-****", regEx: {unmask:/\d{9}/ ,mask:/\d{3}-\d{2}-\d{4}/}},
        'last4Ofssn': {format: "9999"},
        'zipcode':    {format: "99999?-9999", regEx:/^\d{5}-?(\d{4}|\s{4})?$/},
        'postal-code':{format: "99999?-9999", regEx:/^\d{5}-?(\d{4}|\s{4})?$/},
        'height':     {format: "999"},
        'weight':     {format: "9?99"},
        'year':       {format: "9999"},
        'bankruptcycasenumber': {format: "99-99999"},
        'mtcn':       {format: "9999999999", regex: /^(\d{10})?$/},
        'email':      {regEx: /([a-zA-Z0-9_\.\-'])+\@(([a-zA-Z0-9\-])+\.)+[a-zA-Z0-9]{2,4}/},
        'currency':   {format:{thousandsSeparator: ",",decimalPlaces: 2,prefix: "$"},regEx:{unmask:/^((\d+)(\.\d{0,2})?)?$/ ,mask:/^\$?(\d{1,3}(\,\d{3})*|(\d+))(\.\d{0,2})?$/}},
        'currency.0': {format:{thousandsSeparator: ",",decimalPlaces: 0,prefix: "$"},regEx:{unmask:/^(\d+)?$/,mask:/^\$?(\d{1,3}(\,\d{3})*|(\d+))$/}},
        'number':     {format:{thousandsSeparator: ",",decimalPlaces: 0,prefix: ""},regEx:{unmask:/^(\d+)?$/,mask:/^(\d{1,3}(\,\d{3})*|(\d+))$/ }},
        'number.1':   {format:{thousandsSeparator: ",",decimalPlaces: 1,prefix: ""},regEx:{unmask:/^((\d+)(\.\d{0,1})?)?$/ ,mask:/^(\d{1,3}(\,\d{3})*|(\d+))(\.\d{0,1})?$/}},
        'number.2':   {format:{thousandsSeparator: ",",decimalPlaces: 2,prefix: ""},regEx:{unmask:/^((\d+)(\.\d{0,2})?)?$/ ,mask:/^(\d{1,3}(\,\d{3})*|(\d+))(\.\d{0,2})?$/}},
        'number.3':   {format:{thousandsSeparator: ",",decimalPlaces: 3,prefix: ""},regEx:{unmask:/^((\d+)(\.\d{0,3})?)?$/ ,mask:/^(\d{1,3}(\,\d{3})*|(\d+))(\.\d{0,3})?$/}},
        'number.4':   {format:{thousandsSeparator: ",",decimalPlaces: 4,prefix: ""},regEx:{unmask:/^((\d+)(\.\d{0,4})?)?$/ ,mask:/^(\d{1,3}(\,\d{3})*|(\d+))(\.\d{0,4})?$/}},
        'number.5':   {format:{thousandsSeparator: ",",decimalPlaces: 5,prefix: ""},regEx:{unmask:/^((\d+)(\.\d{0,5})?)?$/ ,mask:/^(\d{1,3}(\,\d{3})*|(\d+))(\.\d{0,5})?$/}},
        'number.6':   {format:{thousandsSeparator: ",",decimalPlaces: 6,prefix: ""},regEx:{unmask:/^((\d+)(\.\d{0,6})?)?$/ ,mask:/^(\d{1,3}(\,\d{3})*|(\d+))(\.\d{0,6})?$/}},
        'percent':    {format:{thousandsSeparator: ",",decimalPlaces: 0,prefix: "",suffix: " %"},regEx:{unmask:/^(\d+)?$/,mask:/^(\d{1,3}(\,\d{3})*|(\d+))$/}},
        'percent.1':  {format:{thousandsSeparator: ",",decimalPlaces: 1,prefix: "",suffix: " %"},regEx:{unmask:/^((\d+)(\.\d{0,1})?)?$/,mask:/^(\d{1,3}(\,\d{3})*|(\d+))(\.\d{0,1})?(\s%)?$/}},
        'percent.2':  {format:{thousandsSeparator: ",",decimalPlaces: 2,prefix: "",suffix: " %"},regEx:{unmask:/^((\d+)(\.\d{0,2})?)?$/,mask:/^(\d{1,3}(\,\d{3})*|(\d+))(\.\d{0,2})?(\s%)?$/}},
        'percent.3':  {format:{thousandsSeparator: ",",decimalPlaces: 3,prefix: "",suffix: " %"},regEx:{unmask:/^((\d+)(\.\d{0,3})?)?$/,mask:/^(\d{1,3}(\,\d{3})*|(\d+))(\.\d{0,3})?(\s%)?$/}},
        'percent.4':  {format:{thousandsSeparator: ",",decimalPlaces: 4,prefix: "",suffix: " %"},regEx:{unmask:/^((\d+)(\.\d{0,4})?)?$/,mask:/^(\d{1,3}(\,\d{3})*|(\d+))(\.\d{0,4})?(\s%)?$/}},
        'percent.5':  {format:{thousandsSeparator: ",",decimalPlaces: 5,prefix: "",suffix: " %"},regEx:{unmask:/^((\d+)(\.\d{0,5})?)?$/,mask:/^(\d{1,3}(\,\d{3})*|(\d+))(\.\d{0,5})?(\s%)?$/}},
        'percent.6':  {format:{thousandsSeparator: ",",decimalPlaces: 6,prefix: "",suffix: " %"},regEx:{unmask:/^((\d+)(\.\d{0,6})?)?$/,mask:/^(\d{1,3}(\,\d{3})*|(\d+))(\.\d{0,6})?(\s%)?$/}},
        'integer':    {format:{thousandsSeparator: ",",decimalPlaces: 0,prefix: ""},regex:/^(\d+)?$/}
    },
    Date: function(date, mask, utc)
    {
        var masks = {
            "default": "ddd mmm dd yyyy HH:MM:ss",
            shortDate: "mm/dd/yyyy",
            mediumDate: "mmm d, yyyy",
            longDate: "mmmm d, yyyy",
            fullDate: "dddd, mmmm d, yyyy",
            shortTime: "h:MM TT",
            mediumTime: "h:MM:ss TT",
            longTime: "h:MM:ss TT Z",
            isoDate: "yyyy-mm-dd",
            isoTime: "HH:MM:ss",
            isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
            isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
        };

        var i18n = {
            dayNames:
            [
            "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
            "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
            ],
            monthNames:
            [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
            "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
            ]
        };
        var token = /d{1,4}|m{1,4}|yy(?:yy)?|l{1,3}|([HhMsTt])\1?|[loSZ]|"[^"]*"|'[^']*'/g,
        timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[\-+]\d{4})?)\b/g,
        timezoneClip = /[^\-+\dA-Z]/g,
        pad = function(val, len)
        {
            val = String(val);
            len = len || 2;
            while (val.length < len) {
                val = "0" + val;
            }
            return val;
        };

        // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
        if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date))
        {
            mask = date;
            date = undefined;
        }

        // Passing date through Date applies Date.parse, if necessary
        date = date ? new Date(date) : new Date;
        if (isNaN(date)) throw SyntaxError("invalid date");

        mask = String(masks[mask] || mask || masks["default"]);

        // Allow setting the utc argument via the mask
        if (mask.slice(0, 4) == "UTC:")
        {
            mask = mask.slice(4);
            utc = true;
        }

        var _ = utc ? "getUTC": "get",
        d = date[_ + "Date"](),
        D = date[_ + "Day"](),
        m = date[_ + "Month"](),
        y = date[_ + "FullYear"](),
        H = date[_ + "Hours"](),
        M = date[_ + "Minutes"](),
        s = date[_ + "Seconds"](),
        L = date[_ + "Milliseconds"](),
        o = utc ? 0: date.getTimezoneOffset(),
        flags = {
            d: d,
            dd: pad(d),
            ddd: i18n.dayNames[D],
            dddd: i18n.dayNames[D + 7],
            m: m + 1,
            mm: pad(m + 1),
            mmm: i18n.monthNames[m],
            mmmm: i18n.monthNames[m + 12],
            yy: String(y).slice(2),
            yyyy: y,
            h: H % 12 || 12,
            hh: pad(H % 12 || 12),
            H: H,
            HH: pad(H),
            M: M,
            MM: pad(M),
            s: s,
            ss: pad(s),
            l: Math.round(L / 100),
            ll: pad(Math.round(L / 10)),
            lll: L,
            t: H < 12 ? "a": "p",
            tt: H < 12 ? "am": "pm",
            T: H < 12 ? "A": "P",
            TT: H < 12 ? "AM": "PM",
            Z: utc ? "UTC": (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
            o: (o > 0 ? "-": "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
            S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0: (d % 100 - d % 10 != 10) * d % 10]
        };

        return mask.replace(token,
        function(str)
        {
            return str in flags ? flags[str] : str.slice(1, str.length - 1);
        });
    },
    Number: function(num, formatter)
    {
        num = num.toString().replace(/\$|\,|%|\s/g, '');

        if (isNaN(num))
        num = "0";

        var n = Number(num).toFixed(formatter.decimalPlaces ? formatter.decimalPlaces: 0);

        sign = (num == (num = Math.abs(num)));

        num = Math.floor(n);
        cents = n.toString().substring(n.toString().indexOf('.') + 1)


        for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
        num = num.substring(0, num.length - (4 * i + 3)) + formatter.thousandsSeparator + num.substring(num.length - (4 * i + 3));

        var returnValue = (((sign) ? '': '-') + formatter.prefix + num + (formatter.decimalPlaces > 0 ? '.' + cents.toString() : '')) + (formatter.suffix ? formatter.suffix: '');

        return returnValue;

    },
    UnformatNumber: function(num, formatter)
    {
        var regEx = new RegExp('\\' + formatter.prefix + '|' + '\\' + formatter.thousandsSeparator + (formatter.suffix ? '|' + formatter.suffix.replace(' ', '\\s') : ''), 'g');

        num = num.toString().replace(regEx, '');

        return num.replace(/^\s+|\s+$/, '');

    },
    getPlaceHolder: function(charArray, settings, masking){
        if (masking == undefined) masking = true;
        var retVal = [];
        var postionFound = false;
        for (var i = 0; i < charArray.length; i++)
        {
            var c = charArray[i];
            var ret = JmvcMachinery.Format.getPlaceHolderChar(i, c, settings, masking, postionFound)
            if (ret == '?'){
                postionFound = true;
                continue;
            }
            if (ret != undefined)
            retVal.push(ret);
        }
        return retVal;
    },
    getPlaceHolderChar: function(i, c, settings, masking, postionFound){
        if (masking == undefined) masking = true;
        if (c != '?')
        return JmvcMachinery.Format.definitions[c] ? (!postionFound ? settings.placeholder: JmvcMachinery.Format.unmaskedPlaceHolder) : (masking ? c: undefined);
        else
        return c;

    },
    String: function(val, mask)
    {
        if ((val === undefined) || (val === null)) {
            return "";
        }
        var buffer = JmvcMachinery.Format.getPlaceHolder(mask.split(""), {
            placeholder: JmvcMachinery.Format.maskedPlaceHolder
        });
        var tests = [];
        var valueQueue = {
            values: [],
            position: -1,
            length: function(){
                return this.values.length;
            },
            create: function(charArray){
                var that = this;
                $.each(charArray, function(index, value) {
                         that.add(value);
                });
            },
            add: function(c){
                this.values.push(c);
            },
            remove: function(){
                return this.values[++this.position];
            }
        };
        valueQueue.create(val.split(""));
        var maskChar = mask.split("");
        if (val != undefined && val != '' && mask)
        {
            var pos = 0;


              $.each(maskChar, function(i, c) {
                var c = maskChar[i];
                if (c == '?') return true;
                var def = JmvcMachinery.Format.definitions[c];
                var regEx = def ? new RegExp(def) : new RegExp('['+c+']');
                var bufChar;
                if (valueQueue.position == valueQueue.length()) return false;

                do
                {
                    bufChar = JmvcMachinery.Format.definitions[c] ? valueQueue.remove() : c;
                    if (valueQueue.position == valueQueue.length()) break;
                }
                while (!regEx.test(bufChar))
                if (regEx.test(bufChar))
                {
                    buffer[pos++] = bufChar;
                }
            });
            for(; pos < maskChar.length ; )
            {
                    buffer[pos++] = '';
            }
            return buffer.join("");
        }

    },
    UnformatString: function(val, mask)
    {
        var buffer = JmvcMachinery.Format.getPlaceHolder(mask.split(""), {
            placeholder: JmvcMachinery.Format.unmaskedPlaceHolder
        },
        false);

        var valueQueue = {
            values: new Array(),
            position: -1,
            length: function(){
                return this.values.length;
            },
             create: function(charArray){
                var that = this;
                $.each(charArray, function(index, value) {
                         that.add(value);
                });
            },
            add: function(c){
                this.values.push(c);
            },
            remove: function(){
                if (this.position < this.length()) return this.values[++this.position];
                else return undefined
            }
        }
        valueQueue.create(val.split(""));
        var maskChar = mask.split("");
        if (val && mask)
        {
            var pos = 0;
            $.each(maskChar, function(i, c) {

                if (c == '?') return true;
                if (valueQueue.position == valueQueue.length()) return false;

                var bufChar = valueQueue.remove();
                if ((JmvcMachinery.Format.definitions[c] || bufChar != c) && (bufChar != undefined) && (bufChar != JmvcMachinery.Format.unmaskedPlaceHolder))
                buffer[pos++] = bufChar;
            });
            return buffer.join("").replace(/^\s+|\s+$/, '');;
        }

    },
    mixInFormatter:function(schema){
      var that = this,
          format;

      if (schema.format !== undefined && schema.options === undefined)
      {
            format = this.formats[schema.format].format;

             switch (schema.type.toLowerCase()) {
                case "number":
                case "integer":
                    schema.mask = _.wrap(that.Number,function(formatter,val){ return formatter(val,format); });
                    schema.unmask =  _.wrap(that.UnformatNumber,function(formatter,val){ return formatter(val,format); });
                    break;
                case "string":
                    schema.mask = _.wrap(that.String,function(formatter,val){ return formatter(val,format); });
                    schema.unmask = _.wrap(that.UnformatString,function(formatter,val){ return formatter(val,format); });
                    break;
               }
      } else if (schema.options) {
        schema.mask = function(val) {
            var found =  _(schema.options).detect(function(item){ return item.value == val; });
            if (found !== undefined)
            {
                return found.label;
            } else {
                return "";
            }
        };

        schema.unmask = function(label) {
            var found = _(schema.options).detect(function(item){ return item.label == label; });
            if (found !== undefined)
            {
                return found.value;
            } else {
                return "";
            }
        };
      }

      if(!schema.mask || !schema.unmask){
        schema.mask =   function(val){return val;};
        schema.unmask = function(val){return val;};
      }

    }
};

//===============================
} (window, (function() {
    return;
} ())));
//===============================
