/* -*- Mode: jasmine; tab-width: 4; indent-tabs-mode: nil; */

//--------MODULE HEADER----------
(function(GLOBAL) {
"use strict";
//===============================

describe("JmvcMachinery Model Extensions - Produce Derived Attribute", function() {
    var counter = 0;

    var defaultStaticMembers = {
        init: function () {
            this.attachSchema();
        },
        schema_properties: [
            "applicantLastName",
            "applicantFirstName"
        ]
    };

    var defaultSchema = { type: "string" };

    var defaultAttributeOptions = {
        dependsOnAttributes: ["applicantFirstName"],
        getter: function() {
            if (!this.applicantFirstName) return undefined;
            return this.applicantFirstName.slice(0,1);
        }
    };

    function buildKlass(className, static_members) {
        static_members = static_members || defaultStaticMembers;
        return $.Model.extend(className + counter, static_members, {});
    }

    beforeEach(function() {
        counter++;
    });

    describe("Invalid Schema", function() {
        var klass;
        beforeEach(function() {
            klass = buildKlass('Test.Models.ProducesDerivedAttribute.InvalidSchema');
        });

        it("should blow up if an invalid schema is provided for the derived attribute", function() {
            expect(function() {
                klass.produceDerivedAttribute("applicantFirstInitial", defaultAttributeOptions);
            }).toThrow();

            expect(function() {
                klass.produceDerivedAttribute("applicantFirstInitial", {}, defaultAttributeOptions);
            }).toThrow();
        });
    });

    describe("Getter Missing", function() {
        var klass;
        beforeEach(function() {
            klass = buildKlass('Test.Models.ProducesDerivedAttribute.InvalidGetter');
        });

        it("should blow up if no valid getter is provided for the derived attribute", function() {
            var options = $.extend(true, {}, defaultAttributeOptions);
            delete options.getter;

            expect(function() {
                klass.produceDerivedAttribute("applicantFirstInitial", defaultSchema, options);
            }).toThrow();
        });
    });

    describe("Dependencies not declared", function() {
        var klass;
        beforeEach(function() {
            klass = buildKlass('Test.Models.ProducesDerivedAttribute.DependenciesNotDeclared');
        });

        it("should blow up if dependencies are not provided to produceDerivedAttribute.", function() {
            var options = $.extend(true, {}, defaultAttributeOptions);
            delete options.dependsOnAttributes;

            expect(function() {
                klass.produceDerivedAttribute("applicantFirstInitial", defaultSchema, options);
            }).toThrow();
        });
    });

    describe("Missing Dependency", function() {
        var klass;
        beforeEach(function() {
            var statics = $.extend(true, {}, defaultStaticMembers);
            statics.schema_properties = [ "applicantLastName" ];

            klass = buildKlass("Test.Models.ProducesDerivedAttribute.MissingDependency", statics);
        });

        it("should blow up if a dependency of the derived attribute is missing", function() {
            expect(function() {
                klass.produceDerivedAttribute("applicantFirstInitial", defaultSchema, defaultAttributeOptions);
            }).toThrow();
        });
    });

    describe("Attribute already Defined", function() {
        var klass;
        beforeEach(function() {
            var statics = $.extend(true, {}, defaultStaticMembers);
            statics.schema_properties.push("applicantFirstInitial");

            klass = buildKlass("Test.Models.ProducesDerivedAttribute.MissingDependency", statics);
        });

        it("should blow up if the derived attribute is already defined as an attribute", function() {
            expect(function() {
                klass.produceDerivedAttribute("applicantFirstInitial", defaultSchema, defaultAttributeOptions);
            }).toThrow();
        });
    });

    describe("Happy Path", function() {
        var klass;
        beforeEach(function() {
            klass = buildKlass('Test.Models.ProducesDerivedAttribute.Valid');
        });

        it("should succeed if the call is valid.", function() {
            expect(function() {
                klass.produceDerivedAttribute("applicantFirstInitial", defaultSchema, defaultAttributeOptions);
            }).not.toThrow();
        });
    });

    describe("The produced attribute", function() {
        var model;
        var klass;

        beforeEach(function() {
            klass = buildKlass('Test.Models.ProducesDerivedAttribute.Valid');
            klass.produceDerivedAttribute("applicantFirstInitial", defaultSchema, defaultAttributeOptions);

            model = new klass();
        });

        it("should include the derived attribute in it's attributes list and schema", function() {
            expect(klass.attributes["applicantFirstInitial"]).toBeDefined();
            expect(klass.schema.properties["applicantFirstInitial"]).toBeDefined();
            expect(klass.schema.properties["applicantFirstInitial"].type).toEqual("string");
            expect(klass.schema.properties["applicantFirstInitial"].readOnly).toBeTruthy();
        });

        it("should not allow the derived attribute to be set", function() {
            expect(function() {
                model.attr("applicantFirstInitial", "J");
            }).toThrow();
        });

        it("should raise an event with one of it's dependencies changes", function() {
            var messageTrap = new TestHelpers.Messaging.MessageTrap();
            messageTrap.listenTo(model).andTrap("applicantFirstName applicantFirstInitial");

            model.attr("applicantFirstName", "John");

            expect(model.attr("applicantFirstName")).toEqual("John");
            expect(messageTrap.count("applicantFirstName")).toEqual(1);
            expect(messageTrap.count("applicantFirstInitial")).toEqual(1);
        });

        it("should be gettable", function() {
            model.attr("applicantFirstName", "Andrew");
            expect(function() {
                var initial = model.attr("applicantFirstInitial");
            }).not.toThrow();
        });

        it("should not be settable", function() {
            expect(function() {
                var initial = model.attr("applicantFirstInitial", "A");
            }).toThrow();
        });

    });

    describe("Getter context", function() {
        var klass = buildKlass('Test.Models.ProducesDerivedAttribute.Valid');

        var options = $.extend(true, {}, defaultAttributeOptions);
        options.getter = function() {
            var proxy = this;

            it("should provide depended upon attributes as immediate members on the getter context", function() {
                expect(proxy.Class).not.toBeDefined();
            });

            it("should provide only dependencies for the getter implementation", function() {
                expect(proxy.applicantFirstName).toBeDefined();
            });

            if (!this.applicantFirstName) return undefined;
            return this.applicantFirstName.slice(0,1);
        };

        klass.produceDerivedAttribute("applicantFirstInitial", defaultSchema, defaultAttributeOptions);
        var model = new klass();

        model.attr("applicantFirstName", "Ted");
        var result = model.attr("applicantFirstInitial");

        it("should provide depended upon attributes as immediate members on the getter context", function() {
            expect(result).toEqual("T");
        });
    });
});

//===============================
} (function() {
    return this;
}()));
//===============================
