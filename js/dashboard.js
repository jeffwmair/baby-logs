var APP = APP || {};

APP.Dashboard = function() {

	var API = "src/web/BabyApi.php";
	var SUFFIX_AGO = ' ago';

	this.data = null;

	this.init = function() {

		var that = this;
		var doAsync = false;
		UTILS.ajaxGetJson(API + "?action=loadDashboard", function(json) {
			that.data = json;
		}, doAsync);

	}

	this.setNextExpectedFeedData = function(field) {
		field.innerHTML = formatMinutesUntil(this.data.feed.next.minutesUntil);
	}

	this.setNextExpectedSleepData = function(field) {
		field.innerHTML = formatMinutesUntil(this.data.sleep.next.minutesUntil);
	}

	this.setNextExpectedPeeData = function(field) {
		field.innerHTML = formatMinutesUntil(this.data.pee.next.minutesUntil);
	}

	this.setNextExpectedPooData = function(field) {
		field.innerHTML = formatMinutesUntil(this.data.poo.next.minutesUntil);
	}

	this.setMostRecentFeedData = function(field) {
		field.innerHTML = formatMinutesAgo(this.data.feed.prev.minutesAgo);
	}

	this.setMostRecentSleepData = function(field) {
		field.innerHTML = formatMinutesAgo(this.data.sleep.prev.minutesAgo);
	}

	this.setMostRecentPeeData = function(field) {
		field.innerHTML = formatMinutesAgo(this.data.pee.prev.minutesAgo);
	}

	this.setMostRecentPooData = function(field) {
		field.innerHTML = formatMinutesAgo(this.data.poo.prev.minutesAgo);
	}

	var formatMinutesUntil = function(mins) {
		if (mins == 9999) {
			return '???';
		}

		if (mins <= 0) {
			return 'due';
		}

		if (mins < 60) {
			return mins + ' minutes';
		}

		return (mins / 60.0).toFixed(1) + ' hours';
	}

	var formatMinutesAgo = function(mins) {
		if (mins <= 0) {
			return 'now';
		}

		if (mins < 60) {
			return mins + ' minutes ago';
		}

		return (mins / 60.0).toFixed(1) + ' hours ago';
	}


}
