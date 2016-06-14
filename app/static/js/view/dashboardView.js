(function(window) {
	'use strict'

	var SUFFIX_AGO = ' ago';
	var ONE_DAY_MINUTES = 1440;

	function View() {

		var self = this;

		// view elements
		self.$txtMostRecentFeed = qs('#txtMostRecentFeed');
		self.$txtMostRecentSleep = qs('#txtMostRecentSleep');
		self.$txtMostRecentPee = qs('#txtMostRecentPee');
		self.$txtMostRecentPoo = qs('#txtMostRecentPoo');
		self.$txtBigNaps = qs('#bigNumSleeps');
		self.$txtBigFeeds = qs('#bigNumFeedings');
		self.$txtBigPoos = qs('#bigNumPoos');
	}

	/**
	 * Render the view with the provided data.
	 */
	View.prototype.render = function(data) {
		var self = this;

		self.$txtBigPoos.innerHTML = data.poo.todayCount;
		self.$txtBigNaps.innerHTML = data.sleep.naps.count + ' naps<br>' + data.sleep.naps.duration + ' hrs';
		self.$txtBigFeeds.innerHTML = data.feed.milkMlToday + ' milk<br>' + data.feed.breastCountToday + ' breast<br>' + data.feed.formulaMlToday + ' formula<br>' + data.feed.solidMlToday +' solid';


		if (data.feed.prev.minutesAgo <= ONE_DAY_MINUTES)  {
			self.$txtMostRecentFeed.innerHTML = self._getIcon(data.feed.prev.status) + data.feed.prev.time + ' (' + self._formatMinutesAgo(data.feed.prev.minutesAgo) + ')';
		}

		if (!self._mostRecentActivitiesTooOld(data.sleep.prev.minutesAgo))  {
			self.$txtMostRecentSleep.innerHTML = self._getIcon(data.sleep.prev.status) + data.sleep.prev.time + ' (' + self._formatMinutesAgo(data.sleep.prev.minutesAgo) + ')';
		}

		if (!self._mostRecentActivitiesTooOld(data.pee.prev.minutesAgo))  {
			self.$txtMostRecentPee.innerHTML = self._getIcon(data.pee.prev.status) + data.pee.prev.time + ' (' + self._formatMinutesAgo(data.pee.prev.minutesAgo) + ')';
		}

		if (!self._mostRecentActivitiesTooOld(data.poo.prev.minutesAgo)) {
			self.$txtMostRecentPoo.innerHTML = self._getIcon(data.poo.prev.status) + data.poo.prev.time + ' (' + self._formatMinutesAgo(data.poo.prev.minutesAgo) + ')';
		}

	}

	/**
	 * This is time passed too long to show?
	 */
	View.prototype._mostRecentActivitiesTooOld = function(minutesAgo) {
		return minutesAgo > ONE_DAY_MINUTES;
	}

	/**
	 * Get the appropriate icon for this status.
	 */
	View.prototype._getIcon = function(status) {
		var img = '';
		var file = '';
		switch(status) {
			case 1:
				file = 'Circle_Green';
				break;
			case 2:
				file = 'Circle_Yellow';
				break;
			case 3:
				file = 'Circle_Red';
				break;
			default:
				throw "Status value: "+status;
		}

		img = '<img src="static/images/'+file+'.png" style="width:18px;margin-right:10px" />';
		return img;
	}

	/**
	 * Format the time
	 */
	View.prototype._formatMinutesAgo = function(mins) {

		if (mins < 60) {
			//return parseFloat(mins).toFixed(0) + ' minutes ago';
			return '< 1 hr ago';
		}

		return (mins / 60.0).toFixed(1) + ' hrs ago';
	}

	window.dashboard = window.dashboard || {};
	window.dashboard.View = View;

})(window);
