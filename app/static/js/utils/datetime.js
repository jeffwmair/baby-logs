
var datetime = (function () {

    function parseAmPmTime(time) {
        var split = time.split(':');
        var hr = parseInt(split[0]);
        if (split[0] == '12' && split[1].endsWith('am')) {
            hr = 0;
        }
        else if (split[0] != '12' && split[1].endsWith('pm')) {
            hr += 12;
        }

        var minutes = parseInt(split[1].substring(0, 2));
        var dummyDate = new Date(2000, 01, 01, hr, minutes);
        return dummyDate;
    }


    function datesToSimpleDisplay(dates) {
        return dates.map(function(item) {
            return getShortDayFormatForDate(item);
        })
    }

    function getFormattedTime(hr, min, use24hr) {
        var timestring = UTILS.get2DigitFormat(hr) + ':' + UTILS.get2DigitFormat(min);
        return use24hr ? timestring : getTimeInAmPm(timestring);
    }

    function getTimeInAmPm(timestring) {
        var components = timestring.split(':');
        var hr = components[0];
        var hrAp = hr;
        var ap = 'am';
        if (hr > 12) {
            hrAp = hr % 12;
            ap = 'pm';
        }
        else if (hr == 0) {
            hrAp = 12;
        }
        else if (hr == 12) {
            hrAp = 12;
            ap = 'pm';
        }
        return hrAp + ':' + components[1] + ap;
    }

    function getTimeFromRange(houlyDivisions, position) {
        var hr = Math.floor(position / houlyDivisions);
        var min = (position % houlyDivisions) * (60 / houlyDivisions);
        var timeField = getFormattedTime(hr, min);
        return timeField;
    }

    var calendar = {
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
        days: ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat']
    };

    function getShortDayFormatForDate(date) {
        var dayNameShort = calendar.days[date.getDay()].substring(0, 3);
        return dayNameShort + ' ' + calendar.months[date.getMonth()] + ' ' + date.getDate();
    }

    function getDateFormatForDay(date) {
        return calendar.days[date.getDay()] 
            + ' ' + calendar.months[date.getMonth()] 
            + ' ' + date.getDate() + ', ' + date.getFullYear();
    }

    /**
     * 2016-06-30
     */
    function getYyyymmddFormat(date) {
        return date.getFullYear() + '-' 
            + UTILS.get2DigitFormat(date.getMonth() + 1) 
            + '-' + UTILS.get2DigitFormat(date.getDate());
    }

    function getTime(date) {
        return getFormattedTime(date.getHours(), date.getMinutes());
    }

    function getTimeBlockFromDate(date) {
        var blockSize = 60 / UTILS.HOURLY_DIVISIONS;
        var blocks = date.getHours() * UTILS.HOURLY_DIVISIONS;
        blocks += Math.round(date.getMinutes() / blockSize);
        return blocks;
    }

    function getNextQuarterHourTime(date) {
        var newDate = new Date(date.getTime());
        newDate.setSeconds(0);
        newDate.setMilliseconds(0);
        var qtrHourDiff = newDate.getMinutes() % 15;
        newDate.setMinutes(newDate.getMinutes() + (15 - qtrHourDiff));
        return newDate;
    }

    function parse24HrTime(time) {
        var split = time.split(':');
        var dummyDate = new Date(2000, 01, 01, split[0], split[1], 0);
        return dummyDate;
    }

    return {
        parseAmPmTime: parseAmPmTime,
        parse24HrTime: parse24HrTime,
        datesToSimpleDisplay: datesToSimpleDisplay,
        getFormattedTime: getFormattedTime,
        getTimeInAmPm: getTimeInAmPm,
        getTimeFromRange: getTimeFromRange,
        getShortDayFormatForDate: getShortDayFormatForDate,
        getDateFormatForDay: getDateFormatForDay,
        getYyyymmddFormat: getYyyymmddFormat,
        getTime: getTime,
        getTimeBlockFromDate: getTimeBlockFromDate,
        getNextQuarterHourTime: getNextQuarterHourTime,
    }

})();
