var APP = APP || {};

/**
* Main class for the Entry Page
*/
APP.EntryPage = function() {

	var sleepButtonList = [];

	this.generateTable = function() {
		var table = document.createElement('table');
		var buttonText = ['sleep', 'pee', 'poo'];
		var rowCount = 24*UTILS.HOURLY_DIVISIONS;
		var nonButtonColumns = 2;
		var colCount = buttonText.length + nonButtonColumns;
		var feedOptions = this.generateFeedOptions();
		for(var i = 0; i < rowCount; i++) {
			var timeField = DATETIME.getTimeFromRange(UTILS.HOURLY_DIVISIONS, i);
			var tr = document.createElement('tr');
			table.appendChild(tr);
			for(var j = 0; j < colCount; j++) {
				var td = document.createElement('td');
				tr.appendChild(td);
				if (j == 0) {
					td.innerText = timeField;
				}
				else if (j <= colCount-nonButtonColumns) {
					var button = document.createElement('button');
					if (j == 1) {
						// css tag for sleep
						button.setAttribute('class', 'sleep_'+timeField);
						sleepButtonList.push(button);
					}
					button.innerHTML = buttonText[j-1];
					td.appendChild(button);
				}
				else {
					var feedBox = document.createElement('select');
					this.putFeedOptionsInSelect(feedBox, feedOptions);
					td.appendChild(feedBox);
				}
			}
		}
		container.appendChild(table);
	};

	this.loadData = function() {
		var that = this;
		var getSleepClickStartDate = function(e) {
			var mystartdate = new Date(that.getDate().getTime());
			var time = e.target.parentElement.parentElement.childNodes[0].innerText;
			var timeDate = DATETIME.parse24HrTime(time);
			mystartdate.setMinutes(timeDate.getMinutes());
			mystartdate.setHours(timeDate.getHours());
			mystartdate.setSeconds(0);
			return mystartdate;
		}
		var sleepClickHandlerNotSleeping = function(e) {
			var mystartdate = getSleepClickStartDate(e);
			var myendate = new Date(mystartdate.getTime() + (15*60000));
			var formatteddate = DATETIME.getYyyymmddFormat(mystartdate) + ' ' + DATETIME.getFormattedTime(mystartdate.getHours(), mystartdate.getMinutes());
			var formattedEndDate = DATETIME.getYyyymmddFormat(myendate) + ' ' + DATETIME.getFormattedTime(myendate.getHours(), myendate.getMinutes());
			UTILS.ajaxGetJson("services/BabyApi.php?action=sleep&sleepstart="+formatteddate+"&sleepend="+formattedEndDate, function(json) {
				that.loadData();
			});
		}
		var sleepClickHandlerIsSleeping = function(e) {
			var mystartdate = getSleepClickStartDate(e);
			var formatteddate = DATETIME.getYyyymmddFormat(mystartdate) + ' ' + DATETIME.getFormattedTime(mystartdate.getHours(), mystartdate.getMinutes());
			UTILS.ajaxGetJson("services/BabyApi.php?action=removesleep&sleepstart="+formatteddate, function(json) {
				that.loadData();
			});
		}

		var findSleepButton = function(starttime) {
			var cssClass = 'sleep_' + DATETIME.getFormattedTime(starttime);
			return document.getElementsByClassName(cssClass)[0];
		}

		var date = this.getDate();
		var formatteddate = DATETIME.getYyyymmddFormat(date);
		var that = this;
		var url = "services/BabyApi.php?action=loaddata&day="+formatteddate;
		UTILS.ajaxGetJson(url, function(json) {

			var datasets = DATA.getNewDatasetsForJsonData(json);
			var ds = datasets[0];
			for(var i = 0, len = sleepButtonList.length; i < len; i++) {
				var btn = sleepButtonList[i];
				var time = btn.classList[0].split('_')[1];
				if (ds && ds.getSleepAtTime(time)) {
					btn.setAttribute('style', 'color:#50c050');
					btn.innerText = 'Sleeping';
					btn.onclick = sleepClickHandlerIsSleeping;
				}
				else {
					btn.onclick = sleepClickHandlerNotSleeping;
					btn.setAttribute('style', 'color:black');
					btn.innerText = 'Not Sleeping';
				}
			}
		});
	}

	this.putFeedOptionsInSelect = function(selectEl, feedOptions) {
		for(var i = 0, len = feedOptions.length; i < len; i++) {
			var feedVal = feedOptions[i];
			var opt = document.createElement('option');
			opt.setAttribute('value', feedVal);
			opt.innerHTML = feedVal;
			selectEl.appendChild(opt);
		}
	}

	this.generateFeedOptions = function() {
		var options = ['none', 'BL', 'BR'];
		for(var i = 50; i <= 95; i+=5) options.push(i);
		return options;
	}

	this.setDate = function(date, addDays) {
		if (addDays != undefined) {
			date.setDate(date.getDate()+addDays);
		}
		this.curDate = date;
		var formatted = DATETIME.getDateFormatForDay(date);
		var dateEl = this.getDateEl();
		dateEl.innerText = formatted;
	}
	this.getDate = function() {
		return this.curDate;
	}
	this.setDateEl = function(dateEl) {
		this.dateEl = dateEl;
	}
	this.getDateEl = function() {
		return this.dateEl;
	}
	this.setContainer = function(container) {
		this.container = container;
	}	
	this.getContainer = function() {
		return this.container;
	}

	this.init = function(date, containerEl, btnBack, btnFwd, dateEl) {
		this.setDateEl(dateEl);
		this.setContainer(containerEl);
		this.setDate(date);
		var that = this;
		btnBack.onclick = function(e) {
			that.setDate(that.getDate(), -1);
			that.loadData();
		}
		btnFwd.onclick = function(e) {
			that.setDate(that.getDate(), +1);
			that.loadData();
		}
		this.generateTable();
		this.loadData();
	}
}
