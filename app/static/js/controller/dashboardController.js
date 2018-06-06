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
		self.model.read(function(error, data) {
			self.view.render(error, data);
		});
	}

	Controller.prototype.summarizeData = function() {
		var self = this;
		this.model.summarizeData(function(data) {
			self.view.setDataIsSummarizedStatus(data);
		});
	}

	window.dashboard = window.dashboard || {};
	window.dashboard.Controller = Controller;

})(window);
