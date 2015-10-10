var APP = APP || {};

/**
* Main class for the Entry Page
*/
APP.EntryPage = function() {

	/*
	var sleepButtonList = [];
	var peeButtonList = [];
	var pooButtonList = [];
	*/
	var buttonList = [];
	/*
	buttonLists.push(sleepButtonList);
	buttonLists.push(peeButtonList);
	buttonLists.push(pooButtonList);
	*/
	var that = this;

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

	var peeHandlerClickAddPee = function(e) {
		var mystartdate = getSleepClickStartDate(e);
		var formatteddate = DATETIME.getYyyymmddFormat(mystartdate) + ' ' + DATETIME.getFormattedTime(mystartdate.getHours(), mystartdate.getMinutes());
		UTILS.ajaxGetJson("services/BabyApi.php?action=addvalue&type=diaper&value=1&time="+formatteddate, function(json) {
			that.loadData();
		});
	}
	var peeHandlerClickRemovePee = function(e) {
		var mystartdate = getSleepClickStartDate(e);
		var formatteddate = DATETIME.getYyyymmddFormat(mystartdate) + ' ' + DATETIME.getFormattedTime(mystartdate.getHours(), mystartdate.getMinutes());
		UTILS.ajaxGetJson("services/BabyApi.php?action=removevalue&type=diaper&value=1&time="+formatteddate, function(json) {
			that.loadData();
		});
	}
	var pooHandlerClickAddPoo = function(e) {
		var mystartdate = getSleepClickStartDate(e);
		var formatteddate = DATETIME.getYyyymmddFormat(mystartdate) + ' ' + DATETIME.getFormattedTime(mystartdate.getHours(), mystartdate.getMinutes());
		UTILS.ajaxGetJson("services/BabyApi.php?action=addvalue&type=diaper&value=2&time="+formatteddate, function(json) {
			that.loadData();
		});
	}
	var pooHandlerClickRemovePoo = function(e) {
		var mystartdate = getSleepClickStartDate(e);
		var formatteddate = DATETIME.getYyyymmddFormat(mystartdate) + ' ' + DATETIME.getFormattedTime(mystartdate.getHours(), mystartdate.getMinutes());
		UTILS.ajaxGetJson("services/BabyApi.php?action=removevalue&type=diaper&value=2&time="+formatteddate, function(json) {
			that.loadData();
		});
	}

	var getSleepClickStartDate = function(e) {
		var mystartdate = new Date(that.pageState.getDate().getTime());
		var time = e.target.parentElement.parentElement.childNodes[0].innerText;
		var timeDate = DATETIME.parse24HrTime(time);
		mystartdate.setMinutes(timeDate.getMinutes());
		mystartdate.setHours(timeDate.getHours());
		mystartdate.setSeconds(0);
		return mystartdate;
	}

	var generateAllTimes = function() {
		var rowCount = 24*UTILS.HOURLY_DIVISIONS;
		var times = [];
		for (var i = 0; i < rowCount; i++) {
			var timeField = DATETIME.getTimeFromRange(UTILS.HOURLY_DIVISIONS, i);
			times.push(timeField);
		}

		return times;
	}

	var populateTimeComboBox = function(element, times) {
		for(var i = 0, len = times.length; i < len; i++) {
			var time = times[i];
			var opt = document.createElement('option');
			opt.innerText = time;
			opt.value = time;
			element.appendChild(opt);
		}
	}

	var submitSleepRange = function(e) {
	}

	/**
	* Init the page
	*/
	this.init = function(date, containerEl, btnBack, btnFwd, dateEl, startRangeCombo, endRangeCombo, btnSubmitDateRange) {
		var pageState = new this.PageState();
		this.pageState = pageState;
		this.pageState.setDateEl(dateEl);
		this.pageState.setContainer(containerEl);
		this.pageState.setStartRangeEl(startRangeCombo);
		this.pageState.setEndRangeEl(endRangeCombo);
		this.pageState.setDate(date);
		document.onkeydown = function(e) {
			// handle keypresses
			switch(e.keyIdentifier) {
				case "Left":
					btnBack.click();	
					break;
				case "Right":
					btnFwd.click();
					break;
			}
			if (e.keyIdentifier == 'Left') {
			}
			console.log(e);
		}
		btnBack.onclick = function(e) {
			pageState.setDate(pageState.getDate(), -1);
			that.loadData();
		}
		btnFwd.onclick = function(e) {
			pageState.setDate(pageState.getDate(), +1);
			that.loadData();
		}
		btnSubmitDateRange.onclick = function(e) {
			var starttime = pageState.getStartRangeEl().value;
			var endtime = pageState.getEndRangeEl().value;
			var date = pageState.getDate();
			var formattedstart = DATETIME.getYyyymmddFormat(date) + ' ' + starttime;
			var formattedend = DATETIME.getYyyymmddFormat(date) + ' ' + endtime;
			UTILS.ajaxGetJson("services/BabyApi.php?action=sleep&sleepstart="+formattedstart+"&sleepend="+formattedend, function(json) {
				that.loadData();	
			});

		}

		var timesThroughDay = generateAllTimes();
		generateTable(timesThroughDay);
		populateTimeComboBox(startRangeCombo, timesThroughDay);
		populateTimeComboBox(endRangeCombo, timesThroughDay);
		this.loadData();
	}

	var assignButtonClass = function(column, button, timeval) {
		switch(column) {
			case 1:
				button.setAttribute('class', 'sleep_'+timeval);
				break;
			case 2:
				button.setAttribute('class', 'pee_'+timeval);
				break;
			case 3:
				button.setAttribute('class', 'poo_'+timeval);
				break;
		}
	}

	/**
	* Generate the table of buttons and such
	*/
	var generateTable = function(times) {

		var putFeedOptionsInSelect = function(selectEl, feedOptions) {
			for(var i = 0, len = feedOptions.length; i < len; i++) {
				var feedVal = feedOptions[i];
				var opt = document.createElement('option');
				opt.setAttribute('value', feedVal);
				opt.innerHTML = feedVal;
				selectEl.appendChild(opt);
			}
		}

		var generateFeedOptions = function() {
			var options = ['none', 'BL', 'BR'];
			for(var i = 50; i <= 95; i+=5) options.push(i);
			return options;
		}

		var table = document.createElement('table');
		var buttonText = ['sleep', 'pee', 'poo'];
		var rowCount = 24*UTILS.HOURLY_DIVISIONS;
		var nonButtonColumns = 2;
		var colCount = buttonText.length + nonButtonColumns;
		var feedOptions = generateFeedOptions();

		for(var i = 0; i < rowCount; i++) {
			var timeField = times[i];
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
					assignButtonClass(j, button, timeField);
					buttonList.push(button);
					button.innerHTML = buttonText[j-1];
					td.appendChild(button);
				}
				else {
					var feedBox = document.createElement('select');
					putFeedOptionsInSelect(feedBox, feedOptions);
					td.appendChild(feedBox);
				}
			}
		}
		container.appendChild(table);
	};

	/**
	* Load data into the page (internally finds the appropriate date)
	*/
	this.loadData = function() {

		var date = this.pageState.getDate();
		var formatteddate = DATETIME.getYyyymmddFormat(date);
		var clearButtonStyle = function(button) {
			button.setAttribute('style', 'color:black');
		}
		var setActiveButtonStyle = function(button) {
			button.setAttribute('style', 'color:#50c050');
		}


		UTILS.ajaxGetJson("services/BabyApi.php?action=loaddata&day="+formatteddate, function(json) {

			var datasets = DATA.getNewDatasetsForJsonData(json);
			var ds = datasets[0];
			for(var i = 0, len = buttonList.length; i < len; i++) {
				var btn = buttonList[i];
				var btnClassSplit = btn.classList[0].split('_');
				var btnType = btnClassSplit[0];
				var time = btnClassSplit[1];
				clearButtonStyle(btn);
				switch(btnType) {
					case 'sleep':
						if (ds && ds.getSleepAtTime(time)) {
							setActiveButtonStyle(btn);
							btn.innerText = 'Sleeping';
							btn.onclick = sleepClickHandlerIsSleeping;
						}
						else {
							btn.onclick = sleepClickHandlerNotSleeping;
							btn.innerText = 'Not Sleeping';
						}
						break;
					case 'pee':
						if (ds && ds.getPeeAtTime(time)) {
							setActiveButtonStyle(btn);
							btn.onclick = peeHandlerClickRemovePee;
						}
						else {
							btn.onclick = peeHandlerClickAddPee;
						}
						break;
					case 'poo':
					debugger;
						if (ds && ds.getPooAtTime(time)) {
							setActiveButtonStyle(btn);
							btn.onclick = pooHandlerClickRemovePoo;
						}
						else {
							btn.onclick = pooHandlerClickAddPoo;
						}
						break;
				}
			}

		});

	}

	/**
	* Basically for keeping track of the state of the page
	*/
	this.PageState = function() {

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
		this.setStartRangeEl = function(cboStartRange) {
			this.cboStartRange = cboStartRange
		}
		this.setEndRangeEl = function(cboEndRange) {
			this.cboEndRange = cboEndRange
		}
		this.getStartRangeEl = function() {
			return this.cboStartRange;
		}
		this.getEndRangeEl = function() {
			return this.cboEndRange;
		}
	}

}
