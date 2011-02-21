//--------MODULE HEADER----------
(function(GLOBAL, undefined) {
    "use strict";
    //===============================

    var n = JmvcMachinery.Framework.ModelDefinition.ModelConcepts.ModelConceptProcessors;

    describe("The concept processor for producesAttributesWithPrivateSetters", function() {
        var md;

        beforeEach(function() {
            md = JmvcMachinery.Framework.ModelDefinition.newModelDefinition();
        });

        it("should exist", function() {
            var processor = n.newProcessorFor("producesAttributesWithPrivateSetters", {});
            expect(processor).toBeDefined();
        });

        describe("cases when the syntax fed to it is valid", function() {
            var md, p;
            beforeEach(function() {
                md = JmvcMachinery.Framework.ModelDefinition.newModelDefinition();
                p = n.newProcessorFor("producesAttributesWithPrivateSetters", md);
            });

            it("should process blurbs correctly", function() {
                var blurbOne = {
                    producesAttributesWithPrivateSetters: {
                        applicantFirstName: {
                            schema: {
                                type: "string",
                                maxLength: 30
                            }
                        },
                        applicantLastName: {},
                        applicantMiddleName: {}
                    }
                };

                p.interpret("unitTest", blurbOne);

                var blurbTwo = {
                    producesAttributesWithPrivateSetters: {
                        isCarReallyOld: {
                        }
                    }
                };

                p.interpret("unitTest", blurbTwo);

                _.keys(md.getInternalDataForRequiredAttributes()).shouldContainOnly([]);
                expect(md.getInternalDataForVerbProcessingBlocksForModelInstanceInit().length).toBe(1);

                md.getInternalDataForSchemasToFillInFromDefaultSchemaProvider().shouldContainOnly(["applicantMiddleName", "applicantLastName", "isCarReallyOld"]);
                expect(md.getInternalDataForModelSchema()["applicantFirstName"]).toEqual({
                    type: "string",
                    maxLength: 30,
                    readOnly: true // note that it made the schema readonly!! It will need to do same to those schemas obtained later.
                });

                md.getInternalDataForAttributesWithPrivateSetters().shouldContainOnly(["applicantFirstName", "applicantLastName", "applicantMiddleName", "isCarReallyOld"]);

                expect(_.keys(md.getInternalDataForAttributeSetters()).length).toBe(4);
                expect(_.keys(md.getInternalDataForAttributeGetters()).length).toBe(0);

                _.keys(md.getInternalDataForPrivateInstanceMembers()).shouldContainOnly(["setApplicantFirstName", "setApplicantLastName", "setApplicantMiddleName", "setIsCarReallyOld"]);
            });
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
