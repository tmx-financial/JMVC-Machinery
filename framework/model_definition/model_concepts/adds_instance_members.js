/* -*- Mode: jasmine; tab-width: 4; indent-tabs-mode: nil; */

//--------MODULE HEADER----------
(function(GLOBAL, undefined) {
    "use strict";
    //===============================

steal.resources("//jmvc_machinery/framework/resources/dataStructures.js").then(function() {
    var n = JmvcMachinery.Framework.ModelDefinition.ModelConcepts.ModelConceptProcessors;

    n.registerConceptProcessor("addsInstanceMembers", function(modelDefinition) {
        var customConsequences = {};

        return {
            interpret: function(verbSourceName, concept) {
                _.each(concept.addsInstanceMembers, function(member, memberName) {
                    modelDefinition.addToInstanceMembersToAdd(memberName, member);
                });
            },

            getInternalDataForTesting: function() {
                return customConsequences;
            }
        };
    });
});

    //===============================
} (function() {
    return this;
}(),
(function() {
    return;
} ())));
//===============================
