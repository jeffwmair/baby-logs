DATA = {};

var isDatePartOfNight = function(nightDayTime, time) {
	//night starts at 8pm, ends the next day at 6:30am
	var start = nightDayTime + (20*60*60000);
	var end = start + (10.5 * 60*60000);
	return (time >= start && time <= end);
}

var calcMaxSleeps = function(sleeps) {
	var sleepBlocks = divideSleepsIntoBlocks(sleeps);
	var dates = getDatesFromSleeps(sleeps);
	var maxBlocks = [];
	dates.forEach(function(time) {
		var maxBlock;
		var sleepsForDay = getSleepsOnDayTime(time, sleepBlocks);
		sleepsForDay.forEach(function(sleep) {
			if (!maxBlock) {
				maxBlock = sleep;
			}
			else {
				if (sleep.getDurationInMinutes() > maxBlock.getDurationInMinutes()) {
					maxBlock = sleep;
				}
			}
		});
		if (!maxBlock) {
			maxBlock = new DATA.Dataset.Sleep(new Date(time), new Date(time));
		}
		maxBlocks.push(maxBlock);
	});

	return maxBlocks;
}

var getSleepsOnDayTime = function(time, sleeps) {
	var sleepsFiltered = [];
	sleeps.forEach(function(sleep) {
		if (isDatePartOfNight(time, sleep.getMidPoint().getTime())) {
			sleepsFiltered.push(sleep);
		}
	});

	return sleepsFiltered;
}

var getDatesFromSleeps = function(sleeps) {
	var dates = [];
	sleeps.forEach(function(s) {
		var date = new Date(s.getStart().getTime());
		date.setHours(0);
		date.setMinutes(0);
		date.setSeconds(0);
		if (!dates.contains(date.getTime())) {
			dates.push(date.getTime());
		}
	});
	return dates;
}

var divideSleepsIntoBlocks = function(sleeps) {
	if (!sleeps || sleeps.length == 0) {
		return [];
	}

	var blocks = [];
	var sleep;
	sleeps.forEach(function(s) {
		// first entry
			if (!sleep) {
				sleep = new DATA.Dataset.Sleep(s.getStart(), s.getEnd());
			}
			else {
			// if no end, skip it
				if (s.getEnd()) {
					if (s.getStart().getTime() == sleep.getEnd().getTime()) {
						sleep.setEnd(s.getEnd());
					}
					else {
						// new sleep block, so push the old one
						blocks.push(sleep);
						sleep = new DATA.Dataset.Sleep(s.getStart(), s.getEnd());
					}
				}
			}
	});

	return blocks;
}

DATA.DatasetList = function(datasets) {
	var datasets = datasets;
	var days = [], sleepData = [], sleepMaxHrsPerNight = [], milkMlData = [], milkByBreastData = [], diaperData = [];
	var allSleeps = [];
	var init = function() {
		datasets.forEach(function(ds) {

			// older data is not so good, so starting on Sept 26
			var dsDate = ds.date;
			var skip = false;
			if (dsDate.getMonth() == 8 && dsDate.getDate() < 26 && (dsDate.getYear()+1900) == 2015) {
				skip = true;
			}

			if (!skip) {
				days.push(ds.date);
				var sleepHrs = 0, milkMl = 0, breastFeedCount = 0, diaperChange = 0;
				ds.getSleeps().forEach(function(sleep) {
					allSleeps.push(sleep);
					sleepHrs += (sleep.getDurationInMinutes() / 60.0);
				});
				ds.getFeeds().forEach(function(feed) {
					var amt;
					if (!isNaN(feed.getValue())) {
						milkMl += parseInt(feed.getValue());
					}
					else {
						breastFeedCount++;
					}
				});
				ds.getDiapers().forEach(function(diaper) {
					diaperChange += 1;
				});

				sleepData.push(sleepHrs);
				milkMlData.push(milkMl);
				milkByBreastData.push(breastFeedCount);
				diaperData.push(diaperChange);
			}
		});

		// calculate max sleeps per night
		var maxSleepBlocks = calcMaxSleeps(allSleeps);
		maxSleepBlocks.forEach(function(sleep) {
			sleepMaxHrsPerNight.push(sleep.getDurationInMinutes() / 60.0);	
		})
		
	}

	this.getDays = function() {
		return days;
	}
	this.getSleepMaxHrsPerNight = function() {
		return sleepMaxHrsPerNight;
	}
	this.getSleepHrsData = function() {
		return sleepData;
	}
	this.getMilkMlData = function() {
		return milkMlData;
	}
	this.getBreastFeedsData = function() {
		return milkByBreastData;
	}
	this.getDiaperCountData = function() {
		return diaperData;
	}

	init();
}

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
		splitSleeps.forEach(function(ss) { sleeps.push(ss); });
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

	this.getPooAtTime = function(time) {
		return this.getDiaperAtTime(time, 2) != undefined;
	}

	this.getPeeAtTime = function(time) {
		return this.getDiaperAtTime(time, 1) != undefined;
	}

	this.getDiaperAtTime = function(time, val) {
		var diaper;
		for(var i = 0, len = diapers.length; i < len; i++) {
			var thisDiaperTime = DATETIME.getTime(diapers[i].getTime());
			if (thisDiaperTime == time && diapers[i].getValue() == val) {
				diaper = diapers[i];
				break;
			}
		}
		return diaper;
	}

	this.getFeedAtTime = function(time) {
		var feed;
		for(var i = 0, len = feeds.length; i < len; i++) {
			var thisFeedTime = DATETIME.getTime(feeds[i].getTime());
			if (thisFeedTime == time) {
				feed = feeds[i];
				break;
			}
		}
		return feed;
	}

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
	this.setEnd = function(end) { sleepEnd = end; }
	this.getDay = function() {
		var day = new Date(this.getStart().getTime());
		day.setHours(0);
		day.setMinutes(0);
		day.setSeconds(0);
		return day;
	}
	this.getMidPoint = function() {
		var dur = (this.getEnd().getTime() - this.getStart().getTime()) / 2.0;
		var midMs = this.getStart().getTime() + dur;
		return new Date(midMs);
	}

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

	this.toString = function() {
		return "start:"+sleepStart+", end:"+sleepEnd+", mid:"+this.getMidPoint()+", duration:"+this.getDurationInMinutes();
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
	json.sleeps.forEach(function(sleep) {
		var ds = DATA.getDatasetForDate(datasets, new Date(sleep.start));
		var sleepEnd = sleep.end == null ? undefined : new Date(sleep.end);
		ds.addSleep(new DATA.Dataset.Sleep(new Date(sleep.start), sleepEnd));
	});
	json.feeds.forEach(function(feed) {
		var ds = DATA.getDatasetForDate(datasets, new Date(feed.time));
		ds.addFeed(new DATA.Dataset.Feed(new Date(feed.time), feed.entry_value));
	});
	json.diapers.forEach(function(diaper) {
		var ds = DATA.getDatasetForDate(datasets, new Date(diaper.time));
		ds.addDiaper(new DATA.Dataset.Diaper(new Date(diaper.time), diaper.entry_value));
	});
}

DATA.getNewDatasetsForJsonData = function(json) {

	var datasets = [];
	json.sleeps.forEach(function(item) {
		if (!DATA.getDatasetForDate(datasets, new Date(item.start))) {
			datasets.push(new DATA.Dataset(item.start));
		}
	});
	json.feeds.forEach(function(feed) {
		var feedTime = feed.time;
		if (!DATA.getDatasetForDate(datasets, new Date(feedTime))) {
			datasets.push(new DATA.Dataset(feedTime));
		}
	});
	json.diapers.forEach(function(diaper) {
		var diaperTime = diaper.time;
		if (!DATA.getDatasetForDate(datasets, new Date(diaperTime))) {
			datasets.push(new DATA.Dataset(diaperTime));
		}
	});

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
