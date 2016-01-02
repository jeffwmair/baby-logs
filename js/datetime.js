DATETIME = {};

DATETIME.datesToSimpleDisplay = function(dates) {
	var simpleDays = [];
	dates.forEach(function(d) {
		simpleDays.push(DATETIME.getShortDayFormatForDate(d));
	});
	return simpleDays;
}

DATETIME.getFormattedTime = function(hr, min) {
	var hr = UTILS.get2DigitFormat(hr); 
	var min = UTILS.get2DigitFormat(min);
	return hr + ':' + min;
}

DATETIME.getTimeFromRange = function(houlyDivisions, position) {
	var hr = Math.floor(position / houlyDivisions);
	var min = (position % houlyDivisions) * (60/houlyDivisions);
	var timeField = DATETIME.getFormattedTime(hr, min);
	return timeField;
}

DATETIME.CalendarHelper = function() {
	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
	//var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ];
	var days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat' ];
	this.getMonthName = function(month) {
		return months[month];
	};

	this.getDayName = function(day) {
		return days[day];
	};

	this.getDayNameShort = function(day) {
		return this.getDayName(day).substring(0,3);
	}

};

DATETIME.getShortDayFormatForDate = function(date) {
	var calHelper = new DATETIME.CalendarHelper();
	var dayNameShort = calHelper.getDayNameShort(date.getDay());
	return dayNameShort + ' ' + calHelper.getMonthName(date.getMonth()) + ' ' + date.getDate();
}

DATETIME.getDateFormatForDay = function(date) {
	var calHelper = new DATETIME.CalendarHelper();
	var mon = calHelper.getMonthName(date.getMonth());
	var day = calHelper.getDayName(date.getDay());
	return day + ' ' + mon + ' ' + date.getDate() + ', ' + date.getFullYear();
}

DATETIME.getYyyymmddFormat = function(date) {
	var month = UTILS.get2DigitFormat(date.getMonth()+1);
	var day = UTILS.get2DigitFormat(date.getDate());
	return date.getFullYear() + '-' + month + '-' + day;
}

DATETIME.getTime = function(date) {
	return DATETIME.getFormattedTime(date.getHours(), date.getMinutes());
}

DATETIME.getTimeBlockFromDate = function(date) {
	var blockSize = 60 / UTILS.HOURLY_DIVISIONS;
	var blocks = date.getHours() * UTILS.HOURLY_DIVISIONS;
	blocks += Math.round(date.getMinutes() / blockSize);
	return blocks;
}

DATETIME.getNextQuarterHourTime = function(date) {
	var newDate = new Date(date.getTime());
	newDate.setSeconds(0);	
	newDate.setMilliseconds(0);	
	var qtrHourDiff = newDate.getMinutes() % 15;
	newDate.setMinutes(newDate.getMinutes() + (15 - qtrHourDiff));
	return newDate;
}

DATETIME.parse24HrTime = function(time) {
	var split = time.split(':');
	var dummyDate = new Date(2000, 01, 01, split[0], split[1], 0);
	return dummyDate;
}
