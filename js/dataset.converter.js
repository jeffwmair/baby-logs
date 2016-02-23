if (typeof CONVERTER === "undefined" ) CONVERTER = {};



CONVERTER.populateDatasetsFromJsonData = function(datasets, json) {
	json.sleeps.forEach(function(sleep) {
		var ds = CONVERTER.getDatasetForDate(datasets, new Date(sleep.start));
		var sleepEnd = sleep.end == null ? undefined : new Date(sleep.end);
		ds.addSleep(new DATA.Dataset.Sleep(new Date(sleep.start), sleepEnd));
	});
	json.milkfeeds.forEach(function(milk) {
		var ds = CONVERTER.getDatasetForDate(datasets, new Date(milk.time));
		ds.addFeed(new DATA.Dataset.Feed(new Date(milk.time), 'milk', milk.entry_value));
	});
	json.fmlafeeds.forEach(function(fmla) {
		var ds = CONVERTER.getDatasetForDate(datasets, new Date(fmla.time));
		ds.addFeed(new DATA.Dataset.Feed(new Date(fmla.time), 'formula', fmla.entry_value));
	});
	json.solidfoodfeeds.forEach(function(solidFd) {
		var ds = CONVERTER.getDatasetForDate(datasets, new Date(solidFd.time));
		ds.addFeed(new DATA.Dataset.Feed(new Date(solidFd.time), 'solidfood', solidFd.entry_value));
	});
	json.diapers.forEach(function(diaper) {
		var ds = CONVERTER.getDatasetForDate(datasets, new Date(diaper.time));
		ds.addDiaper(new DATA.Dataset.Diaper(new Date(diaper.time), diaper.entry_value));
	});
}

CONVERTER.getNewDatasetsForJsonData = function(json) {

	var datasets = [];
	json.sleeps.forEach(function(item) {
		if (!CONVERTER.getDatasetForDate(datasets, new Date(item.start))) {
			datasets.push(new DATA.Dataset(item.start));
		}
	});
	json.milkfeeds.forEach(function(feed) {
		var feedTime = feed.time;
		if (!CONVERTER.getDatasetForDate(datasets, new Date(feedTime))) {
			datasets.push(new DATA.Dataset(feedTime));
		}
	});
	json.fmlafeeds.forEach(function(feed) {
		var feedTime = feed.time;
		if (!CONVERTER.getDatasetForDate(datasets, new Date(feedTime))) {
			datasets.push(new DATA.Dataset(feedTime));
		}
	});
	json.diapers.forEach(function(diaper) {
		var diaperTime = diaper.time;
		if (!CONVERTER.getDatasetForDate(datasets, new Date(diaperTime))) {
			datasets.push(new DATA.Dataset(diaperTime));
		}
	});

	CONVERTER.populateDatasetsFromJsonData(datasets, json);
	return datasets;
}

CONVERTER.ReportDataConverterForChart = function() {

	this.getChartData = function( reportJson ) {

		var resultObj = {};
		resultObj.dates = [];
		resultObj.totalSleepHrs = [];
		resultObj.nightSleepHrs = [];
		resultObj.milkMl = [];
		resultObj.formulaMl = [];
		resultObj.solidMl = [];
		resultObj.breastCount = [];
		resultObj.poos = [];

		reportJson.forEach( function( summary ) {
			resultObj.dates.push( new Date(summary.day) );
			resultObj.totalSleepHrs.push( summary.totalSleepHrs );
			resultObj.nightSleepHrs.push( summary.nightSleepHrs );
			resultObj.milkMl.push( summary.milkMl );
			resultObj.formulaMl.push( summary.formulaMl );
			resultObj.solidMl.push( summary.solidMl );
			resultObj.breastCount.push( summary.breastCount );
			resultObj.poos.push( summary.poos );
		});

		return resultObj;

	}

}

CONVERTER.DatasetConverter = function() {

	var sleepMerger = new DATA.SleepMerge();

	var isDatePartOfNight = function(nightDayTime, time) {
		//night starts at 8pm, ends the next day at 6:30am
		var start = nightDayTime + (20*60*60000);
		var end = start + (10.5 * 60*60000);
		return (time >= start && time <= end);
	}

	var getSleepsOnDayTime = function(time, sleeps) {
		var sleepsFiltered = [];
		var tempsleeps = sleeps;
		sleeps.forEach(function(sleep) {
			if (isDatePartOfNight(time, sleep.getMidPoint().getTime())) {
				sleepsFiltered.push(sleep);
			}
		});
		return sleepsFiltered;
	}

	var calcMaxSleepTime = function(datasetTime, sleeps) {
		var maxBlock;
		var sleepBlocks = sleepMerger.mergeSleeps(sleeps);
		var sleepsForDay = getSleepsOnDayTime(datasetTime, sleepBlocks);
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
			maxBlock = new DATA.Dataset.Sleep(new Date(datasetTime), new Date(datasetTime));
		}

		return maxBlock.getDurationInMinutes() / 60.0;
	}

	this.convertDatasetsToSingleArraySummary = function(datasets) {
		var summaries = this.convertDatasetsToSummaries(datasets);
		var singleSummary = this.convertSummariesToSingleArraySummary(summaries);
		return singleSummary;
	}

	this.convertSummariesToSingleArraySummary = function(summaries) {
		var arrSummary = new DATA.DatasetSummary([], [], [], [], [], []);
		summaries.forEach(function(summary) {
			arrSummary.date.push(summary.date);
			arrSummary.totalSleepHrs.push(summary.totalSleepHrs);
			arrSummary.nightSleepHrs.push(summary.nightSleepHrs);
			arrSummary.milkBottleMl.push(summary.milkBottleMl);
			arrSummary.milkBreastCount.push(summary.milkBreastCount);
			arrSummary.diaperCount.push(summary.diaperCount);
		});
		return arrSummary;
	}

	/**
	* Converting an array of datasets mainly so that we can calculate night-sleep which spans multiple days
	*/
	this.convertDatasetsToSummaries = function(datasets) {
		var summaries = [];
		for(var i = 0, len = datasets.length; i < len; i++) {
			var ds = datasets[i];
			var thisAndNextDaySleeps = ds.getSleeps();
			var nextDs = datasets[i+1];
			if (nextDs) {
				thisAndNextDaySleeps = thisAndNextDaySleeps.concat(nextDs.getSleeps());
			}

			var dsSummary = new DATA.DatasetSummary(ds.date, 0, 0, 0, 0, 0);
			ds.getSleeps().forEach(function(sleep) {
				dsSummary.totalSleepHrs += (sleep.getDurationInMinutes() / 60.0);
			});
			ds.getFeeds().forEach(function(feed) {
				var amt;
				if (!isNaN(feed.value)) {
					dsSummary.milkBottleMl += parseInt(feed.value);
				}
				else {
					dsSummary.milkBreastCount++;
				}
			});
			ds.getDiapers().forEach(function(diaper) {
				dsSummary.diaperCount++;
			});

			// calculate max sleeps per night
			dsSummary.nightSleepHrs = calcMaxSleepTime(ds.date.getTime(), thisAndNextDaySleeps);
			summaries.push(dsSummary);
		}

		return summaries;
	}
}

CONVERTER.getDatasetForDate = function(datasets, date) {
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
