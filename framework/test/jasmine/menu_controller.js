/* -*- Mode: jasmine; tab-width: 4; indent-tabs-mode: nil; */

describe("menu_controller", function() {
    beforeEach(function() {
        S.sync.open("//jmvc_machinery/framework/test/jasmine/menu_test.html");
    });

    describe("initialization", function() {
        it("should make a menu", function() {
          S.sync.expect.exists("div#fodder.jmvc-machinery-menu-marker");
        });
    });
});
