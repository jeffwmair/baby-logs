var APP = APP || {};

/**
* Main class for the Entry Page
*/
APP.EntryPage = function() {

	var COLOR_CURRENT_TIME_ROW = "#FAFAA9";
	var COLOR_CURRENT_TIME_ROW_NIGHT = "blue";

	var buttonList = [];
	var that = this;

	var feedClickHandler = function(e) {
		var mystartdate = getSleepClickStartDate(e);
		var formatteddate = DATETIME.getYyyymmddFormat(mystartdate) + ' ' + DATETIME.getFormattedTime(mystartdate.getHours(), mystartdate.getMinutes());
		var amt = e.target.value;
		UTILS.ajaxGetJson("services/BabyApi.php?action=feed&amount="+amt+"&time="+formatteddate, function(json) {
			that.loadData();
		});
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

	var setPageDayNightColor = function() {
		var hr = (new Date()).getHours();
		var isNight = hr > 20 || hr < 7;
		var pageBody = document.getElementsByTagName('body')[0];
		if (isNight) {
			pageBody.setAttribute('style', 'color:white;background-color:black');
		}
		else {
			pageBody.setAttribute('style', 'color:black;background-color:white');
		}

		var color = isNight ? COLOR_CURRENT_TIME_ROW_NIGHT : COLOR_CURRENT_TIME_ROW;
		highlightMostRecentTimeBlockRow(color);
	}

	var scrollToCurrentTime = function() {
		var time = getMostRecentTimeBlock();
		var timeElement = document.getElementById('td_'+time);
		console.log('scrolling element:'+timeElement);
		timeElement.scrollIntoView({behavior:"smooth", block:"start"});
	}


	/**
	* Init the page
	*/
	this.init = function(date, containerEl, btnBack, btnFwd, dateEl) {
		var pageState = new this.PageState();
		this.pageState = pageState;
		this.pageState.setDateEl(dateEl);
		this.pageState.setContainer(containerEl);
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

		var timesThroughDay = generateAllTimes();
		generateTable(timesThroughDay);
		this.loadData(true);
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
			case 4:
				button.setAttribute('class', 'feed_'+timeval);
				break;
		}
	}

	/**
	* Generate the table of buttons and such
	*/
	var generateTable = function(times) {

		var putFeedOptionsInSelect = function(selectEl, feedOptions) {
			feedOptions.forEach(function(feedVal) {
				var opt = document.createElement('option');
				opt.setAttribute('value', feedVal);
				opt.innerHTML = feedVal;
				selectEl.appendChild(opt);
			});
		}

		var generateFeedOptions = function() {
			var options = ['none', 'BL', 'BR'];
			for(var i = 50; i <= 80; i+=10) options.push(i);
			for(var i = 85; i <= 140; i+=5) options.push(i);
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
					var feedBox = document.createElement('select');
					assignButtonClass(j, feedBox, timeField);
					buttonList.push(feedBox);
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
	this.loadData = function(scrollToTime) {

		var date = this.pageState.getDate();
		var formatteddate = DATETIME.getYyyymmddFormat(date);
		var clearButtonStyle = function(button) {
			button.setAttribute('style', 'background-color:none');
		}
		var setActiveButtonStyle = function(button) {
			button.setAttribute('style', 'background-color:#50c050');
		}

		UTILS.ajaxGetJson("services/BabyApi.php?action=loaddata&day="+formatteddate, function(json) {

			//highlight current time row
			setPageDayNightColor();

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
					case 'feed':
						btn.onchange = feedClickHandler;
						if (ds && ds.getFeedAtTime(time)) {
							setActiveButtonStyle(btn);
							btn.value = ds.getFeedAtTime(time).getValue();
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
	}

}