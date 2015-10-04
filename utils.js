UTILS = {};
UTILS.HOURLY_DIVISIONS = 4;
UTILS.get2DigitFormat = function(val) {
	return (val < 10) ? '0' + val : val;
}

UTILS.ajaxGetJson = function(url, callback) {
	// load data from server via ajax
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {

		if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
			if(xmlhttp.status == 200){
				var json = null;
				try {
					console.log(xmlhttp.responseText);
					json = JSON.parse(xmlhttp.responseText);
				} 
				catch (e) {
					console.warn(e);
				}
				callback(json);
			}
			else if(xmlhttp.status == 400) {
				alert('There was an error 400')
			}
			else {
				alert('something else other than 200 was returned')
			}
		}
	}

	var doAsync = true;
	xmlhttp.open("GET", url, doAsync);
	xmlhttp.send();
}
