(function(window) {
	'use strict'

	function View(template) {
		var self = this;
		self.template = template;

		// view elements
		self.$entryGrid = qs('#entry-grid');
		self.$prevDayButton = qs('#btnBack');
		self.$nextDayButton = qs('#btnForward');
		self.$dayPickerDate = qs('#dayPickerDate');
	}

	/**
	 * Render the grid
	 */
	View.prototype.render = function(error, gridData, date) {
		if (error) {
			alert(error);
			return;
		}
		var self = this;
		self.$entryGrid.innerHTML = self.template.generateHtml(gridData);

		// get dynamic controls after binding
		self.$allSleepButtons = qsa('#entry-grid button');
		self.$allDiaperSelects = qsa('select.diaper');
		self.$allFeedSelects = qsa('select.feed');

		self.$dayPickerDate.innerHTML = datetime.getDateFormatForDay(date);
	}

	View.prototype.update = function(error, gridData, date) { 
		if (error) {
			alert(error);
			return;
		}
		this.template.updateHtml(this.$entryGrid, gridData);
		this.$dayPickerDate.innerHTML = datetime.getDateFormatForDay(date);
	}

	/**
	 * Bind a dom event to a callback
	 */
	View.prototype.bind = function(name, callback) {
		var self = this;
		if (name === 'sleepButtonClick') {

			/**
			 * Bind all the sleep toggle buttons.
			 * When clicked, return the sleep data
			 */
			self.$allSleepButtons.forEach(function(item) {
				$on(item, 'click', function() {
					var sleepTime = datetime.parseAmPmTime(item.className.split('sleep_')[1]);
					callback(sleepTime);
				});
			});

		}
		else if (name === 'setFeedValue') {
			/**
			 * Bind all the feed value dropdowns.
			 * When changed, return the data
			 */
			self.$allFeedSelects.forEach(function(item) {
				$on(item, 'change', function() {
					var sleepTime = datetime.parseAmPmTime(item.className.split('feed_')[1]);
					callback(item.value, sleepTime);
				});
			});
		}
		else if (name === 'nextDay') {
			$on(self.$nextDayButton, 'click', function() {
				callback();
			});

			$on(window, 'keydown', function(e) {
				if (e.keyIdentifier === 'Right') callback();
			});
		}
		else if (name==='prevDay'){
			$on(self.$prevDayButton, 'click', function() {
				callback();
			});

			$on(window, 'keydown', function(e) {
				if (e.keyIdentifier === 'Left') callback();
			});
		}
		else if (name === 'setDiaperValue') {
	
			/**
			 * Bind all the diaper value dropdowns.
			 * When changed, return the data
			 */
			self.$allDiaperSelects.forEach(function(item) {
				$on(item, 'change', function() {
					var sleepTime = datetime.parseAmPmTime(item.className.split('diaper_')[1]);
					callback(item.value, sleepTime);
				});
			});

		
		}
		else {
			throw 'Unexpected bind name:'+name;
		}
	}


	window.entry = window.entry || {};
	window.entry.View = View;

})(window);
