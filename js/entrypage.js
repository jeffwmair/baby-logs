var APP = APP || {};

/**
* Main class for the Entry Page
*/
APP.EntryPage = function() {

	var API = "src/web/BabyApi.php";

	var buttonList = [];
	var that = this;

	var milkClickHandler = function(e) {
		var mystartdate = getSleepClickStartDate(e);
		var formatteddate = DATETIME.getYyyymmddFormat(mystartdate) + ' ' + DATETIME.getFormattedTime(mystartdate.getHours(), mystartdate.getMinutes(), true);
		var amt = e.target.value;
		UTILS.ajaxGetJson(API + "?action=feed&feedtype=milk&amount="+amt+"&time="+formatteddate, function(json) {
			that.handleDataLoad(false, null, json);
		});
	}

	var formulaClickHandler = function(e) {
		var mystartdate = getSleepClickStartDate(e);
		var formatteddate = DATETIME.getYyyymmddFormat(mystartdate) + ' ' + DATETIME.getFormattedTime(mystartdate.getHours(), mystartdate.getMinutes(), true);
		var amt = e.target.value;
		UTILS.ajaxGetJson(API + "?action=feed&feedtype=formula&amount="+amt+"&time="+formatteddate, function(json) {
			that.handleDataLoad(false, null, json);
		});
	}

	var sleepClickHandlerNotSleeping = function(e) {
		var mystartdate = getSleepClickStartDate(e);
		var myendate = new Date(mystartdate.getTime() + (15*60000));
		var formatteddate = DATETIME.getYyyymmddFormat(mystartdate) + ' ' + DATETIME.getFormattedTime(mystartdate.getHours(), mystartdate.getMinutes(), true);
		var formattedEndDate = DATETIME.getYyyymmddFormat(myendate) + ' ' + DATETIME.getFormattedTime(myendate.getHours(), myendate.getMinutes(), true);
		UTILS.ajaxGetJson(API + "?action=sleep&sleepstart="+formatteddate+"&sleepend="+formattedEndDate, function(json) {
			that.handleDataLoad(false, null, json);
		});
	}

	var sleepClickHandlerIsSleeping = function(e) {
		var mystartdate = getSleepClickStartDate(e);
		var formatteddate = DATETIME.getYyyymmddFormat(mystartdate) + ' ' + DATETIME.getFormattedTime(mystartdate.getHours(), mystartdate.getMinutes(), true);
		UTILS.ajaxGetJson(API + "?action=removesleep&sleepstart="+formatteddate, function(json) {
			that.handleDataLoad(false, null, json);
		});
	}

	var peeHandlerClickAddPee = function(e) {
		var mystartdate = getSleepClickStartDate(e);
		var formatteddate = DATETIME.getYyyymmddFormat(mystartdate) + ' ' + DATETIME.getFormattedTime(mystartdate.getHours(), mystartdate.getMinutes(), true);
		UTILS.ajaxGetJson(API + "?action=addvalue&type=diaper&value=1&time="+formatteddate, function(json) {
			that.handleDataLoad(false, null, json);
		});
	}
	var peeHandlerClickRemovePee = function(e) {
		var mystartdate = getSleepClickStartDate(e);
		var formatteddate = DATETIME.getYyyymmddFormat(mystartdate) + ' ' + DATETIME.getFormattedTime(mystartdate.getHours(), mystartdate.getMinutes(), true);
		UTILS.ajaxGetJson(API + "?action=removevalue&type=diaper&value=1&time="+formatteddate, function(json) {
			that.handleDataLoad(false, null, json);
		});
	}
	var pooHandlerClickAddPoo = function(e) {
		var mystartdate = getSleepClickStartDate(e);
		var formatteddate = DATETIME.getYyyymmddFormat(mystartdate) + ' ' + DATETIME.getFormattedTime(mystartdate.getHours(), mystartdate.getMinutes(), true);
		UTILS.ajaxGetJson(API + "?action=addvalue&type=diaper&value=2&time="+formatteddate, function(json) {
			that.handleDataLoad(false, null, json);
		});
	}
	var pooHandlerClickRemovePoo = function(e) {
		var mystartdate = getSleepClickStartDate(e);
		var formatteddate = DATETIME.getYyyymmddFormat(mystartdate) + ' ' + DATETIME.getFormattedTime(mystartdate.getHours(), mystartdate.getMinutes(), true);
		UTILS.ajaxGetJson(API + "?action=removevalue&type=diaper&value=2&time="+formatteddate, function(json) {
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
	this.init = function(date, tableEl, btnBack, btnFwd, dateEl) {
		var pageState = new this.PageState();
		this.pageState = pageState;
		this.pageState.setDateEl(dateEl);
		this.pageState.setTableEl(tableEl);
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
				specialClass = 'pee_'+timeval;
				break;
			case 3:
				specialClass = 'poo_'+timeval + ' ' + 'pee_' + timeval;
				break;
			case 4:
				specialClass = 'milk_'+timeval;
				break;
		}
		button.setAttribute('class', specialClass);
	}

	/**
	* Generate the table of buttons and such
	*/
	var generateTable = function(times, tableEl) {

		var putFeedOptionsInSelect = function(selectEl, milkOptions) {
			milkOptions.forEach(function(milkVal) {
				var opt = document.createElement('option');
				opt.setAttribute('value', milkVal);
				opt.innerHTML = milkVal;
				selectEl.appendChild(opt);
			});
		}

		var generateFeedOptions = function() {
			var options = ['none', 'BL', 'BR'];
			for(var i = 50; i <= 90; i+=10) options.push(i);
			for(var i = 95; i <= 200; i+=5) options.push(i);
			return options;
		}

		var buttonText = ['sleep', 'pee', 'poo'];
		var rowCount = 24*UTILS.HOURLY_DIVISIONS;
		var nonButtonColumns = 2;
		var colCount = buttonText.length + nonButtonColumns;
		var milkOptions = generateFeedOptions();

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
				else {
					var milkBox = document.createElement('select');
					assignButtonClass(j, milkBox, timeField);
					buttonList.push(milkBox);
					putFeedOptionsInSelect(milkBox, milkOptions);
					td.appendChild(milkBox);
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
					if (ds && ds.getPooAtTime(time)) {
						setActiveButtonStyle(btn);
						btn.onclick = pooHandlerClickRemovePoo;
					}
					else {
						btn.onclick = pooHandlerClickAddPoo;
					}
					break;
				case 'milk':
					btn.onchange = milkClickHandler;
					if (ds && ds.getFeedAtTime(time)) {
						setActiveButtonStyle(btn);
						btn.value = ds.getFeedAtTime(time).value;
					}
					else {
						btn.value = 'none';
					}
					break;
				case 'formula':
					btn.onchange = formulaClickHandler;
					if (ds && ds.getFeedAtTime(time)) {
						setActiveButtonStyle(btn);
						btn.value = ds.getFeedAtTime(time).value;
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
		UTILS.ajaxGetJson(API + "?action=loaddata&day="+formatteddate, function(json) {
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
	}

}
