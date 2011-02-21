/* -*- Mode: jasmine; tab-width: 4; indent-tabs-mode: nil; */

describe("jack", function() {
    it("should be possible to mock a global function", function() {
        window.addThree = function(x) {
            return x + 3;
        };

        expect(addThree(10)).toEqual(13);

        jack(function() {
            jack.expect("addThree").mock(function() {
                return 42;
            });

            expect(addThree(10)).toEqual(42);
        });

        var report = jack.report("addThree");

        expect(report.expected).toEqual(1);
        expect(report.actual).toEqual(1);
        expect(report.success).toBeTruthy();
    });

    it("should be possible to return a different value each time a mocked function is called", function() {
        var o = {
            someFunc: function() {
                throw "oops, you didn't mean to call the real impl!";
            }
        };

        var first, second;
        var grab1, grab2;

        jack(function() {
            grab1 = jack.grab(o, "someFunc");
            grab1.expect().exactly("2 times").returnValues("The return from the first call", "The return from the second call");
            first = o.someFunc();
            second = o.someFunc();
        });

        expect(first).toEqual("The return from the first call");
        expect(second).toEqual("The return from the second call");

        var report = jack.report("[local].someFunc");
        expect(report.expected).toEqual(2);
        expect(report.actual).toEqual(2);
        expect(report.success).toBeTruthy();
    });
});
