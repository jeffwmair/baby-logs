(function(window) {
	'use strict'

	function Model() {
	}

	/**
	 * Reads the model from storage
	 */
	Model.prototype.read = function(callback) {
		UTILS.ajax("BabyApi?action=loadDashboard", callback);
	}

	window.dashboard = window.dashboard || {};
	window.dashboard.Model = Model;

})(window);
