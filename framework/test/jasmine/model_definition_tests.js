/* -*- Mode: javascript; tab-width: 4; indent-tabs-mode: nil; */

//--------MODULE HEADER----------
(function(GLOBAL) {
"use strict";
//===============================
    describe("model definition", function() {
        var md;
        beforeEach(function() {
            md = JmvcMachinery.Framework.ModelDefinition.newModelDefinition();
        });

        afterEach(function() {
        });

        var expectedFuncs = [
            "addToRequiredAttributes", "addToPrimaryAttributes", "addToDerivedAttributes", "addToVerbProcessingBlocksForModelInstanceInit",
            "addToModelSchema", "addToAttributeGetters", "addToAttributeSetters", "addToSchemasToFillInFromDefaultSchemaProvider", "addToDirectBindAssociations",
            "addToPrivateInstanceMembers", "addToAttributesWithPrivateSetters",
            "getInternalDataForRequiredAttributes", "getInternalDataForPrimaryAttributes", "getInternalDataForDerivedAttributes", "getInternalDataForVerbProcessingBlocksForModelInstanceInit",
            "getInternalDataForModelSchema", "getInternalDataForAttributeGetters", "getInternalDataForAttributeSetters", "getInternalDataForSchemasToFillInFromDefaultSchemaProvider", "getInternalDataForDirectBindAssociations",
            "getInternalDataForPrivateInstanceMembers", "getInternalDataForAttributesWithPrivateSetters",
            "addRangeToPrimaryAttributes", "addRangeToDerivedAttributes", "addRangeToSchemasToFillInFromDefaultSchemaProvider",
            "addRangeToAttributesWithPrivateSetters", "theseAttributesAreRequiredByThisSource",
            "addToBusinessLogicBlocksToRunAtModelInstanceInit",
            "getInternalDataForBusinessLogicBlocksToRunAtModelInstanceInit",
            "addToBusinessLogicBlocksToRunAtModelStaticInit",
            "getInternalDataForBusinessLogicBlocksToRunAtModelStaticInit",
            "addToInstanceMembersToAdd",
            "addToStaticMembersToAdd",
            "getInternalDataForInstanceMembersToAdd",
            "getInternalDataForStaticMembersToAdd"
        ];

        it("should have all the functions for adding to it", function() {
            var modelDefinition = JmvcMachinery.Framework.ModelDefinition.newModelDefinition();
            jasmine.log(_.keys(modelDefinition));
            _.keys(modelDefinition).shouldContainOnly(expectedFuncs);
        });

        it("should succeed with reasonable usage (aka, happy path)", function() {
            md.addToRequiredAttributes("applicantLastName", ["unit test"]);

            md.addToPrimaryAttributes("applicantLastName");
            md.addToPrimaryAttributes("applicantFirstName");
            md.addToPrimaryAttributes("applicantLastName");
            md.addToPrimaryAttributes("vehicleValue");

            md.addToDerivedAttributes("applicantAge");
            md.addToVerbProcessingBlocksForModelInstanceInit(_.identity);
            md.addToVerbProcessingBlocksForModelInstanceInit(_.identity);
            md.addToVerbProcessingBlocksForModelInstanceInit(function() { "excuse me, pardon me, hi"; });

            md.addToModelSchema("applicantLastName", {
                type: "string",
                title: "Applicant Last Name"
            });

            md.addToAttributeGetters("applicantAge", function() { return 42; } );
            md.addToAttributeSetters("applicantAge", function(newValue) { return 42; } );

            md.addToSchemasToFillInFromDefaultSchemaProvider("applicantFirstName");
            md.addToSchemasToFillInFromDefaultSchemaProvider("vehicleValue");

            md.addToDirectBindAssociations("lastSuperbowlWinDate", ["applicantAge"]);
        });

        describe("addToRequiredAttributes", function() {
            it("should keep track of what you've added", function() {
                md.addToRequiredAttributes("foo", ["unit test"]);
                md.addToRequiredAttributes("bar", ["unit test"]);
                md.addToRequiredAttributes("blah", ["unit test"]);
                md.addToRequiredAttributes("boom", ["unit test"]);
                md.addToRequiredAttributes("hi", ["unit test"]);

                _.keys(md.getInternalDataForRequiredAttributes()).shouldContainOnly(["foo", "bar", "blah", "boom", "hi"]);
            });

            it("should dedupe for you", function() {
                md.addToRequiredAttributes("foo", ["unit test"]);
                md.addToRequiredAttributes("foo", ["unit test"]);

                var ra = _.keys(md.getInternalDataForRequiredAttributes());
                expect(ra.length).toEqual(1);
                ra.shouldContainOnly(["foo"]);
            });
        });
    });


//===============================
} (function() {
    return this;
}()));
//===============================
