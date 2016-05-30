(function(window) {
	'use strict'

	function View(template) {
		var self = this;
		self.template = template;

		// view elements
		self.$entryGrid = qs('#entry-grid');
	}

	/**
	 * Render the grid
	 */
	View.prototype.render = function(data) {
		var self = this;
		self.$entryGrid.innerHTML = self.template.generateHtml(data);

		// get dynamic controls after binding
		self.$allSleepButtons = qsa('button');
	}

	/**
	 * Bind a dom event to a callback
	 */
	View.prototype.bind = function(name, callback) {
		var self = this;
		if (name === 'sleepButtonClick') {

			/**
			 * Bind all the sleep toggle buttons.
			 * When clicked, return the sleep data
			 */
			self.$allSleepButtons.forEach(function(item) {
				$on(item, 'click', function() {
					callback(item.className.split('sleep_')[1]);
				});
			});

		}
		else {
			throw 'foobar!';
		}
	}


	window.grid = window.grid || {};
	window.grid.View = View;

})(window);
