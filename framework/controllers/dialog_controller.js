/* -*- Mode: javascript; tab-width: 4; indent-tabs-mode: nil; */

//--------MODULE HEADER----------
(function(GLOBAL, undefined) {
    //===============================
    function createNewInDom(options) {
        var shell = $("<div name='dialog-shell' />"),
            content = $("<div name='dialog-content' />");

        shell.appendTo($("body")).append(content);

        options = options || {};
        options = $.extend(options, {
            modal: true,
            resizable: false,
            zIndex: 3999,
            width: 400
        });
        
        shell.dialog(options);
        content = content.jmvc_machinery_framework_dialog(shell).controller();

        return content;
    }

    jQuery.Controller.extend('JmvcMachinery.Framework.Controllers.Dialog',
    /*Static*/
    {
        createFromController: function(controller, options) {
            if (_.isString(controller)) throw new Error("[controller] must the the controller Class, not a string.");
            
            var args = _(arguments).toArray(),
                dialogController,
                hostedController,
                buttons = (controller.dialog) ? controller.dialog.buttons : undefined,
                staticOptions = (controller.dialog) ? _(controller.dialog).clone() : {};
            
            staticOptions.buttons = undefined;
            staticOptions = jQuery.extend(true, options, staticOptions);
            dialogController = createNewInDom(staticOptions);

            args.shift();
            args.shift();
            args.unshift(dialogController.container);
            hostedController = controller.newInstance.apply(controller, args);
            hostedController.dialog = dialogController;

            dialogController.hostedController = hostedController;

            if (buttons) {
                dialogController.setButtons(buttons);
            };

            if (hostedController.onDialogInit) {
               hostedController.onDialogInit();
            }
            
            if (hostedController.onDialogClose) {
                dialogController.dialogShell.bind( "dialogclose", hostedController.onDialogClose);
            };
            
            return hostedController;
        }
    },

    /*ProtoType*/
    {
        init: function(el, shell) {
            var that = this;

            this.container = $(el);
            this.dialogShell = $(shell);

            this.dialogShell.bind("dialogclose", function(event, ui) {
                that.container.remove();
            });
        },
        destroy: function() {
            this.dialogShell.dialog("destroy");
            this._super(); //Always call this!
        },
        close: function() {
            this.dialogShell.dialog("close");
        },
        setButtons: function(buttons) {
            var that = this;

            this.dialogShell.dialog("option", "buttons", _(buttons).map(function(button) {
                var text = _(button).isString() ? button : button.text,
                    name = (_(button).isString() ? button : button.name) || text;

                return {
                    text: text,
                    click: function() {
                        var callback = that.hostedController[_("%s dialog_button_click").sprintf(name)];

                        if (callback) {
                            callback.call(that.hostedController);
                        } else if (name.toLowerCase() === "cancel") {
                            that.close();
                        };
                    }
                };
            }));
        },
        title: function(v) {
            if (v) {
                this.dialogShell.dialog( "option", "title", v );                
            }
            return this.dialogShell.dialog( "option", "title" );
        },
        busy: function(v) {
            return this.dialogShell.busy(v);
        }
    });

    //===============================
} (window, (function() {
    return;
} ())));
//===============================
