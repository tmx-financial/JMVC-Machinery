//--------MODULE HEADER----------
(function(GLOBAL, undefined) {
    "use strict";
    //===============================

    var n = JmvcMachinery.Framework.ModelDefinition.ModelConcepts.ModelConceptProcessors;
    var md, p;

    describe("The concept processor for primaryAttributes", function() {

        beforeEach(function() {
            md = JmvcMachinery.Framework.ModelDefinition.newModelDefinition();
            p = n.newProcessorFor("primaryAttributes", md);
        });

        afterEach(function() {
        });

        it("should exist", function() {
            expect(p).toBeDefined();
        });

        describe("cases when the syntax fed to it is valid", function() {

            it("should handle blurbs with in-line schema correctly", function() {
                var blurb = {
                    primaryAttributes: {
                        applicantFirstName: {
                            schema: {
                                title: "Applicant First Name",
                                type: "string"
                            }
                        }
                    }
                };

                p.interpret("untTest", blurb);

                md.getInternalDataForPrimaryAttributes().shouldContainOnly(["applicantFirstName"]);
                _.keys(md.getInternalDataForModelSchema()).shouldContainOnly(["applicantFirstName"]);

                expect(md.getInternalDataForModelSchema()["applicantFirstName"]).toEqual({
                    type: "string",
                    title: "Applicant First Name"
                });
            });

            it("should handle cases where no inline schema exists by adding those attributes to the model definition's schemaToBeObtainedLater", function() {
                var blurb = {
                    primaryAttributes: {
                        applicantFirstName: {
                        }
                    }
                };

                p.interpret("unitTest", blurb);

                md.getInternalDataForPrimaryAttributes().shouldContainOnly(["applicantFirstName"]);
                _.keys(md.getInternalDataForModelSchema()).shouldContainOnly([]);

                md.getInternalDataForSchemasToFillInFromDefaultSchemaProvider().shouldContainOnly(["applicantFirstName"]);
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
