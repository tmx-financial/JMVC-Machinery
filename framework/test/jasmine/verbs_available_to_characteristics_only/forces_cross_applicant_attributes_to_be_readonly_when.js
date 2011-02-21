//--------MODULE HEADER----------
(function(GLOBAL, undefined) {
    "use strict";
    //===============================

    var n = JmvcMachinery.Framework.Characteristics.CharacteristicVerbProcessors;
    var internalNs = JmvcMachinery.Framework.ModelDefinition.InternalForUnitTesting;
    var modelDefNs = JmvcMachinery.Framework.ModelDefinition;

    describe("The processor for forcesCrossApplicantAttributesToBeReadonlyWhen", function() {
        var md, ciPrimaryOnly, ciCoapplicantOnly, ciBothApplicants, charNs, processorTable;

        beforeEach(function() {
            md = undefined;
            charNs = {};
            processorTable = undefined;
        });

        afterEach(function() {
        });

        describe("cases when the syntax fed to it is valid", function() {
            beforeEach(function() {
            });

            it("should process one blurb correctly", function() {
                var blurb = {
                    forcesCrossApplicantAttributesToBeReadonlyWhen: {
                        firstName: [
                        {
                            dependsOnAttributes: ["isCarReallyOld"],
                            dependsOnCrossApplicantAttributes: ["firstName"],
                            condition: function() {
                                return this.isCarReallyOld; 
                            }
                        }
                        ]
                    }
                };

                var characteristic = JmvcMachinery.Framework.Characteristics.declareCrossApplicantCharacteristic(charNs, "ForUnitTest", blurb );

                assertExpectationsForPrimaryApplicantOnly(characteristic);

                assertExpectationsForCoapplicantOnly(characteristic);

                assertExpectationsForBothApplicants(characteristic);

                function assertExpectationsForPrimaryApplicantOnly(characteristic) {
                    var c = characteristic();
                    c.init({whichApplicant: "PrimaryApplicantOnly"});

                    interpretCharacteristic(c);

                    _.keys(md.getInternalDataForRequiredAttributes()).shouldContainOnly(["isCarReallyOld", "applicantFirstName"]);
                    expect(md.getInternalDataForVerbProcessingBlocksForModelInstanceInit().length).toBe(1);

                    md.getInternalDataForSchemasToFillInFromDefaultSchemaProvider().shouldContainOnly([]);

                    expect(_.keys(md.getInternalDataForModelSchema()).length).toEqual(0);
                }

                function assertExpectationsForCoapplicantOnly(characteristic) {
                    var c = characteristic();
                    c.init({whichApplicant: "CoapplicantOnly"});
                    interpretCharacteristic(c);

                    _.keys(md.getInternalDataForRequiredAttributes()).shouldContainOnly(["isCarReallyOld", "coapplicantFirstName"]);
                    expect(md.getInternalDataForVerbProcessingBlocksForModelInstanceInit().length).toBe(1);

                    md.getInternalDataForSchemasToFillInFromDefaultSchemaProvider().shouldContainOnly([]);

                    expect(_.keys(md.getInternalDataForModelSchema()).length).toEqual(0);
                }

                function assertExpectationsForBothApplicants(characteristic) {
                    var c = characteristic();
                    c.init({whichApplicant: "BothApplicants"});
                    interpretCharacteristic(c);

                    _.keys(md.getInternalDataForRequiredAttributes()).shouldContainOnly(["isCarReallyOld", "applicantFirstName", "coapplicantFirstName"]);
                    expect(md.getInternalDataForVerbProcessingBlocksForModelInstanceInit().length).toBe(1);

                    md.getInternalDataForSchemasToFillInFromDefaultSchemaProvider().shouldContainOnly([]);

                    expect(_.keys(md.getInternalDataForModelSchema()).length).toEqual(0);
                }

                function interpretCharacteristic(characteristic) {
                    md = JmvcMachinery.Framework.ModelDefinition.newModelDefinition();
                    modelDefNs.processVerbBundle([characteristic], md);
                }
            });

            it("should build its data structures correctly when fed multiple blurbs", function() {
                var blurbs = [
                    {
                        firstName: [{
                            dependsOnAttributes: ["isCarReallyOld"],
                            condition: function() {
                                return this.isCarReallyOld; 
                            }
                        }]
                    },
                    {
                        firstName:[ {
                            dependsOnCrossApplicantAttributes: ["lastName", "middleName"],
                            condition: function() {
                                return (this.lastName.length + this.middleName.length) > 20; 
                            }
                        }]
                    },
                    {
                        firstName:[ {
                            dependsOnAttributes: ["isCarReallyOld"],
                            dependsOnCrossApplicantAttributes: ["lastName"],
                            condition: function() {
                                return (!! lastName && isCarReallyOld);
                            }
                        }]
                    },
                    {
                        lastName:[ {
                            dependsOnAttributes: ["isCarReallyOld"],
                            condition: function() {
                                return (isCarReallyOld);
                            }
                        }]
                    }
                ];

                var characteristicList = [];
                _(blurbs).each(function(b, index) {
                    var o = { forcesCrossApplicantAttributesToBeReadonlyWhen: b };
                    var characteristic = JmvcMachinery.Framework.Characteristics.declareCrossApplicantCharacteristic(charNs, "ForUnitTest" + index, o );
                    var instance = characteristic();
                    instance.init({whichApplicant: "BothApplicants"});
                    characteristicList.push(instance);
                });

                md = JmvcMachinery.Framework.ModelDefinition.newModelDefinition();
                JmvcMachinery.Framework.ModelDefinition.processVerbBundle(characteristicList, md);

                var requiredAttrs = _.keys(md.getInternalDataForRequiredAttributes());
                requiredAttrs.shouldContainOnly(["applicantFirstName", "coapplicantFirstName", "isCarReallyOld", "applicantLastName", "applicantMiddleName",
                        "coapplicantLastName", "coapplicantMiddleName"]);

                expect(md.getInternalDataForVerbProcessingBlocksForModelInstanceInit().length).toBe(1);
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
