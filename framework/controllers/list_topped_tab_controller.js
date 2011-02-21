(function(GLOBAL){
"use strict";

    JmvcMachinery.Framework.Controllers.Tab.extend("JmvcMachinery.Framework.Controllers.ListToppedTab",{

    },{
        init: function(el, options) {
            var that = this,
                $container = $(el),
                $top = this.$top = $("<div name='top'/>"),
                $bottom = this.$bottom = $("<div name='bottom'/>"),
                tableList,
                firstRow = true;

            $container.append($top).append($bottom);

            this._super($bottom);

            $top.jmvc_machinery_framework_simple_table_list(options.header);
            tableList = $top.controller();

            this.addTab = _(this.addTab).wrap(function(func, tab, row){
                var result;

                if (!row) {
                    throw new Error("A row object is required.");
                }

                tableList.addRow(row);
                result = func.call(that, tab);
                result.row = row;
                row.tab = result;

                if (firstRow) {
                    that.highlight(row);
                }
                firstRow = false;

                return result;
            });

            this.updateRow = _(tableList.updateRow).bind(tableList);
            this.highlight = _(tableList.highlight).bind(tableList);

            $bottom.tabs({
                select: function(event, ui){
                    that.highlight(ui.index);
                }
            });
        },

        "div[name=top] simple_table_list_row_clicked" : function(el, evt, row){
            this.$bottom.tabs("select", row.tab.attr("id"));
        }
    });

}(function(){return this;}));
