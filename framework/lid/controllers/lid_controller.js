/* -*- Mode: javascript; tab-width: 4; indent-tabs-mode: nil; */

/*
    In this file you will see that we add elements, marked with classes, find them again from the DOM and then remove the marker classes. In those cases, we are attaching
    a controller to the elements so there will be a class added for that controller. Any style should be hooked up via the controller class, not the marker class.
*/

//--------MODULE HEADER----------
(function(GLOBAL) {
    //===============================
    var overridableProperties = ['readOnly', 'title'];

    function makeLabel(that, $container, schema) {
        var label = $("<div class='lid_label' / >").appendTo($container),
            labelText = $("<span/>").appendTo(label),
            icon = $("<span style='float: right'/>").appendTo(label),
            currentIconClass;

        title = that.overrideFor("title") || schema.title;

        that.labelText = function(v) {

            if (v !== undefined) {
                if (!_(v).trim()) throw that.lidError("The label must be set to something.");
                $(labelText).text(_(v).chain().trim().rtrim(" :").value() + ":");
            }

            return _($(labelText).text()).rtrim(":");
        };

        that.setLabelIcon = function(iconClass) {
            currentIconClass = iconClass;
            icon.toggleClass("ui-icon", true).toggleClass(currentIconClass, true);
        };

        that.clearLabelIcon = function() {
            icon.toggleClass("ui-icon", false).toggleClass(currentIconClass, false);
        };

        if (!title) {
            throw that.lidError("A LID can only be rendered for a schema with a title.");
        }
        that.labelText(title);
    }



    function makeDecorator(that, $container, name) {
        var decorator;

        $container.append("<div class='field_decoration' name='" + name + "'/>");
        decorator = $container.find(".field_decoration:first");
        decorator.removeClass("field_decoration");
        decorator.append("&nbsp;");
        decorator = decorator.jmvc_machinery_lid_decorator().controller();
        JmvcMachinery.Messages.Api.mixIn(that, decorator.decorateCallback(that));
    }



    function extractSchemaFromContainer($container) {
        var schema, schemaId;

        schemaId = $container.attr("data-schemaId");
        $container.removeAttr("data-schemaId");
        schema = (JmvcMachinery.SchemaHelper.schema(schemaId));
        JmvcMachinery.SchemaHelper.remove(schemaId);

        if (!schema) {
            //This LID is being rendered using basicLid, without a model.
            schema = {
                type: $container.attr("data-type"),
              format: $container.attr("data-format") 
              };
            JmvcMachinery.Format.mixInFormatter(schema);
        }

        return schema;
    }



    function initializeLidState(that, schema) {
        that.required(schema.required || false);
        that.readOnly(that.overrideFor("readOnly") || schema.readOnly || false);
        that.val(null);
    }

    /**
     * @tag controllers
     */
    $.Controller.extend("JmvcMachinery.Lid.Controllers.LidController",
    /* @Static */
    {

    },
    /* @Prototype */
    {
        init: function(el) {
            var that = this,
                $container,
                schema,
                name,
                currentlyRequired;

            if (!_.isElement(el)) throw new Error("container argument must be an html Element");

            this.$container = $container = $(el);
            if (!$container.hasClass("lid_container")) throw new Error("LidController can only be attached to Lid Container elements, but the element you passed in does not have the 'lid_container' class to indicate it is a Lid Container.");
            $container.removeClass("lid_container");

            $container.addClass("ui-widget");

            this.name = _(function() {
                return $container.attr("name");
            }).memoize();
            name = this.name();

            this.lidError = function(msg) {
                var fieldDescriptor = "LID Error for: " + name + " \n",
                    viewDescriptor = JmvcMachinery.Lid.__currentView ? "While rendering " + JmvcMachinery.Lid.__currentView + "\n" : "";
                return new Error(fieldDescriptor + viewDescriptor + msg);
            };

            schema = jQuery.extend(extractSchemaFromContainer($container), {
                'name': name
            });

            makeLabel(this, $container, schema);

            this.input = JmvcMachinery.Lid.InputLocator.hookup($container, schema);

            JmvcMachinery.Lid.Controllers.MixIns.DelegatedInputMethods.mixIn(this, {
                inputController: this.input
            });

            if (this.input.mixIntoParentLid) {
                this.input.mixIntoParentLid(this);
            }

            makeDecorator(this, $container, name, this.input);

            if (this.hasOverrideFor("readOnly")) {
                if (!this.overrideFor("readOnly")) throw this.lidError("You may only override [readOnly] to be TRUE.");
            }

            this.required = function(v) {

                if (v !== undefined) {
                    currentlyRequired = _.readBoolean(v);

                    if (currentlyRequired) {
                        that.setLabelIcon("ui-icon-flag");
                    } else {
                        that.clearLabelIcon();
                    }
                }

                return currentlyRequired;
            };

            initializeLidState(this, $container, schema);
        },

        hasOverrideFor: function(property) {
            return this.overrideFor(property) !== undefined;
        },

        overrideFor: function(property) {
            if (! (_(overridableProperties).contains(property))) throw this.lidError(_("The only overridable properties are [%s]. Not: %s").sprintf(overridableProperties.join(", "), property));
            var val = this.$container.attr("data-" + property);

            switch (property.toLowerCase()) {
            case "readonly":
                return val === undefined ? undefined : _(val).readBoolean();
            default:
                return val;
            }
        },

        hidden: function(v) {
            if (v !== undefined) {
                v = _.readBoolean(v);
                this.$container.toggleClass("ui-helper-hidden", v);
            }

            return this.$container.hasClass("ui-helper-hidden");
        },

        show: function() {
            this.hidden(false);
        },

        hide: function() {
            this.hidden(true);
        },

        showMe: function() {
            this.$container.trigger("showme");
            this.focus(true);
        },

        "* lidfocused": function() {
            JmvcMachinery.Lid.__lastFocused = this;
        }

    });

    //===============================
} (window, (function() {
    return;
} ())));
//===============================
