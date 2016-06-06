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
		var self = this;

		// keys to our data object, and to our element classes
		var times = self._generateAllTimes();

		times.forEach(function(t) {
			var btnSleep = qs('.sleep_'+t);
			var ddlDiaper = qs('.diaper_'+t);
			var ddlFeed = qs('.feed_'+t);
			var elements = [ btnSleep, ddlDiaper, ddlFeed ];

			if (!data[t]) {
				self._setElementsToDefaultState(elements);
			}
			else {
				self._setActiveInactive(btnSleep, data[t].sleep);
				self._setActiveInactive(ddlDiaper, data[t].diaper);
				self._setActiveInactive(ddlFeed, data[t].feed);
			}

		});

	}

	Template.prototype._setActiveInactive = function(element, state) {
		if (state) {
			this._setActive(element);
		}
		else {
			this._setElementsToDefaultState([element]);
		}
	}

	Template.prototype._setElementsToDefaultState = function(elements) {
		elements.forEach(function(el) {	
			el.style.backgroundColor = "";
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

		if (feed) {
			// select the selected item
			feedOptionsUpdated = feedOptionsUpdated.replace('value="'+feed+'"', 'value="'+feed+'" selected ');
		}

		return '<tr>' 
			+	'<td>'
			+ 		time
			+	'</td>'
			+	'<td>'
			+		'<button class="sleep_'+time+'" style="background-color:'+(sleep ? this._getActiveColor() : 'none')+'">sleep</button>'
			+	'</td>'
			+	'<td>'
			+		this._generateDiaperSelect(time, diaper)
			+	'</td>'
			+	'<td>'
			+		feedOptionsUpdated
						.replace('{{time}}', time)
						.replace('{{color}}', (feed ? this._getActiveColor() : 'none'));
			+	'</td>'
			+ '</tr>';
	}

	/**
	 * Generate all the possible feed options
	 */
	Template.prototype._generateFeedOptions = function() {

		var options = [ 'none', 'milk-BL', 'milk-BR' ];
		var feedTypes = ['milk', 'formula', 'solid'];
		for(var h = 0; h < feedTypes.length; h++) {
			var min_amount = 50;
			if (h == 2) {
				min_amount = 10;
			}
			for(var i = min_amount; i <= 300; i+=10) options.push(feedTypes[h]+'-'+i);
		}

		var optionsHtml = '';
		options.forEach(function(opt) {
			optionsHtml += '<option value="'+opt+'">'+opt+'</option>';
		});

		return '<select class="feed feed_{{time}}" style="background-color:{{color}}">'
		+	optionsHtml
		+ '</select>';
	}

	Template.prototype._generateDiaperSelect = function(time, selection) { 
		var bg = 'none';
		if (selection) {
			bg = this._getActiveColor();
		}
		return '<select class="diaper diaper_'+time+'" style="background-color:'+bg+'">'
		+		this._generateHtmlOption('none', selection)
		+		this._generateHtmlOption('pee', selection)
		+		this._generateHtmlOption('poo', selection)
		+	'</select>';
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
		var rowsHtml = '';
		for (let time of times) {
			rowsHtml +=	this._generateRow(time, data, feedOptionsHtml);
		}
		return rowsHtml;
	}

	/**
	 * Generate all the times for the grid (ie, rows)
	 */
	Template.prototype._generateAllTimes = function() {
		var rowCount = 24*UTILS.HOURLY_DIVISIONS;
		var times = [];
		for (var i = 0; i < rowCount; i++) {
			var timeField = DATETIME.getTimeFromRange(UTILS.HOURLY_DIVISIONS, i);
			times.push(timeField);
		}

		return times;
	}


	window.grid = window.grid || {};
	window.grid.Template = Template;

})(window);
