(function(window) {
    'use strict'

    function Model() {
        var self = this;
        // default start date is now/today
        this.date = new Date();
    }

    /**
     * Get the selected date
     */
    Model.prototype.getDate = function() {
        return this.date;
    }

    Model.prototype.moveToNextDay = function(callback) {
        this.date = new Date(this.date.getTime() + 24*60*60*1000);
        this.read(callback);
    }

    Model.prototype.moveToPrevDay = function(callback) {
        this.date = new Date(this.date.getTime() - 24*60*60*1000);
        this.read(callback);
    }

    Model.prototype._handleData = function(error, json, callback) {

        if (error) {
            callback(error, json);
            return;
        }

        var self = this;
        self.data = {};
        var createArrIfNotThere = function(key) {
            if (self.data[key] == undefined) self.data[key] = []; 
        }

        var putData = function(key, type, item) {
            var timeKey = datetime.getTime(new Date(key));
            createArrIfNotThere(timeKey);
            self.data[timeKey][type] = item;
        }

        json.diapers.forEach(function(item)  {
            putData(item.time, 'diaper', item);
        });
        json.sleeps.forEach(function(item)  {
            putData(item.start, 'sleep', item);
        });
        json.fmlafeeds.forEach(function(item)  {
            putData(item.time, 'feed', item);
        });
        json.milkfeeds.forEach(function(item)  {
            putData(item.time, 'feed', item);
        });
        json.solidfoodfeeds.forEach(function(item)  {
            putData(item.time, 'feed', item);
        });

        callback.call(self, error, self.data, self.getDate());

    }

    var getFormattedDateForServerCall = function(date) {
        var use24HrFormat = true;
        return datetime.getYyyymmddFormat(date) + ' ' + datetime.getFormattedTime(date.getHours(), date.getMinutes(), use24HrFormat);
    }

    /**
     * Toggles the sleep state for that time
     */
    Model.prototype.toggleSleep = function(date, callback) {

        var self = this;

        // sort out the toggle direction
        var dateData = self.data[datetime.getTime(date)];
        var isRemoveSleep = (dateData && dateData.sleep);
        var apiAction = isRemoveSleep ? 'removesleep' : 'sleep';

        var gridDate = new Date(self.getDate());
        gridDate.setHours(date.getHours(), date.getMinutes(), 0);
        var formatteddate = getFormattedDateForServerCall(gridDate);
        var myEndDate = new Date(gridDate.getTime() + (15*60000));
        var formattedEndDate = getFormattedDateForServerCall(myEndDate);

        UTILS.ajax("BabyApi?action="+apiAction+"&sleepstart="+formatteddate+"&sleepend="+formattedEndDate, function(error, json) {
            self._handleData(error, json, callback);
        });
    }

    Model.prototype.setFeed = function(date, val, callback) {
        var self = this;

        // feed api is a little funny:
        var type = 'feed';
        var value = 'none';

        if (val != 'none') {
            var valsplit = val.split('-');
            type = valsplit[0]
            value = valsplit[1]
        }

        var datetime = self.getDate();
        datetime.setHours(date.getHours(), date.getMinutes());

        UTILS.ajax("BabyApi?action=addvalue&type="+type+"&value="+value+"&time="+getFormattedDateForServerCall(datetime), function(error, json) {
            self._handleData(error, json, callback);
        });
    }

    Model.prototype.setDiaper = function(date, val, callback) {
        var self = this;

        var datetime = self.getDate();
        datetime.setHours(date.getHours(), date.getMinutes());
        UTILS.ajax("BabyApi?action=addvalue&type=diaper&value="+val+"&time="+getFormattedDateForServerCall(datetime), function(error, json) {
            self._handleData(error, json, callback);
        });
    }

    /**
     * Reads the model from storage
     */
    Model.prototype.read = function(callback) {
        var self = this;
        UTILS.ajax("BabyApi?action=loadentrydata&day="+datetime.getYyyymmddFormat(self.date), function(error, json) {
            self._handleData(error, json, callback);	
        });

    }

    window.entry = window.entry || {};
    window.entry.Model = Model;

})(window);
