/**
 * @tag controllers, home
 */
jQuery.Controller.extend('JmvcMachinery.Framework.Controllers.PageFooter',
/* @Static */
{

    },
/* @Prototype */
{
    Notifications: undefined,
    init: function(el)
    {
        this.container = $(el)
        this.container.html(this.view("//jmvc_machinery/framework/views/page_footer"));
        this.container.extend({
            left: this.container.find('#AppFooterLeft')
        })


        var that = this;
        this.Notifications = new Object();
        this.Notifications.Elements = new Object();
        //this.Notifications.Messages = new Array();
        JmvcMachinery.Messages.Api.mixIn(this.Notifications,
        function(){
            that.decorate();
        });

        this.container.left.className = JmvcMachinery.Class.Add(this.container.className, 'ValidationEmpty');

        this.Notifications.Options = {
            Position: 'TopLeft',
            maxHeight: 450,
            Height: 0,
            Width: 190
        };

        if (!this.Notifications.Elements.Header)
        {
            var dHeader = document.createElement('div');
            dHeader.className = 'NotificationHeader';

            var dOpen = document.createElement('div');
            dOpen.className = 'NotificationFlyOutToggle';
            dOpen.NotificationElement = this.container.left;
            dOpen.style.display = 'none';

            dHeader.appendChild(dOpen);
            this.Notifications.Elements.HeaderOpen = dOpen;

            var dMark = document.createElement('div');
            dMark.className = 'NotificationHeaderMark';
            dMark.style.display = 'none';
            dHeader.appendChild(dMark);
            this.Notifications.Elements.HeaderMark = dMark;

            var dCount = document.createElement('div');
            dCount.className = 'NotificationHeaderCount';
            dCount.style.display = 'none';
            dHeader.appendChild(dCount);
            this.Notifications.Elements.HeaderCount = dCount;

            var dCF = document.createElement('div');
            dCF.className = 'ui-helper-clearfix';
            dHeader.appendChild(dCF);

            this.container.left.append(dHeader);
            this.Notifications.Elements.Header = dHeader;
        }

        if (!this.Notifications.Elements.FlyOut)
        {
            var dFlyOut = document.createElement('div');
            dFlyOut.className = 'NotificationFlyOut ui-helper-hidden';

            this.container.left.append(dFlyOut);
            this.Notifications.Elements.FlyOut = dFlyOut;

            var dFlyOutHeader = document.createElement('div');
            dFlyOutHeader.className = 'NotificationFlyOutHeader';

            var dClose = document.createElement('div');
            dClose.className = 'NotificationFlyOutToggle';
            dClose.NotificationElement = this.container.left;

            dFlyOutHeader.appendChild(dClose);

            var dCF = document.createElement('div');
            dCF.className = 'ui-helper-clearfix';
            dFlyOutHeader.appendChild(dCF);

            dFlyOut.appendChild(dFlyOutHeader);
            this.Notifications.Elements.FlyOutHeader = dFlyOutHeader;

            var dContainer = document.createElement('div');
            dContainer.className = 'NotificationContainer';

            this.Notifications.Elements.Container = dContainer;
            dFlyOut.appendChild(dContainer);
        }

    },

    ".NotificationFlyOutToggle click": function()
    {
        if (JmvcMachinery.Class.Check(this.Notifications.Elements.FlyOut, 'ui-helper-hidden'))
        {
            this.Show();
        } else{
            this.Hide();
        }
    },

    decorate : function()
    {
        var jContainer = jQuery(this.Notifications.Elements.Container);
        if (jContainer)
          jContainer.empty();

        
        for (var i = 0; i < this.Notifications.messages.length; i++)
        {
            msg = this.Notifications.messages[i];
           // if (!msg.template)
            //{
              //  msg.template = "//jmvc_machinery/framework/views/default_fly_out_message"
            //}
            //msg.__MessageElement = this;
                       
            jContainer.append(this.view("//jmvc_machinery/framework/views/default_fly_out_message", msg));
        }
        if(this.Notifications.messages.length > 0){
            this.Show();
        } else {
          this.Hide();
        }
        this._SetStyle();        
    },
    
    "JmvcMachinery.Flyout.Update subscribe": function(el, msgs)
    {
        
        //this.Notifications.messages.set(msgs.messages,{source: msgs.source});

        //this.Show();
        //this._SetStyle();
    },
    "JmvcMachinery.Flyout.Add subscribe": function(el, msgs)
    {
        if (!msg.ID || !msg.ID == null)
        throw "Each message must have an ID"

        for (var i = 0; i < this.Notifications.Messages.length; i++)
        {
            if (this.Notifications.Messages[i].ID == msg.ID)
           return;
            //Do not add the exact same message again
        }

        var jContainer = jQuery(this.Notifications.Elements.Container);

        if (!msg.Template)
        msg.Template = "//jmvc_machinery/framework/views/default_fly_out_message"

        jContainer.append(this.view(msg.Template, msg));

        jContainer.find(_('[NotificationID=%s]').sprintf(msg.ID)).each(function(){
            msg.__MessageElement = this;
        })


        this.Notifications.messages.push(msg);
        
        this.Show();
        this._SetStyle();
    },

    "JmvcMachinery.Flyout.Remove subscribe": function(el, criteria)
    {
      
        //this.Remove(criteria);
    },

    Show: function()
    {
        //$(this.Notifications.Elements.FlyOut).toggle('ui-helper-hidden', false);
        this.Position();
    },

    Hide: function()
    {
        var dFlyOut = this.Notifications.Elements.FlyOut;
      //  $(this.Notifications.Elements.FlyOut).toggle('ui-helper-hidden', true);
        dFlyOut.style.left = '';
        dFlyOut.style.top = '';
    },

    Position: function()
    {
        var dFlyOut = this.Notifications.Elements.FlyOut;



        var T = 200;
        var L = 200;

        var Pos = this.Notifications.Options.Position;

        //clear binding container settings
        this.Notifications.Elements.Container.style.width = '';
        this.Notifications.Elements.Container.style.height = '';

        var hLayout = JmvcMachinery.Layout.element(this.Notifications.Elements.FlyOutHeader);
        var cLayout = JmvcMachinery.Layout.element(this.Notifications.Elements.Container);

        var H = hLayout.height.outer + cLayout.height.outer;

        if (this.Notifications.Options.Height)
        {
            if (H > this.Notifications.Options.Height)
            H = this.Notifications.Options.Height;
        }
        else
        {
            if (this.Notifications.Options.maxHeight && H > this.Notifications.Options.maxHeight)
            H = this.Notifications.Options.maxHeight;
        }

        var W = (this.Notifications.Options.Width || 200);

        var pOptions = {
            element: this.Notifications.Elements.FlyOut,
            parent: this.container.left[0],
            vertical: 'top',
            horizontal: 'left',
            vAnchor: 'bottom'
        }

        JmvcMachinery.Layout.Absolutes.position(pOptions);
    },

    "resize": function()
    {
        var dFlyOut = this.Notifications.Elements.FlyOut;
        if (!JmvcMachinery.Class.Check(dFlyOut.className, 'ui-helper-hidden'))
        this.Position();
    },

    Remove: function(Criteria)
    {
        if (!Criteria) return;

        var Remaining = new Array();

        if (this.Notifications && this.Notifications.Messages)
        {
            for (var i = 0; i < this.Notifications.Messages.length; i++)
            {
                var messageElement = this.Notifications.Messages[i].__MessageElement;

                if (JmvcMachinery.Objects.Match(this.Notifications.Messages[i], Criteria))
                this.Notifications.Elements.Container.removeChild(messageElement);
                else
                Remaining.push(this.Notifications.Messages[i]);
            }
            this.Notifications.Messages = Remaining;
        }

        this.Show();
        this._SetStyle();
    },

    _SetStyle: function()
    {
        var className = this.Notifications.Options.className;
        var classNameEmpty = this.Notifications.Options.classNameEmpty;

        if (this.Notifications.messages && this.Notifications.messages.length)
        {
            this.Notifications.Elements.HeaderOpen.style.display = '';
            this.Notifications.Elements.HeaderMark.style.display = '';
            this.Notifications.Elements.HeaderCount.style.display = '';
            this.Notifications.Elements.HeaderCount.innerHTML = this.Notifications.messages.length;

            this.container.left.className = JmvcMachinery.Class.Replace(this.container.left.className, classNameEmpty, className);
        }
        else
        {
            this.Notifications.Elements.HeaderOpen.style.display = 'none';
            this.Notifications.Elements.HeaderMark.style.display = 'none';
            this.Notifications.Elements.HeaderCount.style.display = 'none';

            this.Hide();
            this.container.left.className = JmvcMachinery.Class.Replace(this.container.left.className, className, classNameEmpty);
        }
    }

});
