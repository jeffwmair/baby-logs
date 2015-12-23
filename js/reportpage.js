var APP = APP || {};
APP.ReportPage = function(container, calHelper) {

	var calcHoursBetweenTimes = function(date1, date2) {
		var msDiff = date2.getTime() - date1.getTime();	
		return msDiff / (60000.0 * 60);
	}

	this.init_new = function( container, calHelper ) {
		var that = this;
		UTILS.ajaxGetJson("services/BabyApi.php?action=loadreportdata", function(json) {
			var converter = new CONVERTER.ReportDataConverterForChart();
			var chartDataDaily = converter.getChartData(json.daily);
			var chartDataWeekly = converter.getChartData(json.weekly);
			console.log(chartDataDaily);
			console.log(chartDataWeekly);
			configureLineChartNew('#container_linechart_daily', 'Last 10 Days', chartDataDaily);
			configureLineChartNew('#container_linechart_weekly', 'Weekly Averages', chartDataWeekly);
		});
	}

	this.init = function(container, calHelper) {
		var that = this;
		UTILS.ajaxGetJson("services/BabyApi.php?action=loaddata", function(json) {
			var datasets = new CONVERTER.getNewDatasetsForJsonData(json);
			//that.generate(datasets.reverse(), container, calHelper);

			var now = new Date();
			var lastDs = datasets[datasets.length-1];
			var sleeps = lastDs.getSleeps();
			var feeds = lastDs.getFeeds();
			var diapers = lastDs.getDiapers();
			var mostRecentSleep = sleeps[sleeps.length-1];
			var mostRecentFeed = feeds[feeds.length-1];
			var mostRecentDiaper = diapers[diapers.length-1];
			var hrsAgoSleep = '', hrsAgoFeed = '', hrsAgoDiaper = '';
			if (mostRecentSleep) {
				var hrsAgoSleep = calcHoursBetweenTimes(mostRecentSleep.start, now).toFixed(1);
			}
			if (mostRecentFeed) {
				var hrsAgoFeed = calcHoursBetweenTimes(mostRecentFeed.time, now).toFixed(1);
			}
			if (mostRecentDiaper) {
				var hrsAgoDiaper = calcHoursBetweenTimes(mostRecentDiaper.time, now).toFixed(1);
			}

			var txtLastSleep = document.getElementById('txtLastSleep');
			var txtLastFeed = document.getElementById('txtLastFeed');
			var txtLastDiaper = document.getElementById('txtLastDiaper');

			txtLastSleep.innerText = hrsAgoSleep;
			txtLastFeed.innerText = hrsAgoFeed;
			txtLastDiaper.innerText = hrsAgoDiaper;

			var converter = new CONVERTER.DatasetConverter();
			var summaries = converter.convertDatasetsToSummaries(datasets);
			var last10DaysSummary = converter.convertSummariesToSingleArraySummary(summaries.slice(summaries.length-10));

/*
			var twodays = datasets.slice(datasets.length-2);
			var merger = new DATA.SleepMerge();
			var sleeps = twodays[0].getSleeps();
			sleeps = sleeps.concat(twodays[1].getSleeps());
			var mergedSleeps = merger.mergeSleeps(sleeps);
			*/


			var grouper = new DATA.DataGroup();
			var weekGroupings = grouper.groupSummariesByWeek(summaries);
			var weekSummaryForChart = weekGroupings.getSingleSummary();


			configureLineChart('#container_linechart_daily', 'Last 10 Days', last10DaysSummary);
			configureLineChart('#container_linechart_weekly', 'Weekly Averages', weekSummaryForChart);
		});
	}

	var configureLineChartNew = function(chartEl, chartTitle, data) {
		var title = chartTitle;
		var categoryData, sleepData, sleepMaxHrsPerNight, milkData, breastFeedsData;
		categoryData = DATETIME.datesToSimpleDisplay(data.dates);
		sleepData = data.totalSleepHrs;
		sleepMaxHrsPerNight = data.nightSleepHrs;
		milkData = data.bottleMl;
		breastFeedsData = data.breastCount;

		$(chartEl).highcharts({
			chart: { zoomType: 'xy' },
			credits: { enabled:false },
			title: { text: title },
			xAxis: [{
				categories: categoryData,
				crosshair: true
			}],
			yAxis: [{ // Primary yAxis
				labels: {
					format: '{value} ml',
					style: { color: Highcharts.getOptions().colors[3] }
				},
				title: {
					text: 'Bottle Feeding',
					style: { color: Highcharts.getOptions().colors[3] }
				},
				opposite: true

			}, { // Secondary yAxis
				gridLineWidth: 0,
				title: {
					text: 'Sleep',
					style: { color: Highcharts.getOptions().colors[0] }
				},
				labels: {
					format: '{value} hrs',
					style: { color: Highcharts.getOptions().colors[0] }
				}
			}, 
			{ 
				gridLineWidth: 0,
				title: {
					text: 'Breast Feedings',
					style: { color: Highcharts.getOptions().colors[2] }
				},
				labels: {
					format: '{value}',
					style: { color: Highcharts.getOptions().colors[2] }
				},
				opposite: true
			}
			
			],
			tooltip: {
				shared: true
			},
			legend: {
				layout: 'vertical',
				align: 'left',
				x: 80,
				verticalAlign: 'top',
				y: 55,
				floating: true,
				backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
			},
			series: [{
				name: 'Total Sleep',
				type: 'column',
				yAxis: 1,
				data: sleepData,
				tooltip: {
					valueSuffix: ' hrs'
				}
			}, 
			{
				name: 'Uninterrupted Night Sleep',
				type: 'column',
				yAxis: 1,
				data: sleepMaxHrsPerNight,
				tooltip: {
					valueSuffix: ' hrs'
				}
			},
			{
				name: 'Feeding - Breast',
				yAxis : 2,
				type: 'spline',
				data: breastFeedsData,
				tooltip: { valueSuffix: ' feedings' }
			},
			{
				name: 'Feeding - Bottle',
				type: 'spline',
				data: milkData,
				tooltip: { valueSuffix: ' ml' }
			}
			]
		});
	}


	var configureLineChart = function(chartEl, chartTitle, dsSummaries) {
		var title = chartTitle;
		var categoryData, sleepData, sleepMaxHrsPerNight, milkData, breastFeedsData;
		categoryData = DATETIME.datesToSimpleDisplay(dsSummaries.date);
		sleepData = dsSummaries.totalSleepHrs;
		sleepMaxHrsPerNight = dsSummaries.nightSleepHrs;
		milkData = dsSummaries.milkBottleMl;
		breastFeedsData = dsSummaries.milkBreastCount;

		$(chartEl).highcharts({
			chart: { zoomType: 'xy' },
			credits: { enabled:false },
			title: { text: title },
			xAxis: [{
				categories: categoryData,
				crosshair: true
			}],
			yAxis: [{ // Primary yAxis
				labels: {
					format: '{value} ml',
					style: { color: Highcharts.getOptions().colors[3] }
				},
				title: {
					text: 'Bottle Feeding',
					style: { color: Highcharts.getOptions().colors[3] }
				},
				opposite: true

			}, { // Secondary yAxis
				gridLineWidth: 0,
				title: {
					text: 'Sleep',
					style: { color: Highcharts.getOptions().colors[0] }
				},
				labels: {
					format: '{value} hrs',
					style: { color: Highcharts.getOptions().colors[0] }
				}
			}, 
			{ 
				gridLineWidth: 0,
				title: {
					text: 'Breast Feedings',
					style: { color: Highcharts.getOptions().colors[2] }
				},
				labels: {
					format: '{value}',
					style: { color: Highcharts.getOptions().colors[2] }
				},
				opposite: true
			}
			
			],
			tooltip: {
				shared: true
			},
			legend: {
				layout: 'vertical',
				align: 'left',
				x: 80,
				verticalAlign: 'top',
				y: 55,
				floating: true,
				backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
			},
			series: [{
				name: 'Total Sleep',
				type: 'column',
				yAxis: 1,
				data: sleepData,
				tooltip: {
					valueSuffix: ' hrs'
				}
			}, 
			{
				name: 'Uninterrupted Night Sleep',
				type: 'column',
				yAxis: 1,
				data: sleepMaxHrsPerNight,
				tooltip: {
					valueSuffix: ' hrs'
				}
			},
			{
				name: 'Feeding - Breast',
				yAxis : 2,
				type: 'spline',
				data: breastFeedsData,
				tooltip: { valueSuffix: ' feedings' }
			},
			{
				name: 'Feeding - Bottle',
				type: 'spline',
				data: milkData,
				tooltip: { valueSuffix: ' ml' }
			}
			]
		});

	}
};

