if (typeof DATA === "undefined" ) DATA = {};

DATA.MS_PER_WEEK = 604800000;

DATA.DatasetWeekGroup = function(weekDate) {
	this.summaries = [];
	this.week = new Date(weekDate.getTime());
	this.week.setMilliseconds(0); this.week.setSeconds(0); this.week.setMinutes(0); this.week.setHours(0);
	while (this.week.getDay() > 0) {
		this.week.setDate(this.week.getDate() - 1);
	}
	this.doesSummaryBelongInGroup = function(summary) {
		// belongs in this week if the date
		var dsMs = summary.date.getTime();
		var weekMs = this.week.getTime();
		var diff = dsMs - weekMs;
		return diff > 0 && diff < DATA.MS_PER_WEEK;
	}
	this.getAggregatedSummary = function() {
		var aggSum = new DATA.DatasetSummary(new Date(this.week.getTime()));
		var totSleep = 0, nightSleep = 0, fmlaBott = 0, milkBott = 0, milkBreast = 0, diapers = 0;
		var i = 0;
		this.summaries.forEach(function(s) {
			totSleep += s.totalSleepHrs;
			nightSleep += s.nightSleepHrs;
			fmlaBott += s.formulaBottleMl;
			milkBott += s.milkBottleMl;
			milkBreast += s.milkBreastCount;
			diapers += s.diaperCount;
			i++;
		});

		aggSum.totalSleepHrs = round(1.0 * totSleep / i);
		aggSum.nightSleepHrs = round(1.0 * nightSleep / i);
		aggSum.milkBottleMl = round(1.0 * milkBott / i);
		aggSum.formulaBottleMl = round(1.0 * fmlaBott / i);
		aggSum.milkBreastCount = round(1.0 * milkBreast / i);
		aggSum.diaperCount = round(1.0 * diapers / i);

		return aggSum;
	}

	var round = function(val) {
		return Math.round(val * 100) / 100;
	}
}

DATA.DatasetWeekGroupList = function() {
	this.weekGroups = [];
	this.add = function(summary) {
		var found = false;
		for(var i = 0, len = this.weekGroups.length; i < len && !found; i++) {
			var wk = this.weekGroups[i];
			if (wk.doesSummaryBelongInGroup(summary)) {
				wk.summaries.push(summary);
				found = true;
			}
		}
		
		if (!found) {
			var newWeekGroup = new DATA.DatasetWeekGroup(summary.date);
			newWeekGroup.summaries.push(summary);
			this.weekGroups.push(newWeekGroup);
		}
	}

	this.getSingleSummary = function() {
		var singleSum = new DATA.DatasetSummary([], [], [], [], [], []);
		this.weekGroups.forEach(function(wg) {
			var aggregatedSummary = wg.getAggregatedSummary();
			singleSum.date.push(aggregatedSummary.date);
			singleSum.totalSleepHrs.push(aggregatedSummary.totalSleepHrs);
			singleSum.nightSleepHrs.push(aggregatedSummary.nightSleepHrs);
			singleSum.milkBottleMl.push(aggregatedSummary.milkBottleMl);
			singleSum.milkBreastCount.push(aggregatedSummary.milkBreastCount);
			singleSum.diaperCount.push(aggregatedSummary.diaperCount);
		});

		return singleSum;
	}
}

DATA.DatasetSummary = function(date, totalSleep, nightSleep, milkMl, milkBreastCount, diaperCount) {
	this.date = date;
	this.totalSleepHrs = totalSleep;
	this.nightSleepHrs = nightSleep;
	this.milkBottleMl = milkMl;
	this.milkBreastCount = milkBreastCount;
	this.diaperCount = diaperCount;
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
