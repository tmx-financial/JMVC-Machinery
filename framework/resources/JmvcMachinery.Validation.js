/* -*- Mode: javascript; tab-width: 4; indent-tabs-mode: nil; */

//--------MODULE HEADER----------
(function(GLOBAL, undefined) {
//===============================

GLOBAL.namespace("JmvcMachinery").Validation = {

    dateFormat: function(date) {
        var dy, dm, dd, ys, ms, ds, rtn;
        var da = new Date(date);
        // Create a Date Object set to the last modifed date
        dy = da.getFullYear();
        // Get full year (as opposed to last two digits only)
        dm = da.getMonth() + 1;
        // Get month and correct it (getMonth() returns 0 to 11)
        dd = da.getDate();
        // Get date within month
        if (dy < 1970) dy = dy + 100;
        // We still have to fix the millennium bug
        ys = new String(dy);
        // Convert year, month and date to strings
        ms = new String(dm);
        ds = new String(dd);
        if (ms.length == 1) ms = "0" + ms;
        // Add leading zeros to month and date if required
        if (ds.length == 1) ds = "0" + ds;
        rtn = ms + "/" + ds + "/" + ys;
        // Combine year, month and date in ISO format
        return rtn;
        // return the result
    },

    Validate: function(value, name, schema, schemaId) {
          
        var validationResults = new Object();

        validationResults.isValid = true;
        validationResults.messages = new Array();

        if (JmvcMachinery.SchemaHelper.isSchemaHasRequired(schema)) JmvcMachinery.Validation.IsRequired(value, name, schema, schemaId, validationResults);
        if (JmvcMachinery.SchemaHelper.isSchemaHasMaximum(schema)) JmvcMachinery.Validation.IsMaximum(value, name, schema, schemaId, validationResults);
        if (JmvcMachinery.SchemaHelper.isSchemaHasMinimum(schema)) JmvcMachinery.Validation.IsMinimum(value, name, schema, schemaId, validationResults);
        if (JmvcMachinery.SchemaHelper.isSchemaHasMinLength(schema)) JmvcMachinery.Validation.IsMinLength(value, name, schema, schemaId, validationResults);
        if (JmvcMachinery.SchemaHelper.isSchemaHasMaxLength(schema)) JmvcMachinery.Validation.IsMaxLength(value, name, schema, schemaId, validationResults);
        if (JmvcMachinery.SchemaHelper.isSchemaHasPattern(schema)) JmvcMachinery.Validation.IsPatternValid(value, name, schema, schemaId, validationResults);
        
        return validationResults.messages;
    },
    IsRequired: function(v, name, schema, schemaId, validationResults) {
        var Required = schema.required;

        if (!Required) return true;

        var val = v;
        var fieldTitle = (schema.title || name);

        var invalid = false;
        var message = '';

        var messageID = schemaId + '_RequiredVaidation';

        if (Required != undefined && (val == undefined || (val != undefined && val.toString().replace(/^\s+|\s+$/, '').length == 0))) {
            invalid = true;
            message = fieldTitle + ' is required';
        }

        if (invalid) {
            validationResults.messages.push({
                rule: 'Required',
                level: 'error',
                message: (message || '[undefined]')
            });
            validationResults.isValid = false;
            return false;
        }
        return true;
    },
    IsMaximum: function(v, name, schema, schemaId, validationResults) {
        var maximum;
        var val;
        var isDate = false;
        if (schema.type == 'number' || schema.type == 'integer') {
            maximum = parseFloat(schema.maximum);
            val = parseFloat(v);
        } else if (schema.type == 'date' || schema.type == 'datepicker') {
            isDate = true;
            maximum = new Date(schema.maximum);
            val = new Date(v);
        }

        var maximumCanEqual = (schema.maximumCanEqual || 'true');

        var fieldTitle = (schema.title || name);
        var invalid = false;
        var message = '';
        var messageID = schemaId + '_MaximumVaidation';
        if (v != undefined && maximum != undefined && maximumCanEqual == 'true' && val > maximum) {
            invalid = true;
            message = fieldTitle + ' value cannot to greater than ' + (isDate ? JmvcMachinery.Validation.dateFormat(maximum) : maximum);
        }
        if (v != undefined && maximum != undefined && maximumCanEqual == 'false' && val >= maximum && !isDate) {
            invalid = true;
            message = fieldTitle + ' value cannot to greater than or equal to ' + (isDate ? JmvcMachinery.Validation.dateFormat(maximum) : maximum);
        }

        if (invalid) {
            validationResults.messages.push({
                rule: 'MaxValue',
                level: 'error',
                message: (message || '[undefined]')
            });

            validationResults.isValid = false;
            return false;
        }
        return true;
    },
    IsMinimum: function(v, name, schema, schemaId, validationResults) {
        var minimum;
        var val;
        var isDate = false;
        if (schema.type == 'number' || schema.type == 'integer') {
            minimum = parseFloat(schema.minimum);
            val = parseFloat(v);
        } else if (schema.type == 'date' || schema.type == 'datepicker') {
            isDate = true;
            minimum = new Date(schema.minimum);
            val = new Date(v);
        }

        var minimumCanEqual = (schema.minimumCanEqual || 'true');
        var fieldTitle = (schema.title || name);
        var invalid = false;
        var message = '';
        var messageID = schemaId + '_MinimumVaidation';
        if (v != undefined && minimum != undefined && minimumCanEqual == 'true' && val < minimum) {
            invalid = true;
            message = fieldTitle + ' value cannot to less than ' + (isDate ? JmvcMachinery.Validation.dateFormat(minimum) : minimum);
        }
        if (v != undefined && minimum != undefined && minimumCanEqual == 'false' && val <= minimum && !isDate) {
            invalid = true;
            message = fieldTitle + ' value cannot to less than or equal to ' + (isDate ? JmvcMachinery.Validation.dateFormat(minimum) : minimum);
        }

        if (invalid) {
            validationResults.messages.push({
                rule: 'MinValue',
                level: 'error',
                message: (message || '[undefined]')
            });

            validationResults.isValid = false;
            return false;
        }
        return true;
    },
    IsMinLength: function(v, name, schema, schemaId, validationResults) {
        var minLength = parseFloat(schema.minLength);
        var val = v;
        var fieldTitle = (schema.title || name);

        var invalid = false;
        var message = '';

        var messageID = schemaId + '_MinLengthVaidation';

        if (minLength != undefined && ((val == undefined && minLength > 0) || val.toString().length < minLength)) {
            invalid = true;
            message = fieldTitle + ' may not be shorter than ' + minLength + ' characters';
        }

        if (invalid) {
            validationResults.messages.push({
                rule: 'MinLength',
                level: 'error',
                message: (message || '[undefined]')

            });
            validationResults.isValid = false;
            return false;
        }
        return true;
    },
    IsMaxLength: function(v, name, schema, schemaId, validationResults) {
        var maxLength = parseFloat(schema.maxLength);
        var val = v;
        if (val === undefined) val = "";

        var fieldTitle = (schema.title || name);

        var invalid = false;
        var message = '';

        var messageID = schemaId + '_MaxLengthVaidation';

        if (maxLength != undefined && val != undefined && val.toString().length > maxLength) {
            invalid = true;
            message = fieldTitle + ' may not be longer than ' + maxLength + ' characters';
        }

        if (invalid) {
            validationResults.messages.push({
                rule: 'MaxLength',
                level: 'error',
                message: (message || '[undefined]')
            });
            validationResults.isValid = false;
            return false;
        }
        return true;
    },
    IsPatternValid: function(v, name, schema, schemaId, validationResults) {

        var fieldTitle = (schema.title || name);
        var invalid = false;
        var message = '';
        var val = v;
        var messageID = schemaId + '_PatternVaidation';
        var pattern = (schema.pattern || schema.format);

        if (!_.isRegExp(pattern) && !_.isFunction(pattern) && _.isString(pattern)) {
            pattern = JmvcMachinery.Format.formats[pattern].regEx;
            if (!pattern){ 
              return true;
            } else if(!_.isRegExp(pattern)){
              pattern = pattern.unmask;
            }
            
        }

        if (val && _.isRegExp(pattern)) {
            //console.log("v:" + val + ",p:" + pattern);
            val = val.toString();
            var m = val.match(pattern);
            if (m == null || m.length == 0 || (m.length >= 1 && m[0] != val)) {
                invalid = true;
            }
        } else if (val && _.isFunction(pattern)) {
            invalid = !pattern(v);
        }

        if (invalid || invalid == null) {
            message = fieldTitle + ' has invalid data';
        }
        if (invalid) {
            validationResults.messages.push({
                rule: 'PatternValue',
                level: 'error',
                message: (message || '[undefined]')
            });

            validationResults.isValid = false;
            return false;
        }
        return true;
    }

};

//===============================
} (window, (function() {
    return;
} ())));
//===============================
