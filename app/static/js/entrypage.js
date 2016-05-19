var APP = APP || {};

/**
* Main class for the Entry Page
*/
APP.EntryPage = function() {

	var NONE_VALUE = 'none';
	var API = "BabyApi";

	var buttonList = [];
	var that = this;

	that.FIFTEEN_MINUTES = 15*60000;
	
	/**
	 * Handle an error and place in the UI appropriately
	 */
	var errorHandler = function(errMsg) {
		var errDiv = that.pageState.getErrorDiv();
		errDiv.style.display = 'block';
		var errTextEl = that.pageState.getErrorText();	
		errTextEl.innerHTML = errMsg;
	}

	/**
	 * Format the date for a server call
	 */
	var getFormattedDateForServerCall = function(date) {
		var use24HrFormat = true;
		return DATETIME.getYyyymmddFormat(date) + ' ' + DATETIME.getFormattedTime(date.getHours(), date.getMinutes(), use24HrFormat);
	}

	var diaperClickHandler = function(e) {
		var mystartdate = getSleepClickStartDate(e);
		var formatteddate = getFormattedDateForServerCall(mystartdate);
		var diaperVal = e.target.value;
		UTILS.ajaxGetJson(API + "?action=addvalue&type=diaper&value="+diaperVal+"&time="+formatteddate, errorHandler, function(json) {
			that.handleDataLoad(false, null, json);
		});
	}

	var feedClickHandler = function(e) {
		var mystartdate = getSleepClickStartDate(e);
		var formatteddate = getFormattedDateForServerCall(mystartdate);
		var feedType = '';
		var feedValue = '';
		if (e.target.value == 'none') {
			feedType = 'feed';
			feedValue = 'none';
		}
		else {
			var argSplit = e.target.value.split('-');
			feedType = argSplit[0];
			feedValue = argSplit[1];
		}
		UTILS.ajaxGetJson(API + "?action=addvalue&type="+feedType+"&value="+feedValue+"&time="+formatteddate, errorHandler, function(json) {
			that.handleDataLoad(false, null, json);
		});
	}

	var sleepClickHandlerNotSleeping = function(e) {
		var mystartdate = getSleepClickStartDate(e);
		var myendate = new Date(mystartdate.getTime() + that.FIFTEEN_MINUTES);
		var formatteddate = getFormattedDateForServerCall(mystartdate);
		var formattedEndDate = getFormattedDateForServerCall(myendate);
		UTILS.ajaxGetJson(API + "?action=sleep&sleepstart="+formatteddate+"&sleepend="+formattedEndDate, errorHandler, function(json) {
			that.handleDataLoad(false, null, json);
		});
	}

	var sleepClickHandlerIsSleeping = function(e) {
		var mystartdate = getSleepClickStartDate(e);
		var formatteddate = getFormattedDateForServerCall(mystartdate);
		UTILS.ajaxGetJson(API + "?action=removesleep&sleepstart="+formatteddate, errorHandler, function(json) {
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
		var nowRoundedMs = DATETIME.getNextQuarterHourTime(now).getTime() - that.FIFTEEN_MINUTES;
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
				specialClass = 'feed_'+timeval;
				break;
		}
		button.setAttribute('class', specialClass);
	}

	/**
	* Generate the table of buttons and such
	*/
	var generateTable = function(times, tableEl) {

		/**
		 * Generate option elements and put in the given select
		 */
		var putOptionsInSelect = function(selectEl, options) {
			options.forEach(function(val) {
				var opt = document.createElement('option');
				opt.setAttribute('value', val);
				opt.innerHTML = val;
				selectEl.appendChild(opt);
			});
		}

		/**
		 * Generate all the possible feed options
		 */
		var generateFeedOptions = function() {
			var options = [ NONE_VALUE, 'milk-BL', 'milk-BR' ];
			var feedTypes = ['milk', 'formula', 'solid'];
			for(var h = 0; h < feedTypes.length; h++) {
				var min_amount = 50;
				if (h == 2) {
					min_amount = 10;
				}
				for(var i = min_amount; i <= 300; i+=10) options.push(feedTypes[h]+'-'+i);
			}
			return options;
		}

		/**
		 * Generate all the possible diaper options
		 */
		var generateDiaperOptions = function() {
			return [NONE_VALUE, 'pee', 'poo'];
		}

		var buttonText = ['sleep' ];
		var rowCount = 24*UTILS.HOURLY_DIVISIONS;
		var nonButtonColumns = 3;
		var colCount = buttonText.length + nonButtonColumns;
		var diaperOptions = generateDiaperOptions();
		var feedOptions = generateFeedOptions();

		var diaperBox = document.createElement('select');
		putOptionsInSelect(diaperBox, diaperOptions);
		var feedBox = document.createElement('select');
		putOptionsInSelect(feedBox, feedOptions);

		/**
		 * setup all the rows.  Alternatively we could hardcode the whole html document, which 
		 * would improve performance. But I like it this way.
		 */

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
					var diaperBoxLocal = diaperBox.cloneNode(true);
					assignButtonClass(j, diaperBoxLocal, timeField);
					buttonList.push(diaperBoxLocal);
					td.appendChild(diaperBoxLocal);
				}
				else if (j == 3) {
					var feedBoxLocal = feedBox.cloneNode(true);
					assignButtonClass(j, feedBoxLocal, timeField);
					buttonList.push(feedBoxLocal);
					td.appendChild(feedBoxLocal);
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
						btn.value = diaperVal;
					}
					else {
						btn.value = NONE_VALUE;
					}
					break;
				case 'feed':
					btn.onchange = feedClickHandler;
					if (ds && ds.getFeedAtTimeAny(time)) {
						setActiveButtonStyle(btn);
						var feedRecord = ds.getFeedAtTimeAny(time);
						var inputText = feedRecord.type +'-'+ feedRecord.value;
						btn.value = inputText;
					}
					else {
						btn.value = NONE_VALUE;
					}
					break;
			}
		}

		if (scrollToTime &&  date.getDayTime() == (new Date()).getDayTime()) {
			// scroll to current time
			var time = getMostRecentTimeBlock();
			var timeElement = document.getElementById('td_'+time);
			timeElement.scrollIntoView({behavior:"smooth", block:"start"});
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
