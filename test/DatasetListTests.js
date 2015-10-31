

QUnit.test( "WeeklyDatasetGrouping", function( assert ) {
	
	var d1 = new Date(2015, 9, 31); // oct 31
	var d2 = new Date(2015, 10, 1); // nov 1
	var d3 = new Date(2015, 10, 2); // nov 2 (next week)
	var ds1 = new DATA.DatasetSummary(d1, 21, 11, 61, 4, 13);
	var ds2 = new DATA.DatasetSummary(d2, 10, 5, 50, 2, 10);
	var ds3 = new DATA.DatasetSummary(d3, 20, 10, 60, 3, 12);
	var grouper = new DATA.DataGroup();
	var grouped = grouper.groupSummariesByWeek([ds1, ds2, ds3]);
	var aggSum1 = grouped.weekGroups[0].getAggregatedSummary();
	var aggSum2 = grouped.weekGroups[1].getAggregatedSummary();
	assert.equal(grouped.weekGroups.length, 2);
	assert.equal(grouped.weekGroups[0].summaries.length, 1);
	assert.equal(grouped.weekGroups[1].summaries.length, 2);
	assert.equal(aggSum1.totalSleepHrs, 21);
	assert.equal(aggSum1.nightSleepHrs, 11);
	assert.equal(aggSum1.milkBottleMl, 61);
	assert.equal(aggSum1.milkBreastCount, 4);
	assert.equal(aggSum1.diaperCount, 13);
	assert.equal(aggSum2.totalSleepHrs, 15);
	assert.equal(aggSum2.nightSleepHrs, 7.5);
	assert.equal(aggSum2.milkBottleMl, 55);
	assert.equal(aggSum2.milkBreastCount, 2.5);
	assert.equal(aggSum2.diaperCount, 11);
});

QUnit.test("convertSummariesToArraySummaryObject", function(assert) {
	var date1 = new Date(2000, 01, 01);
	var date2 = new Date(2000, 01, 02);
	var summary1 = new DATA.DatasetSummary(date1, 14, 8.0, 400, 4, 10);
	var summary2 = new DATA.DatasetSummary(date2, 16, 9.0, 500, 6, 12);
	var converter = new CONVERTER.DatasetConverter();
	var result = converter.convertSummariesToSingleArraySummary([summary1, summary2]);
	assert.equal(result.date[0].getTime(), date1.getTime());
	assert.equal(result.totalSleepHrs[0], 14);
	assert.equal(result.nightSleepHrs[0], 8.0);
	assert.equal(result.milkBottleMl[0], 400);
	assert.equal(result.milkBreastCount[0], 4);
	assert.equal(result.diaperCount[0], 10);
	assert.equal(result.date[1].getTime(), date2.getTime());
	assert.equal(result.totalSleepHrs[1], 16);
	assert.equal(result.nightSleepHrs[1], 9.0);
	assert.equal(result.milkBottleMl[1], 500);
	assert.equal(result.milkBreastCount[1], 6);
	assert.equal(result.diaperCount[1], 12);
});

QUnit.test("mergeSleeps", function(assert) {
	var s1 = new DATA.Dataset.Sleep(new Date(2015, 9, 28, 20, 0, 0), new Date(2015, 9, 29, 0, 0, 0));
	var s2 = new DATA.Dataset.Sleep(new Date(2015, 9, 29, 0, 0, 0), new Date(2015, 9, 29, 4, 0, 0));
	var merger = new DATA.SleepMerge();
	var merged = merger.mergeSleeps([s1, s2]);
	var mergedItem = merged[0];
	assert.equal(merged.length, 1);
	assert.equal(mergedItem.getDurationInMinutes(), 480);
	assert.equal(mergedItem.start.getTime(), (new Date(2015, 9, 28, 20, 0, 0)).getTime());
	assert.equal(mergedItem.end.getTime(), (new Date(2015, 9, 29, 4, 0, 0)).getTime());
});

QUnit.test("nightSleepCalc", function(assert) {
	var ds1 = new DATA.Dataset(new Date(2015, 9, 28, 0, 0, 0));
	var ds2 = new DATA.Dataset(new Date(2015, 9, 29, 0, 0, 0));
	ds1.addSleep(new DATA.Dataset.Sleep(new Date(2015, 9, 28, 20, 0, 0), new Date(2015, 9, 29, 0, 0, 0)));
	ds2.addSleep(new DATA.Dataset.Sleep(new Date(2015, 9, 29, 0, 0, 0), new Date(2015, 9, 29, 4, 30, 0)));
	var calc = new DATA.SleepCalculator();
	var sleepHrs = calc.calculateNightSleepDuration(ds1, ds2);
	assert.equal(sleepHrs, 8.5);
});

QUnit.test("datasetConverter", function(assert) {
	var ds1 = new DATA.Dataset(new Date(2015, 9, 28, 0, 0, 0));
	var ds2 = new DATA.Dataset(new Date(2015, 9, 29, 0, 0, 0));
	// 8.5hrs night sleep in ds1, 2hrs night sleep in ds2
	ds1.addSleep(new DATA.Dataset.Sleep(new Date(2015, 9, 28, 20, 0, 0), new Date(2015, 9, 29, 0, 0, 0)));
	ds2.addSleep(new DATA.Dataset.Sleep(new Date(2015, 9, 29, 0, 0, 0), new Date(2015, 9, 29, 4, 30, 0)));
	ds2.addSleep(new DATA.Dataset.Sleep(new Date(2015, 9, 29, 20, 0, 0), new Date(2015, 9, 29, 22, 0, 0)));
	var datasets = [ds1, ds2];
	var converter = new CONVERTER.DatasetConverter();
	var summaries = converter.convertDatasetsToSummaries(datasets);
	var dsSummary1 = summaries[0];
	var dsSummary2 = summaries[1];
	assert.equal(summaries.length, 2);
	assert.equal(dsSummary1.nightSleepHrs, 8.5);
	assert.equal(dsSummary2.nightSleepHrs, 2.0);
	assert.equal(dsSummary1.totalSleepHrs, 4.0);
	assert.equal(dsSummary2.totalSleepHrs, 6.5);
});
