/* -*- Mode: javascript; tab-width: 4; indent-tabs-mode: nil; */

//--------MODULE HEADER----------
(function(GLOBAL) {
//===============================

steal.plugins(
    "underscore",
    "//jmvc_machinery/framework/js_augmentations",
    "jquery/controller",
    "jquery/controller/subscribe",
    "jquery/view/ejs",
    "jquery/view/helpers",
    "jquery/class",
    "jquery/lang",
    "jquery/model",
    "jquery/model/associations",
    "jquery/model/validations",
    "jquery/dom/form_params",
    "//jmvc_machinery/framework/views/helpers",
    "jquery/tie",
    "jack",
    "jquery_plugins",
    "jquery_ui",
    "//jmvc_machinery/framework/lid",
    "magic_fixture"
)
.css(
    "stylesheets/JmvcMachinery.BasePage",
    "stylesheets/JmvcMachinery.SplitBody",
    "stylesheets/JmvcMachinery.PageHeader",
    "stylesheets/tab_controller",
    "stylesheets/flyout_controller",
    "stylesheets/menu_controller",
    "stylesheets/tab_message_controller",
    "stylesheets/simple_table_list_controller"
)
.resources(
    "debug",
    "dataStructures",
    "JmvcMachinery",
    "JmvcMachinery.Ajax",
    "JmvcMachinery.Format",
    "JmvcMachinery.Themes",
    "JmvcMachinery.SchemaHelper",
    //"Atlas.SharedSchemas",
    "JmvcMachinery.Editors",
    "JmvcMachinery.Validation",
    "modelExtensions",
    "memberScanning",
    "inflection",
    "JmvcMachinery.ScreenBlueprint",
    "JmvcMachinery.Message.Proxy",
    "JmvcMachinery.message.api"
)
.controllers(
    "page_header",
    "page_footer",
    "flyout",
    "base_page",
    "menu",
    "action_bar",
    "tab_messages",
    "split_body",
    "tabbed_body",
    "tab",
    "list_topped_tab",
    "simple_table_list",
    "dialog",
    "tab_area",
    "model_bound",
    "main_menu",
    "focus_group"
)
.views(
    "//jmvc_machinery/framework/views/page_header.ejs",
    "//jmvc_machinery/framework/views/page_footer.ejs",
    "//jmvc_machinery/framework/views/flyout.ejs",
    "//jmvc_machinery/framework/views/page_base.ejs",
    "//jmvc_machinery/framework/views/page_footer.ejs",
    "//jmvc_machinery/framework/views/default_fly_out_message.ejs",
    "//jmvc_machinery/framework/views/split_body.ejs",
    "//jmvc_machinery/framework/views/action_bar.ejs"
)
.then(function() {
    if(steal.options.env === "development" || steal.options.env === "test")
    {
        steal.plugins(
            "jquery/dom/fixture",     // simulated Ajax requests
            "magic_fixture"
        );
    }

    steal.plugins(
            "//jmvc_machinery/framework/characteristics/new_characteristic_based_model_definition.js",
            "//jmvc_machinery/framework/characteristics/proxy_machinery/proxy_machinery.js",
            "jmvc_machinery/framework/application/characteristics/resources/steal_characteristics.js",
            "//jmvc_machinery/framework/model_definition/model_concepts/model_concept_processor_registry.js",
            "//jmvc_machinery/framework/model_definition/model_definition.js",
            "//jmvc_machinery/framework/characteristics/define_characteristic_types.js"
            ).then(function() {
                steal.plugins(
                    "//jmvc_machinery/framework/model_definition/model_concepts/morphs_attribute_schemas.js",
                    "//jmvc_machinery/framework/model_definition/model_concepts/adds_instance_members.js",
                    "//jmvc_machinery/framework/model_definition/model_concepts/adds_static_members.js",
                    "//jmvc_machinery/framework/model_definition/model_concepts/runs_block_at_model_instance_init.js",
                    "//jmvc_machinery/framework/model_definition/model_concepts/product_must_have_these_attributes.js",
                    "//jmvc_machinery/framework/model_definition/model_concepts/produces_attributes_with_specialized_getters_and_setters.js",
                    "//jmvc_machinery/framework/model_definition/model_concepts/produces_derived_attributes.js",
                    "//jmvc_machinery/framework/model_definition/model_concepts/forces_attributes_to_be_readonly_when.js",
                    "//jmvc_machinery/framework/model_definition/model_concepts/primary_attributes.js",
                    "//jmvc_machinery/framework/model_definition/model_concepts/produces_attributes_with_private_setters.js",
                    "//jmvc_machinery/framework/characteristics/application/cross_applicant/cross_applicant_translation.js"
                    ).then(function() {
                    steal.plugins(
                        "//jmvc_machinery/framework/model_definition/model_definer.js",
                        "//jmvc_machinery/framework/characteristics/produce_characteristic_declaration_function.js",
                        "//jmvc_machinery/framework/characteristics/produce_characteristic_instantiation_function.js"
                        );
                });
    });
});


//===============================
} (window, (function() {
    return;
} ())));
//===============================
