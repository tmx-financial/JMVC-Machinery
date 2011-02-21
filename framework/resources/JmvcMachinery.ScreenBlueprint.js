(function(window, $, undefined) {
    window.namespace("JmvcMachinery");

    var Blueprint = function() {
        if (! (this instanceof arguments.callee )) return new arguments.callee( arguments );

        var bpContainer = new Container(this, "Blueprint", Tab, "tab"), thisBlueprint = this;

        this.addTab = bpContainer.addItem;
        this.tab = bpContainer.item;
        this.tabs = bpContainer.itemArray;

        this.addTabs = bpContainer.addItems;
        this.removeTab = bpContainer.removeItem;
        this.removeAllTabs = bpContainer.removeAllItems;

        this.errors = function() {
            var result = [];

            if(! _.any(thisBlueprint.tabs())) result.push("This Blueprint does not have any tabs.");
            _.each(thisBlueprint.tabs(), function(theTab) {
                var childErrors = theTab.errors();
                result = result.concat(childErrors);
            });

            return result;
        };

        this.assertValid = function() {
            var errs = this.errors();
            if(! errs) return;
            if(errs.length === 0) return;

            var errorMessage = errs.join('\r\n');
            errorMessage = "This blueprint has " + errs.length + " error(s), listed below: \r\n" + errorMessage;
            throw errorMessage;
        };

        return this;
    };

    var twoColumnLayoutToken = 2, customViewLayoutToken = 3;

    var TabInSectionMode = function() {
        if (! (this instanceof arguments.callee )) return new arguments.callee( arguments );
        this.sectionLayout = null;
        this.sectionLayoutViewUrl = null;

        this.errors = function() {
            if(this.sectionLayout === null) return ["This tab is in Section Mode, but you have not provided a Section Layout."];
            if(this.sectionLayout === twoColumnLayoutToken) return ["This tab is in Section Mode, and you told it to use twoColumnLayout. However, twoColumnLayout is not implemented yet."];
            if(this.sectionLayout === customViewLayoutToken) {
                if(! this.sectionLayoutViewUrl) return ["This tab was told to lay out its sections according to a custom view, but you have not provided a customViewUrl."];
            }
            return [];
        };
        return this;
    };

    var TabInCustomControllerMode = function() {
        if (! (this instanceof arguments.callee )) return new arguments.callee( arguments );
        this.controllerType = null;

        this.errors = function() {
            if(this.controllerType === null) return ["This tab is in Custom Controller Mode, but you have not provided a Controller Type."];
            return [];
        };

        return this;
    };

    var Tab = function(parent, tabName) {
        if (! (this instanceof arguments.callee )) return new arguments.callee( arguments );
        if(! parent) throw "You must pass a parent in";
        if(! tabName) throw "You must pass in a tabName";

        var sectionContainer = new Container(this, "Tab", Section, "section"),
            currentMode = new TabInSectionMode(), thisTab = this,
            titleText = _(tabName).makeTitle(),
            _controllerInstanceAssignedDuringBlueprintExecution,
            additionalControllersToAdd = [],
            customControllerArguments;

        this.name = function() { return tabName; };

        thisTab.remove = function() {
            parent.removeTab(tabName);
        };

        var transitionToSectionModeIfValid = function() {
            // Currently, there are no rules which would ever prevent transitioning to Section Mode. If there were, they should throw right here.
            if(currentMode instanceof TabInSectionMode) return;
            currentMode = new TabInSectionMode();
        };

        var transitionToCustomControllerModeIfValid = function() {
            if(currentMode instanceof TabInCustomControllerMode) return;
            if(thisTab.hasSections()) throw "This tab has sections, and it therefore in Section Mode. You must remove all sections before you can switch to custom controller mode.";
            if(currentMode instanceof TabInSectionMode) {
                if(!(currentMode.sectionLayout === null)) throw "This tab has a section layout, and therefore expects to have Sections. To switch to custom controller mode, you must first remove the section layout.";
            }

            currentMode = new TabInCustomControllerMode();
        };

        function assertCustomControllerArguments(){
            if (thisTab.isInSectionMode()) {
                throw new Error("This tab is is section mode. Controller arguments can only be set for tabs with Custom Controllers. [setModeToCustomControllerMode()]");
            }
        }

        this.setControllerArguments = function(){
            assertCustomControllerArguments();
            customControllerArguments = _(arguments).toArray();
        };

        this.getControllerArguments = function() {
            assertCustomControllerArguments();
            return customControllerArguments;
        };

        this.addSection = function(sectionName) {
            if(thisTab.isInCustomControllerMode()) throw "This tab is in custom controller mode. Tabs that are in custom controller mode cannot have sections.";
            return sectionContainer.addItem.apply(sectionContainer, arguments);
        };

        this.section = sectionContainer.item;
        this.sections = sectionContainer.itemArray;
        this.addSections = sectionContainer.addItems;
        this.removeSection = sectionContainer.removeItem;

        this.getTitle = function() {
            return titleText;
        };

        this.setTitle = function(title) {
            if(! title) throw "You must pass in a title.";
            titleText = title;
            return thisTab;
        };

        this.addAdditionalController = function(controllerInstance) {
            if(! controllerInstance) throw new Error("You must pass a controller instance to add");
            additionalControllersToAdd.push(controllerInstance);
            return thisTab;
        };

        this.additionalControllers = function() {
            return _.clone(additionalControllersToAdd);
        };

        this.hasSections = function() {
            return _.any(sectionContainer.itemArray());
        };

        this.setModeToSectionMode = function() {
            transitionToSectionModeIfValid();
            return this;
        };

        this.setModeToCustomControllerMode = function() {
            transitionToCustomControllerModeIfValid();
            return thisTab;
        };

        this.isInCustomControllerMode = function() {
            return (currentMode instanceof TabInCustomControllerMode);
        };

        this.isInSectionMode = function() {
            return (currentMode instanceof TabInSectionMode);
        };

        this.setControllerType = function(controllerType) {
            if(! thisTab.isInCustomControllerMode()) throw  "This tab is not in custom controller mode, and therefore you cannot set the controller type on it.";
            if(! controllerType) throw "You must pass in a value for the desired controller type." ;
            currentMode.controllerType = controllerType;
            return thisTab;
        };

        this.getControllerType = function() {
            return currentMode.controllerType;
        };

        this.removeControllerType = function() {
            if(! thisTab.isInCustomControllerMode()) return thisTab;
            currentMode.controllerType = null;
            return thisTab;
        };

        this.setSectionLayoutToTwoColumnLayout = function() {
            if(thisTab.isInCustomControllerMode()) throw "This tab is in custom controller mode. Therefore, it cannot have sections, and therefore it cannot have a section layout.";
            transitionToSectionModeIfValid();
            currentMode.sectionLayout = twoColumnLayoutToken;
            return thisTab;
        };

        this.isSectionLayoutTheTwoColumnLayout = function() {
            return (currentMode && (currentMode.sectionLayout !== null) && (currentMode.sectionLayout === twoColumnLayoutToken));
        };

        this.setSectionLayoutToCustomViewLayout = function(viewUrl) {
            if(thisTab.isInCustomControllerMode()) throw "This tab is in custom controller mode. Therefore, it cannot have sections, and therefore it cannot have a section layout.";
            if(! viewUrl) throw "You must pass in a viewUrl.";
            transitionToSectionModeIfValid();
            currentMode.sectionLayout = customViewLayoutToken;
            currentMode.sectionLayoutViewUrl = viewUrl;
            return thisTab;
        };

        this.getSectionLayoutCustomViewUrl = function() {
            return currentMode.sectionLayoutViewUrl;
        };

        this.isSectionLayoutTheCustomViewLayout = function() {
            return (currentMode && (currentMode.sectionLayout !== null) && (currentMode.sectionLayout === customViewLayoutToken));
        };

        this.removeSectionLayout = function() {
            if(! thisTab.isInSectionMode()) return thisTab;
            currentMode.sectionLayout = null;
            return thisTab;
        };

        this.removeAllSections = sectionContainer.removeAllItems;

        this.errors = function() {
            var result = [], errorsFromTabMode = currentMode ? currentMode.errors() : undefined;

            //if(! currentMode) result.push("You have not specified which mode the tab " + thisTab.name() + " is in.");

            if(errorsFromTabMode) {
                _.each(errorsFromTabMode, function(theError) {
                    result.push("For Tab " + thisTab.name() + ": " + theError);
                });
            }

            _.each(thisTab.sections(), function(theSection) {
                result = result.concat(theSection.errors());
            });

            return result;
        };

        thisTab._setControllerInstanceFromBlueprintExecution = function(controllerInstanceAssignedDuringBlueprintExecution) {
            if(! controllerInstanceAssignedDuringBlueprintExecution) throw "You must pass in a controller instance!";
            _controllerInstanceAssignedDuringBlueprintExecution = controllerInstanceAssignedDuringBlueprintExecution;
        };

        thisTab.getControllerInstanceAfterBlueprintExecution = function() {
            return _controllerInstanceAssignedDuringBlueprintExecution;
        };

        return this;
    };

    var sectionInModelBoundMode = {
        description: function() { return "Model Bound"; },

        setViewUrl: function(viewUrl) {
            if(! viewUrl) throw "You must pass a viewUrl";
            this.modelRelatedSettings.viewUrl = viewUrl;
            return this;
        },

        getViewUrl: function() {
            return this.modelRelatedSettings.viewUrl;
        },

        setModelInstance: function(modelInstance) {
            if(! modelInstance) throw "You must pass a value for modelInstance";
            this.modelRelatedSettings.modelInstance = modelInstance;
            return this;
        },

        getModelInstance: function() {
            return this.modelRelatedSettings.modelInstance;
        },

        getModeErrors: function() {
            var result = [];

            if(! this.getViewUrl()) result.push("The section " + this.name() + " is in " + this.description() + " mode, but you have not provided a View Url.");
            if(! this.getModelInstance()) result.push("The section " + this.name() + " is in " + this.description() + " mode, but you have not provided a Model Instance.");

            return result;
        }
    };

    var sectionInCustomControllerMode = {
        description: function() { return "Custom Controller"; },

        setControllerType: function(controllerType) {
            if(! controllerType) throw "You must pass in a controller type";
            this.modelRelatedSettings.controllerType = controllerType;
            return this;
        },

        getControllerType: function() {
            return this.modelRelatedSettings.controllerType;
        },

        getModeErrors: function() {
            var result = [];
            if(! this.getControllerType()) result.push("The section " + this.name() + " is in " + this.description() + " mode, but you have not provided a Controller Type.");
            return result;
        }
    };

    var sectionModeUndetermined = {
        description: function() { return "Undetermined"; },
        getModeErrors: function() { return undefined; }
    };

    var allPossibleSectionModes = [sectionInModelBoundMode, sectionInCustomControllerMode, sectionModeUndetermined];

    var Section = function(parent, sectionName) {
        var theSection = this, _controllerInstanceAssignedDuringBlueprintExecution, additionalControllersToAdd = [];
        if (! (this instanceof arguments.callee )) return new arguments.callee( arguments );
        if(! parent) throw new Error("You must pass in a parent");
        if(! sectionName) throw new Error("You must pass in a sectionName");

        theSection.remove = function() {
            parent.removeSection(sectionName);
        };

        theSection.currentMode = sectionModeUndetermined;
        theSection.modelRelatedSettings = {};

        theSection.name = function() { return sectionName; };

        theSection.isModelBound = function() {
            return (theSection.currentMode === sectionInModelBoundMode);
        };

        theSection.isInCustomControllerMode = function() {
            return (theSection.currentMode === sectionInCustomControllerMode);
        };

        theSection.addAdditionalController = function(controllerInstance) {
            if(! controllerInstance) throw new Error("You must pass a controller instance to add");
            additionalControllersToAdd.push(controllerInstance);
            return theSection;
        };

        theSection.additionalControllers = function() {
            return _.clone(additionalControllersToAdd);
        };

        var _changeToMode = function(newMode) {
            if(! newMode) newMode = sectionModeUndetermined;
            if(theSection.currentMode === newMode) return;
            if(! _.contains(allPossibleSectionModes, newMode)) throw "Attempt to put Section into unknown mode '" + newMode.description() + "'.";

            theSection.modelRelatedSettings = {};
            theSection.currentMode = newMode;
        };

        theSection.setModeToModelBoundMode = function() {
            _changeToMode(sectionInModelBoundMode);
            return this;
        };

        theSection.setModeToCustomControllerMode = function() {
            _changeToMode(sectionInCustomControllerMode);
            return this;
        };

        theSection.errors = function() {
            var result = [], sectionModeErrors;

            if(theSection.currentMode === sectionModeUndetermined){
                result.push("On tab " + parent.name() + ", you have not specified which mode the section " + theSection.name() + " is in.");
            } else {
                sectionModeErrors = theSection.getModeErrors();

                if(sectionModeErrors) {
                    _.each(sectionModeErrors, function(theError) {
                        result.push("On tab " + parent.name() + theError);
                    });
                }
            }

            return result;
        };

        theSection._setControllerInstanceFromBlueprintExecution = function(controllerInstanceAssignedDuringBlueprintExecution) {
            if(! controllerInstanceAssignedDuringBlueprintExecution) throw "You must pass in a controller instance!";
            _controllerInstanceAssignedDuringBlueprintExecution = controllerInstanceAssignedDuringBlueprintExecution;
        };

        theSection.getControllerInstanceAfterBlueprintExecution = function() {
            return _controllerInstanceAssignedDuringBlueprintExecution;
        };

        return this;
    };

    (function attachFunctionsFromAllPossibleSectionModesToTheSectionPrototype() {
        _.each(allPossibleSectionModes, function(mode) {
            var funcs = _.functions(mode);
            _.each(funcs, function(functionName) {
                Section.prototype[functionName] = function() {
                    var currentModeFuncs = _.functions(this.currentMode);

                    if(_.contains(currentModeFuncs, functionName)) {
                        return this.currentMode[functionName].apply(this, arguments);
                    } else {
                        throw "This section (" + this.name() + ") is in " + this.currentMode.description() + " mode, and therefore the operation '" + functionName + "' is invalid.";
                    }
                };
            });
        });
    }());

     var Container = function(parent, containerName, newItemConstructor, itemDescription) {
        var _items = {}, container = this;
        if (! (this instanceof arguments.callee )) throw new Error("This function is a class constructor and must be called with new.");
        if(! parent) throw "You must pass in a parent";

        container.containerName = containerName ;
        container.parent = parent;

        container.addItem = function(itemName) {
            container.addItems(itemName);
            return container.item(itemName);
        };

        container.item = function(itemName) {
            var result = _items[itemName];
            if(! (result && (result instanceof newItemConstructor ))) throw new Error("There is no " + itemDescription + " named " + itemName + ".");
            return result;
        };

        container.addItems = function() {
            var args = _.toArray(arguments);
            _.each(args, function(itemName) {
                if(itemName.indexOf(" ") !== -1) throw "Spaces are not allowed in " + itemDescription + " names.";
                if(_items[itemName]) throw new Error("There is already a " + itemDescription + " by the name of " + itemName + " (or that name is an illegal value).");
                var newItem = new newItemConstructor(parent, itemName);
                _items[itemName] = newItem ;
            });
            return container;
        };

        container.removeItem = function(itemName) {
            var itemToremove = container.item(itemName);
            delete _items[itemName];
        };

        container.removeAllItems = function() {
            _items = {};
        };

        container.itemArray = function(){
            return _.values(_items);
        };

     };

    window.JmvcMachinery.ScreenBlueprint = Blueprint;
}(window, jQuery));
