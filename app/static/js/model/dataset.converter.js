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
		ds.addFeed(new DATA.Dataset.Feed(new Date(solidFd.time), 'solid', solidFd.entry_value));
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
