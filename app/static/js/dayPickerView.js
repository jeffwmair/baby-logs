(function(window) {
	'use strict'

	function View() {
		self.$prevDayButton = qs('#btnBack');
		self.$nextDayButton = qs('#btnForward');
		console.log(self.$prevDayButton);
		console.log(self.$nextDayButton);
	}

	View.prototype.bind = function(name, callback) {
		var self = this;
		if (name==='nextDay') {
			$on($nextDayButton, 'click', function() {
				callback();
			});
		}
		else if (name==='prevDay'){
			$on($prevDayButton, 'click', function() {
				callback();
			});
		}
		else {
			throw 'Unexpected bind name:'+name;
		}
	}

	window.dayPicker = window.dayPicker || {};
	window.dayPicker.View = View;
})(window);
