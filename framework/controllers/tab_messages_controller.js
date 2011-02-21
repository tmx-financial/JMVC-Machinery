/**
 * @tag controllers, home
 */
jQuery.Controller.extend('JmvcMachinery.Framework.Controllers.TabMessages',
/* @Static */
{

    },
/* @Prototype */
{
    init: function(el)
    {
        this.container = $(el)
        this.tabHeader = $('ul.ui-tabs-nav li a[href="#'+this.container[0].id+'"]').parent()
        var that = this;
        JmvcMachinery.Messages.Api.mixIn(this,
        function(){
            that.decorate();
        });
    },

    findContainer: function()
    {
        var container = this.tabHeader.find(".TabNotificationContainer");
        return container;
    },
    getContainer: function()
    {
        if(!this.notificationContainer)
        {
              var errorNotificationcontainer = $("<div class='TabNotificationContainer' ></div>");  
              errorNotificationcontainer.appendTo(this.tabHeader);
              this.notificationContainer = errorNotificationcontainer;     
        }
        return this.notificationContainer;
    },
    decorate : function()
    {   
      var container = this.getContainer();
      container.empty();
      
      if(this.errors.length > 0)
      {
            var errorNotification = $(JmvcMachinery.Messages.Api.messageSummaryIcon('error'));
            errorNotification.appendTo(container);  
      }
    },
    
    Show: function()
    {
    },

    Hide: function()
    {
    },

    Position: function()
    {
    },

    Remove: function(Criteria)
    {
    },

    _SetStyle: function()
    {
          
    }

});
