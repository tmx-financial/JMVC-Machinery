/* -*- Mode: jasmine; tab-width: 4; indent-tabs-mode: nil; */

//--------MODULE HEADER----------
(function(GLOBAL, undefined) {
    "use strict";
    //===============================

    describe("The proxy machinery", function() {
        var model1 , model2;

        beforeEach(function() {
            model1 = makeFakeModelInstance("Fred", "Helen", "Flintstone");
            model2 = makeFakeModelInstance("Betty", "Ezra", "Rubble");
        });

        it("should make a proxy that you can call with many different instances", function() {
            var proxy = JmvcMachinery.Framework.Characteristics.Proxy.newProxy("someAttributeName", ["firstName", "middleName", "lastName"], {
                firstName: "thePersonsFirstName",
                middleName: "thatMiddleNameSheHates"
            });

            var theFunction = function() {
                return {
                    thePersonsFirstName: this.thePersonsFirstName(),
                    thatMiddleNameSheHates: this.thatMiddleNameSheHates(),
                    lastName: this.lastName()
                };
            };

            var fromModel1 = proxy.callWith(theFunction, model1);

            expect(fromModel1.thePersonsFirstName).toBe("Fred");
            expect(fromModel1.thatMiddleNameSheHates).toBe("Helen");
            expect(fromModel1.lastName).toBe("Flintstone");

            var fromModel2 = proxy.callWith(theFunction, model2);

            expect(fromModel2.thePersonsFirstName).toBe("Betty");
            expect(fromModel2.thatMiddleNameSheHates).toBe("Ezra");
            expect(fromModel2.lastName).toBe("Rubble");
        });

        it("should work just fine when called with no aliases whatsoever", function() {
            var proxy = JmvcMachinery.Framework.Characteristics.Proxy.newProxy("someAttributeName", ["firstName", "middleName", "lastName"]);

            var theFunction = function() {
                return {
                    firstName: this.firstName(),
                    middleName: this.middleName(),
                    lastName: this.lastName()
                };
            };

            var result = proxy.callWith(theFunction, model1);

            expect(result.firstName).toBe("Fred");
            expect(result.middleName).toBe("Helen");
            expect(result.lastName).toBe("Flintstone");
        });
    });

    function makeFakeModelInstance(firstName, middleName, lastName) {
        var valid = ["firstName", "middleName", "lastName"];

        return {
            attr: function(attrName) {
                if(! attrName) throw "No attrName";
                if(! _.contains(valid, attrName)) throw "Unknown attrName: " + attrName;

                if(attrName === "firstName") return firstName;
                if(attrName === "lastName") return lastName;
                if(attrName === "middleName") return middleName;

                throw "Something went wrong with the test.";
            }
        };
    }

    //===============================
} (function() {
    return this;
}(),
(function() {
    return;
} ())));
//===============================
