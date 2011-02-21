/* -*- Mode: javascript; tab-width: 4; indent-tabs-mode: nil; */

/**
 * @tag controllers, home
 */
JmvcMachinery.Framework.Controllers.SplitBody.extend('JmvcMachinery.Framework.Controllers.TabbedBody',
/* @Static */
{

},
/* @Prototype */
{
  init: function (el) {
        this._super(el);

        // this.ActionBar.jmvc_machinery_framework_action_bar();
        this.ActionBar = this.ActionBar.controller();

        this.BodyArea.jmvc_machinery_framework_tab();
        this.Tabs = this.BodyArea.controller();
    },
    TabCount: 0,
    addTab: function(controller, options)
    {
        var tabElement = this.Tabs.addTab(options),
            controllerInstance;

        options.args = options.args || [];

        controller.newInstance.apply(controller, [tabElement].concat(options.args));
        tabElement.jmvc_machinery_framework_tab_messages();

        this.TabCount++;
        controllerInstance = $(tabElement).controller();
        controllerInstance.__tabElement = tabElement;
        return controllerInstance;
    },

    "validation": function(data)
    {
      JmvcMachinery.Alert('Lid Error');
    },

    executeBlueprint: function(blueprint) {
        if(! blueprint) throw "You must pass in an JmvcMachinery.ScreenBlueprint";
        blueprint.assertValid();

        var blueprintErrors, thisTabController = this, tabs = new _(blueprint.tabs());

        tabs.each(function(thisTab) {
            var initialControllerInstanceForTab,
                sectionsOnTab = new _(thisTab.sections()),
                messageControllerArray = [thisTabController.LeftArea.FlyOut],
                tab_message_proxy = new JmvcMachinery.Message.Proxy(messageControllerArray);

            if (thisTab.getControllerType()) {
                initialControllerInstanceForTab = thisTabController.addTab(thisTab.getControllerType(), {Text: thisTab.getTitle(), args: thisTab.getControllerArguments().concat(tab_message_proxy)});
            } else {
                initialControllerInstanceForTab = thisTabController.addTab(JmvcMachinery.Framework.Controllers.TabAreaController, {Text: thisTab.getTitle()});
            }

            messageControllerArray.push(initialControllerInstanceForTab.__tabElement.controller(JmvcMachinery.Framework.Controllers.TabMessages));

            thisTab._setControllerInstanceFromBlueprintExecution(initialControllerInstanceForTab);


            if(thisTab.isInSectionMode()) {
                if(thisTab.isSectionLayoutTheTwoColumnLayout()) throw "The tab named " + thisTab.name() + " is configured to use two-column layout, but two-column layout is not implemented yet.";

                if(thisTab.isSectionLayoutTheCustomViewLayout()) {
                   initialControllerInstanceForTab.$container.html(thisTabController.view(thisTab.getSectionLayoutCustomViewUrl()));
                }

                sectionsOnTab.each(function(thisSection) {
                    if(thisSection.isInCustomControllerMode()) throw "Section " + thisSection.name() + " is in Custom Controller mode, but Custom Controller Mode for *Sections* is not implemented yet";

                    var expectedDivContainerName = thisSection.name() + "Section", $sectionElement = initialControllerInstanceForTab.$container.find('[name=' + expectedDivContainerName + ']'),
                        sectionName = thisSection.name();

                    if($sectionElement.length != 1) throw "An error occurred finding the dom element that was just added for section " + sectionName;

                    $sectionElement.jmvc_machinery_framework_model_bound(thisSection.getModelInstance(), thisSection.getViewUrl(),tab_message_proxy);//thisTabController.LeftArea.FlyOut);

                    var sectionController = $sectionElement.controller();
                    if(! sectionController) throw "Something went wrong trying to obtain the section controller that was just created.";
                    thisSection._setControllerInstanceFromBlueprintExecution(sectionController);
                });
            }

            var additionalTabControllers = thisTab.additionalControllers();
            _.each(additionalTabControllers, function(controllerFunction) {
                var tabElement = initialControllerInstanceForTab.container, controller;
                if(! tabElement) throw new Error("There was an error getting the tabElement so that we could attach additional controllers to the tab.");
                controller = controllerFunction(tabElement);
            });

            if(thisTab.isInSectionMode()) {
                sectionsOnTab.each(function(thisSection) {
                    var additionalSectionControllers = thisSection.additionalControllers();
                    var sectionElement = thisSection.getControllerInstanceAfterBlueprintExecution().$container;
                    _.each(additionalSectionControllers, function(controllerFunction) {
                        controllerFunction(sectionElement);
                    });
                });
            }
        });
    }
});
