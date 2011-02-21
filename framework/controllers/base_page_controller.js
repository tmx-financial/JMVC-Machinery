/* -*- Mode: javascript; tab-width: 4; indent-tabs-mode: nil; */

/**
 * @tag controllers, home
 */
jQuery.Controller.extend('JmvcMachinery.Framework.Controllers.BasePage',
/* @Static */
{

},
/* @Prototype */
{
    init: function() {
        var body = $('body'),
            pageHeader;
        
        //A little weird, but this is the most central place to ensure that these classes are on the whole body...
        body.toggleClass("ui-helper-reset", true).toggleClass("ui-widget", true); 
        

        body.append(this.view("//jmvc_machinery/framework/views/page_base"));

        this.pageHeader = pageHeader = $('#AppHeaderArea');
        this.pageBody = $('#AppBodyArea');

        pageHeader.jmvc_machinery_framework_page_header();
    },
    pageHeader: undefined,
    pageBody: undefined
});
