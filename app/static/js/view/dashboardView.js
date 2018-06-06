(function (window) {
	'use strict'
	var ONE_DAY_MINUTES = 1440;

	function View() {
		// view elements
		this.$txtMostRecentFeed = qs('#txtMostRecentFeed');
		this.$txtMostRecentSleep = qs('#txtMostRecentSleep');
		this.$txtMostRecentPee = qs('#txtMostRecentPee');
		this.$txtMostRecentPoo = qs('#txtMostRecentPoo');
		this.$txtBigNaps = qs('#bigNumSleeps');
		this.$txtBigFeeds = qs('#bigNumFeedings');
		this.$txtBigPoos = qs('#bigNumPoos');
	}

	View.prototype.setDataIsSummarizedStatus = function(data) {
		console.log('Data successfully summarized');
	}

	/**
	 * Render the view with the provided data.
	 */
	View.prototype.render = function (error, data) {
		this.$txtBigPoos.innerHTML = data.poo.todayCount;
		this.$txtBigNaps.innerHTML = data.sleep.naps.count + ' naps<br>' + data.sleep.naps.duration + ' hrs';
		this.$txtBigFeeds.innerHTML = data.feed.milkMlToday + ' milk<br>' + data.feed.breastCountToday + ' breast<br>' + data.feed.formulaMlToday + ' formula<br>' + data.feed.solidMlToday + ' solid';

		function assignIfNotTooOld(textbox, data) {
			if (data.prev.minutesAgo < ONE_DAY_MINUTES) {
				textbox.innerHTML = this._getIcon(data.prev.status) + data.prev.time + ' (' + this._formatMinutesAgo(data.prev.minutesAgo) + ')';
			}
		}

		assignIfNotTooOld.call(this, this.$txtMostRecentFeed, data.feed);
		assignIfNotTooOld.call(this, this.$txtMostRecentSleep, data.sleep);
		assignIfNotTooOld.call(this, this.$txtMostRecentPee, data.pee);
		assignIfNotTooOld.call(this, this.$txtMostRecentPoo, data.poo);
	}

	/**
	 * Get the appropriate icon for this status.
	 */
	View.prototype._getIcon = function (status) {
		var fileMap = { 1: 'Circle_Green', 2: 'Circle_Yellow', 3: 'Circle_Red' };
		return '<img src="static/images/' + fileMap[status] + '.png" style="width:18px;margin-right:10px" />';
	}

	/**
	 * Format the time
	 */
	View.prototype._formatMinutesAgo = function (mins) {
		return mins < 60 ? '< 1 hr ago' : (mins / 60.0).toFixed(1) + ' hrs ago';
	}

	window.dashboard = window.dashboard || {};
	window.dashboard.View = View;

})(window);
