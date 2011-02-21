/* -*- Mode: javascript; tab-width: 4; indent-tabs-mode: nil; */

/**
 * @tag controllers, home
 */
JmvcMachinery.Framework.Controllers.BasePage.extend('JmvcMachinery.Framework.Controllers.SplitBody',
/* @Static */
{

},
/* @Prototype */
{
    init: function() {
        this._super();  
        var flyout,actionbar;  
        var pageBody = $(this.pageBody);

        this.lidView(this.pageBody, "//jmvc_machinery/framework/views/split_body");

        this.LeftArea = this.pageBody.find('#EastBar');
        this.BodyArea = this.pageBody.find('#SplitBodyArea');
        flyout = this.LeftArea.find('#FlyOut');
        
        actionbar = $('#ActionContainer');
        this.ActionBar = actionbar.jmvc_machinery_framework_action_bar();        
        this.LeftArea.FlyOut = flyout.jmvc_machinery_framework_flyout().controller();
        
        
    }
});
