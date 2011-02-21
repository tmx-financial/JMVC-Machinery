/* -*- Mode: javascript; tab-width: 4; indent-tabs-mode: nil; */

//--------MODULE HEADER----------
(function(GLOBAL, undefined) {
//===============================

    var productApplicationDefinitions = {}, 
        dslScope;

    dslScope = createDslScope();

    GLOBAL.namespace("JmvcMachinery.Framework.Application").definition = {
        defineApplicationForProduct: function(productName, definitionFunction) {
            var newApplicationDefinition;

            if(productApplicationDefinitions.hasOwnProperty(productName)) throw "The Application for product " + productName + " has already been defined.";

            newApplicationDefinition = new ApplicationDefinition(productName);

        }
    };

    function ApplicationDefinition(productName) {
        if( ! (this instanceof ApplicationDefinition)) return new ApplicationDefinition(arguments);
        if(! productName) throw "You must pass in a product name";
        this._productName = productName;
        this._includedFields = [];

        
        return this;
    }

    ApplicationDefinition.prototype = ApplicationDefinition.prototype || {
        productName : function() { return this._productName; },
        includeFields: function(fieldNameArray) {
            if(! fieldNameArray) throw "You must pass in a list of field names that are relevant to the " + this.productName() + " product.";
            _.each(fieldNameArray, function(fieldName) {
                assertFieldExistsInDataDictionary(fieldName);
                if(! _.contains(this._includedFields, fieldName)) this._includedFields.push(fieldName);
            });
        },
        addCharacteristic: function(characteristicName, options) {
            
        }
    };

//===============================
} (window, (function() {
    return;
} ())));
//===============================


