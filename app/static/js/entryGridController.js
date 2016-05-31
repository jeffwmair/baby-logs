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

	Controller.prototype._render = function(data) {
		this.view.render(data);
	}

	Controller.prototype._bind = function() {
		var self = this;
		/* rendering must happen before binding so that we have all the elements that need to be bound */
		self.view.bind('sleepButtonClick', function(sleepTime) {

			// sleep button toggled
			var datetime = new Date(self.day);	
			datetime.setHours(sleepTime.getHours(), sleepTime.getMinutes());
			self.model.toggleSleep(datetime, function(data) {
				self._render(data);	
				self._bind();
			});

		});
	}

	/**
	 * Loads and initializes the view
	 */
	Controller.prototype.setView = function() {

		var self = this;

		self.model.read(self.day, function(data) {
			self._render(data);	
			self._bind();
		});
	}

	window.grid = window.grid || {};
	window.grid.Controller = Controller;

})(window);
