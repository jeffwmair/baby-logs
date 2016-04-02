APP.SleepEntryDialog = function() {

	var API = "BabyApi";
	var that = this;

	var createDivWithClass = function(classname) {
		var el = document.createElement('div')
		el.setAttribute('class', classname);
		return el;
	}

	var createDialog = function() {

		var divOuter = createDivWithClass('modal fade');
		divOuter.setAttribute('id', 'sleepDialog');
		divOuter.setAttribute('tabindex', '-1');
		divOuter.setAttribute('role', 'dialog');
		divOuter.setAttribute('aria-labelledby', 'myModalLabel');

		var divDialog = createDivWithClass('modal-dialog');
		divDialog.setAttribute('role', 'document');

		var divContent = createDivWithClass('modal-content');

		var divHeader = createDivWithClass('modal-header');
		var divBody = createDivWithClass('modal-body');
		var divFooter = createDivWithClass('modal-footer');

		divOuter.appendChild(divDialog);
		divDialog.appendChild(divContent);
		divContent.appendChild(divHeader);
		divContent.appendChild(divBody);
		divContent.appendChild(divFooter);

		var body = document.getElementsByTagName('body')[0];
		body.appendChild(divOuter);
					/*
			<div class="modal fade" id="sleepDialog" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
				<div class="modal-dialog" role="document">
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
							<img src='static/images/babysleepicon.jpg' width="50px"/>
							<h4 class="modal-title" id="myModalLabel">Enter Sleep Range</h4>
						</div>
						<div class="modal-body">

						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
							<button id='btnSaveSleepRange' type="button" class="btn btn-primary" data-dismiss="modal">Save</button>
						</div>
					</div>
				</div>
			</div>
			*/


	}

	var errorHandler = function(errMsg) {
		var errDiv = that.pageState.getErrorDiv();
		errDiv.style.display = 'block';
		var errTextEl = that.pageState.getErrorText();	
		errTextEl.innerHTML = errMsg;
	}
	
	var intWithLeadingZero = function(intVal) {
		if (intVal > 9) return intVal;
		return '0' + intVal;
	}

	var addTimeHrOptionsToSelect = function(selectEl) {
		var val = 1;
		while (val <= 12) {
			var opt = document.createElement('option');
			opt.setAttribute('value', val);
			opt.innerHTML = intWithLeadingZero(val);
			selectEl.appendChild(opt);
			val += 1;
		}
	}

	var addTimeMinOptionsToSelect = function(selectEl) {
		var interval = 15; // 15 minutes
		var val = 0;
		while (val <= 60) {
			var opt = document.createElement('option');
			opt.setAttribute('value', val);
			opt.innerHTML = intWithLeadingZero(val);
			selectEl.appendChild(opt);
			val += interval;
		}
	}

	/**
	 * Grabs the time values from the dialog
	 */
	var getValuesFromDialogElements = function(dialog, elements) {
		var retVal = {};
		elements.forEach(function(item) { retVal[item]= dialog.querySelector('#'+item).value; });
		return retVal;
	}


	var setupSaveButtonHandler = function() {
		var btn = this.dialog.querySelector('#btnSaveSleepRange');
		btn.onclick = function(e) {
			var btn = e.target;
			var dialog = btn.parentElement.parentElement;
			var values = getValuesFromDialogElements(dialog, ['selectSleepStartHr', 
				'selectSleepStartMin',
				'selectSleepStartAmPm',
				'selectSleepEndHr',
				'selectSleepEndMin',
				'selectSleepEndAmPm']);
			console.log(values);
			// todo: get the start and end times, send to the server
			// then reload the page data

			var data = JSON.stringify(values);
			UTILS.ajaxGetJson(API + "?action=sleeprange&data="+data, errorHandler, function(json) {
				console.log("done!");
				//that.handleDataLoad(false, null, json);
			});

		}
	}

	var hookUpSleepRangeDialog = function() {
		addTimeHrOptionsToSelect(this.dialog.querySelector('#selectSleepStartHr'));
		addTimeHrOptionsToSelect(this.dialog.querySelector('#selectSleepEndHr'));
		addTimeMinOptionsToSelect(this.dialog.querySelector('#selectSleepStartMin'));
		addTimeMinOptionsToSelect(this.dialog.querySelector('#selectSleepEndMin'));
	}


	this.init = function(dialog) {
		createDialog();
		//setupSaveButtonHandler();	
		//hookUpSleepRangeDialog();
	}
}
