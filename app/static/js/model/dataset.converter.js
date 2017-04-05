function reportDataConverter() {

    function getChartData(reportJson) {
        return reportJson.reduce(function (soFar, item) {
            soFar.dates.push(new Date(item.day));
            soFar.totalSleepHrs.push(item.totalSleepHrs);
            soFar.nightSleepHrs.push(item.nightSleepHrs);
            soFar.milkMl.push(item.milkMl);
            soFar.formulaMl.push(item.formulaMl);
            soFar.solidMl.push(item.solidMl);
            soFar.breastCount.push(item.breastCount);
            soFar.poos.push(item.poos);
            return soFar;
        }, { dates: [], totalSleepHrs: [], nightSleepHrs: [], milkMl: [], formulaMl: [], solidMl: [], breastCount: [], poos: [] });
    }

    return {
        getChartData: getChartData
    };
}

