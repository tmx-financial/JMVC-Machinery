/* -*- Mode: jasmine; tab-width: 4; indent-tabs-mode: nil; */

describe("ControllerExtensions: Metaview: The metaview method on all controllers", function() {
    var testModelClass, testModelInstance, wrappedSetWithOnlyOneElement;

    beforeEach(function() {
        var temp = setUpSomeTestVariables();
        testModelClass = temp.testModelClass;
        testModelInstance = temp.testModelInstance;
        wrappedSetWithOnlyOneElement = $("<div></div>");
    });

    it("should attach the metaview function to $.Controller.prototype", function() {
        expect(jQuery.Controller.prototype).toBeDefined();
        expect($.Controller.prototype.metaview).toBeDefined();
    });

    it("should throw if you call it without a view", function() {
        var someModel = new _testModel();

        expect(function() {
            $.Controller.prototype.metaview(wrappedSetWithOnlyOneElement, undefined, someModel);
        }).toThrow();
    });

    it("should throw if you call it without a model", function() {
        expect(function() {
            $.Controller.prototype.metaview(wrappedSetWithOnlyOneElement, 'pretend this is a valid url for a view', undefined);
        }).toThrow();
    });

    it("should throw if you call it with a model that does not have a schema", function() {
        var modelWithoutSchema = {};
        expect(function() {
            $.Controller.prototype.metaview(wrappedSetWithOnlyOneElement, 'pretend this is valid view url', modelWithoutSchema);
        }).toThrow();
    });

    it("should throw if you call it without a target element", function() {
        expect(function() {
            $.Controller.prototype.metaview(undefined, 'pretend this is valid view url', testModelInstance);
        }).toThrow();
    });

    it("should ultimately delegate to the lidView() method $.Controller.prototype, passing correct arguments", function() {
        var elementItWasPassed, viewUrlItWasPassed, modelItWasPassed;
        jack(function() {
            jack.grab($.Controller.prototype, "lidView").specify().once().mock(function($element, viewUrl, model) {
                elementItWasPassed = $element;
                viewUrlItWasPassed = viewUrl;
                modelItWasPassed = model;
            });
            $.Controller.prototype.metaview(wrappedSetWithOnlyOneElement, 'view url', testModelInstance);
        });
        
        expect(elementItWasPassed).toBe(wrappedSetWithOnlyOneElement);
        expect(viewUrlItWasPassed).toEqual('view url');
        expect(modelItWasPassed).toBe(testModelInstance);
    });

    it("should augment $.EJS.Helpers.prototype with the special helpers, call view, then remove the special helpers afterwards", function() {
        var helpersBeforeCallToMetaview = $.extend({},
        $.EJS.Helpers.prototype),
            helpersAtTimeLidViewIsCalled, helpersAfterMetaviewHasFinished, elementItWasPassed, viewUrlItWasPassed, modelItWasPassed;

        jack(function() {
            jack.grab($.Controller.prototype, "lidView").specify().once().mock(function($element, viewUrl, model) {
                helpersAtTimeLidViewIsCalled = $.extend({},
                $.EJS.Helpers.prototype);
                elementItWasPassed = $element;
                viewUrlItWasPassed = viewUrl;
                modelItWasPassed = model;
            });

            $.Controller.prototype.metaview(wrappedSetWithOnlyOneElement, 'view url', testModelInstance);
            helpersAfterMetaviewHasFinished = $.extend({},
            $.EJS.Helpers.prototype);

        });

        expect(elementItWasPassed).toBe(wrappedSetWithOnlyOneElement);
        expect(viewUrlItWasPassed).toEqual('view url');
        expect(modelItWasPassed).toBe(testModelInstance);

        expect(helpersBeforeCallToMetaview).toEqual(helpersAfterMetaviewHasFinished);
        expect(helpersBeforeCallToMetaview).toEqual(helpersAfterMetaviewHasFinished);
        expect(helpersBeforeCallToMetaview).not.toEqual(helpersAtTimeLidViewIsCalled);
        expect(helpersAfterMetaviewHasFinished).not.toEqual(helpersAtTimeLidViewIsCalled);
        
        expect(helpersBeforeCallToMetaview.hasOwnProperty("meditorFor")).toBeFalsy();
        expect(helpersAtTimeLidViewIsCalled.hasOwnProperty("meditorFor")).toBeTruthy();
        expect(helpersAfterMetaviewHasFinished.hasOwnProperty("meditorFor")).toBeFalsy();
    });
});

describe("ControllerExtensions: meditorFor: The meditorFor helper", function() {

    beforeEach(function() {
        var temp = setUpSomeTestVariables();
        testModelClass = temp.testModelClass;
        testModelInstance = temp.testModelInstance;
    });

    it("should produce the meditorFor helper", function() {
        var helpers = $.Controller.prototype.metaview._makeHelpers(testModelInstance);
        expect(helpers).toBeDefined();
        expect(helpers.meditorFor).toBeDefined();
    });

    it("should throw if you give it an attribute name that the model does not know", function() {
        var helpers = $.Controller.prototype.metaview._makeHelpers(testModelInstance);
        expect(function() {
            helpers.meditorFor("unknownAttribute");
        }).toThrow();
    });

    it("should also take multiple attributes, and just render them one after the other", function() {
        var result, metaHelpers = $.Controller.prototype.metaview._makeHelpers(testModelInstance);
        testModelInstance.ssn = "234-56-7892";
        jack(function() {
            var myContext = {
                EditorFor: function() {
                    throw "oops, you didn't mean to call the actual impl ... you meant to mock it";
                }
            };

            jack.grab(myContext, "EditorFor").specify().exactly("4 times").returnValue("This is what EditorFor returned!");
            result = metaHelpers.meditorFor.call(myContext, "ssn", "firstName", "lastName", "doNotSolicit");
        });
        
        expect(result.match(/This is what EditorFor returned/g).length).toEqual(4);
    });

});



function setUpSomeTestVariables() {
    var testModelClass, testModelInstance;

    testModelClass = $.Model.extend('_testModel');

    testModelClass._setSchema({
        "description": "Customer Contact Information",
        "type": "object",
        "properties": {
            "id": {
                "title": "The id for this instance of Customer Contact Information",
                "type": "string"
            },
            "ssn": {
                "title": "SSN / Alien ID",
                "type": "string",
                "format": "ssn"
            },
            "hasAlienSsn": {
                "title": "Is Alien ID",
                "type": "Boolean"
            },
            "firstName": {
                "title": "First Name",
                "type": "string",
                "maxLength": 30
            },
            "lastName": {
                "title": "Last Name",
                "type": "string",
                "maxLength": 50
            },
            "middleName": {
                "title": "Middle Name",
                "type": "string",
                "maxLength": 50
            },
            "homeAddressLine1": {
                "title": "Street Address 1",
                "type": "string",
                "maxLength": 50
            },
            "homeAddressLine2": {
                "title": "Street Address 2",
                "type": "string",
                "maxLength": 50
            },
            "city": {
                "title": "City",
                "type": "string",
                "maxLength": 40
            },
            "zipCode": {
                "title": "Zip Code",
                "type": "string",
                "format": "postal-code"
            },
            "county": {
                "title": "County",
                "type": "string",
                "maxLength": 40
            },
            "homePhone": {
                "title": "Home Phone",
                "type": "string",
                "format": "phone"
            },
            "cellPhone": {
                "title": "Cell Phone",
                "type": "string",
                "format": "phone"
            },
            "pagerPhone": {
                "title": "Work/Pager",
                "type": "string",
                "format": "phone"
            },
            "smsOptIn": {
                "title": "Text Message Opt. In",
                "type": "Boolean"
            },
            "email": {
                "type": "string",
                "format": "email"
            },
            "doNotSolicit": {
                "title": "Do Not Solicit",
                "type": "Boolean"
            }
        }
    });

    testModelInstance = new _testModel();

    return {
        testModelClass: testModelClass,
        testModelInstance: testModelInstance
    };
}

describe("ControllerExtensions: lidView: The lidView method on all controllers", function() {

    var wrappedSetWithOnlyOneElement;

    beforeEach(function() {
        wrappedSetWithOnlyOneElement = $("<div></div>");
    });

    it("should put lidView onto $.Controller.prototype", function() {
        expect($.Controller.prototype).toBeDefined();
        expect($.Controller.prototype.lidView).toBeDefined();
    });

    it("should require that the first parameter be the wrapped set of a *SINGLE* element", function() {
        expect(function() {
            $.Controller.prototype.lidView(undefined);
        }).toThrow();

        expect(function() {
            $.Controller.prototype.lidView({});
        }).toThrow();

        var wrappedSetWithManyElements = $("<div></div><div></div>");
        expect(function() {
            $.Controller.prototype.lidView(wrappedSetWithManyElements);
        }).toThrow();

        var wrappedSetWithOnlyOneElement = $("<div></div>");
        var unwrappedRawDomElement = wrappedSetWithOnlyOneElement[0];
        expect(function() {
            $.Controller.prototype.lidView(unwrappedRawDomElement);
        }).toThrow();
    });

    it("should render the html into the element provided and return undefined", function() {
        var result;

        jack(function() {
            jack.grab($.Controller.prototype, "view").specify().withArguments(1, 2, 3, 4, 5, true, false, 42, 42, 42).returnValue("this is from view()");
            jack.grab(wrappedSetWithOnlyOneElement, "html").specify().once().withArguments("this is from view()");
            result = $.Controller.prototype.lidView(wrappedSetWithOnlyOneElement, 1, 2, 3, 4, 5, true, false, 42, 42, 42);
        });

        expect(result).not.toBeDefined();
    });

    it("should put no constraints on the parameters you pass (other than that the first parameter must be the dom element to insert into), and should faithfully pass them along to $.Controller.prototype.view()", function() {
        jack(function() {
            jack.grab($.Controller.prototype, "view").specify().withArguments(1, 2, 3, 4, 5, true, false, 42, 42, 42).returnValue("this is from view()");
            result = $.Controller.prototype.lidView(wrappedSetWithOnlyOneElement, 1, 2, 3, 4, 5, true, false, 42, 42, 42);
        });
    });

    it("should augment $.EJS.Helpers.prototype with the special lid-related helpers, call view, then remove the special helpers afterwards", function() {
        var helpersBeforeCallToLidView = $.extend({},
        $.EJS.Helpers.prototype),
            helpersAtTimeViewIsCalled, helpersAfterLidViewHasFinished;

        jack(function() {
            jack.grab($.Controller.prototype, "view").specify().once().mock(function() {
                helpersAtTimeViewIsCalled = $.extend({},
                $.EJS.Helpers.prototype);
                return "this is from view()";
            });

            $.Controller.prototype.lidView(wrappedSetWithOnlyOneElement, 'view url');

            helpersAfterLidViewHasFinished = $.extend({},
            $.EJS.Helpers.prototype);
        });

        expect(helpersBeforeCallToLidView).toEqual(helpersAfterLidViewHasFinished);
        expect(helpersBeforeCallToLidView).not.toEqual(helpersAtTimeViewIsCalled);
        expect(helpersAfterLidViewHasFinished).not.toEqual(helpersAtTimeViewIsCalled);

        assertThatEditorForIsNotAvailableBeforeCallingLidView();
        assertThatEditorForIsAvailableAtTheTimeThatLidViewCallsView();
        assertThatEditorForIsNotAvailableAfterCallingLidViewCompletes();



        function assertThatEditorForIsNotAvailableBeforeCallingLidView() {
            expect(helpersBeforeCallToLidView.EditorFor).not.toBeDefined();
        }



        function assertThatEditorForIsAvailableAtTheTimeThatLidViewCallsView() {
            expect(helpersAtTimeViewIsCalled.EditorFor).toBeDefined();
        }



        function assertThatEditorForIsNotAvailableAfterCallingLidViewCompletes() {
            expect(helpersAfterLidViewHasFinished.EditorFor).not.toBeDefined();
        }
    });
});



function getSomeMockLidHtml() {
    var result = '<fieldset class="GroupPanel" layout="width: 100; height: fixed;" resizable="true" style="width: 1518px;"><legend layout="width: ignore; height: fixed" class="GroupPanel-Legend">Underwriting</legend> <div name="hasValidGovernmentIssuedId" layout="width: fill 100; height: fixed;" resizable="true" class="lid_container" style="width: 1516px;"><div class="Field-Label" name="hasValidGovernmentIssuedId" layout="width: 25 50 200; height: fixed" style="width: 198px;">Valid Government issued I.D.</div><input type="checkbox" class="Field-Input" schemaid="4332AD7C-131C-FD4B-D40D-9E4227103BEC" title="Valid Government issued I.D." value="" name="hasValidGovernmentIssuedId" layout="width: fixed; height: fixed"><div class="Field-Decoration" name="hasValidGovernmentIssuedId" layout="width: 25 20 50; height: fixed" style="width: 48px;"></div><div class="ui-helper-clearfix" style=""></div></div>        <div name="areApplicantsOldEnough" layout="width: fill 100; height: fixed;" resizable="true" class="lid_container" style="width: 1516px;"><div class="Field-Label" name="areApplicantsOldEnough" layout="width: 25 50 200; height: fixed" style="width: 198px;">Applicant(s) are of age 18 or older</div><input type="checkbox" class="Field-Input" schemaid="10D8782A-A630-D387-D43D-2265EA5BBC25" title="Applicant(s) are of age 18 or older" value="" name="areApplicantsOldEnough" layout="width: fixed; height: fixed"><div class="Field-Decoration" name="areApplicantsOldEnough" layout="width: 25 20 50; height: fixed" style="width: 48px;"></div><div class="ui-helper-clearfix" style=""></div></div>        <div name="didApplicantsAnswerNoToAllAddendumQuestionsAndSignAddendum" layout="width: fill 100; height: fixed;" resizable="true" class="lid_container" style="width: 1516px;"><div class="Field-Label" name="didApplicantsAnswerNoToAllAddendumQuestionsAndSignAddendum" layout="width: 25 50 200; height: fixed" style="width: 198px;">Applicant(s) answered NO to all questions on the Customer Application Addendum and have signed the Addendum</div><input type="checkbox" class="Field-Input" schemaid="7B7B0E46-93BA-BF98-35C6-F1AE07ECC064" title="Applicant(s) answered NO to all questions on the Customer Application Addendum and have signed the Addendum" value="" name="didApplicantsAnswerNoToAllAddendumQuestionsAndSignAddendum" layout="width: fixed; height: fixed"><div class="Field-Decoration" name="didApplicantsAnswerNoToAllAddendumQuestionsAndSignAddendum" layout="width: 25 20 50; height: fixed" style="width: 48px;"></div><div class="ui-helper-clearfix" style=""></div></div>        <div name="hasValidTitleWithNoLiens" layout="width: fill 100; height: fixed;" resizable="true" class="lid_container" style="width: 1516px;"><div class="Field-Label" name="hasValidTitleWithNoLiens" layout="width: 25 50 200; height: fixed" style="width: 198px;">Valid Title With No Liens</div><input type="checkbox" class="Field-Input" schemaid="0B8AE3A3-0019-45D9-96F4-A4FC1AEA8C05" title="Valid Title With No Liens" value="" name="hasValidTitleWithNoLiens" layout="width: fixed; height: fixed"><div class="Field-Decoration" name="hasValidTitleWithNoLiens" layout="width: 25 20 50; height: fixed" style="width: 48px;"></div><div class="ui-helper-clearfix" style=""></div></div>        <div name="hasThreeOrMoreReferences" layout="width: fill 100; height: fixed;" resizable="true" class="lid_container" style="width: 1516px;"><div class="Field-Label" name="hasThreeOrMoreReferences" layout="width: 25 50 200; height: fixed" style="width: 198px;">Three Complete References</div><input type="checkbox" class="Field-Input" schemaid="784A7255-4CA7-DD1E-89FF-77A754E12996" title="Three Complete References" value="" name="hasThreeOrMoreReferences" layout="width: fixed; height: fixed"><div class="Field-Decoration" name="hasThreeOrMoreReferences" layout="width: 25 20 50; height: fixed" style="width: 48px;"></div><div class="ui-helper-clearfix" style=""></div></div>        <div name="hasProofOfResidency" layout="width: fill 100; height: fixed;" resizable="true" class="lid_container" style="width: 1516px;"><div class="Field-Label" name="hasProofOfResidency" layout="width: 25 50 200; height: fixed" style="width: 198px;">Proof of Residency</div><input type="checkbox" class="Field-Input" schemaid="B991E13F-1679-AB0A-338D-90EBCBEDDDA1" checked="checked" title="Proof of Residency" value="true" name="hasProofOfResidency" layout="width: fixed; height: fixed"><div class="Field-Decoration" name="hasProofOfResidency" layout="width: 25 20 50; height: fixed" style="width: 48px;"></div><div class="ui-helper-clearfix" style=""></div></div>        <div name="doesGrossMonthlyIncomeExceedLoanPayment" layout="width: fill 100; height: fixed;" resizable="true" class="lid_container" style="width: 1516px;"><div class="Field-Label" name="doesGrossMonthlyIncomeExceedLoanPayment" layout="width: 25 50 200; height: fixed" style="width: 198px;">Proof of Gross Monthly Income at ???? exceeds the calculated loan payment</div><input type="checkbox" class="Field-Input" schemaid="4259B19B-972B-429F-D892-BEC9D96D2E38" checked="checked" title="Proof of Gross Monthly Income at ???? exceeds the calculated loan payment" value="true" name="doesGrossMonthlyIncomeExceedLoanPayment" layout="width: fixed; height: fixed"><div class="Field-Decoration" name="doesGrossMonthlyIncomeExceedLoanPayment" layout="width: 25 20 50; height: fixed" style="width: 48px;"></div><div class="ui-helper-clearfix" style=""></div></div>        <div name="isLoanAmountAtOrLowerThan80PercentOfAcv" layout="width: fill 100; height: fixed;" resizable="true" class="lid_container" style="width: 1516px;"><div class="Field-Label" name="isLoanAmountAtOrLowerThan80PercentOfAcv" layout="width: 25 50 200; height: fixed" style="width: 198px;">Loan amount of ???? does NOT exceed 80% of ACV</div><input type="checkbox" class="Field-Input" schemaid="41251870-14C1-59F4-D879-E757D6531424" title="Loan amount of ???? does NOT exceed 80% of ACV" value="" name="isLoanAmountAtOrLowerThan80PercentOfAcv" layout="width: fixed; height: fixed"><div class="Field-Decoration" name="isLoanAmountAtOrLowerThan80PercentOfAcv" layout="width: 25 20 50; height: fixed" style="width: 48px;"></div><div class="ui-helper-clearfix" style=""></div></div>         </fieldset>';
    return result;
}
