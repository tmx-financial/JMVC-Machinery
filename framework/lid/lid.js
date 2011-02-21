/* -*- Mode: javascript; tab-width: 4; indent-tabs-mode: nil; */
steal.plugins('jquery/controller')
.then(function(){
steal
    .plugins(
         'underscore'
        , 'jquery/controller/subscribe'
        , 'jquery/view/ejs'
        , 'jquery/view/helpers'
        , 'jquery/class'
        , 'jquery/lang'
        , 'jquery/model'
        , 'jquery_ui'
        , '//jmvc_machinery/framework/views/helpers'
    )
    .resources(
        'lid_jquery_plugin'
        , 'read_only_api'
        , 'standard_focus_api'
        , 'delegated_input_methods'
        , 'extend_controller'
        , 'input_locator'
        , 'schema_tools'
        , 'reshow'
    )
    .css(
        'stylesheets/lid'
    )
    .controllers(
        'decorator'
        ,'input'
        ,'string'
        ,'number'
        ,'checkbox'
        ,'datepicker'
        ,'textarea'
        ,'select'
        ,'ssn'
        ,'lid'
    )
    .views();
});
