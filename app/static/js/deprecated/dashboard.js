var APP = APP || {};

APP.Dashboard = function() {

	var API = "BabyApi";
	var SUFFIX_AGO = ' ago';
	var ONE_DAY_MINUTES = 1440;

	var errorHandler = function(errorMessage) {
		console.error(errorMessage);
	}

	this.data = null;

	this.init = function() {

		var that = this;
		var doAsync = false;
		UTILS.ajaxGetJson(API + "?action=loadDashboard", errorHandler, function(json) {
			that.data = json;
		}, doAsync);

	}

	this.setBigNumNaps = function(field) {
		field.innerHTML	= this.data.sleep.naps.count + ' naps<br>' + this.data.sleep.naps.duration + ' hrs';
	}

	this.setBigNumFeeds = function(field) {
		field.innerHTML = this.data.feed.milkMlToday + ' milk<br>' + this.data.feed.breastCountToday + ' breast<br>' + this.data.feed.formulaMlToday + ' formula<br>' + this.data.feed.solidMlToday +' solid';
	}

	this.setBigNumPoos = function(field) {
		field.innerHTML = this.data.poo.todayCount;
	}

	this.setMostRecentFeedData = function(field) {
		if (this.data.feed.prev.minutesAgo > ONE_DAY_MINUTES) 
			return;
		field.innerHTML = getIcon(this.data.feed.prev.status) + this.data.feed.prev.time + ' (' + formatMinutesAgo(this.data.feed.prev.minutesAgo) + ')';
	}

	/**
	 * Activities entry is too old for display
	 */
	var mostRecentActivitiesTooOld = function(minutesAgo) {
		return minutesAgo > ONE_DAY_MINUTES;
	}

	this.setMostRecentSleepData = function(field) {
		if (mostRecentActivitiesTooOld(this.data.sleep.prev.minutesAgo)) 
			return;

		field.innerHTML = getIcon(this.data.sleep.prev.status) + this.data.sleep.prev.time + ' (' + formatMinutesAgo(this.data.sleep.prev.minutesAgo) + ')';
	}

	this.setMostRecentPeeData = function(field) {
		if (mostRecentActivitiesTooOld(this.data.pee.prev.minutesAgo)) 
			return;

		field.innerHTML = getIcon(this.data.pee.prev.status) + this.data.pee.prev.time + ' (' + formatMinutesAgo(this.data.pee.prev.minutesAgo) + ')';
	}

	this.setMostRecentPooData = function(field) {
		if (mostRecentActivitiesTooOld(this.data.poo.prev.minutesAgo)) 
			return;

		field.innerHTML = getIcon(this.data.poo.prev.status) + this.data.poo.prev.time + ' (' + formatMinutesAgo(this.data.poo.prev.minutesAgo) + ')';
	}

	var getIcon = function(status) {
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

	var formatMinutesAgo = function(mins) {

		if (mins < 60) {
			//return parseFloat(mins).toFixed(0) + ' minutes ago';
			return '< 1 hr ago';
		}

		return (mins / 60.0).toFixed(1) + ' hrs ago';
	}


}