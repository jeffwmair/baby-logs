var APP = APP || {};
APP.ReportPage = function(container, calHelper) {

	var calcHoursBetweenTimes = function(date1, date2) {
		var msDiff = date2.getTime() - date1.getTime();	
		return msDiff / (60000.0 * 60);
	}

	this.init = function(container, calHelper) {
		var that = this;
		UTILS.ajaxGetJson("services/BabyApi.php?action=loaddata", function(json) {
			var datasets = DATA.getNewDatasetsForJsonData(json);
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
				var hrsAgoSleep = calcHoursBetweenTimes(mostRecentSleep.getStart(), now).toFixed(1);
			}
			if (mostRecentFeed) {
				var hrsAgoFeed = calcHoursBetweenTimes(mostRecentFeed.getTime(), now).toFixed(1);
			}
			if (mostRecentDiaper) {
				var hrsAgoDiaper = calcHoursBetweenTimes(mostRecentDiaper.getTime(), now).toFixed(1);
			}

			var txtLastSleep = document.getElementById('txtLastSleep');
			var txtLastFeed = document.getElementById('txtLastFeed');
			var txtLastDiaper = document.getElementById('txtLastDiaper');

			txtLastSleep.innerText = hrsAgoSleep;
			txtLastFeed.innerText = hrsAgoFeed;
			txtLastDiaper.innerText = hrsAgoDiaper;


			// last 5 days
			var dataToReport = datasets.slice(datasets.length-10);
			configureLineChart(dataToReport);
			//configureBarChart(dataToReport);
		});
	}

	var configureLineChart = function(datasets) {
		var title = 'Liam Data';
		var dsList = new DATA.DatasetList(datasets);
		var categoryData = DATETIME.datesToSimpleDisplay(dsList.getDays());
		var sleepData = dsList.getSleepHrsData();
		var sleepMaxHrsPerNight = dsList.getSleepMaxHrsPerNight();
		var milkData = dsList.getMilkMlData();
		var breastFeedsData = dsList.getBreastFeedsData();
		//var diaperData = dsList.getDiaperCountData();

		$('#container_linechart').highcharts({
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
					style: { color: Highcharts.getOptions().colors[2] }
				},
				title: {
					text: 'Bottle Feeding',
					style: { color: Highcharts.getOptions().colors[2] }
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
					style: { color: Highcharts.getOptions().colors[1] }
				},
				labels: {
					format: '{value}',
					style: { color: Highcharts.getOptions().colors[1] }
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
				name: 'Max Sleep Per Night',
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

