//--------MODULE HEADER----------
(function(GLOBAL) {
"use strict";
//===============================
    function shouldContainOnly(expectedArray) {
        if(! _.isArray(expectedArray)) throw new Error("You must pass an array to shouldContainOnly.");
        var thisArray = this;
        jasmine.log("EXPECTED: ", expectedArray);
        jasmine.log("==========================");
        jasmine.log("ACTUAL: ", thisArray);

        _(expectedArray).each(function(item, index) {
            expect(thisArray).toContain(item);
        });

        expect(thisArray.length).toEqual(expectedArray.length);
    }

    if(! Array.prototype.shouldContainOnly) {
        Array.prototype.shouldContainOnly = shouldContainOnly;
    }

//===============================
} (function() {
    return this;
}()));
//===============================
