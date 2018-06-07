(function(window) {
    'use strict'

    /**
     * Templating for the Entry grid
     */
    function Template() {
        this.tableTemplate
        =		'<table id="tblEntries" class="table table-striped table-condensed">'
        +			'<thead>'
        +				'<th>Time</th>'
        +				'<th>Sleep</th>'
        +				'<th>Diaper</th>'
        +				'<th>Feed</th>'
        +			'</thead>'
        +			'<tbody id="tblEntriesBody">'
        +				'{{rows}}'
        +			'</tbody>'
        +		'</table>';
    }

    /**
     * Generate the html
     */
    Template.prototype.generateHtml = function(data) {
        return this.tableTemplate.replace('{{rows}}', this._generateRows(data));
    }

    /**
     * Update existing html with the given data
     */
    Template.prototype.updateHtml = function(grid, data) {
        // keys to our data object, and to our element classes
        var times = this._generateAllTimes();
        var setElementsToDefaultState = this._setElementsToDefaultState.bind(this);
        var setActiveOrInactive = this._setActiveOrInactive.bind(this);

        // rip through all the 'times'
        times.forEach(function(t) {
            var btnSleep = qs('.sleep_'+t);
            var ddlDiaper = qs('.diaper_'+t);
            var ddlFeed = qs('.feed_'+t);
            var all_elements = [ btnSleep, ddlDiaper, ddlFeed ];
            if (data[t] === undefined) {    // <-- that's right, using time as a property on the object...
                setElementsToDefaultState(all_elements);
            }
            else {
                setActiveOrInactive(btnSleep, data[t].sleep);
                setActiveOrInactive(ddlDiaper, data[t].diaper);
                setActiveOrInactive(ddlFeed, data[t].feed);
            }
        });
    }

    /**
     * Sets an element to be either active or inactive.
     */
    Template.prototype._setActiveOrInactive = function(element, dataObject) {
        var getFeedValue = function() {
            return dataObject.entry_type + '-' + dataObject.entry_value;
        }
        if (dataObject !== undefined) {
            this._setActive(element);
            if (dataObject.entry_type) {
                switch (dataObject.entry_type) {
                    case 'diaper':
                        element.value = dataObject.entry_value;
                        break;
                    default:
                        // default will be for 'feed' (milk, fmla, etc)
                        element.value = getFeedValue();
                        break;
                }
            }
        }
        else {
            this._setElementsToDefaultState([element]);
        }
    }

    Template.prototype._setElementsToDefaultState = function(elements) {
        elements.forEach(function(el) {	
            el.style.backgroundColor = "";
            el.value = "none";
        });
    }


    Template.prototype._setActive = function(element) {
        element.style.backgroundColor = this._getActiveColor();	
    }

    Template.prototype._getActiveColor = function() {
        return '#50C050';
    }

    Template.prototype._generateRow = function(time, data, feedOptionsHtml) {

        var rowData = data[time];
        var sleep = (rowData && rowData.sleep) ? rowData.sleep : null;
        var diaper = (rowData && rowData.diaper) ? rowData.diaper.entry_value : null;
        var feed = (rowData && rowData.feed) ? rowData.feed.entry_type+'-'+rowData.feed.entry_value : null;
        var feedOptionsUpdated = feedOptionsHtml;
        if (feed !== undefined) {
            // select the selected item
            feedOptionsUpdated = feedOptionsUpdated.replace('value="'+feed+'"', 'value="'+feed+'" selected ');
        }

        return '<tr>' 
            +   '<td>'
            +   time
            +   '</td>'
            +   '<td>'
            +       '<button class="sleep_'+time+'" style="background-color:'+(sleep ? this._getActiveColor() : 'none')+'">sleep</button>'
            +   '</td>'
            +   '<td>'
            +   this._generateDiaperSelect(time, diaper)
            +   '</td>'
            +   '<td>'
            +       feedOptionsUpdated
                        .replace('{{time}}', time)
                        .replace('{{color}}', (feed ? this._getActiveColor() : 'none'));
            +   '</td>'
            + '</tr>';
    }

    /**
     * Generate all the possible feed options
     */
    Template.prototype._generateFeedOptions = function () {
        var options = ['none', 'milk-BL', 'milk-BR'];
        ['milk', 'formula', 'solid'].forEach(function (feedType, i) {
            var min_amount = feedType === 'solid' ? 10 : 50;
            for (var j = min_amount; j <= 300; j += 10) {
                options.push(feedType + '-' + j);
            }
        });
        var optionsHtml = '';
        options.forEach(function (opt) {
            optionsHtml += '<option value="' + opt + '">' + opt + '</option>';
        });
        return '<select class="feed feed_{{time}}" style="background-color:{{color}}">'
            + optionsHtml
            + '</select>';
    }

    Template.prototype._generateDiaperSelect = function (time, selection) {
        var bg = 'none';
        if (selection !== null) {
            bg = this._getActiveColor();
        }
        return '<select class="diaper diaper_' + time + '" style="background-color:' + bg + '">'
            + this._generateHtmlOption('none', selection)
            + this._generateHtmlOption('pee', selection)
            + this._generateHtmlOption('poo', selection)
            + '</select>';
    }

    Template.prototype._generateHtmlOption = function(val, selectedVal) {
        var selected = (selectedVal === val) ? 'selected' : '';
        return '<option '+selected+' value="'+val+'">'+val+'</option>';
    }

    /**
     * Gen all the rows in html
     */
    Template.prototype._generateRows = function(data) {
        var times = this._generateAllTimes();
        var feedOptionsHtml = this._generateFeedOptions();
        var generateRow = this._generateRow.bind(this);
        return times.reduce(function(acc, val) {
            acc += generateRow(val, data, feedOptionsHtml);
            return acc;
        }, '');
    }

    /**
     * Generate all the times for the grid (ie, rows)
     */
    Template.prototype._generateAllTimes = function() {
        var rowCount = 24*UTILS.HOURLY_DIVISIONS;
        var times = [];
        for (var i = 0; i < rowCount; i++) {
            times.push(datetime.getTimeFromRange(UTILS.HOURLY_DIVISIONS, i));
        }
        return times;
    }

    window.entry = window.entry || {};
    window.entry.Template = Template;

})(window);
