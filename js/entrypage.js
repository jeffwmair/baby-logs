var APP = APP || {};

/**
* Main class for the Entry Page
*/
APP.EntryPage = function() {

	var API = "src/web/BabyApi.php";

	var buttonList = [];
	var that = this;
	
	var errorHandler = function(errMsg) {
		var errDiv = that.pageState.getErrorDiv();
		errDiv.style.display = 'block';
		var errTextEl = that.pageState.getErrorText();	
		errTextEl.innerHTML = errMsg;
	}

	var diaperClickHandler = function(e) {
		var mystartdate = getSleepClickStartDate(e);
		var formatteddate = DATETIME.getYyyymmddFormat(mystartdate) + ' ' + DATETIME.getFormattedTime(mystartdate.getHours(), mystartdate.getMinutes(), true);
		var diaperVal = e.target.value;
		UTILS.ajaxGetJson(API + "?action=addvalue&type=diaper&value="+diaperVal+"&time="+formatteddate, errorHandler, function(json) {
			that.handleDataLoad(false, null, json);
		});
	}

	var milkClickHandler = function(e) {
		var mystartdate = getSleepClickStartDate(e);
		var formatteddate = DATETIME.getYyyymmddFormat(mystartdate) + ' ' + DATETIME.getFormattedTime(mystartdate.getHours(), mystartdate.getMinutes(), true);
		var amt = e.target.value;
		UTILS.ajaxGetJson(API + "?action=addvalue&type=milk&value="+amt+"&time="+formatteddate, errorHandler, function(json) {
			that.handleDataLoad(false, null, json);
		});
	}

	var formulaClickHandler = function(e) {
		var mystartdate = getSleepClickStartDate(e);
		var formatteddate = DATETIME.getYyyymmddFormat(mystartdate) + ' ' + DATETIME.getFormattedTime(mystartdate.getHours(), mystartdate.getMinutes(), true);
		var amt = e.target.value;
		UTILS.ajaxGetJson(API + "?action=addvalue&type=formula&value="+amt+"&time="+formatteddate, errorHandler, function(json) {
			that.handleDataLoad(false, null, json);
		});
	}

	var sleepClickHandlerNotSleeping = function(e) {
		var mystartdate = getSleepClickStartDate(e);
		var myendate = new Date(mystartdate.getTime() + (15*60000));
		var formatteddate = DATETIME.getYyyymmddFormat(mystartdate) + ' ' + DATETIME.getFormattedTime(mystartdate.getHours(), mystartdate.getMinutes(), true);
		var formattedEndDate = DATETIME.getYyyymmddFormat(myendate) + ' ' + DATETIME.getFormattedTime(myendate.getHours(), myendate.getMinutes(), true);
		UTILS.ajaxGetJson(API + "?action=sleep&sleepstart="+formatteddate+"&sleepend="+formattedEndDate, errorHandler, function(json) {
			that.handleDataLoad(false, null, json);
		});
	}

	var sleepClickHandlerIsSleeping = function(e) {
		var mystartdate = getSleepClickStartDate(e);
		var formatteddate = DATETIME.getYyyymmddFormat(mystartdate) + ' ' + DATETIME.getFormattedTime(mystartdate.getHours(), mystartdate.getMinutes(), true);
		UTILS.ajaxGetJson(API + "?action=removesleep&sleepstart="+formatteddate, errorHandler, function(json) {
			that.handleDataLoad(false, null, json);
		});
	}

	var peeHandlerClickAddPee = function(e) {
		var mystartdate = getSleepClickStartDate(e);
		var formatteddate = DATETIME.getYyyymmddFormat(mystartdate) + ' ' + DATETIME.getFormattedTime(mystartdate.getHours(), mystartdate.getMinutes(), true);
		UTILS.ajaxGetJson(API + "?action=addvalue&type=diaper&value=1&time="+formatteddate, errorHandler, function(json) {
			that.handleDataLoad(false, null, json);
		});
	}
	var peeHandlerClickRemovePee = function(e) {
		var mystartdate = getSleepClickStartDate(e);
		var formatteddate = DATETIME.getYyyymmddFormat(mystartdate) + ' ' + DATETIME.getFormattedTime(mystartdate.getHours(), mystartdate.getMinutes(), true);
		UTILS.ajaxGetJson(API + "?action=removevalue&type=diaper&value=1&time="+formatteddate, errorHandler, function(json) {
			that.handleDataLoad(false, null, json);
		});
	}
	var pooHandlerClickAddPoo = function(e) {
		var mystartdate = getSleepClickStartDate(e);
		var formatteddate = DATETIME.getYyyymmddFormat(mystartdate) + ' ' + DATETIME.getFormattedTime(mystartdate.getHours(), mystartdate.getMinutes(), true);
		UTILS.ajaxGetJson(API + "?action=addvalue&type=diaper&value=2&time="+formatteddate, errorHandler, function(json) {
			that.handleDataLoad(false, null, json);
		});
	}
	var pooHandlerClickRemovePoo = function(e) {
		var mystartdate = getSleepClickStartDate(e);
		var formatteddate = DATETIME.getYyyymmddFormat(mystartdate) + ' ' + DATETIME.getFormattedTime(mystartdate.getHours(), mystartdate.getMinutes(), true);
		UTILS.ajaxGetJson(API + "?action=removevalue&type=diaper&value=2&time="+formatteddate, errorHandler, function(json) {
			that.handleDataLoad(false, null, json);
		});
	}

	var getSleepClickStartDate = function(e) {
		var mystartdate = new Date(that.pageState.getDate().getTime());
		var time = e.target.parentElement.parentElement.childNodes[0].innerText;
		var timeDate = DATETIME.parseAmPmTime(time);
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

	var getMostRecentTimeBlock = function() {
		var now = new Date();	
		var nowRoundedMs = DATETIME.getNextQuarterHourTime(now).getTime() - (15*60000);
		var nowRoundedDate = new Date(nowRoundedMs);
		var time = DATETIME.getTime(nowRoundedDate);
		return time;
	}

	var highlightMostRecentTimeBlockRow = function(color) {
		var time = getMostRecentTimeBlock();
		var timeElement = document.getElementById('td_'+time);
		var row = timeElement.parentElement;
		for(var i = 0, len = row.children.length; i < len; i++) {
			var td = row.children[i];
			td.setAttribute('style', 'background-color:'+color);
		}
	}

	var scrollToCurrentTime = function() {
		var time = getMostRecentTimeBlock();
		var timeElement = document.getElementById('td_'+time);
		timeElement.scrollIntoView({behavior:"smooth", block:"start"});
	}

	/**
	* Init the page
	*/
	this.init = function(date, tableEl, btnBack, btnFwd, dateEl, errorDiv, errorText) {
		var pageState = new this.PageState();
		this.pageState = pageState;
		this.pageState.setDateEl(dateEl);
		this.pageState.setTableEl(tableEl);
		this.pageState.setDate(date);
		this.pageState.setErrorEl(errorDiv, errorText);
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
		}
		btnBack.onclick = function(e) {
			pageState.setDate(pageState.getDate(), -1);
			that.loadData();
		}
		btnFwd.onclick = function(e) {
			pageState.setDate(pageState.getDate(), +1);
			that.loadData();
		}

		var timesThroughDay = generateAllTimes();
		generateTable(timesThroughDay, tableEl);
		this.loadData(true);
	}

	var assignButtonClass = function(column, button, timeval) {
		var specialClass = '';
		switch(column) {
			case 1:
				specialClass = 'sleep_'+timeval;
				break;
			case 2:
				specialClass = 'diaper_'+timeval;
				break;
			case 3:
				specialClass = 'milk_'+timeval;
				break;
			case 4:
				specialClass = 'formula_'+timeval;
				break;
		}
		button.setAttribute('class', specialClass);
	}

	/**
	* Generate the table of buttons and such
	*/
	var generateTable = function(times, tableEl) {

		var putFeedOptionsInSelect = function(selectEl, options) {
			options.forEach(function(val) {
				var opt = document.createElement('option');
				opt.setAttribute('value', val);
				opt.innerHTML = val;
				selectEl.appendChild(opt);
			});
		}

		// TODO: bring these ranges in from the database
		//
		var generateFormulaOptions = function() {
			var options = ['none'];
			for(var i = 50; i <= 90; i+=10) options.push(i);
			for(var i = 95; i <= 270; i+=5) options.push(i);
			return options;
		}

		var generateMilkOptions = function() {
			var options = ['none', 'BL', 'BR'];
			for(var i = 10; i <= 90; i+=10) options.push(i);
			for(var i = 95; i <= 280; i+=5) options.push(i);
			return options;
		}

		var generateDiaperOptions = function() {
			return ['none', 'pee', 'poo'];
		}

		var buttonText = ['sleep' ];
		var rowCount = 24*UTILS.HOURLY_DIVISIONS;
		var nonButtonColumns = 4;
		var colCount = buttonText.length + nonButtonColumns;
		var milkOptions = generateMilkOptions();
		var fmlaOptions = generateFormulaOptions();
		var diaperOptions = generateDiaperOptions();

		for(var i = 0; i < rowCount; i++) {
			var timeField = times[i];
			var tr = document.createElement('tr');
			tableEl.appendChild(tr);
			for(var j = 0; j < colCount; j++) {
				var td = document.createElement('td');
				tr.appendChild(td);
				if (j == 0) {
					td.innerText = timeField;
					td.setAttribute('id', 'td_'+timeField);
				}
				else if (j <= colCount-nonButtonColumns) {
					var button = document.createElement('button');
					assignButtonClass(j, button, timeField);
					buttonList.push(button);
					button.innerHTML = buttonText[j-1];
					td.appendChild(button);
				}
				else if (j == 2) {
					var diaperBox = document.createElement('select');
					assignButtonClass(j, diaperBox, timeField);
					buttonList.push(diaperBox);
					putFeedOptionsInSelect(diaperBox, diaperOptions);
					td.appendChild(diaperBox);
				}
				else if (j == 3) {
					var milkBox = document.createElement('select');
					assignButtonClass(j, milkBox, timeField);
					buttonList.push(milkBox);
					putFeedOptionsInSelect(milkBox, milkOptions);
					td.appendChild(milkBox);
				}
				else if (j == 4) {
					var fmlaBox = document.createElement('select');
					assignButtonClass(j, fmlaBox, timeField);
					buttonList.push(fmlaBox);
					putFeedOptionsInSelect(fmlaBox, fmlaOptions);
					td.appendChild(fmlaBox);
				}
			}
		}
	};

	this.handleDataLoad = function(scrollToTime, date, json) {

		var clearButtonStyle = function(button) {
			button.setAttribute('style', 'background-color:none');
		}
		var setActiveButtonStyle = function(button) {
			button.setAttribute('style', 'background-color:#50c050');
		}

		var datasets = CONVERTER.getNewDatasetsForJsonData(json);
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
						btn.onclick = sleepClickHandlerIsSleeping;
					}
					else {
						btn.onclick = sleepClickHandlerNotSleeping;
					}
					break;
				case 'diaper':
					btn.onchange = diaperClickHandler;
					if (ds && ds.getDiaperAtTimeAny(time)) {
						setActiveButtonStyle(btn);
						var diaperVal = ds.getDiaperAtTimeAny(time).value;
						//var diaperValText = 'pee';
						//if (diaperVal == '2' || diaperVal == '3') diaperValText = 'poo';
						btn.value = diaperVal;
					}
					else {
						btn.value = 'none';
					}
					break;
				case 'milk':
					btn.onchange = milkClickHandler;
					if (ds && ds.getFeedAtTime('milk', time)) {
						setActiveButtonStyle(btn);
						btn.value = ds.getFeedAtTime('milk', time).value;
					}
					else {
						btn.value = 'none';
					}
					break;
				case 'formula':
					btn.onchange = formulaClickHandler;
					if (ds && ds.getFeedAtTime('formula', time)) {
						setActiveButtonStyle(btn);
						btn.value = ds.getFeedAtTime('formula', time).value;
					}
					else {
						btn.value = 'none';
					}

					break;
			}
		}

		if (scrollToTime &&  date.getDayTime() == (new Date()).getDayTime()) {
			scrollToCurrentTime();
		}
	};

	/**
	* Load data into the page (internally finds the appropriate date)
	*/
	this.loadData = function(scrollToTime) {

		var date = this.pageState.getDate();
		var formatteddate = DATETIME.getYyyymmddFormat(date);
		UTILS.ajaxGetJson(API + "?action=loadentrydata&day="+formatteddate, errorHandler, function(json) {
			that.handleDataLoad(scrollToTime, date, json);
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
		this.setTableEl = function(table) {
			this.tableEl = table;
		}	
		this.getTableEl = function() {
			return this.tableEl;
		}
		this.setErrorEl = function(divEl, textEl) {
			this.errorDiv = divEl;
			this.errorText = textEl;
		}
		this.getErrorDiv = function() { 
			return this.errorDiv;
		}
		this.getErrorText = function() { 
			return this.errorText;
		}
	}

}
