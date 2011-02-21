//--------MODULE HEADER----------
(function(GLOBAL) {
    "use strict";
//===============================

    var stubFunc = function() { return true; };

    var translate = JmvcMachinery.Framework.Characteristics.Application.CrossApplicant.translateCrossApplicantVerbToCorrespondingSetOfPrimitiveVerbs;

    describe("the translation from runsCrossApplicantBlockAtModelInstanceInit to runsBlockAtModelInstanceInit", function() {
        it("should handle the happy path in a way that makes me happy", function() {
            var originalVerb = {
                runsCrossApplicantBlockAtModelInstanceInit: function(prefix, applicantType) {
                    var fieldName = prefix + "FirstName";
                    this.attr(fieldName, "SET BY INIT BLOCK!");
                }
            };

            var translatedVerbList = translate(originalVerb, "BothApplicants");

            expect(_.isArray(translatedVerbList)).toBe(true);
            expect(translatedVerbList.length).toBe(2);

            _.keys(translatedVerbList[0]).shouldContainOnly(["runsBlockAtModelInstanceInit"]);
            expect(_.isFunction(translatedVerbList[0].runsBlockAtModelInstanceInit)).toBe(true);
            expect(translatedVerbList[0].runsBlockAtModelInstanceInit.length).toBe(0); // no args for the function

            _.keys(translatedVerbList[1]).shouldContainOnly(["runsBlockAtModelInstanceInit"]);
            expect(_.isFunction(translatedVerbList[1].runsBlockAtModelInstanceInit)).toBe(true);
            expect(translatedVerbList[1].runsBlockAtModelInstanceInit.length).toBe(0); // no args for the function
        });
    });

    describe("the translation from forcesCrossApplicantAttributesToBeReadonlyWhen to forcesAttributesToBeReadonlyWhen", function() {
        it("should handle the happy path", function() {
            var originalVerb = {
                forcesCrossApplicantAttributesToBeReadonlyWhen: {
                    firstName: [
                    {
                        dependsOnAttributes: ["isCarReallyOld"],
                        dependsOnCrossApplicantAttributes: ["firstName"],
                        condition: function() {
                            return this.isCarReallyOld && this.firstName.length > 5; 
                        }
                   }
                   ]
                }
            };

            var translatedVerbList = translate(originalVerb, "BothApplicants");

            expect(_.isArray(translatedVerbList)).toBe(true);
            expect(translatedVerbList.length).toBe(2);

            expect(translatedVerbList[0]).toEqual({
                forcesAttributesToBeReadonlyWhen: {
                    applicantFirstName: [
                        {
                            dependsOnAttributes: ["isCarReallyOld", "applicantFirstName"],
                            condition: originalVerb.forcesCrossApplicantAttributesToBeReadonlyWhen.firstName[0].condition,
                            proxyAliases: {
                                applicantFirstName: "firstName"
                            }
                        }
                    ]
                }
            });

            expect(translatedVerbList[1]).toEqual({
                forcesAttributesToBeReadonlyWhen: {
                    coapplicantFirstName: [
                        {
                            dependsOnAttributes: ["isCarReallyOld", "coapplicantFirstName"],
                            condition: originalVerb.forcesCrossApplicantAttributesToBeReadonlyWhen.firstName[0].condition,
                            proxyAliases: {
                                coapplicantFirstName: "firstName"
                            }
                        }
                    ]
                }
            });

        });
    });

    describe("the translation from producesCrossApplicantAttributesWithPrivateSetters to producesAttributesWithPrivateSetters", function() {
        it("should handle the happy path", function() {
            var originalVerb = {
                producesCrossApplicantAttributesWithPrivateSetters: {
                    firstName: {
                        schema: {
                            type: "string",
                            maxLength: 30
                        }
                    },
                    lastName: {}
                }
            };

            var translatedVerbList = translate(originalVerb, "BothApplicants");

            expect(_.isArray(translatedVerbList)).toBe(true);
            expect(translatedVerbList.length).toBe(2);

            expect(translatedVerbList[0]).toEqual({
                producesAttributesWithPrivateSetters: {
                    applicantFirstName: [{
                        schema: {
                            type: "string",
                            maxLength: 30
                        }
                    }],
                    applicantLastName: [{ }]
                }
            });

            expect(translatedVerbList[1]).toEqual({
                producesAttributesWithPrivateSetters: {
                    coapplicantFirstName: [{
                        schema: {
                            type: "string",
                            maxLength: 30
                        }
                    }],
                    coapplicantLastName: [{ }]
                }
            });
        });
    });

    describe("The translation from producesCrossApplicantAttributesWithSpecializedGettersAndSetters to producesSpecializedGettersAndSetters", function() {
        it("should handle the happy path", function() {

            var originalVerb = {
                producesCrossApplicantAttributesWithSpecializedGettersAndSetters: {
                    mailingAddressCity: {
                        dependsOnAttributes: ["isCarReallyOld"],
                        dependsOnCrossApplicantAttributes: ["isMailingAddressSameAsHomeAddress", "homeAddressCity"],
                        getter: stubFunc,
                        setter: stubFunc
                    }
                }
            };

            var translatedVerbList = translate(originalVerb, "BothApplicants");

            expect(_.isArray(translatedVerbList)).toBe(true);
            expect(translatedVerbList.length).toBe(2);

            expect(translatedVerbList[0]).toEqual({
                producesAttributesWithSpecializedGettersAndSetters: {
                    applicantMailingAddressCity: {
                        dependsOnAttributes: ["isCarReallyOld", "applicantIsMailingAddressSameAsHomeAddress", "applicantHomeAddressCity"],
                        getter: stubFunc,
                        setter: stubFunc,
                        proxyAliases: {
                            applicantIsMailingAddressSameAsHomeAddress: "isMailingAddressSameAsHomeAddress",
                            applicantHomeAddressCity: "homeAddressCity"
                        }
                    }
                }
            });

            expect(translatedVerbList[1]).toEqual({
                producesAttributesWithSpecializedGettersAndSetters: {
                    coapplicantMailingAddressCity: {
                        dependsOnAttributes: ["isCarReallyOld", "coapplicantIsMailingAddressSameAsHomeAddress", "coapplicantHomeAddressCity"],
                        getter: stubFunc,
                        setter: stubFunc,
                        proxyAliases: {
                            coapplicantIsMailingAddressSameAsHomeAddress: "isMailingAddressSameAsHomeAddress",
                            coapplicantHomeAddressCity: "homeAddressCity"
                        }
                    }
                }
            });
        });
    });

    describe("the translation from producesCrossApplicantDerivedAttributes to producesDerivedAttributes", function() {
        it("should handle the happy path in a way that makes me happy", function() {
            var originalVerb = {
                producesCrossApplicantDerivedAttributes: {
                    age: {
                        dependsOnCrossApplicantAttributes: ["birthDate"],
                        dependsOnAttributes: ["isCarReallyOld"],
                        getter: stubFunc
                    }
                }
            };

            var translatedVerbList = translate(originalVerb, "BothApplicants");

            expect(_.isArray(translatedVerbList)).toBe(true);
            expect(translatedVerbList.length).toBe(2);

            expect(translatedVerbList[0]).toEqual({
                producesDerivedAttributes: {
                    applicantAge: {
                        dependsOnAttributes: ["isCarReallyOld", "applicantBirthDate"],
                        getter: stubFunc,
                        proxyAliases: {
                            applicantBirthDate: "birthDate"
                        }
                    }
                }
            });

            expect(translatedVerbList[1]).toEqual({
                producesDerivedAttributes: {
                    coapplicantAge: {
                        dependsOnAttributes: ["isCarReallyOld", "coapplicantBirthDate"],
                        getter: stubFunc,
                        proxyAliases: {
                            coapplicantBirthDate: "birthDate"
                        }
                    }
                }
            });
        });
    });

    describe("the translation from productMustHaveTheseCrossApplicantAttributes to productMustHaveTheseAttributes", function() {

        it("should handle the happy path happily, like we all should", function() {
            var originalVerb = { productMustHaveTheseCrossApplicantAttributes: ["isMailingAddressSameAsHomeAddress", "homeAddressLine1", "homeAddressLine2"]};

            var translatedVerbList = translate(originalVerb, "BothApplicants");

            expect(_.isArray(translatedVerbList)).toBe(true);
            expect(translatedVerbList.length).toBe(2);

            expect(translatedVerbList[0]).toEqual({
                productMustHaveTheseAttributes: ["applicantIsMailingAddressSameAsHomeAddress", "applicantHomeAddressLine1", "applicantHomeAddressLine2"]
            });

            expect(translatedVerbList[1]).toEqual({
                productMustHaveTheseAttributes: ["coapplicantIsMailingAddressSameAsHomeAddress", "coapplicantHomeAddressLine1", "coapplicantHomeAddressLine2"]
            });
        });
    });

//===============================
} (function() {
    return this;
}()));
//===============================
