var APP = APP || {};
APP.ReportPage = function(container, calHelper) {

	var LeftColumnWidth = 14;
	var processServerData = function(json) {
	}

	var generate24HrCharArray = function() {
		var string = '';
		while (string.length < (24*UTILS.HOURLY_DIVISIONS)) {
			string += " ";
		}
		var str_arr = string.split('');
		return str_arr;
	}

	var calcHoursBetweenTimes = function(date1, date2) {
		var msDiff = date2.getTime() - date1.getTime();	
		return msDiff / (60000.0 * 60);
	}

	this.generate = function(datasets, container, calHelper) {
		var now = new Date();
		for(var i = 0, len = datasets.length; i < len; i++) {
			var el = document.createElement('pre');
			container.appendChild(el);
			var ds = datasets[i];
			var header = this.generateHeader(ds.date, calHelper);
			var sleepRow = this.generateSleepRow(now, ds.getSleeps());
			var diaperRow = this.generateValueItemRow(now, "Diaper", ds.getDiapers());
			var feedRow = this.generateValueItemRow(now, "Feed", ds.getFeeds());
			el.innerText = header 
			+ '\n' + sleepRow
			+ '\n' + feedRow
			+ '\n' + diaperRow;
		}
	}

	this.init = function(container, calHelper) {
		var that = this;
		UTILS.ajaxGetJson("services/BabyApi.php?action=loaddata", function(json) {
			var datasets = DATA.getNewDatasetsForJsonData(json);
			that.generate(datasets.reverse(), container, calHelper);
		});
	}

	// generate the header
	this.generateHeader = function(date, calHelper) {
		var month = calHelper.getMonthName(date.getMonth());
		var dateString = month + ' ' + date.getDate() + ', ' + (date.getYear()+1900);
		while(dateString.length < LeftColumnWidth) {
			dateString += " ";
		}
		var header = dateString + "|00  01  02  03  04  05  06  07  08  09  10  11  12  13  14  15  16  17  18  19  20  21  22  23  |"
		return header;
	}

	// generate the sleep row
	this.generateSleepRow = function(now, sleeps) {
		var timeblockNow = DATETIME.getTimeBlockFromDate(now);
		var str_arr = generate24HrCharArray();	
		var sumSleepBlocks = 0;
		for (var i = 0; i < sleeps.length; i++) {
			var sleep = sleeps[i];

			var startSleepBlock = sleep.getStartingBlock();
			var totalSleepBlocks = sleep.getDurationBlocks();
			sumSleepBlocks += totalSleepBlocks;
			if (totalSleepBlocks == 0) {
				// zero duration means an unended sleep; just put a 
				// special character in one box
				str_arr[startSleepBlock] = '!';
				continue;
			}
			for(var j = startSleepBlock; j < startSleepBlock+totalSleepBlocks; j++) {
				str_arr[j] = "#";
			}
		}

		// for showing right-side summary, if previous day
		var sumColumn = "";

		// if this dataset is for today, show current time position
		var mostRecentSleep = sleeps[sleeps.length-1];
		if (mostRecentSleep && mostRecentSleep.getStart().getDate() == now.getDate()) {
			str_arr[timeblockNow] = '>';
			var msg = " hrs ago";
			var hrs = 0;
			if (mostRecentSleep.getDurationBlocks() == 0) {
				hrs = calcHoursBetweenTimes(mostRecentSleep.getStart(), now).toFixed(1);
			}
			else { 
				hrs = calcHoursBetweenTimes(mostRecentSleep.getEnd(), now).toFixed(1);
			}
			msg = hrs + msg;
			var msg_arr = msg.split('');
			// TODO: generalize this insertion of array
			for(var i = 0, len = msg_arr.length; i < len; i++) {
				str_arr[timeblockNow+i+1] = msg_arr[i];
			}
		}
		else {
			// entry is for previous day, so show a total on the end
			sumColumn = "Total:" + (sumSleepBlocks/4).toFixed(1) + "hrs";
		}

		var sleep_string = str_arr.join('');
		var colHeader = this.generateColumnHeaderRightAlign("Sleep");
		sleep_string = colHeader + sleep_string + "  " + sumColumn;
		return sleep_string;
	}

	// generate the diaper or feed (or other simple) row
	// This doesn't work very well as a one-size-fits all function
	this.generateValueItemRow = function(now, colName, items) {
		var timeblockNow = DATETIME.getTimeBlockFromDate(now);
		var str_arr = generate24HrCharArray();	
		var countPee = 0, countPoo = 0, countBreast = 0, sumBottleMl = 0;
		var isDiaper = false;
		for(var i = 0; i < items.length; i++) {
			var item = items[i];
			isDiaper = item.getType() == "diaper";
			// "value items" take up multiple character locations, so we need to split the value up
			var itemValueArr = item.getValue().split('');
			var extraShift = 0;
			for(var j = 0, len = itemValueArr.length; j < len; j++) {
				var extraShiftIndex = item.getTimeBlock()+j+extraShift;
				while (str_arr[extraShiftIndex] != ' ' && extraShiftIndex < str_arr.length) extraShiftIndex++;
				str_arr[extraShiftIndex] = itemValueArr[j];
			}
			if (item.getType() == "diaper") {
				switch(item.getValue()) {
					case "1":
						countPee++;
						break;
					case "2":
						countPoo++;
						break;
					case "3":
						countPee++;	
						countPoo++;
						break;
				}
			}
			else {
				if (isNaN(item.getValue())) {
					countBreast++;
				}
				else {
					var ml = parseInt(item.getValue());
					sumBottleMl += ml;
				}
			}
		}

		// current time
		var summaryColumn = "";
		var mostRecentItem = items[items.length-1];
		if (mostRecentItem && mostRecentItem.getTime().getDate() == now.getDate()) {
			str_arr[timeblockNow] = '>';
			var hrs = calcHoursBetweenTimes(mostRecentItem.getTime(), now).toFixed(1);
			var msg = hrs + " hrs ago";
			var msg_arr = msg.split('');
			for(var i = 0, len = msg_arr.length; i < len; i++) {
				str_arr[timeblockNow+i+1] = msg_arr[i];
			}
		}
		else {
			if (isDiaper) {
				summaryColumn = "Pees:" + countPee + ", Poos:" + countPoo;
			}
			else {
				summaryColumn = "ML:" + sumBottleMl + ", Breasts:" + countBreast;
			}
		}

		var colHeader = this.generateColumnHeaderRightAlign(colName);
		var string_row = colHeader + str_arr.join('') + '  ' + summaryColumn;
		return string_row;
	}
	this.generateColumnHeaderRightAlign = function(text) {
		var colHeader = text;
		while(colHeader.length < LeftColumnWidth) colHeader = " " + colHeader;
		return colHeader + "|";
	}
};

