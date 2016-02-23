var APP = APP || {};
APP.ReportPage = function(container, calHelper) {

	var API = "src/web/BabyApi.php";

	var calcHoursBetweenTimes = function(date1, date2) {
		var msDiff = date2.getTime() - date1.getTime();	
		return msDiff / (60000.0 * 60);
	}

	var errorHandler = function(errorMessage) {
		console.error(errorMessage);
	}

	this.init = function( container, calHelper ) {
		var that = this;

		UTILS.ajaxGetJson(API+"?action=loadreportdata", errorHandler, function(json) {

			var converter = new CONVERTER.ReportDataConverterForChart();
			var chartDataDaily = converter.getChartData(json.daily);
			var chartDataWeekly = converter.getChartData(json.weekly);

			configureLineChart('#container_linechart_daily', 'Last 10 Days', chartDataDaily);
			configureLineChart('#container_linechart_weekly', 'Weekly Averages', chartDataWeekly);

		});
	}


	var configureLineChart = function(chartEl, chartTitle, data) {
		
		var title = chartTitle;
		var categoryData, sleepData, sleepMaxHrsPerNight, milkData, breastFeedsData;
		categoryData = DATETIME.datesToSimpleDisplay(data.dates);
		sleepData = data.totalSleepHrs;
		sleepMaxHrsPerNight = data.nightSleepHrs;
		milkData = data.milkMl;
		formulaData = data.formulaMl;
		solidFoodData = data.solidMl;
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
				name: 'Milk - Breast',
				yAxis : 2,
				type: 'spline',
				data: breastFeedsData,
				tooltip: { valueSuffix: ' feedings' }
			},
			{
				name: 'Milk - Bottle',
				type: 'spline',
				data: milkData,
				tooltip: { valueSuffix: ' ml' }
			},
			{
				name: 'Formula - Bottle',
				type: 'spline',
				data: formulaData,
				tooltip: { valueSuffix: ' ml' }
			},
			{
				name: 'Solid Food',
				type: 'spline',
				data: solidFoodData,
				tooltip: { valueSuffix: ' ml' }
			}

			]
		});
	}

};

