(function() {

	'use strict'

	function EntryGrid() {
		this.model = new grid.Model();	
		this.template = new grid.Template();	
		this.view = new grid.View(this.template);
		this.controller = new grid.Controller(this.model, this.view, new Date());
	}

	var mygrid = new EntryGrid();

	function setView() {
		mygrid.controller.setView();
	}

	$on(window, 'load', setView);

})();
