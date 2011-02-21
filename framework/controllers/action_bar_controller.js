/**
 * @tag controllers, home
 */
jQuery.Controller.extend('JmvcMachinery.Framework.Controllers.ActionBar',
/* @Static */
{

},
/* @Prototype */
{
	init: function (el) {
		this.container = $(el);
		this.lidView(this.container, "//jmvc_machinery/framework/views/action_bar");
		this.leftArea = this.container.find('#AppActionLeft');
		this.rightArea = this.container.find('#AppActionRight');
		
		this.ActionMenu  =this.rightArea ; 
	},
	setStatusMessage: function(msg) {
		this.leftArea.text(msg);
	}
});

