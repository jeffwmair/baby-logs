UTILS = {};
UTILS.HOURLY_DIVISIONS = 4;
UTILS.get2DigitFormat = function(val) {
	return (val < 10) ? '0' + val : val;
}

UTILS.ajaxGetJson = function(url, errorHandler, callback, doAsync) {
	// load data from server via ajax
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {

		if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
			if(xmlhttp.status == 200){
				var json = null;
				try {
					json = JSON.parse(xmlhttp.responseText);
				} 
				catch (e) {
					if (errorHandler) {
						errorHandler(e + '<br>' + xmlhttp.responseText);
					}
				}
				callback(json);
			}
			else {
				if (errorHandler) {
					errorHandler(xmlhttp.response);
				}
			}
		}
	}

	xmlhttp.open("GET", url, doAsync);
	xmlhttp.send();
}

Date.prototype.getDayTime = function() {
	var dayDate = new Date(this.getTime());
	dayDate.setHours(0);
	dayDate.setMinutes(0);
	dayDate.setSeconds(0);
	dayDate.setMilliseconds(0);
	return dayDate.getTime();
}

Array.prototype.contains = function(obj) {
	var i = this.length;
	while (i--) {
		if (this[i] === obj) {
			return true;
		}
	}
	return false;
}

String.prototype.endsWith = function(suffix) {
	return this.indexOf(suffix, this.length - suffix.length) !== -1;
};
