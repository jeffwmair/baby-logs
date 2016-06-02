(function(window) {
	'use strict'

	function Controller(model, view, day) {
		var self = this;
		self.model = model;
		self.view = view;
		self.day = day;
	}

	/**
	 * Update the day
	 */
	Controller.prototype.setDay = function(day) {
		this.day = day;
	}

	Controller.prototype._renderAndBind = function(data) {
		var self = this;

		self.view.render(data);

		/* rendering must happen before binding so that we have all the elements that need to be bound */
		self.view.bind('sleepButtonClick', function(sleepTime) {

			// sleep button toggled
			var datetime = new Date(self.day);	
			datetime.setHours(sleepTime.getHours(), sleepTime.getMinutes());
			self.model.toggleSleep(datetime, function(data) {
				self._renderAndBind(data);	
			});

		});

		self.view.bind('setDiaperValue', function(val, diaperTime) {

			var datetime = new Date(self.day);	
			datetime.setHours(diaperTime.getHours(), diaperTime.getMinutes());
			self.model.setDiaper(datetime, val, function(data) {
				self._renderAndBind(data);	
			});

		});

		self.view.bind('setFeedValue', function(val, feedTime) {

			var datetime = new Date(self.day);	
			datetime.setHours(feedTime.getHours(), feedTime.getMinutes());
			self.model.setFeed(datetime, val, function(data) {
				self._renderAndBind(data);	
			});

		});



	}

	/**
	 * Loads and initializes the view
	 */
	Controller.prototype.setView = function() {

		var self = this;

		self.model.read(self.day, function(data) {
			self._renderAndBind(data);	
		});
	}

	window.grid = window.grid || {};
	window.grid.Controller = Controller;

})(window);
