//--------MODULE HEADER----------
(function(GLOBAL, undefined) {
    "use strict";
    //===============================

    var validateWhichApplicantParameter = function(whichApplicant) {
        if(! _.contains(["PrimaryApplicantOnly", "CoapplicantOnly", "BothApplicants"], whichApplicant)) throw whichApplicant + " is not a valid value for the 'whichApplicant' parameter. Valid values are 'PrimaryApplicantOnly', 'CoapplicantOnly' and 'BothApplicants'";
    };

    var translateCrossApplicantVerbNameIntoCorrespondingPrimitiveVerb = function(caVerb) {
        if(! caVerb) throw new Error("You must pass a value for caVerb.");
        var result = caVerb.replace("CrossApplicant", "", "g");
        return result;
    };

    var buildAttributePrefixList = function(whichApplicant) {
        validateWhichApplicantParameter(whichApplicant);
        var prefixes = [];
        if(whichApplicant === "PrimaryApplicantOnly" || whichApplicant === "BothApplicants") prefixes.push("applicant");
        if(whichApplicant === "CoapplicantOnly" || whichApplicant === "BothApplicants") prefixes.push("coapplicant");
        return prefixes;
    };

    var perApplicantType = function(whichApplicant, perApplicantTypeFunction) {
        validateWhichApplicantParameter(whichApplicant);
        if(! _.isFunction(perApplicantTypeFunction)) throw new Error("The 'perApplicantTypeFunction' parameter must be a function.");
        var prefixes = buildAttributePrefixList(whichApplicant);

        _.each(prefixes, function(prefix) {
            var thisApplicantType = (prefix === "applicant" ) ? "PrimaryApplicantOnly" : "CoapplicantOnly" ;
            perApplicantTypeFunction(prefix, thisApplicantType);
        });
    };

    var resolveCrossApplicantNames = function(ambiguousNames, whichApplicant) {
        var prefixes = buildAttributePrefixList(whichApplicant), result = [];

        _.each(prefixes, function(prefix) {
            _.each(ambiguousNames, function(ambiguousAttributeName) {
                var resolvedAttributeName = prefix + $.String.capitalize(ambiguousAttributeName);
                result.push(resolvedAttributeName);
            });
        });

        return _.unique(result);
    };

    GLOBAL.namespace("JmvcMachinery.Framework.Characteristics.Application.CrossApplicant").crossApplicantFunctionalHelpers = {
        validateWhichApplicantParameter: validateWhichApplicantParameter,
        buildAttributePrefixList : buildAttributePrefixList,
        perApplicantType: perApplicantType,
        resolveCrossApplicantNames: resolveCrossApplicantNames,
        translateCrossApplicantVerbNameIntoCorrespondingPrimitiveVerb: translateCrossApplicantVerbNameIntoCorrespondingPrimitiveVerb
    };

    //===============================
} (function() {
    return this;
}(),
(function() {
    return;
} ())));
//===============================
