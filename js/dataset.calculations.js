if (typeof DATA === "undefined" ) DATA = {};

DATA.DataGroup = function() {
	this.groupSummariesByWeek = function(summaries) {
		var weekGroupings = new DATA.DatasetWeekGroupList();
		summaries.forEach(function(s) {
			weekGroupings.add(s);
		});
		return weekGroupings;
	}
	this.groupSummariesByMonth = function(summaries) {
		throw "not implemented!";
	}
}

DATA.SleepCalculator = function() {

	var isDatePartOfNight = function(nightDayTime, time) {
		//night starts at 8pm, ends the next day at 7:30am
		var hrsTillEnd = 11.5;
		var start = nightDayTime + (20*60*60000);
		var end = start + (hrsTillEnd * 60*60000);
		return (time >= start && time <= end);
	}

	this.calculateNightSleepDuration = function(ds1, ds2) {
		if (!ds1) throw "Ds1 must be provided!";


		var allSleeps = ds1.getSleeps();
		if (ds2) {
			allSleeps = allSleeps.concat(ds2.getSleeps());
		}
		var nightSleeps = [];

		allSleeps.forEach(function(sleep) {
			if (isDatePartOfNight(ds1.date.getTime(), sleep.getMidPoint().getTime())) {
				nightSleeps.push(sleep);
			}
		});

		var maxBlock;
		var sleepMerge = new DATA.SleepMerge();
		var mergedSleeps = sleepMerge.mergeSleeps(nightSleeps);

		mergedSleeps.forEach(function(sleep) {
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

		return maxBlock.getDurationInMinutes() / 60.0;
	}
}

DATA.SleepMerge = function() {

	/**
	* merge contiguous sleep records
	*/
	this.mergeSleeps = function(sleeps) {
		if (!sleeps || sleeps.length == 0) {
			return [];
		}

		var blocks = [];
		var sleep;
		sleeps.forEach(function(s) {
			if (!sleep) {
				sleep = new DATA.Dataset.Sleep(s.start, s.end);
			}
			else {
				// if no end, skip it
				if (s.end) {
					if (s.start.getTime() == sleep.end.getTime()) {
						sleep.end = s.end;
					}
					else {
						// new sleep block, so push the old one
						blocks.push(sleep);
						sleep = new DATA.Dataset.Sleep(s.start, s.end);
					}
				}
			}
		});

		if (sleep && (blocks.length == 0 || sleep.start.getTime() != blocks[blocks.length-1].start.getTime())) {
			blocks.push(sleep);
		}

		return blocks;
	}
}
