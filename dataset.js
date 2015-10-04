DATA = {};



DATA.Dataset = function(pDate, pSleeps, pFeeds, pDiapers) {

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

	var splitSleepInto15MinuteSleeps = function(sleep) {
		var sleeps = [];
		if (sleep.getDurationInMinutes() > 15) {
			var splitNum = Math.ceil(sleep.getDurationInMinutes() / 15);
			var start = sleep.getStart();
			var end = DATETIME.getNextQuarterHourTime(start);
			for (var i = 0; i < splitNum; i++) {
				var partialSleep = new DATA.Dataset.Sleep(start, end);
				start = DATETIME.getNextQuarterHourTime(start);
				end = DATETIME.getNextQuarterHourTime(end);
				sleeps.push(partialSleep);
			}
		}
		else { 
			sleeps.push(sleep);
		}
		return sleeps;
	}

	this.addSleep = function(sleep) {
		var splitSleeps = splitSleepInto15MinuteSleeps(sleep);
		for(var i = 0, len = splitSleeps.length; i < len; i++) {
			sleeps.push(splitSleeps[i]);
		}
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

	this.getSleepAtTime = function(time) {
		var sleep;
		for(var i = 0, len = sleeps.length; i < len; i++) {
			var thisSleepTime = DATETIME.getTime(sleeps[i].getStart());
			if (thisSleepTime == time) {
				sleep = sleeps[i];
				break;
			}
		}
		return sleep;
	}
};

DATA.Dataset.Sleep = function(start, end) {
	var sleepStart = start;
	var sleepEnd = end;

	this.getStart = function() { return sleepStart; }
	this.getEnd = function() { return sleepEnd; }

	// when did the sleep begin?
	this.getStartingBlock = function() {
		return DATETIME.getTimeBlockFromDate(sleepStart);
	}

	this.getDurationInMinutes = function() {
		if (!sleepEnd) return 0;
		var msDiff = this.getEnd().getTime() - this.getStart().getTime();	
		return msDiff / 60000;
	}

	// how long was the sleep? in 15 minute blocks
	this.getDurationBlocks = function() {
		if (!sleepEnd) return 0;

		var sec = (1/1000.0) * (sleepEnd.getTime() - sleepStart.getTime());
		var mins = sec / 60.0
		var hrs = mins / 60.0;
		var blockSize = 60 / UTILS.HOURLY_DIVISIONS;
		var blocks = Math.round(mins / blockSize);
		return blocks;
	}
};

DATA.Dataset.Diaper = function(pTime, value) {
	var diaperType = value;
	var time = pTime;
	if (!(value == 1 || value == 2 || value == 3)) {
		throw "Bad diaper value; 1 = pee, 2 = poo, 3 = both";
	}
	this.getType = function() { return "diaper"; }
	this.getValue = function() { return diaperType; }
	this.getTime = function() { return time; }
	this.getTimeBlock = function() {
		return DATETIME.getTimeBlockFromDate(time);
	}
}

DATA.Dataset.Feed = function(pTime, value) {
	var feedValue = value;
	var time = pTime;
	this.getType = function() { return "feed"; }
	this.getValue = function() { return feedValue; }
	this.getTime = function() { return time; }
	this.getTimeBlock = function() {
		return DATETIME.getTimeBlockFromDate(time);
	}
}

DATA.populateDatasetsFromJsonData = function(datasets, json) {
	for(var i = 0, len = json.sleeps.length; i < len; i++) {
		var sleep = json.sleeps[i];
		var ds = DATA.getDatasetForDate(datasets, new Date(sleep.start));
		var sleepEnd = sleep.end == null ? undefined : new Date(sleep.end);
		ds.addSleep(new DATA.Dataset.Sleep(new Date(sleep.start), sleepEnd));
	}
	for(var i = 0, len = json.feeds.length; i < len; i++) {
		var feed = json.feeds[i];
		var ds = DATA.getDatasetForDate(datasets, new Date(feed.time));
		ds.addFeed(new DATA.Dataset.Feed(new Date(feed.time), feed.entry_value));
	}
	for(var i = 0, len = json.diapers.length; i < len; i++) {
		var diaper = json.diapers[i];
		var ds = DATA.getDatasetForDate(datasets, new Date(diaper.time));
		ds.addDiaper(new DATA.Dataset.Diaper(new Date(diaper.time), diaper.entry_value));
	}
}

DATA.getNewDatasetsForJsonData = function(json) {

	var datasets = [];
	for(var i = 0, len = json.sleeps.length; i < len; i++) {
		var item = json.sleeps[i];
		if (!DATA.getDatasetForDate(datasets, new Date(item.start))) {
			datasets.push(new DATA.Dataset(item.start));
		}
	}
	for(var i = 0, len = json.feeds.length; i < len; i++) {
		var feedTime = json.feeds[i].time;
		if (!DATA.getDatasetForDate(datasets, new Date(feedTime))) {
			datasets.push(new DATA.Dataset(feedTime));
		}
	}
	for(var i = 0, len = json.diapers.length; i < len; i++) {
		var diaperTime = json.diapers[i].time;
		if (!DATA.getDatasetForDate(datasets, new Date(diaperTime))) {
			datasets.push(new DATA.Dataset(diaperTime));
		}
	}

	DATA.populateDatasetsFromJsonData(datasets, json);
	return datasets;
}

DATA.getDatasetForDate = function(datasets, date) {
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
