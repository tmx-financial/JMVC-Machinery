/**
 * @tag controllers, home
 */
jQuery.Controller.extend('JmvcMachinery.Framework.Controllers.PageHeader',
/* @Static */
{

},
/* @Prototype */
{
  init : function(el) {
    var $el = this.container = $(el);
    
    this.lidView(this.container, "//jmvc_machinery/framework/views/page_header");
    $el.find("#appHeaderMenu").jmvc_machinery_framework_main_menu();
  }

});
