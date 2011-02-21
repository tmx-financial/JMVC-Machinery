/* -*- Mode: jasmine; tab-width: 4; indent-tabs-mode: nil; */

describe("JmvcMachinery member scanning plugin", function() {
    var helpers = {
        crockfordBeget: function(o) {
            function F() {}
            F.prototype = o;
            return new F();
        }
    };

    var sampleTarget = {
        the: 1,
        sky: 2,
        is: "this is a verb",
        so: "this is not a verb",
        blue: "this is a pretty color",
        today: 42,
        man: [1, 2, 3, 4, 5]
    };

    describe("The jQuery.scanMembers function", function() {
        it("should be available on jQuery", function() {
            expect($.scanMembers).toBeDefined();
            expect(typeof($.scanMembers)).toEqual("function");
        });

        it("should throw if you don't pass it an object", function() {
            expect(function() {
                $.scanMembers(undefined);
            }).toThrow();
        });

        it("should return an object with the useful linq-like operators", function() {
            var result = $.scanMembers({});
            
            expect(result.select).toBeDefined();
            expect(result.where).toBeDefined();
        });
    });

    describe("the results function", function() {
        it("should return an object with all of the members if you have not performed any queries", function() {
            var result = $.scanMembers({
                meaningOfLife: 42,
                firstName: "bob"
            }).results();
            
            expect(result.meaningOfLife).toBeDefined();
            expect(result.firstName).toBeDefined();
        });
    });

    describe("the own filter", function() {
        it("should give you back only the properties where hasOwnProperty is true", function() {
            var prototype = {
                thisIsNotAnOwnProperty: 42
            };
            var target = helpers.crockfordBeget(prototype);
            target.thisIsAnOwnProperty = "this one is an own property";
            
            var full_result = $.scanMembers(target).results();
            expect(full_result.thisIsNotAnOwnProperty).toBeDefined();
            expect(full_result.thisIsAnOwnProperty).toBeDefined();
            
            var result = $.scanMembers(target).own().results();
            
            expect(result.thisIsAnOwnProperty).toBeDefined();
            expect(result.thisIsNotAnOwnProperty).not.toBeDefined();
        });
    });

    describe("the where operator", function() {
        it("should elimiate all members that do not meet its predicate", function() {
            var resultOne = $.scanMembers(sampleTarget).where(function(k, v) {
                return k.indexOf('e') > 0;
            }).results();
            
            expect(resultOne.the).toBeDefined();
            expect(resultOne.blue).toBeDefined();
            
            expect(resultOne.sky).not.toBeDefined();
            expect(resultOne.is).not.toBeDefined();
            expect(resultOne.so).not.toBeDefined();
            expect(resultOne.today).not.toBeDefined();
            expect(resultOne.man).not.toBeDefined();

            var resultTwo = $.scanMembers(sampleTarget).where(function(k, v) {
                return (jQuery.type(v) == "number");
            }).results();
            
            expect(resultTwo.the).toBeDefined();
            expect(resultTwo.sky).toBeDefined();
            expect(resultTwo.today).toBeDefined();
            
            expect(resultTwo.is).not.toBeDefined();
            expect(resultTwo.so).not.toBeDefined();
            expect(resultTwo.blue).not.toBeDefined();
            expect(resultTwo.man).not.toBeDefined();
        });

        it("should be chainable with itself and the own operator", function() {
            var prototype = {
                thisIsNotAnOwnProperty: 42
            };
            
            var target = helpers.crockfordBeget(prototype);
            $.extend(target, sampleTarget);
            
            var result = $.scanMembers(target).results();
            
            expect(result.the).toBeDefined();
            expect(result.sky).toBeDefined();
            expect(result.is).toBeDefined();
            expect(result.so).toBeDefined();
            expect(result.blue).toBeDefined();
            expect(result.today).toBeDefined();
            expect(result.man).toBeDefined();

            var chainedQuery = $.scanMembers(target).own().where(function(k, v) {
                return k.length > 2;
            }).where(function(k, v) {
                return jQuery.type(v) != "number";
            });
            
            result = chainedQuery.results();
            
            expect(result.blue).toBeDefined();
            expect(result.man).toBeDefined();
            
            expect(result.the).not.toBeDefined();
            expect(result.sky).not.toBeDefined();
            expect(result.is).not.toBeDefined();
            expect(result.so).not.toBeDefined();
            expect(result.today).not.toBeDefined();
            
            expect(result.thisIsNotAnOwnProperty).not.toBeDefined();
        });
    });

    describe("the select operator", function() {
        it("should simply perform a map operation and give you back the stuff you want", function() {
            var myResults = $.scanMembers(sampleTarget).where(function(k, v) {
                return jQuery.type(v) == "number";
            }).select(function(k, v) {
                return v * 2;
            });
            
            expect(myResults).toEqual([2, 4, 84]);
        });
    });

    describe("The count operator", function() {
        it("should give correct results", function() {
            var prototype = {
                thisIsNotAnOwnProperty: 42
            };
            var target = helpers.crockfordBeget(prototype);
            $.extend(target, sampleTarget);

            expect($.scanMembers(target).count()).toEqual(8);
            expect($.scanMembers(target).own().count()).toEqual(7);
        });
    });

    describe("The keys operator", function() {
        it("should return array of all the keys", function() {
            expect($.scanMembers(sampleTarget).keys()).toEqual(['the', 'sky', 'is', 'so', 'blue', 'today', 'man']);
        });
    });
});
