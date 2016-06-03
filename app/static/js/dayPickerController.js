(function(window) {
	'use strict'

	function Controller(model, view) {
		var self = this;
		self.model = model;
		self.view = view;

		self.view.bind('nextDay', function() {
			self.model.moveToNextDay();
		});

		self.view.bind('prevDay', function() {
			self.model.moveToPrevDay();
		});
	}

	Controller.prototype.setView = function() {
		var self = this;
		self.model.getDate(function(date) {
			console.log(date);
		});

	}

	window.dayPicker = window.dayPicker || {};
	window.dayPicker.Controller = Controller;
})(window);
