(function() {

	'use strict'

	function DayPicker() {
		this.model = new dayPicker.Model();	
		this.view = new dayPicker.View();
		this.controller = new dayPicker.Controller(this.model, this.view);
	}

	var myDayPicker = new DayPicker();

	function setView() {
		myDayPicker.controller.setView();
	}

	$on(window, 'load', setView);

})();
