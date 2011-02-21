describe("ScreenBlueprint", function() {
    var bp;

    beforeEach(function() {
        bp = new JmvcMachinery.ScreenBlueprint();
    });

    describe("initialization", function() {
        it("should have made the type available", function() {
            expect(JmvcMachinery.ScreenBlueprint).toBeTruthy();
            var newInstance = new JmvcMachinery.ScreenBlueprint();
            expect(newInstance).toBeTruthy();
        });

        it("should respond correctly if you call it with new or without new", function() {
            var newInstance = new JmvcMachinery.ScreenBlueprint();
            expect(newInstance).toBeTruthy();
            expect(newInstance instanceof JmvcMachinery.ScreenBlueprint).toBe(true);

            var alsoOk = JmvcMachinery.ScreenBlueprint();
            expect(alsoOk).toBeTruthy();
            expect(alsoOk instanceof JmvcMachinery.ScreenBlueprint).toBe(true);
        });
    });

    describe("simply specifying tabs and sections", function() {
        it("should be possible to add tabs and sections in mass", function() {
            bp.addTabs("Coaches", "Players", "CityInfo");
            bp.addTab("TeamOwnerInfo").addSections("ContactData", "ShirtSize", "TeamAssets", "TeamCaptains");

            expect(bp.tabs().length).toEqual(4);
            expect(bp.tab("TeamOwnerInfo").sections().length).toEqual(4);
        });

        it("should prevent you from adding tab with same name twice", function() {
            bp.addTab("Foo");
            expect(function() {
                bp.addTab("Foo");
            }).toThrow("There is already a tab by the name of Foo (or that name is an illegal value).");
        });
        it("should prevent you from adding the same section to the same tab twice", function() {
            bp.addTab("TheTab");
            bp.tab("TheTab").addSection("TheSection");
            expect(function() {
                bp.tab("TheTab").addSection("TheSection");
            }).toThrow("There is already a section by the name of TheSection (or that name is an illegal value).");
        });

        it("should know whether or not a tab has sections", function() {
            bp.addTab("Foo");
            expect(bp.tab("Foo").hasSections()).toEqual(false);
            bp.tab("Foo").addSection("Bar");
            var result = bp.tab("Foo").hasSections();
            expect(result).toEqual(true);
        });

        it("Should know tab and section names, and should manage references correctly", function() {
            var tabObj = bp.addTab("Foo");
            expect(bp.tab("Foo").name()).toEqual("Foo");
            expect(tabObj).toBe(bp.tab("Foo"));
        });

        it("should return the section you just added from addSection (singular)", function() {
            var result = bp.addTab("Foo").addSection("Bar");
            expect(result).toBeTruthy();
            expect(result.name()).toEqual("Bar");
        });

        it("should be possible to add additional controllers by controller instance to a tab", function() {
            var someFunc = function() {};

            var result = bp.addTab("Foo").addAdditionalController(someFunc);
            expect(bp.tab("Foo").additionalControllers()).toContain(someFunc);
        });

        it("should be possible to add additional controllers by controller instance to a section", function() {
            var someFunc = function() {};
            var result = bp.addTab("Foo").addSection("Bar").addAdditionalController(someFunc);
            expect(bp.tab("Foo").section("Bar").additionalControllers()).toContain(someFunc);
        });
    });

    describe("deleting tabs and sections", function() {
        var tabWithSections;

        beforeEach(function() {
            bp.addTabs("tab1", "tab2", "tab3");
            bp.addTab("tabWithSections").addSections("Section1", "Section2", "Section3");
            tabWithSections = bp.tab("tabWithSections");
        });

        it("should be possible to remove a tab", function() {
            bp.tab("tab1").remove();
            expect(function() {
                bp.tab("tab1");
            }).toThrow("There is no tab named tab1.");
        });

        it("should be possible to remove all tabs", function() {
            bp.removeAllTabs();
            expect(bp.tabs().length).toBe(0);
        });

        it("should be possible to remove a single section", function() {
            expect(tabWithSections.sections().length).toBe(3);
            tabWithSections.section("Section1").remove();
            expect(tabWithSections.sections().length).toBe(2);
        });

        it("Should be possible to remove all sections from a tab", function() {
            expect(tabWithSections.sections().length > 0).toBe(true);
            tabWithSections.removeAllSections();
            expect(tabWithSections.sections().length).toEqual(0);
        });
    });

    describe("custom Controller mode for tabs", function() {
        it("Should let you specify that a tab is in custom controller mode", function() {
            bp.addTab("Foo");
            bp.tab("Foo").setModeToCustomControllerMode();
            expect(bp.tab("Foo").isInCustomControllerMode()).toBe(true);
        });

        it("should throw if you try to put a tab with sections into custom controller mode", function() {
            bp.addTab("Foo");
            bp.tab("Foo").addSection("Bar");
            expect(function() {
                bp.tab("Foo").setModeToCustomControllerMode();
            }).toThrow("This tab has sections, and it therefore in Section Mode. You must remove all sections before you can switch to custom controller mode.");
        });

        it("should throw if you try to add a section to a tab that is in custom controller mode", function() {
            bp.addTab("Foo");
            bp.tab("Foo").setModeToCustomControllerMode();

            expect(function() {
                bp.tab("Foo").addSection("Bar");
            }).toThrow("This tab is in custom controller mode. Tabs that are in custom controller mode cannot have sections.");
        });

        it("Should let you set the controllerType on tabs that are in custom controller mode", function() {
            bp.addTab("Foo").setModeToCustomControllerMode();
            bp.tab("Foo").setControllerType(JmvcMachinery.Framework.Controllers.ActionBar);
            expect(bp.tab("Foo").getControllerType()).toBe(JmvcMachinery.Framework.Controllers.ActionBar);
        });

        it("should throw if you forget to pass something when calling setControllerType", function() {
            bp.addTab("Foo").setModeToCustomControllerMode();
            expect(function() {
                bp.tab("Foo").setControllerType();
            }).toThrow("You must pass in a value for the desired controller type.");
        });

        it("should throw if you set the controller type on a tab that is not in custom controller mode", function() {
            bp.addTab("Foo");
            expect(function() {
                bp.tab("Foo").setControllerType(JmvcMachinery.Framework.Controllers.ActionBar);
            }).toThrow("This tab is not in custom controller mode, and therefore you cannot set the controller type on it.");
        });

        it("should let you toggle between custom controller mode and section mode", function() {
            bp.addTab("Foo");
            bp.tab("Foo").setModeToCustomControllerMode();
            bp.tab("Foo").setModeToSectionMode();
            bp.tab("Foo").setModeToCustomControllerMode();
            bp.tab("Foo").setModeToSectionMode();
        });

    });

    describe("How the tab's mode should behave when the tab starts out", function() {
        it("should start out in Section Mode", function() {
            bp.addTab("Foo");
            expect(bp.tab("Foo").isInCustomControllerMode()).toBe(false);
            expect(bp.tab("Foo").isInSectionMode()).toBe(true);
        });

        it("should be possible to switch from Section Mode to Custom Controller Mode if you reverse the settings related to section mode", function() {
            bp.addTab("Foo");
            bp.tab("Foo").setSectionLayoutToTwoColumnLayout();
            bp.tab("Foo").addSection("Section");

            expect(function() {
                bp.tab("Foo").setModeToCustomControllerMode();
            }).toThrow();

            bp.tab("Foo").removeSectionLayout();

            expect(function() {
                bp.tab("Foo").setModeToCustomControllerMode();
            }).toThrow();

            bp.tab("Foo").removeAllSections();

            bp.tab("Foo").setModeToCustomControllerMode();
        });
    });

    describe("when trying to switch from Custom Controller mode to Section Mode", function() {
        it("should be possible to switch explicitly even when you have specified properties related to Custom Controller Mode", function() {
            bp.addTab("Foo").setModeToCustomControllerMode();
            bp.tab("Foo").setControllerType(JmvcMachinery.Framework.Controllers.ActionBar);
            expect(bp.tab("Foo").getControllerType()).toBe(JmvcMachinery.Framework.Controllers.ActionBar);
            bp.tab("Foo").setModeToSectionMode();
            expect(bp.tab("Foo").getControllerType()).not.toBeDefined();
        });
    });

    describe("when working with a tab that already has a number of settings set", function() {
        var customControllerTab, sectionTab;
        beforeEach(function() {
            customControllerTab = bp.addTab("customControllerTab").setModeToCustomControllerMode();
            sectionTab = bp.addTab("sectionTab").setModeToSectionMode();
        });

        it("should be possible to remove a section layout that was the twoColumnLayout", function() {
            sectionTab.setSectionLayoutToTwoColumnLayout();
            expect(sectionTab.isSectionLayoutTheTwoColumnLayout()).toBe(true);
            sectionTab.removeSectionLayout();
            expect(sectionTab.isSectionLayoutTheTwoColumnLayout()).toBe(false);
        });

        it("should be possible to remove a section layout that was the customViewLayout", function() {
            sectionTab.setSectionLayoutToCustomViewLayout("someUrl");
            expect(sectionTab.isSectionLayoutTheCustomViewLayout()).toBe(true);
            sectionTab.removeSectionLayout();
            expect(sectionTab.isSectionLayoutTheCustomViewLayout()).toBe(false);
        });

        it("should be possible to remove controllerType", function() {
            customControllerTab.setControllerType("something");
            expect(customControllerTab.getControllerType()).toEqual("something");
            customControllerTab.removeControllerType();
            expect(customControllerTab.getControllerType()).toBeFalsy();
        });
    });

    describe("when laying out sections on tabs", function() {
        it("should throw if you try to provide a layout for a tab that is in custom controller mode", function() {
            bp.addTab("Foo").setModeToCustomControllerMode();
            expect(function() {
                bp.tab("Foo").setSectionLayoutToTwoColumnLayout();
            }).toThrow("This tab is in custom controller mode. Therefore, it cannot have sections, and therefore it cannot have a section layout.");
        });

        it("should throw if you give a section layout and then later try to put it into custom controller mode", function() {
            bp.addTab("Foo");
            bp.tab("Foo").setSectionLayoutToTwoColumnLayout();
            expect(function() {
                bp.tab("Foo").setModeToCustomControllerMode();
            }).toThrow("This tab has a section layout, and therefore expects to have Sections. To switch to custom controller mode, you must first remove the section layout.");
        });

        it("should allow you to specify section layout on a tab when that is a valid operation", function() {
            bp.addTab("Foo");
            bp.tab("Foo").setSectionLayoutToTwoColumnLayout();
        });

        it("should be possible to express that sections should be laid out with a custom view", function() {
            bp.addTab("Foo");
            bp.tab("Foo").setSectionLayoutToCustomViewLayout("someUrl");
        });
    });

    describe("when specifying a section's mode", function() {
        it("should be possible to specify that a section should be model bound", function() {
            bp.addTab("Foo").addSection("Section").setModeToModelBoundMode();
            expect(bp.tab("Foo").section("Section").isModelBound()).toBe(true);
        });

        it("should be possible to specify that a section should be controller driven", function() {
            bp.addTab("Foo").addSection("Section").setModeToCustomControllerMode();
            expect(bp.tab("Foo").section("Section").isInCustomControllerMode()).toBe(true);
        });

        it("should be possible to toggle between modes as long as you are in a valid state to do so", function() {
            var section = bp.addTab("Tab").addSection("Section");
            section.setModeToModelBoundMode();
            section.setModeToCustomControllerMode();
            section.setModeToModelBoundMode();
        });
    });

    describe("when a section is in ModelBoundMode", function() {
        var sectionInModelBoundMode;
        beforeEach(function() {
            var section = bp.addTab("Foo").addSection("Bar");
            section.setModeToModelBoundMode();
            sectionInModelBoundMode = section;
        });

        it("should throw if you try to set the section's controllerType", function() {
            expect(function() {
                sectionInModelBoundMode.setControllerType("something");
            }).toThrow("This section (Bar) is in Model Bound mode, and therefore the operation 'setControllerType' is invalid.");
        });

        it("should clear out mode related settings if you change modes and then change back", function() {
            sectionInModelBoundMode.setViewUrl("test");
            expect(sectionInModelBoundMode.getViewUrl()).toEqual("test");

            sectionInModelBoundMode.setModeToCustomControllerMode();
            sectionInModelBoundMode.setModeToModelBoundMode();

            expect(sectionInModelBoundMode.getViewUrl()).not.toBeDefined();
        });
    });

    describe("when a section is in CustomControllerMode", function() {
        var section;
        beforeEach(function()  {
            section = bp.addTab("Foo").addSection("Bar");
            section.setModeToCustomControllerMode();
        });

        it("should throw if you try to set the section's modelInstance", function() {
            expect(function() {
                section.setModelInstance("something");
            }).toThrow("This section (Bar) is in Custom Controller mode, and therefore the operation 'setModelInstance' is invalid.");
        });

        it("should throw if you try to set the section's viewUrl", function() {
            expect(function() {
                section.setViewUrl("something");
            }).toThrow("This section (Bar) is in Custom Controller mode, and therefore the operation 'setViewUrl' is invalid.");
        });
    });

    describe("Error reporting", function() {
        var bp;

        beforeEach(function() {
            bp = new JmvcMachinery.ScreenBlueprint();
            bp.addTabs("Tab1", "Tab2", "Tab3");
            var tabs = new _(bp.tabs());

            tabs.each(function(theTab) {
                theTab.addSections("Section1", "Section2", "Section3", "Section4");
            });

            bp.addTab("TabInCustomControllerMode").setModeToCustomControllerMode();

            bp.tab("Tab1").section("Section1").setModeToModelBoundMode();
            bp.tab("Tab1").section("Section2").setModeToCustomControllerMode();
        });

        it("should be possible to ask a blueprint for its errors", function() {
            var errors = bp.errors();
            jasmine.log("The errors are: ", errors);
            expect(errors).toBeDefined();
            expect(_.any(errors)).toBe(true);
        });

        it("should be possible to ask a tab for its errors", function() {
            var errors = bp.tab("Tab1").errors();
            jasmine.log("The errors are: ", errors);
            expect(errors).toBeDefined();
            expect(_.any(errors)).toBe(true);
        });
    });
});
