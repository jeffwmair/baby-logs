var APP = {};
APP.SleepBlockSizeInMinutes = 15;
APP.LeftColumnWidth = 14;

APP.getTimeBlockFromDate = function(date) {
	var blocks = date.getHours() * (60 / APP.SleepBlockSizeInMinutes);
	blocks += Math.round(date.getMinutes() / APP.SleepBlockSizeInMinutes);
	return blocks;
}

APP.generate24HrCharArray = function() {
	var string = '';
	var blockSize = 60 / APP.SleepBlockSizeInMinutes;
	while (string.length < (24*blockSize)) {
		string += " ";
	}
	var str_arr = string.split('');
	return str_arr;
}

APP.Dataset = function(pDate, pSleeps, pFeeds, pDiapers) {

	this.date = new Date(pDate);
	this.date.setHours(0);
	this.date.setMinutes(0);
	this.date.setSeconds(0);
	var sleeps, feeds, diapers, date;
	sleeps = pSleeps;
	feeds = pFeeds;
	diapers = pDiapers;
	if (!sleeps) sleeps = [];
	if (!diapers) diapers = [];
	if (!feeds) feeds = [];

	this.addSleep = function(sleep) {
		sleeps.push(sleep);
	}
	this.addDiaper = function(diaper) {
		diapers.push(diaper);
	}
	this.addFeed = function(feed) {
		feeds.push(feed);
	}
	this.getSleeps = function() { return sleeps; }
	this.getDiapers = function() { return diapers; }
	this.getFeeds = function() { return feeds; }
};

APP.Dataset.Sleep = function(start, end) {
	var sleepStart = start;
	var sleepEnd = end;

	this.getStart = function() { return sleepStart; }
	this.getEnd = function() { return sleepEnd; }

	// when did the sleep begin?
	this.getStartingBlock = function() {
		return APP.getTimeBlockFromDate(sleepStart);
	}

	// how long was the sleep? in 15 minute blocks
	this.getDurationBlocks = function() {
		if (!sleepEnd) return 0;

		var sec = (1/1000.0) * (sleepEnd.getTime() - sleepStart.getTime());
		var mins = sec / 60.0
		var hrs = mins / 60.0;
		var blocks = Math.round(mins / APP.SleepBlockSizeInMinutes);
		return blocks;
	}
};

APP.Dataset.Diaper = function(pTime, value) {
	var diaperType = value;
	var time = pTime;
	if (!(value == 1 || value == 2 || value == 3)) {
		throw "Bad diaper value; 1 = pee, 2 = poo, 3 = both";
	}
	this.getValue = function() { return diaperType; }
	this.getTimeBlock = function() {
		return APP.getTimeBlockFromDate(time);
	}
}

APP.Dataset.Feed = function(pTime, value) {
	var feedValue = value;
	var time = pTime;
	this.getValue = function() { return feedValue; }
	this.getTimeBlock = function() {
		return APP.getTimeBlockFromDate(time);
	}
}

APP.CalendarHelper = function() {
	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
	this.getMonthName = function(month) {
		return months[month];
	}
};

APP.TableGenerator = function(container, calHelper) {

	this.generate = function(datasets) {
		for(var i = 0, len = datasets.length; i < len; i++) {
			var el = document.createElement('pre');
			container.appendChild(el);
			var ds = datasets[i];
			var header = this.generateHeader(ds.date);
			var sleepRow = this.generateSleepRow(ds.getSleeps());
			var diaperRow = this.generateValueItemRow("Diapers", ds.getDiapers());
			var feedRow = this.generateValueItemRow("Feed", ds.getFeeds());
			el.innerText = header 
			+ '\n' + sleepRow
			+ '\n' + feedRow
			+ '\n' + diaperRow;
		}
	}

	// generate the header
	this.generateHeader = function(date) {
		var month = calHelper.getMonthName(date.getMonth());
		var dateString = month + ' ' + date.getDate() + ', ' + (date.getYear()+1900);
		while(dateString.length < APP.LeftColumnWidth) {
			dateString += " ";
		}
		var header = dateString + "|00  01  02  03  04  05  06  07  08  09  10  11  12  13  14  15  16  17  18  19  20  21  22  23  |"
		header += "\n";
		header += "--------------|------------------------------------------------------------------------------------------------|";
		return header;
	}

	// generate the sleep row
	this.generateSleepRow = function(sleeps) {
		var str_arr = APP.generate24HrCharArray();	
		for (var i = 0; i < sleeps.length; i++) {
			var sleep = sleeps[i];

			var startSleepBlock = sleep.getStartingBlock();
			var totalSleepBlocks = sleep.getDurationBlocks();
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
		var sleep_string = str_arr.join('');
		var colHeader = this.generateColumnHeaderRightAlign("Sleep");
		sleep_string = colHeader + sleep_string;
		return sleep_string;
	}

	// generate the diaper or feed (or other simple) row
	this.generateValueItemRow = function(colName, items) {
		var str_arr = APP.generate24HrCharArray();	
		for(var i = 0; i < items.length; i++) {
			var item = items[i];
			// "value items" take up multiple character locations, so we need to split the value up
			var itemValueArr = item.getValue().split('');
			var extraShift = 0;
			for(var j = 0, len = itemValueArr.length; j < len; j++) {
				while (str_arr[item.getTimeBlock()+j+extraShift] != ' ') extraShift++;
				str_arr[item.getTimeBlock()+j+extraShift] = itemValueArr[j];
			}
		}
		var colHeader = this.generateColumnHeaderRightAlign(colName);
		var string_row = colHeader + str_arr.join('');
		return string_row;
	}
	this.generateColumnHeaderRightAlign = function(text) {
		var colHeader = text;
		while(colHeader.length < APP.LeftColumnWidth) colHeader = " " + colHeader;
		return colHeader + "|";
	}
};

APP.populateDatasetsFromJsonData = function(datasets, json) {
	for(var i = 0, len = json.sleeps.length; i < len; i++) {
		var sleep = json.sleeps[i];
		var ds = APP.getDatasetForDate(datasets, new Date(sleep.start));
		var sleepEnd = sleep.end == null ? undefined : new Date(sleep.end);
		ds.addSleep(new APP.Dataset.Sleep(new Date(sleep.start), sleepEnd));
	}
	for(var i = 0, len = json.feeds.length; i < len; i++) {
		var feed = json.feeds[i];
		var ds = APP.getDatasetForDate(datasets, new Date(feed.time));
		ds.addFeed(new APP.Dataset.Feed(new Date(feed.time), feed.entry_value));
	}
	for(var i = 0, len = json.diapers.length; i < len; i++) {
		var diaper = json.diapers[i];
		var ds = APP.getDatasetForDate(datasets, new Date(diaper.time));
		ds.addDiaper(new APP.Dataset.Diaper(new Date(diaper.time), diaper.entry_value));
	}
}

APP.getNewDatasetsForJsonData = function(json) {

	var datasets = [];
	for(var i = 0, len = json.sleeps.length; i < len; i++) {
		var item = json.sleeps[i];
		if (!APP.getDatasetForDate(datasets, new Date(item.start))) {
			datasets.push(new APP.Dataset(item.start));
		}
	}
	for(var i = 0, len = json.feeds.length; i < len; i++) {
		var feedTime = json.feeds[i].time;
		if (!APP.getDatasetForDate(datasets, new Date(feedTime))) {
			datasets.push(new APP.Dataset(feedTime));
		}
	}
	for(var i = 0, len = json.diapers.length; i < len; i++) {
		var diaperTime = json.diapers[i].time;
		if (!APP.getDatasetForDate(datasets, new Date(diaperTime))) {
			datasets.push(new APP.Dataset(diaperTime));
		}
	}

	return datasets;
}

APP.getDatasetForDate = function(datasets, date) {
	if (!datasets || datasets.length === 0) return false;

	for(var i = 0, len = datasets.length; i < len; i++) {
		var ds = datasets[i];
		var dsDate = ds.date;
		if (dsDate.getYear() == date.getYear()
			&& dsDate.getMonth() == date.getMonth()
		&& dsDate.getDate() == date.getDate()) {
			return ds;
		}
	}
	return false;
}

APP.processServerData = function(json) {
	var datasets = APP.getNewDatasetsForJsonData(json);
	APP.populateDatasetsFromJsonData(datasets, json);
	var container = document.getElementById('tableContainer');
	var calHelper = new APP.CalendarHelper();
	var tableGenerator = new APP.TableGenerator(container, calHelper);
	tableGenerator.generate(datasets.reverse());
}

APP.init = function() {
	//APP.genDummyData();

	// load data from server via ajax
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {

		if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
			if(xmlhttp.status == 200){
				APP.processServerData(JSON.parse(xmlhttp.responseText));
			}
			else if(xmlhttp.status == 400) {
				alert('There was an error 400')
			}
			else {
				alert('something else other than 200 was returned')
			}
		}
	}

	var doAsync = false;
	xmlhttp.open("GET", "services/BabyApi.php?action=loaddata", doAsync);
	xmlhttp.send();
}
APP.genDummyData = function() {
	// location for the table
	var container = document.getElementById('tableContainer');
	var calHelper = new APP.CalendarHelper();

	// some dummy data
	var datasets = [];
	for(var i = 0; i < 9; i++) {
		var ds = new APP.Dataset(new Date());
		ds.addSleep(new APP.Dataset.Sleep(new Date(2015, 9, 25, 7, 0, 0, 0)));
		ds.addSleep(new APP.Dataset.Sleep(new Date(2015, 9, 25, 0, 0, 0, 0), new Date(2015, 9, 25, 0, 30, 0, 0)));
		ds.addSleep(new APP.Dataset.Sleep(new Date(2015, 9, 25, 7, 30, 0, 0), new Date(2015, 9, 25, 9, 20, 0, 0)));
		ds.addSleep(new APP.Dataset.Sleep(new Date(2015, 9, 25, 11, 45, 0, 0), new Date(2015, 9, 25, 14, 05, 0, 0)));
		ds.addDiaper(new APP.Dataset.Diaper(new Date(2015, 9, 25, 3, 0, 0), 1));
		ds.addDiaper(new APP.Dataset.Diaper(new Date(2015, 9, 25, 5, 0, 0), 1));
		ds.addDiaper(new APP.Dataset.Diaper(new Date(2015, 9, 25, 8, 0, 0), 3));
		ds.addFeed(new APP.Dataset.Feed(new Date(2015, 9, 25, 11, 0, 0), 'BR'));
		ds.addFeed(new APP.Dataset.Feed(new Date(2015, 9, 25, 13, 0, 0), '80'));
		datasets.push(ds);
	}

	var tableGenerator = new APP.TableGenerator(container, calHelper);
	tableGenerator.generate(datasets);
}

APP.init();
