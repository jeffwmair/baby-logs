var APP = APP || {};
APP.ReportPage = function(container, calHelper) {

	var API = "BabyApi";

	var calcHoursBetweenTimes = function(date1, date2) {
		var msDiff = date2.getTime() - date1.getTime();	
		return msDiff / (60000.0 * 60);
	}

	var errorHandler = function(errorMessage) {
		console.error(errorMessage);
	}

	this.init = function( container, calHelper ) {
		var that = this;

		var converter = new CONVERTER.ReportDataConverterForChart();
		UTILS.ajaxGetJson(API+"?action=loadreportdata_daily", errorHandler, function(json) {
			var chartDataDaily = converter.getChartData(json.datasets);
			if (chartDataDaily.dates.length > 0) {
			 	configureLineChart('#container_linechart_daily', 'Last 10 Days', chartDataDaily);
			}
			else {
				console.warn('No daily data found, so hiding this chart');
				$('#container_linechart_daily').hide()
			}
		});

		UTILS.ajaxGetJson(API+"?action=loadreportdata_weekly", errorHandler, function(json) {
			var chartDataWeekly = converter.getChartData(json.datasets);
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
		var milk_and_fmla_together = [];
		for(var i = 0; i < milkData.length; i++) {
			milk_and_fmla_together.push(milkData[i]+formulaData[i]);
		}
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
				name: 'Milk & Formula - Bottle',
				type: 'spline',
				data: milk_and_fmla_together,
				tooltip: { valueSuffix: ' ml' }
			},

			/*
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
			*/
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
