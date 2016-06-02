(function(window) {
	'use strict'

	function Model() {
		var self = this;
	}

	Model.prototype._handleData = function(json, callback) {

		var self = this;
		self.data = {};

		var createArrIfNotThere = function(key) {
			if (self.data[key] == undefined) self.data[key] = []; 
		}

		var putData = function(key, type, item) {
			var timeKey = DATETIME.getTime(new Date(key));
			createArrIfNotThere(timeKey);
			self.data[timeKey][type] = item;
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

		callback.call(self, self.data);	

	}

	/**
	 * Toggles the sleep state for that time
	 */
	Model.prototype.toggleSleep = function(date, callback) {

		var self = this;

		// sort out the toggle direction
		var dateData = self.data[DATETIME.getTime(date)];
		var isRemoveSleep = (dateData && dateData.sleep);
		var apiAction = isRemoveSleep ? 'removesleep' : 'sleep';

		var getFormattedDateForServerCall = function(date) {
			var use24HrFormat = true;
			return DATETIME.getYyyymmddFormat(date) + ' ' + DATETIME.getFormattedTime(date.getHours(), date.getMinutes(), use24HrFormat);
		}

		var formatteddate = getFormattedDateForServerCall(date);
		var myendate = new Date(date.getTime() + (15*60000));
		var formattedEndDate = getFormattedDateForServerCall(myendate);

		UTILS.ajax("BabyApi?action="+apiAction+"&sleepstart="+formatteddate+"&sleepend="+formattedEndDate, function(json) {
			self._handleData(json, callback);
		});
	}

	/**
	 * Reads the model from storage
	 */
	Model.prototype.read = function(date, callback) {
		var self = this;
		UTILS.ajax("BabyApi?action=loadentrydata&day="+DATETIME.getYyyymmddFormat(date), function(json) {
			self._handleData(json, callback);	
		});

	}

	window.grid = window.grid || {};
	window.grid.Model = Model;

})(window);
