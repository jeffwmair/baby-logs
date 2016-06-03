(function(window) {
	'use strict'

	function Model() {
		// default start date is now/today
		this.date = new Date();
	}

	/**
	 * Get the selected date
	 */
	Model.prototype.getDate = function(callback) {
		callback.call(this, this.date);	
	}

	Model.prototype.moveToNextDay = function() {
		this.date = new Date(this.date.getTime() + 24*60*60*1000);
		console.log('date is:'+this.date);
	}

	Model.prototype.moveToPrevDay = function() {
		this.date = new Date(this.date.getTime() + 24*60*60*1000);
		console.log('date is:'+this.date);
	}

	window.dayPicker = window.dayPicker || {};
	window.dayPicker.Model = Model;

})(window);
