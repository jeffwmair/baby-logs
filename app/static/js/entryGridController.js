(function(window) {
	'use strict'

	function Controller(model, view, day) {
		var self = this;
		self.model = model;
		self.view = view;
		self.day = day;
	}

	Controller.prototype.setDay = function(day) {
		this.day = day;
	}

	/**
	 * Loads and initializes the view
	 */
	Controller.prototype.setView = function() {
		var self = this;
		self.model.read(function(data) {
			self.view.render(data);

			/* rendering must happen before binding so that we have all the elements that need to be bound */
			self.view.bind('sleepButtonClick', function(sleepTime) {

				// sleep button toggled
				self.model.toggleSleep(self.day, sleepTime, function(data) {
					//console.log(data);
				});

			});

		});
	}

	window.grid = window.grid || {};
	window.grid.Controller = Controller;

})(window);
