(function() {

	'use strict'

	function Page() {
		this.model = new dashboard.Model();	
		//this.template = new dashboard.Template();	
		this.view = new dashboard.View(this.template);
		this.controller = new dashboard.Controller(this.model, this.view, new Date());
	}

	var page = new Page();

	function setView() {
		page.controller.setView();
	}

	$on(window, 'load', setView);

})();
