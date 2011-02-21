steal.plugins('jquery/view/ejs', 'jquery/lang/json').then(function($)
{

    /**
	* @add jQuery.EJS.Helpers.prototype
	*/
    $.extend($.EJS.Helpers.prototype, {
        framework_img_tag: function(image, options)
        {
            options = options || {};
            options.src = steal.root.join("/jmvc_machinery/framework/resources/images/" + image);
            return this.single_tag_for('img', options);
        },
        fieldsetBegin: function(title)
        {
            title = title ? _("<legend>%s</legend>").sprintf(title) : "";
            return "<fieldset class='ui-widget ui-widget-content group-panel'>" + title;
        },
        fieldsetEnd: function()
        {
            return "</fieldset>";
        },
        input_field_tag: function(name, value, inputType, html_options){
            html_options = html_options || {};
            html_options.value = value || '';
            html_options.type = inputType || 'text';
            html_options.name = name;
            html_options.title = ""; 
            return this.single_tag_for('input', html_options);
        },
        select_tag: function(name, value, choices, html_options){
            html_options = html_options || {};
            //html_options.value = value;
            html_options.name = name;
            var txt = '';
            txt += this.start_tag_for('select', html_options);
            for (var i = 0; i < choices.length; i++)
            {
                var choice = choices[i];
                if (typeof choice == 'string') choice = {
                    value: choice
                };
                if (!choice.text) choice.text = choice.value;
                if (!choice.value) choice.text = choice.text;

                var optionOptions = {
                    value: choice.value
                };
                if (choice.value == value)
                optionOptions.selected = null;// 'selected';
                txt += this.start_tag_for('option', optionOptions) + choice.text + this.tag_end('option');
            }
            txt += this.tag_end('select');
            return txt;
        },
        text_area_tag: function(name, value, html_options){
            html_options = html_options || {};
            html_options.name = html_options.name || name;
            value = value || '';

            return this.start_tag_for('textarea', html_options) + value + this.tag_end('textarea');
        },
        /**
   * @plugin view/helpers
   * @param {Object} image_location
   * @param {Object} options
   */
        img_tag: function(image_location, options){
            options = options || {};
            options.src = steal.root.join("resources/images/" + image_location);
            return this.single_tag_for('img', options);
        }
    });
});
