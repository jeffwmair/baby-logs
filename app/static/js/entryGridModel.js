(function(window) {
	'use strict'

	function Model() {
		var self = this;
	}

	/**
	 * Toggles the sleep state for that time
	 */
	Model.prototype.toggleSleep = function(day, time, callback) {
		console.log(day);
		console.log(time);
		var data = {say:'hi'};

		var timeSplit = time.substring(0, time.length-2).split(':');
		// need something like this:
		//var use24HrFormat = true;
		//return DATETIME.getYyyymmddFormat(date) + ' ' + DATETIME.getFormattedTime(date.getHours(), date.getMinutes(), use24HrFormat);

		UTILS.ajaxGetJson("BabyApi?action=sleep&sleepstart="+formatteddate+"&sleepend="+formattedEndDate, errorHandler, function(json) {
		});
		callback(data);
	}

	/**
	 * Reads the model from storage
	 */
	Model.prototype.read = function(callback) {
		UTILS.ajax("BabyApi?action=loadentrydata&day=2016-05-28", function(json) {
	
			var data = {};

			var createArrIfNotThere = function(key) {
				if (data[key] == undefined) data[key] = []; 
			}

			var putData = function(key, type, item) {
				var timeKey = DATETIME.getTime(new Date(key));
				createArrIfNotThere(timeKey);
				data[timeKey][type] = item;
			}

			json.diapers.forEach(function(item)  {
				putData(item.time, 'diaper', item);
			});
			json.sleeps.forEach(function(item)  {
				putData(item.start, 'sleep', item);
			});
			json.fmlafeeds.forEach(function(item)  {
				putData(item.time, 'feed', item);
			});
			json.milkfeeds.forEach(function(item)  {
				putData(item.time, 'feed', item);
			});
			json.solidfoodfeeds.forEach(function(item)  {
				putData(item.time, 'feed', item);
			});

			callback.call(this, data);	
		});

	}

	window.grid = window.grid || {};
	window.grid.Model = Model;

})(window);
