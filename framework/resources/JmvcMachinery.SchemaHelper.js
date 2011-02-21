/* -*- Mode: javascript; tab-width: 4; indent-tabs-mode: nil; */

//--------MODULE HEADER----------
(function(GLOBAL, undefined) {
//===============================

GLOBAL.namespace("JmvcMachinery").SchemaHelper =
{
    Schemas: {},

    schema: function(k, v)
    {
        if (!_.isObject(v))
        return JmvcMachinery.SchemaHelper.Schemas[k];

        JmvcMachinery.SchemaHelper.Schemas[k] = v;
    },
    remove: function(k)
    {
        delete JmvcMachinery.SchemaHelper.Schemas[k];
    },
    isSchemaExists: function(k){
        if (JmvcMachinery.SchemaHelper.Schemas[k] != undefined)
        return true;
        return false;
    },
    isSchemaHasMaximum: function(schema)
    {
        if (schema.maximum != undefined)
        return true;
        return false;
    },
    isSchemaHasMinLength: function(schema)
    {
        if (schema.minLength != undefined)
        return true;
        return false;
    },
    isSchemaHasMaxLength: function(schema)
    {
        if (schema.maxLength != undefined)
        return true;
        return false;
    },
    isSchemaHasMinimum: function(schema)
    {
        if (schema.minimum != undefined)
        return true;
        return false;
    },
    isSchemaHasPattern: function(schema)
    {
        if (schema.pattern != undefined || schema.format != undefined)
        return true;
        return false;
    },
    isSchemaHasRequired: function(schema)
    {
        if (schema.required != undefined)
        return true;
        return false;
    }
}

//===============================
} (window, (function() {
    return;
} ())));
//===============================
