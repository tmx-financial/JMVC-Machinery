// vim: set filetype=javascript.jasmine :

(function(GLOBAL){
"use strict";

describe("Simple Table List Controller", function() {
    var $el,
        controller,
        header = ["Name", "Status", "Etc."];

    beforeEach(function() {

        function assertIsJQuery(obj) {
            if (!(obj instanceof jQuery)) {
                throw new Error("The target of the assertion must be a jQuery wrapped object to use this matcher.");
            }
        }

        this.addMatchers({
            toHave: function(sizzle) {
                assertIsJQuery(this.actual);
                return this.actual.find(sizzle).length > 0;
            },
            toHaveClass: function(className) {
                assertIsJQuery(this.actual);
                return this.actual.hasClass(className);
            }
        });

        $el = $("<div/>");
        $el.jmvc_machinery_framework_simple_table_list(header);
        controller = $el.controller();
    });


    it("Should be creatable", function() {
        expect(controller).not.toBeUndefined();
    });

    it("Should mark the target as a widget", function() {
        expect($el).toHaveClass("ui-widget");
    });


    describe("Table", function() {
        var $table;

        beforeEach(function() {
            $table = $el.find("table").first();
        });

        it("Should construct a table", function() {
            expect($el).toHave("table");
        });

        it("Should be styled as widget content", function() {
            expect($table).toHaveClass("ui-widget-content");
        });

        it("Should have all four corners rounded", function() {
            expect($table).toHaveClass("ui-corner-all");
        });


        describe("Header", function() {
            var $header;

            beforeEach(function() {
                $header = $table.find("tr[name=header]").first();
            });


            it("Should render a header", function() {
                expect($table).toHave("tr[name=header]");
            });


            it("Should have the jqui heading class", function() {
                expect($header).toHaveClass("ui-widget-header");
            });

            describe("Columns", function() {
                _(header).each(function(item){
                    it("Should have a header item for " + item, function() {
                        expect($header).toHave("th[name=" + item + "]");
                        expect($header.find("th[name=" + item + "]").first().text()).toEqual(item);
                    });
                });
            });

        });

    });

    describe("Row API", function() {
        var theRow,
            uniqueId;

        beforeEach(function() {
            theRow = {};

            _(header).each(function(item){
                theRow[item] = "DATA for " + item;
            });

            uniqueId = theRow.ourUniqueId = _.uniqueId();
        });

        describe("addRow", function() {
            beforeEach(function() {
                controller.addRow(theRow);
            });

            it("Should allow a row to be added", function() {
                controller.addRow(theRow);
            });

            it("Should return the row object", function() {
                expect(controller.addRow(theRow)).toBe(theRow);
            });

            it("Should draw a row element", function() {
                expect($el).toHave("tr[name!=header]");
            });

            it("Should decorate rows with zebra stripe classes", function() {
                expect($el.find("tr").last()).toHaveClass("ui-grid-zebra-odd");
                controller.addRow(theRow);
                expect($el.find("tr").last()).toHaveClass("ui-grid-zebra-even");
            });

            it("Should include all the values from the row object", function() {
                var $row = $el.find("tr").last(),
                    $cells = $row.find("td");

                expect($cells.length).toEqual(header.length);

                _(header).each(function(item, index){
                    expect($cells[index].innerText).toEqual("DATA for " + item);
                });

            });

        });

    });

    describe("Row behavior", function() {
        var $row,
            row = {"Name" : "Test"};

        beforeEach(function() {
            controller.addRow(row);
            $row = $el.find("tr").last();
        });

        describe("Hovering", function() {

            describe("Mouse Enter", function() {
                beforeEach(function() {
                    controller["tr mouseenter"]($row[0]);
                });

                it("Should gain the highlight class", function() {
                    expect($row).toHaveClass("ui-state-hover");
                });
            });

            describe("Mouse Leave", function() {
                beforeEach(function() {
                    controller["tr mouseleave"]($row[0]);
                });
                it("Should lose the highlight class", function() {
                    expect($row).not.toHaveClass("ui-state-hover");
                });
            });

            it("Should not highlight the header row", function() {
                var $headerRow = $el.find("tr").first();
                controller["tr mouseenter"]($headerRow[0]);
                expect($headerRow).not.toHaveClass("ui-state-hover");
            });

        });

        describe("Clicking", function() {
            var messages;

            beforeEach(function() {
                messages = new TestHelpers.Messaging.MessageTrap();
                messages.listenToJQuery();
                $row.click();
            });

            it("Should get the hightlighted class", function() {
                expect($row).toHaveClass("ui-state-highlight");
            });

            it("Should not highlight the header row", function() {
                var $headerRow = $el.find("tr").first();
                $headerRow.click();
                expect($headerRow).not.toHaveClass("ui-state-hightlight");
            });

            it("Should clear the highlighting on previously clicked rows", function() {
                controller.addRow({"Name" : "Second"});
                var $last = $el.find("tr").last();

                $last.click();
                $row.click();

                expect($row).toHaveClass("ui-state-highlight");
                expect($last).not.toHaveClass("ui-state-highlight");
            });

            it("should raise a simple_table_list_row_clicked event", function() {
                expect(messages.getNames("simple_table_list_row_clicked").length).toBeGreaterThan(0);
            });

        });

        describe("Highlight Command", function() {
            describe("By object", function() {
                beforeEach(function() {
                    controller.highlight(row);
                });


                it("Should highlight the row", function() {
                    expect($row).toHaveClass("ui-state-highlight");
                });
            });

            describe("by index", function() {
                beforeEach(function() {
                    controller.highlight(0);
                });

                it("Should highlight the row", function() {
                    expect($row).toHaveClass("ui-state-highlight");
                });
            });

       });

        describe("Update Command", function() {
            it("Should replace the cell contents", function() {
                var $firstCell = $row.find("td").first();
                expect($firstCell.text()).toEqual(row.Name);
                row.Name = "NEW NAME";
                expect($firstCell.text()).not.toEqual(row.Name);
                controller.updateRow(row);
                $firstCell = $row.find("td").first();
                expect($firstCell.text()).toEqual(row.Name);
            });
        });


    });



});


}(function(){return this;}));
