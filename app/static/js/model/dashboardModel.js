(function(window) {
	'use strict'

	function Model() {
		var self = this;
	}

	/**
	 * Reads the model from storage
	 */
	Model.prototype.read = function(callback) {
		var self = this;
		UTILS.ajax("BabyApi?action=loadDashboard", function(json) {
			callback(json);
		});
	}

	window.dashboard = window.dashboard || {};
	window.dashboard.Model = Model;

})(window);
