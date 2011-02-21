// vim: set filetype=jasmine.javascript :

describe("List Topped Tab Controller", function() {
    var $el,
        options = {
                header: ["First Name", "Middle", "Last Name"]
        };

    beforeEach(function() {
        $el = $("<div/>");
        $el.appendTo($('body'));
    });

    afterEach(function() {
        $el.remove();
    });

    describe("Initialization", function() {
        it("Should require an [options] parameter.", function() {
            expect(function(){
                $el.jmvc_machinery_framework_list_topped_tab(undefined);
            }).toThrow();
        });

        it("Should require a header on the options", function() {
            expect(function(){
                $el.jmvc_machinery_framework_list_topped_tab({});
            }).toThrow();
        });

        it("Should accept a good options object", function() {
            expect(function(){
                $el.jmvc_machinery_framework_list_topped_tab(options);
            }).not.toThrow();
        });
    });

    describe("Usage", function() {
        var controller;

        beforeEach(function() {
            $el.jmvc_machinery_framework_list_topped_tab(options);
            controller = $el.controller();
        });

        afterEach(function() {
            controller.destroy();
        });

        describe("DOM Interactions", function() {

            it("should be created", function() {
                expect($el.hasClass("jmvc_machinery_framework_list_topped_tab")).toBeTruthy();
            });


            it("should create a top", function() {
                expect($el.find("div[name=top]").length).toBeGreaterThan(0);
            });

            it("should create a bottom", function() {
                expect($el.find("div[name=bottom]").length).toBeGreaterThan(0);
            });

            it("should render the tabs in the bottom", function() {
                expect($el.find("div[name=bottom]").hasClass("ui-tabs")).toBeTruthy();
            });
        });

        describe("Adding a Tab", function() {
            it("should accept a row object", function() {
                var result = controller.addTab({text: "Test Tab"}, {"Name": "Joe", "Age": "23"});
                expect(result).not.toBeUndefined();
            });

            it("should require a row object", function() {
                expect(function(){
                    controller.addTab({text: "Another Tab"}, undefined);
                }).toThrow();
            });

            describe("Resulting object", function() {
                var row = {"Name" : "Test"},
                    result;

                beforeEach(function() {
                    result = controller.addTab("label", row);
                });

                it("should stick the row on the resulting tab", function() {
                    expect(result.row).not.toBeUndefined();
                    expect(result.row).toBe(row);
                });

                it("should stick the tab on the row (on the tab)", function() {
                    expect(result.row.tab).not.toBeUndefined();
                    expect(result.row.tab).toBe(result);
                });
            });
        });

        describe("Updating a Row", function() {

            it("should update the row", function() {
                var tab = controller.addTab("test", {"First Name" : "Old"});
                tab.row["First Name"] = "New";
                controller.updateRow(tab.row);
                expect($el.find("tr[name!=header] td").first().text()).toEqual("New");
            });

        });

        describe("Interaction", function() {
            var firstRow = {"First Name" : "One First", "Middle" : "One Middle", "Last Name" : "One Last"},
                secondRow = {"First Name" : "Two First", "Middle" : "Two Middle", "Last Name" : "Two Last"};

            beforeEach(function() {
                controller.addTab("First", firstRow);
                controller.addTab("First", secondRow);
            });

            describe("When a tab is clicked", function() {
                beforeEach(function() {
                    $el.find("div[name=bottom].ui-tabs").tabs("select", 1);
                });

                it("should highlight the correct row", function() {
                    expect($el.find("tr[name!=header]").last().hasClass("ui-state-highlight")).toBeTruthy();
                });
            });

            describe("When a row is clicked", function() {
                beforeEach(function() {
                    $el.find("tr[name!=header]").last().click();
                });

                it("should select the correct tab", function() {
                    expect($el.find("ul.ui-tabs-nav li").last().hasClass("ui-tabs-selected")).toBeTruthy();
                });

            });
        });

    });

});

