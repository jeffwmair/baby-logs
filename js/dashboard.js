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

	this.setBigNumFeeds = function(field) {
		field.innerHTML = this.data.milk.bottleMlToday;
	}

	this.setBigNumPoos = function(field) {
		field.innerHTML = this.data.poo.todayCount;
	}

	this.setMostRecentFeedData = function(field) {
		field.innerHTML = getIcon(this.data.milk.prev.status) + this.data.milk.prev.time + ' (' + formatMinutesAgo(this.data.milk.prev.minutesAgo) + ')';
	}

	this.setMostRecentSleepData = function(field) {
		field.innerHTML = getIcon(this.data.sleep.prev.status) + this.data.sleep.prev.time + ' (' + formatMinutesAgo(this.data.sleep.prev.minutesAgo) + ')';
	}

	this.setMostRecentPeeData = function(field) {
		field.innerHTML = getIcon(this.data.pee.prev.status) + this.data.pee.prev.time + ' (' + formatMinutesAgo(this.data.pee.prev.minutesAgo) + ')';
	}

	this.setMostRecentPooData = function(field) {
		field.innerHTML = getIcon(this.data.poo.prev.status) + this.data.poo.prev.time + ' (' + formatMinutesAgo(this.data.poo.prev.minutesAgo) + ')';
	}

	var getIcon = function(status) {
		var img = '';
		var file = '';
		switch(status) {
			case "1":
				file = 'Circle_Green';
				break;
			case "2":
				file = 'Circle_Yellow';
				break;
			case "3":
				file = 'Circle_Red';
				break;
		}

		img = '<img src="./images/'+file+'.png" style="width:18px;margin-right:10px" />';
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