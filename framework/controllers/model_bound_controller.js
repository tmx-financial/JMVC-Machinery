/* -*- Mode: javascript; tab-width: 4; indent-tabs-mode: nil; */

//--------MODULE HEADER----------
(function(GLOBAL) {
    "use strict";
    //===============================
    var REFRESH_THROTTLE = 200;

    /**
     * @tag controllers
     */
    jQuery.Controller.extend('JmvcMachinery.Framework.Controllers.ModelBoundController',
    /* @Static */
    {},
    /* @Prototype */
    {
        init: function(el, modelInstance, viewUrl, messageSink) {

            if (!modelInstance) {
                throw new Error("You must provide a modelInstance to a ModelBoundController.");
            }
            if (!viewUrl) {
                throw new Error("You must provide a viewUrl to a ModelBoundController.");
            } else if (!_.isString(viewUrl)) {
                throw new Error("viewUrl must be a string.");
            }
            if (!el) {
               throw new Error("You must provide an element to a ModelBoundController.");
            }

            this.container = el;
            this.$container = $(el);
            this.metaview(this.$container, viewUrl, modelInstance);

            this.getModel = function() {
                return modelInstance;
            };

            this.messageSink = messageSink;
            if (messageSink) {
                messageSink.errors.throttledRefresh = _(messageSink.errors.refresh).throttle(REFRESH_THROTTLE);
            }

            this.allLids = bindLidEvents(this.$container.lid(), modelInstance, this);
            this.allBoundButtons = initializeButtons(this.$container.find("button[data-bound=true]"), modelInstance, this);

            this.$container.jmvc_machinery_framework_focus_group();

            _(this.allLids).each(function(lid){
                updateLid(lid, modelInstance);
            });
        },

        change: function($el, ev) {

            function isNotDerivedAttribute(name) {
                return (!model.Class.derivedAttributes) || (!_.contains(model.Class.derivedAttributes, name));
            }

            var $target = ($(ev.target) || $(ev.originalEvent.target)),
                lid = $.lid($target),
                lidValue = lid.val(),
                attributeName = lid.name(),
                model = this.getModel();

            if (model.Class.attributes[attributeName]) {
                if (isNotDerivedAttribute(attributeName)) {
                    if (model.attr(attributeName) !== lidValue) {
                        model.attr(attributeName, lidValue);
                    }
                }
            }
        },
        "button[data-bound=true][disabled] click": function(el, evt) {
            evt.stopPropagation();
        }
    });



    function bindLidEvents(allLids, modelInstance, controller) {
        _(allLids).each(function(lid) {
            var lidName = lid.name(),
                updater = function() {
                updateLid(lid, modelInstance);
                updateLidErrors(lid, modelInstance, controller);
            };

            controller.bindToModel(modelInstance, lidName, updater);
            controller.bindToModel(modelInstance, "error." + lidName, updater);
            controller.bindToModel(modelInstance, "schema." + lidName, updater);
        });

        return allLids;
    }



    function updateLid(lid, modelInstance) {
        var lidName = lid.name();
        if (!modelInstance.Class.attributes[lidName]) throw new Error(_("Model doesn't have an attribute called [%s]. A LID is not supposed to even exist for an attribute that the model doesn't have. Something is broken.").sprintf(lidName));

        var schema = modelInstance.getSchemaFor(lidName),
            modelValue = modelInstance.attr(lidName);

        lid.val(modelValue);

        lid.required(schema.required);

        if (!lid.hasOverrideFor("readOnly")) {
            lid.readOnly(schema.readOnly);
        }

        if (!lid.hasOverrideFor("title")) {
            lid.labelText(schema.title);
        }

        if (schema.options) {
            lid.setChoices(schema.options);
        }
    }



    function updateLidErrors(lid, modelInstance, controller) {
        var lidName = lid.name(),
            allModelErrors = modelInstance.errors(),
            lidErrors = allModelErrors ? (allModelErrors[lidName] || null) : null;

        if (controller.messageSink) {
            controller.messageSink.errors.from(lid).set(lidErrors);
            controller.messageSink.errors.throttledRefresh();
        }

        lid.errors.from(modelInstance).set(lidErrors);
        lid.messages.refresh();
    }



    function initializeButtons(buttons, modelInstance, controller) {
        buttons.each(function(idx, button) {
            button = $(button);
            var icons = button.attr("data-icons");

            if (icons) {
                icons = $.parseJSON(icons);
                button.removeAttr("data-icons");
            }

            button.button({
                icons: icons
            });
        });

        //This will change once buttons are also bound to the explicit event. (Maybe not even needed, there wont be a lot of bound buttons...)
        controller.bindToModel(modelInstance, "modelFinishedChanging", _(function() {
            updateBoundButtons(modelInstance, buttons);
        }).throttle(REFRESH_THROTTLE));

        updateBoundButtons(modelInstance, buttons);

        return buttons;
    }



    function updateBoundButtons(modelInstance, buttons) {
        var enabledAttr, labelAttr;

        buttons.each(function(idx, button) {
            button = $(button);
            enabledAttr = button.attr("data-enabledAttr");
            labelAttr = button.attr("data-labelAttr");

            if (enabledAttr) {
                if (modelInstance.attr(enabledAttr)) {
                    button.removeAttr("disabled");
                } else {
                    button.attr("disabled", " ");
                }
            }

            if (labelAttr) {
                button.button("option", "label", modelInstance.attr(labelAttr));
            }

            button.button("refresh");
        });
    }

    //===============================
} (function() {
    return this;
}));
//===============================
