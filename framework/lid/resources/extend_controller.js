/* -*- Mode: javascript; tab-width: 4; indent-tabs-mode: nil; */

//--------MODULE HEADER----------
(function(GLOBAL, undefined) {
    "use strict";
    //===============================
    var target = $.Controller.prototype;

    target.metaview = makeMetaview();
    target.lidView = makeLidView();

    target.bindToModel = makeBindToModel();
    target.unbindAll = makeUnbindAll();

    target.destroy = makeWrappedDestroy(target);



    function augmentHelpersPrototypeWith(helpersToAdd) {
        $.extend($.EJS.Helpers.prototype, helpersToAdd);
    }



    function unaugmentHelpersPrototype(helpersToRemove) {
        var keys = $.scanMembers(helpersToRemove).own().keys();
        $.each(keys, function(i, key) {
            delete $.EJS.Helpers.prototype[key];
        });
    }



    function makeLidView() {
        return function($element) {
            assertTargetElementIsValid($element);

            var args = $.makeArray(arguments);
            args.shift();

            try {
                GLOBAL.namespace("JmvcMachinery.Lid").__currentView = args[0];
            } catch(e) {}

            JmvcMachinery.Editors._addLidHelpersToTarget($.EJS.Helpers.prototype);
            var renderResult = $.Controller.prototype.view.apply(this, args);
            JmvcMachinery.Editors._removeLidHelpersFromTarget($.EJS.Helpers.prototype);
            $element.html(renderResult);
            attachLidControllers($element);

            GLOBAL.namespace("JmvcMachinery.Lid").__currentView = undefined;
        };
    }



    function assertTargetElementIsValid($element) {
        if (!$element) {
            throw new Error("You must provide a wrapped set into which the rendered html will go");
        }

        $.each(["size", "html", "first"], function(i, expectedMethod) {
            if ($element[expectedMethod] === undefined) {
                throw new Error("The value you pass in for $element must be a jQuery wrapped set. However, the value you passed does not contain a member called '" + expectedMethod + "'.");
            }
        });

        if ($element.size() != 1) {
            throw new Error("The value you pass in for $element must have one and only one dom element in a jQuery wrapped set. However, the value you passed in has " + $element.length + " members.");
        }
    }



    function attachLidControllers($element) {
        var foo = $element;
        $element.find('.lid_container').each(function(idx, lidContainer) {
            $(lidContainer).jmvc_machinery_lid_lid();
        });
    }



    function makeMetaview() {
        var metaview = function($element, view, modelInstance) {
            assertTargetElementIsValid($element);
            if (!view) throw new Error("You must pass in a view");
            if (!modelInstance) throw new Error("You must pass in a modelInstance");
            if (!modelInstance.Class.schema) throw new Error("The model you pass in must be a schema-backed model, but this model doesn't have a schema property.");

            var specialHelpers = metaview._makeHelpers(modelInstance);

            augmentHelpersPrototypeWith(specialHelpers);
            var result = $.Controller.prototype.lidView.call(this, $element, view, modelInstance);
            unaugmentHelpersPrototype(specialHelpers);

            return result;
        };

        metaview._makeHelpers = function(modelInstance) {
            var helpers;



            function assertAttributeExists(name) {
                if (!modelInstance.Class.schema.properties.hasOwnProperty(name)) throw new Error("This model does not contain an attribute named '" + name + "'.");
            }

            helpers = {
                lid: function() {
                    if (arguments.length === 0) throw new Error("You must pass in an attribute name or attribute description object.");
                    var results = [],
                        schemaId, attributeName, dataAttributes, theArg;

                    results.push("<div class='focus_group'>");

                    for (var i = 0; i < arguments.length; i++) {
                        dataAttributes = {};
                        theArg = arguments[i];
                        schemaId = _.uniqueId("schema_");

                        if (_.isString(theArg)) {
                            attributeName = theArg;
                        } else {
                            if (!theArg.attributeName) throw new Error("When calling lid, any arguments which are not strings must be objects, and those object must contain an 'attributeName' property.");
                            attributeName = theArg.attributeName;
                            dataAttributes = _(theArg).clone();
                            delete dataAttributes.attributeName;
                        }

                        assertAttributeExists(attributeName);
                        JmvcMachinery.SchemaHelper.schema(schemaId, modelInstance.getSchemaFor(attributeName));

                        dataAttributes.schemaId = schemaId;
                        dataAttributes = JmvcMachinery.Editors._dataAttributePrep(dataAttributes);

                        results.push(this.EditorFor(attributeName, dataAttributes));
                    }

                    results.push("</div>");
                    return results.join("\n");
                },
                button: function(name, options) {
                    if (!name) throw new Error("You must pass in a button name.");
                    if (!_(options).isObject()) throw new Error("You must pass in a button options object.");
                    if (! (options.label || options.labelAttr)) throw new Error("You must provide either a `label` or `labelAttr` in the button options object.");
                    if (options.label && options.labelAttr) throw new Error("Choose one. You can't specify both a `label` and a `labelAttr`.");

                    var label = (options.label || modelInstance.attr(options.labelAttr)) || "",
                        dataAttributes = {};

                    dataAttributes.bound = true;
                    if (options.icons) {
                        dataAttributes.icons = $.toJSON(options.icons);
                    }

                    if (options.labelAttr) {
                        assertAttributeExists(options.labelAttr);
                        dataAttributes.labelAttr = options.labelAttr;
                    }

                    if (options.enabledAttr) {
                        assertAttributeExists(options.enabledAttr);
                        dataAttributes.enabledAttr = options.enabledAttr;
                    }

                    dataAttributes = makeDataAttributesFrom(dataAttributes);

                    return _("<button name=%s %s>%s</button>").sprintf(name, dataAttributes, label);
                }
            };
            helpers.meditorFor = helpers.lid;

            return helpers;
        };

        return metaview;
    }


    function makeDataAttributesFrom(obj) {
        return _(obj).chain().keys().map(function(key) {
            return "data-" + key + "='" + _(obj[key] + "").escapeHtml() + "'";
        }).value().join(' ');
    }



    function makeBindToModel() {
        var bindToModel = function(modelInstance, eventName, handler) {
            this._modelBindings = this._modelBindings || [];
            this._modelBindings.push({
                modelInstance: modelInstance,
                eventName: eventName,
                handler: handler
            });
            modelInstance.bind(eventName, handler);
        };

        return bindToModel;
    }



    function makeUnbindAll() {
        var unbindAll = function() {
            if (this._modelBindings) {
                _(this._modelBindings).each(function(binding) {
                    binding.modelInstance.unbind(binding.eventName, binding.handler);
                });
            }
        };

        return unbindAll;
    }



    function makeWrappedDestroy(target) {
        var proxiedDestroy = target.destroy;
        var wrappedDestroy = function() {
            this.unbindAll();
            if (proxiedDestroy) {
                proxiedDestroy.call(this);
            }
        };

        return wrappedDestroy;
    }

    //===============================
} (function() {
    return this;
} (), (function() {
    return;
} ())));
//===============================
