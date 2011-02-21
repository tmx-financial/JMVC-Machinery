//--------MODULE HEADER----------
(function(GLOBAL, undefined) {
    "use strict";
    //===============================

    var n = JmvcMachinery.Framework.ModelDefinition.ModelConcepts.ModelConceptProcessors;

    describe("The concept processor for forcesAttributesToBeRequiredWhen", function() {
        var md;

        beforeEach(function() {
            md = JmvcMachinery.Framework.ModelDefinition.newModelDefinition();
        });

        afterEach(function() {
        });

        it("should exist", function() {
            var processor = n.newProcessorFor("forcesAttributesToBeRequiredWhen", {});
            expect(processor).toBeDefined();
        });

        describe("cases when the syntax fed to it is valid", function() {
            var md, p;
            beforeEach(function() {
                md = JmvcMachinery.Framework.ModelDefinition.newModelDefinition();
                p = n.newProcessorFor("forcesAttributesToBeRequiredWhen", md);
            });

            it("should process one blurb correctly", function() {
                var blurb = {
                    forcesAttributesToBeRequiredWhen: {
                        applicantFirstName: [
                        {
                            dependsOnAttributes: ["isCarReallyOld"],
                            condition: function() {
                                return this.isCarReallyOld; 
                            }
                        }
                        ]
                    }
                };

                p.interpret("unitTest", blurb);

                var result = p.getInternalDataForTesting();

                jasmine.log(result);
                expect(result).toBeDefined();
                result.mapTriggeringAttrsToAffectedAttrs.getAttributesAffectedBy("isCarReallyOld").shouldContainOnly(["applicantFirstName"]);
                expect(result.mapTargetAttrsToConditionList.getConditionsFor("applicantFirstName")[0].condition).toEqual(blurb.forcesAttributesToBeRequiredWhen.applicantFirstName[0].condition);

                _.keys(md.getInternalDataForRequiredAttributes()).shouldContainOnly(["isCarReallyOld", "applicantFirstName"]);
                expect(md.getInternalDataForVerbProcessingBlocksForModelInstanceInit().length).toBe(1);

                md.getInternalDataForSchemasToFillInFromDefaultSchemaProvider().shouldContainOnly([]);

                expect(_.keys(md.getInternalDataForModelSchema()).length).toEqual(0);

            });

            it("should build its data structures correctly when fed multiple blurbs", function() {
                var blurbs = [
                    {
                        applicantFirstName: [{
                            dependsOnAttributes: ["isCarReallyOld"],
                            condition: function() {
                                return this.isCarReallyOld; 
                            }
                        }]
                    },
                    {
                        applicantFirstName:[ {
                            dependsOnAttributes: ["applicantLastName", "applicantMiddleName"],
                            condition: function() {
                                return (this.applicantLastName.length + this.applicantMiddleName.length) > 20; 
                            }
                        }]
                    },
                    {
                        applicantFirstName:[ {
                            dependsOnAttributes: ["applicantLastName", "isCarReallyOld"],
                            condition: function() {
                                return (!! applicantLastName && isCarReallyOld);
                            }
                        }]
                    },
                    {
                        applicantLastName:[ {
                            dependsOnAttributes: ["isCarReallyOld"],
                            condition: function() {
                                return (isCarReallyOld);
                            }
                        }]
                    }
                ];

                _(blurbs).each(function(b) {
                    var o = { forcesAttributesToBeRequiredWhen: b };
                    p.interpret("unitTest", o);
                });

                var result = p.getInternalDataForTesting();

                jasmine.log(result);

                result.mapTriggeringAttrsToAffectedAttrs.getAttributesAffectedBy("isCarReallyOld").shouldContainOnly(["applicantLastName", "applicantFirstName"]);

                result.mapTriggeringAttrsToAffectedAttrs.getAttributesAffectedBy("applicantLastName").shouldContainOnly(["applicantFirstName"]);
                result.mapTriggeringAttrsToAffectedAttrs.getAttributesAffectedBy("applicantMiddleName").shouldContainOnly(["applicantFirstName"]);

                jasmine.log("TARGET TO CONDITIONS: ", result.mapTargetAttrsToConditionList);

                result.mapTargetAttrsToConditionList.getTargetAttributes().shouldContainOnly(["applicantFirstName", "applicantLastName"]);
                var applicantFirstNameConditions = result.mapTargetAttrsToConditionList.getConditionsFor("applicantFirstName");
                expect(applicantFirstNameConditions[0].condition).toBe(blurbs[0].applicantFirstName[0].condition);
                expect(applicantFirstNameConditions[0].attributeSpec).toBe(blurbs[0].applicantFirstName[0]);

                var appLastNameConditions = result.mapTargetAttrsToConditionList.getConditionsFor("applicantLastName");
                expect(appLastNameConditions[0].condition).toBe(blurbs[3].applicantLastName[0].condition);
                expect(appLastNameConditions[0].attributeSpec).toBe(blurbs[3].applicantLastName[0]);
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
