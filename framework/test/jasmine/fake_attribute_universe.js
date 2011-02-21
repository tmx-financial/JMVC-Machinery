/* -*- Mode: javascript; tab-width: 4; indent-tabs-mode: nil; */

//--------MODULE HEADER----------
 (function(GLOBAL, undefined){
    //===============================
    var universe = GLOBAL.namespace("JmvcMachinery.Framework.FakeAttributeUniverse"),
        functionalWorkers = defineFunctionalWorkers(),
        string = "string";

    addSomeBasicFieldsForUnitTests(universe);
    addSomeFakeFieldsForUnitTests(universe);
    addSomeFakeFieldsAboutFootball(universe);

    ensureFieldsHaveTitlesAndDontHaveRequired(universe);
    universe.getSchema = function(attrName) {
        var schemaForAttr = universe[attrName];
        if (!schemaForAttr) universe.throwUnknownAttributeError(attrName);
        return _(schemaForAttr).clone();
    };

    universe.hasAttribute = function(attrName) {
        return (universe.hasOwnProperty(attrName));
    };

    universe.assertHasAttribute = function(attrName) {
        if(! universe.hasAttribute(attrName)) universe.throwUnknownAttributeError(attrName);
    };

    universe.throwUnknownAttributeError = function(attrName) {
        throw new Error("The attribute universe does not include a definition for " + attrName + ". All attributes must be defined in the attribute universe.");
    };

    function addSomeBasicFieldsForUnitTests(target) {

        // These are some examples of the kinds of Attributes you might have in your domain. These are merely fake examples for unit testing.
        var crossApplicantCustomerInformationAttributes = {
            fullNameWithSpaces: {
                title: "Full Name",
                type: "string"
            },
            fullNameWithCommas: {
                title: "Full Name",
                type: "string"
            },
            firstName : {
                type: "string",
                maxLength: 30
            },
            firstInitial : {
                type: "string",
                maxLength: 1
            },
            lastName : {
                type: "string",
                maxLength: 50
            },
            middleName : {
                title: "Middle Name",
                type: "string",
                maxLength: 50
            },
            homeAddressCity : {
                title: "City",
                type: "string",
                maxLength: 40
            },
            mailingAddressCity : {
                type: "string",
                title: "City",
                maxLength: 40
            }
        };

        ensureFieldsHaveTitlesAndDontHaveRequired(crossApplicantCustomerInformationAttributes);
        functionalWorkers.addCrossApplicantAttributesToTarget(crossApplicantCustomerInformationAttributes, target);
    }

    function addSomeFakeFieldsAboutFootball(target){
        var properties = {
            "teamSlogan": {
                type: "string"
            },
            "mascotName": {
                type: "string"
            },
            lastSuperbowlWinDate: {
                type: "date"
            },
            teamOwnersHomeState: makeStateSchema("Team Owner Home State")
        };

        functionalWorkers.addAttributesToTarget(properties, target);
    }

    function addSomeFakeFieldsForUnitTests(target){
        var properties = {
            "isCarReallyOld": {
                type: "boolean"
            },
            "doesCarHaveEvenYear": {
                type: "boolean"
            },
            "isInRestrictedMode": {
                type: "boolean"
            },
            "peekAtMyCounterValue": {
                type: "number"
            }
        };

        functionalWorkers.addAttributesToTarget(properties, target);
    }

    function ensureFieldsHaveTitlesAndDontHaveRequired(schema){
        _(schema).chain().keys().each(function(key){
            var field = schema[key];

            if (field.required !== undefined) {
                throw new Error(key + " defines 'required' in the attribute universe. It is invalid to define the requiredness of an attribute here in a universal fashion. Instead, have your model set this value based on the current state of the model.");
            }

            if (!field.title){
                field.title = _(key).makeTitle();
            }
        });
    }

    function defineFunctionalWorkers(){
        var fw = {
            addCrossApplicantAttributesToTarget: function(crossApplicantAttributes, target){
                var prefixes = ["applicant", "coapplicant"];

                _.each(prefixes,
                function(prefix){
                    _.each(crossApplicantAttributes,
                    function(attributeDefinition, rawAttributeName){
                        var resolvedName = prefix + $.String.capitalize(rawAttributeName);
                        fw.safelyAddAttributeToTarget(target, resolvedName, attributeDefinition);
                    });
                });
            },

            addAttributesToTarget: function(attributes, target){
                _.each(attributes,
                function(attributeDefinition, attributeName){
                    fw.safelyAddAttributeToTarget(target, attributeName, attributeDefinition);
                });
            },

            safelyAddAttributeToTarget: function(target, attributeName, attributeDefinition){
                if (target.hasOwnProperty(attributeName)) throw new Error("This target already has an attribute named " + attributeName);
                target[attributeName] = attributeDefinition;
            }
        };

        return fw;
    }

    function makeStateSchema(titleText) {
        // NOTE: This is merely a sample for unit testing. As you can see, it doesn't even contain all of the states.
        return {
            "title": titleText,
            "type": "integer",
            "options": [{
                "value": 1,
                "label": "Alabama"
            },
            {
                "value": 2,
                "label": "Alaska"
            },
            {
                "value": 3,
                "label": "Arizona"
            },
            {
                "value": 4,
                "label": "Arkansas"
            },
            {
                "value": 5,
                "label": "California"
            },
            {
                "value": 6,
                "label": "Colorado"
            },
            {
                "value": 7,
                "label": "Connecticut"
            },
            {
                "value": 8,
                "label": "Delaware"
            },
            {
                "value": 9,
                "label": "District of Columbia"
            },
            {
                "value": 10,
                "label": "Florida"
            },
            {
                "value": 11,
                "label": "Georgia"
            },
            {
                "value": 12,
                "label": "Hawaii"
            },
            {
                "value": 13,
                "label": "Idaho"
            },
            {
                "value": 14,
                "label": "Illinois"
            },
            {
                "value": 15,
                "label": "Indiana"
            },
            {
                "value": 16,
                "label": "Iowa"
            },
            {
                "value": 17,
                "label": "Kansas"
            },
            {
                "value": 18,
                "label": "Kentucky"
            },
            {
                "value": 19,
                "label": "Louisiana"
            },
            {
                "value": 20,
                "label": "Maine"
            },
            {
                "value": 21,
                "label": "Tennessee"
            },
            {
                "value": 22,
                "label": "Virginia"
            }]
        };
    }

    //===============================
} (window, (function(){
    return;
} ())));
//===============================
