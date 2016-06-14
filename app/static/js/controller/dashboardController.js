(function(window) {
	'use strict'

	function Controller(model, view, day) {
		var self = this;
		self.model = model;
		self.view = view;
	}

	/**
	 * Loads and initializes the view
	 */
	Controller.prototype.setView = function() {

		var self = this;

		self.model.read(function(data) {
			self.view.render(data);
		});

	}

	window.dashboard = window.dashboard || {};
	window.dashboard.Controller = Controller;

})(window);
