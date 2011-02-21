/* -*- Mode: jasmine; tab-width: 4; indent-tabs-mode: nil; */

//--------MODULE HEADER----------
(function(GLOBAL, undefined) {
"use strict";
//===============================

$.Model.extend('AttachSchema.UsesUniverse',
/* @Static */
 {
    init: function () {
        this.attachSchema();
    },
    schema_properties: [
    "applicantFirstName",
    "applicantLastName"
    ]
},
/* @Prototype */
{});


describe("attachSchema", function() {
    describe("When schema_properties is an array", function() {
        var model,
            firstName;

        beforeEach(function() {
            model = new AttachSchema.UsesUniverse();
            firstName = model.getSchemaFor("applicantFirstName");
        });
        it("should load the identified schema bits from the attribute universe", function() {
            expect(firstName.type).toEqual("string");
            expect(firstName.maxLength).toEqual(30);
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
