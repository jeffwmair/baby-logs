(function(window) {
	'use strict'

	function Controller(model, view, day) {
		var self = this;
		self.model = model;
		self.view = view;
	}

	/**
	 * Update the day
	 */
	Controller.prototype.setDay = function(day) {
		this.day = day;
	}

	Controller.prototype._renderAndBindGrid = function(gridData, date) {
		var self = this;

		self.view.render(gridData, self.model.getDate());

		// might be best to move this elsewhere, but it works here.
		$('#tblEntries').stickyTableHeaders({ fixedOffset : 50 });

		/* rendering must happen before binding so that we have all the elements that need to be bound */
		self.view.bind('sleepButtonClick', function(sleepTime) {

			// sleep button toggled
			self.model.toggleSleep(sleepTime, function(data) {
				self.view.update(data);
			});

		});

		self.view.bind('setDiaperValue', function(val, diaperTime) {

			self.model.setDiaper(diaperTime, val, function(data) {
				self.view.update(data);
			});

		});

		self.view.bind('setFeedValue', function(val, feedTime) {

			self.model.setFeed(feedTime, val, function(data) {
				self.view.update(data);
			});

		});
	}

	/**
	 * Loads and initializes the view
	 */
	Controller.prototype.setView = function() {

		var self = this;

		self.model.read(function(gridData, date) {

			self._renderAndBindGrid(gridData, date);

			// bind the controls that never go away

			self.view.bind('nextDay', function() {
				self.model.moveToNextDay(function(gridData, date) {
					self.view.update(gridData);
				});
			});

			self.view.bind('prevDay', function() {
				self.model.moveToPrevDay(function(gridData, date) {
					self.view.update(gridData);
				});
			});


		});

	}

	window.grid = window.grid || {};
	window.grid.Controller = Controller;

})(window);
