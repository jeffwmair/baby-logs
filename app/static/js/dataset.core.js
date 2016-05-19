if (typeof DATA === "undefined" ) DATA = {};

DATA.MS_PER_WEEK = 604800000;

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
			var start = sleep.start;
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

	this.getDiaperAtTimeAny = function(time) {
		var diaper;
		/* got-awful code here... */
		for(var i = 0, len = diapers.length; i < len; i++) {
			var thisDiaperTime = DATETIME.getTime(diapers[i].time);
			if (thisDiaperTime == time) {
				if (!diaper || diaper.value < diapers[i].value) {
					diaper = diapers[i];
				}
			}
		}
		return diaper;
	}

	this.getDiaperAtTime = function(time, val) {
		var diaper;
		for(var i = 0, len = diapers.length; i < len; i++) {
			var thisDiaperTime = DATETIME.getTime(diapers[i].time);
			if (thisDiaperTime == time && diapers[i].value == val) {
				diaper = diapers[i];
				break;
			}
		}
		return diaper;
	}

	this.getFeedAtTimeAny = function(time) {
		var feed;
		for(var i = 0, len = feeds.length; i < len; i++) {
			var thisFeed = feeds[i];

			var thisFeedTime = DATETIME.getTime(thisFeed.time);
			if (thisFeedTime == time) {
				feed = feeds[i];
				break;
			}
		}
		return feed;

	}

	this.getFeedAtTime = function(feedType, time) {
		var feed;
		for(var i = 0, len = feeds.length; i < len; i++) {
			var thisFeed = feeds[i];

			if (thisFeed.type !== feedType) {
				continue;
			}

			var thisFeedTime = DATETIME.getTime(thisFeed.time);
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
			var thisSleepTime = DATETIME.getTime(sleeps[i].start);
			if (thisSleepTime == time) {
				sleep = sleeps[i];
				break;
			}
		}
		return sleep;
	}
};

DATA.Dataset.Sleep = function(start, end) {
	this.start = start;
	this.end = end;

	this.getDay = function() {
		var day = new Date(this.start.getTime());
		day.setHours(0);
		day.setMinutes(0);
		day.setSeconds(0);
		return day;
	}
	this.getMidPoint = function() {
		var dur = (this.end.getTime() - this.start.getTime()) / 2.0;
		var midMs = this.start.getTime() + dur;
		return new Date(midMs);
	}

	// when did the sleep begin?
	this.getStartingBlock = function() {
		return DATETIME.getTimeBlockFromDate(this.sleepStart);
	}

	this.getDurationInMinutes = function() {
		if (!this.end) return 0;
		var msDiff = this.end.getTime() - this.start.getTime();
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
	this.value = value;
	this.time = pTime;
	this.type = "diaper";
	if (!(value == 'pee' || value == 'poo')) {
		throw "Bad diaper value; value seen was:"+value;
	}
	this.getTimeBlock = function() {
		return DATETIME.getTimeBlockFromDate(time);
	}
}

DATA.Dataset.Feed = function(pTime, feedType, value) {
	this.value = value;
	this.time = pTime;
	this.type = feedType;
	this.getTimeBlock = function() {
		return DATETIME.getTimeBlockFromDate(this.time);
	}
}
