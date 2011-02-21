/**
 * @tag controllers, home
 */
jQuery.Controller.extend('JmvcMachinery.Framework.Controllers.Flyout',
/* @Static */
{

    },
/* @Prototype */
{
    Notifications: undefined,
    init: function(el)
    {
      
        this.container = $(el)
        
        var that = this;
        this.Notifications = {};
        this.Notifications.Elements = {};
        JmvcMachinery.Messages.Api.mixIn(this,
        function(){
            that.decorate();
        });

        this.container.className = JmvcMachinery.Class.Add(this.container.className, 'ValidationEmpty');

        this.Notifications.Options = {
            Position: 'TopLeft',
            maxHeight: 450,
            Height: 0,
            Width: 190
        };

        if (!this.Notifications.Elements.Header)
        {

            var dHeader =$('<div class="NotificationHeader ui-accordion-header ui-corner-bottom"></div>') 
            
            var dOpen = $('<div class="NotificationFlyOutToggle" ></div>');
            dOpen.html('<span class="ui-icon ui-icon-triangle-1-s"></span>');
            dOpen.css('display','none');
            dOpen.appendTo(dHeader);
            
            this.Notifications.Elements.HeaderOpen = dOpen;
            
            var dMark = $('<div class="NotificationHeaderMarkGroup" ></div>');
            
            var dMark2 = $('<div class="NotificationHeaderMarkGroup2" ></div>');
            
            var dMarkError = $('<div class="NotificationHeaderMark"  ></div>');
            dMarkError.appendTo(dMark);
            dMarkError.css('display','none');
            this.Notifications.Elements.HeaderMarkError = dMarkError;
            
            var dMarkInfo = $('<div class="NotificationHeaderMark" />');
            dMarkInfo.appendTo(dMark);
            dMarkInfo.css('display','none');
            this.Notifications.Elements.HeaderMarkInfo = dMarkInfo;
            
            var dMarkWarning = $('<div class="NotificationHeaderMark" />');
            dMarkWarning.appendTo(dMark);
            dMarkWarning.css('display','none');
            this.Notifications.Elements.HeaderMarkWarning = dMarkWarning;
            
            dMark.appendTo(dMark2);
            dMark2.appendTo(dHeader);
            
            var dCF =$('<div class="ui-helper-clearfix" />');
            dCF.appendTo(dHeader);
            

            dHeader.appendTo(this.container);
            this.Notifications.Elements.Header = dHeader;
        }

        if (!this.Notifications.Elements.FlyOut)
        {
            var dFlyOut = $('<div class="NotificationFlyOut ui-helper-hidden ui-accordion-content ui-widget-content" />') ;
            dFlyOut.appendTo(this.container);
            
            this.Notifications.Elements.FlyOut = dFlyOut;
            var dContainer = $('<div class ="NotificationContainer" />');
            this.Notifications.Elements.Container = dContainer;
            dContainer.appendTo(dFlyOut)
        }

    },

    ".NotificationHeader click": function()
    {
        if(this.Notifications.Elements.HeaderOpen.css('display') != 'none'){
            if (this.Notifications.Elements.FlyOut.hasClass( 'ui-helper-hidden')){
                this.Show();
            } else {
                this.Hide();
            }
        }
    },

    ".NotificationHeader mouseover": function(){
        this.Notifications.Elements.Header.toggleClass('ui-state-hover', true);
    },

    ".NotificationHeader mouseout": function(){
        this.Notifications.Elements.Header.toggleClass('ui-state-hover', false);
    },

    ".messageWithSourceShowMe click": function(el,evt){
        el.data('messagesource').source.showMe();
    },

    decorate : function()
    {
        var jContainer = this.Notifications.Elements.Container;
        var msg ,message;
        if (jContainer)
          jContainer.empty();

        
        for (var i = 0; i < this.messages.length; i++)
        {
            msg = this.messages[i];
            message = $(this.view("//jmvc_machinery/framework/views/default_fly_out_message",JmvcMachinery.Messages.Api.messageTemplate(msg.level.toString().toLowerCase(),msg.message)));
            message.find('p').toggleClass('ui-corner-bottom', true);
            if(msg.source && msg.source.showMe){
              message.toggleClass('messageWithSourceShowMe', true);
            }
            
            message = message.appendTo(jContainer);
            message.data('messagesource', msg);
        }
        if(this.messages.length > 0){
            this.Show();
        } else {
          this.Hide();
        }
        this._SetStyle();
        
        
    },
    
    Show: function()
    {
        if (this.messages.length > 0) {
            $(this.Notifications.Elements.FlyOut).toggleClass('ui-helper-hidden', false);
            $(this.Notifications.Elements.Header).toggleClass('ui-state-default', false);
            $(this.Notifications.Elements.Header).toggleClass('ui-state-active', true);
            this.Position();
        };
    },

    Hide: function()
    {
        var dFlyOut = this.Notifications.Elements.FlyOut;
        $(this.Notifications.Elements.FlyOut).toggleClass('ui-helper-hidden', true);
        $(this.Notifications.Elements.Header).toggleClass('ui-state-default', false);
        $(this.Notifications.Elements.Header).toggleClass('ui-state-active', false);
        
        
        dFlyOut.css('left','');
        dFlyOut.css('top','');
    },

    Position: function()
    {
        $(this.Notifications.Elements.FlyOut).position({ my: 'left top', at: 'left bottom',offset:'2 0', of: '.NotificationHeader'});
    },

    _SetStyle: function()
    {
        var className = this.Notifications.Options.className;
        var classNameEmpty = this.Notifications.Options.classNameEmpty;

        if (this.messages && this.messages.length)
        {
            setStyleAndHtml(this.Notifications.Elements.HeaderOpen,true);
            setStyleAndHtml(this.Notifications.Elements.HeaderMarkError, this.errors.length > 0 ,JmvcMachinery.Messages.Api.messageSummaryIcon('error',this.errors.length));
            setStyleAndHtml(this.Notifications.Elements.HeaderMarkInfo,this.information.length > 0 ,JmvcMachinery.Messages.Api.messageSummaryIcon('information',this.information.length));
            setStyleAndHtml(this.Notifications.Elements.HeaderMarkWarning, this.warnings.length > 0, JmvcMachinery.Messages.Api.messageSummaryIcon('warnings',this.warnings.length));         
            this.container.className = JmvcMachinery.Class.Replace(this.container.className, classNameEmpty, className);
        }
        else
        {
            setStyleAndHtml(this.Notifications.Elements.HeaderOpen,false);
            setStyleAndHtml(this.Notifications.Elements.HeaderMarkError,false);
            setStyleAndHtml(this.Notifications.Elements.HeaderMarkInfo,false);
            setStyleAndHtml(this.Notifications.Elements.HeaderMarkWarning,false);
            this.Hide();
            this.container.className = JmvcMachinery.Class.Replace(this.container.className, className, classNameEmpty);
        }
        function setStyleAndHtml(element,visibility,innerHtml)
        {
              element.css('display',visibility ? '' : 'none');
              if(innerHtml && innerHtml != ''){
                 element.html(innerHtml);
              }
          
        } 
    }

});
