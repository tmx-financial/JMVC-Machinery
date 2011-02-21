/**
 * @tag controllers, home
 */
jQuery.Class.extend('JmvcMachinery.Message.Proxy',
/* @Static */
{

    },
/* @Prototype */
{
    messageControllers: [],
    init: function(msgControllers)
    {
        var that = this;

        this.messageControllers = msgControllers;

        this.messages = {

            set: function(messages){
                _(that.messageControllers).each(function(controller){
                    controller.messages.set(messages);
                });
            },
            add: function(messages, criteria){
                _(that.messageControllers).each(function(controller){
                    controller.messages.add(messages, criteria);
                });
            },
            clear: function(criteria){
                _(that.messageControllers).each(function(controller){
                    controller.messages.clear(criteria);
                });
            },
            refresh: function(){
                _(that.messageControllers).each(function(controller){
                    controller.messages.refresh();
                });
            }
        };
        this.errors = {

            set: function(messages, criteria){
                _(that.messageControllers).each(function(controller){
                    controller.errors.set(messages, criteria);
                });
            },
            add: function(messages, criteria){
                _(that.messageControllers).each(function(controller){
                    controller.errors.add(messages, criteria);
                });
            },
            clear: function(criteria){
                _(that.messageControllers).each(function(controller){
                    controller.errors.clear(criteria);
                });
            },
            refresh: function(){
                _(that.messageControllers).each(function(controller){
                    controller.errors.refresh();
                });
            },
            from: function(source){
                return{
                    set: function(messages, criteria){
                        _(that.messageControllers).each(function(controller){
                            controller.errors.from(source).set(messages, criteria);
                        });
                    },
                    clear: function(criteria){
                        _(that.messageControllers).each(function(controller){
                            controller.errors.from(source).clear(criteria);
                        });
                    },
                    add: function(message, criteria){
                        _(that.messageControllers).each(function(controller){
                            controller.errors.from(source).add(message, criteria);
                        });
                    },
                    refresh: function(){
                        _(that.messageControllers).each(function(controller){
                            controller.errors.from(source).refresh();
                        })
                    }
                }
            }


        };
        this.warnings = {

            set: function(messages, criteria){
                _(that.messageControllers).each(function(controller){
                    controller.warnings.set(messages, criteria);
                });
            },
            add: function(messages, criteria){
                _(that.messageControllers).each(function(controller){
                    controller.warnings.add(messages, criteria);
                });
            },
            clear: function(criteria){
                _(that.messageControllers).each(function(controller){
                    controller.warnings.clear(criteria);
                });
            },
            refresh: function(){
                _(that.messageControllers).each(function(controller){
                    controller.warnings.refresh();
                });
            },
            from: function(source){
                return{
                    set: function(messages, criteria){
                        _(that.messageControllers).each(function(controller){
                            controller.warnings.from(source).set(messages);
                        });
                    },
                    clear: function(criteria){
                        _(that.messageControllers).each(function(controller){
                            controller.warnings.from(source).clear(criteria);
                        });
                    },
                    add: function(message, criteria){
                        _(that.messageControllers).each(function(controller){
                            controller.warnings.from(source).add(message, criteria);
                        });
                    },
                    refresh: function(){
                        _(that.messageControllers).each(function(controller){
                            controller.warnings.from(source).refresh();
                        })
                    }
                }
            }



        };

        this.information =  {

            set: function(messages, criteria){
                _(that.messageControllers).each(function(controller){
                    controller.information.set(messages, criteria);
                });
            },
            add: function(messages, criteria){
                _(that.messageControllers).each(function(controller){
                    controller.information.add(messages, criteria);
                });
            },
            clear: function(criteria){
                _(that.messageControllers).each(function(controller){
                    controller.information.clear(criteria);
                });
            },
            refresh: function(){
                _(that.messageControllers).each(function(controller){
                    controller.information.refresh();
                });
            },
            from: function(source){
                return{
                    set: function(messages, criteria){
                        _(that.messageControllers).each(function(controller){
                            controller.information.from(source).set(messages, criteria);
                        });
                    },
                    clear: function(criteria){
                        _(that.messageControllers).each(function(controller){
                            controller.information.from(source).clear(criteria);
                        });
                    },
                    add: function(message, criteria){
                        _(that.messageControllers).each(function(controller){
                            controller.information.from(source).add(message, criteria);
                        });
                    },
                    refresh: function(){
                        _(that.messageControllers).each(function(controller){
                            controller.information.from(source).refresh();
                        })
                    }
                }
            }


        };


    },



});
