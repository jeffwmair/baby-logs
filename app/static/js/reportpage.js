var reportPage = (function reportPage() {
    'use strict';

    function init() {
        function loadChartData(period) {
            console.log('Beginning to load data:'+period)
            UTILS.ajaxGetJson('ReportData?type='+period, { doAsync: true }, function (error, json) {
                console.log("Daily data loaded")
                var chartDataDaily = getChartData(json.datasets, period);
                if (chartDataDaily.length > 0 && chartDataDaily[0].dates.length > 0) {
                    configureLineChart('#main-chart', json.description, chartDataDaily, period);
                }
                else {
                    console.warn('No daily data found, so hiding this chart');
                    $('#container_linechart_daily').hide()
                }
            });
        }

        var timeSelectorMap = {
            "ddlChartRecent": {
                api:'daily',
                desc:'Daily'
            },
            "ddlChartWeekly": {
                api:'weekly',
                desc:'Weekly'
            },
            "ddlChartWeeklyComparison": {
                api:'weekly-compare',
                desc:'Weekly - Compare'
            }
        };

        $('#ddlChartRecent, #ddlChartWeekly, #ddlChartWeeklyComparison').on('click', function (event) {
            var item = timeSelectorMap[event.currentTarget.id];
            setCookie('babyChartView', JSON.stringify(item), 300);
            $('#chart-time-description').html(item.desc);
            loadChartData(item.api);
        })

        var previousSetting = getCookie('babyChartView');
        var defaultApiCall = 'daily';
        if (previousSetting) {
            var item = JSON.parse(previousSetting);
            $('#chart-time-description').html(item.desc);
            defaultApiCall = item.api;
        }
        loadChartData(defaultApiCall);
    }

    function setCookie(name,value,days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    }
    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

    function getChartData(reportJson, period) {
        if (!reportJson) {
            alert('No data!');
            return;
        }
        var objectifiedDatasets = [];
        return reportJson.map(function(ds) {
            return ds.data.reduce(function (soFar, item) {
                if (!soFar.name) {
                    soFar.name = ds.name;
                }
                soFar.dates.push(period !== 'weekly-compare' ? new Date(item.day) : item.day);
                soFar.totalSleepHrs.push(item.totalSleepHrs);
                soFar.nightSleepHrs.push(item.nightSleepHrs);
                soFar.milkMl.push(item.milkMl);
                soFar.formulaMl.push(item.formulaMl);
                soFar.solidMl.push(item.solidMl);
                soFar.breastCount.push(item.breastCount);
                soFar.poos.push(item.poos);
                soFar.milkAndFmla.push(item.milkMl + item.formulaMl)
                return soFar;
            }, { dates: [], totalSleepHrs: [], nightSleepHrs: [], milkMl: [], formulaMl: [], solidMl: [], breastCount: [], poos: [], milkAndFmla: [] });
        });
    }

    function makeDataSeriesArrayFromDataset(data) {
        return [
            { name: data.name + ': Total Sleep', type: 'column', yAxis: 1, data: data.totalSleepHrs, tooltip: { valueSuffix: ' hrs' } },
            { name: data.name + ': Uninterrupted Night Sleep', type: 'column', yAxis: 1, data: data.nightSleepHrs, tooltip: { valueSuffix: ' hrs' } },
            { name: data.name + ': Milk - Breast', yAxis: 2, type: 'spline', data: data.breastCount, tooltip: { valueSuffix: ' feedings' } },
            { name: data.name + ': Milk & Formula - Bottle', type: 'spline', data: data.milkAndFmla, tooltip: { valueSuffix: ' ml' } },
            { name: data.name + ': Solid Food', type: 'spline', data: data.solidMl, tooltip: { valueSuffix: ' ml' } }
        ];
    }

    function configureLineChart(chartEl, chartTitle, datasets, period) {
        console.log('Line chart config started');
        var title = chartTitle;

        var series = datasets.map(function(ds) {
            return makeDataSeriesArrayFromDataset(ds);
        })
        var seriesFlattened = [];
        series.forEach(function(s) {
            s.forEach(function(x) {
                seriesFlattened.push(x);
            });
        });

        $(chartEl).highcharts({
            chart: { zoomType: 'xy' },
            credits: { enabled: false },
            title: { text: title },
            xAxis: [{
                categories: period !== 'weekly-compare' ? datetime.datesToSimpleDisplay(datasets[0].dates) : datasets[0].dates.map(function(d) { return 'Week ' + d; }),
                crosshair: true
            }],
            yAxis: [{ // Primary yAxis
                labels: { format: '{value} ml', style: { color: Highcharts.getOptions().colors[3] } },
                title: { text: 'Bottle Feeding', style: { color: Highcharts.getOptions().colors[3] } },
                opposite: true
            }, { // Secondary yAxis
                gridLineWidth: 0,
                title: { text: 'Sleep', style: { color: Highcharts.getOptions().colors[0] } },
                labels: { format: '{value} hrs', style: { color: Highcharts.getOptions().colors[0] } }
            },
            {
                gridLineWidth: 0,
                title: { text: 'Breast Feedings', style: { color: Highcharts.getOptions().colors[2] } },
                labels: { format: '{value}', style: { color: Highcharts.getOptions().colors[2] } },
                opposite: true
            }

            ],
            tooltip: { shared: true },
            legend: {
                layout: 'vertical', align: 'left', x: 80, verticalAlign: 'top', y: 55, floating: true,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
            },
            series: seriesFlattened
        });
        console.log('Line chart config finished');
    }

    return {
        init: init,
        configureLineChart: configureLineChart
    }
})();

reportPage.init();