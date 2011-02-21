(function(GLOBAL){
"use strict";

function loadHeader($header, headerArray) {
    var resultingArray = [];

    _(headerArray).each(function(item){
        var $element = $("<th name='" + item + "' />");

        $element.text(item);
        $element.appendTo($header);
        resultingArray.push($element);
    });

    return resultingArray;
}

$.Controller.extend("JmvcMachinery.Framework.Controllers.SimpleTableList",{

},{
    init: function(el, headerArray){
        var $el = $(el),
            $table = $("<table class='ui-widget-content ui-corner-all'/>").appendTo($el),
            $header = $("<tr name='header' class='ui-widget-header'/>").appendTo($table),
            rowCount = 0,
            rows = [];

        $el.toggleClass("ui-widget", true);

        loadHeader($header, headerArray);

        function loadRow(row) {

            var $row = $table.find("tr[data-rownum=" + row.__rowNum + "]").first();
            if ($row.length === 0) {
                throw new Error("Unable to find row number: " + row.__rowNum);
            }

            $row.empty();

            _(headerArray).each(function(item){
                var $cell = $("<td/>").appendTo($row);

                $cell.html(row[item] || "&nbsp;");
            });
        }

        this.addRow = function(row) {
            if (!row) {
                throw new Error("[row] is required.");
            }

            var $row = $("<tr data-rownum='" + rowCount + "'/>").appendTo($table);

            row.__rowNum = rowCount + "";

            if(rowCount % 2) {
                $row.toggleClass("ui-grid-zebra-even", true);
            } else {
                $row.toggleClass("ui-grid-zebra-odd", true);
            }

            loadRow(row, headerArray);
            rows.push(row);

            rowCount ++;
            return row;
        };

        this.rowFromRowElement = function($row) {
            if (!$row) {
                throw new Error("$row is required.");
            }
            if (!($row instanceof jQuery)) {
                throw new Error("$row must be a jQuery-wrapped element.");
            }

            var result = _(rows).detect(function(row){
                return row.__rowNum === $row.attr("data-rownum");
            });

            if (result === undefined) {
                throw new Error("Row object not found for specified $row.");
            }
            return result;
        };

        this.updateRow = function(row){
            loadRow(row, headerArray);
        };

        this.clearHighlights = function() {
            $table.find("tr").toggleClass("ui-state-highlight", false);
        };

        this.highlight = function(row) {
            this.clearHighlights();
            row = row.__rowNum || row;
            console.log(row);
            $table.find("tr[data-rownum=" + row + "]").first().toggleClass("ui-state-highlight", true);
        };
    },

    "tr mouseenter" : function(row) {
        var $row = $(row);

        if ($row.attr("name") !== "header") {
            $(row).toggleClass("ui-state-hover", true);
        }
    },

    "tr mouseleave" : function(row) {
        $(row).toggleClass("ui-state-hover", false);
    },

    "tr click" : function(row) {
        var $row = $(row);

        if ($row.attr("name") !== "header") {
            this.clearHighlights();
            $row.toggleClass("ui-state-highlight", true);
            $row.trigger("simple_table_list_row_clicked", this.rowFromRowElement($row));
        }
    }
});

}(function(){return this;}));
