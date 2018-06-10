(function(window) {
    'use strict'

    function View(template) {
        this.template = template;

        // view elements
        this.$entryGrid = qs('#entry-grid');
        this.$prevDayButton = qs('#btnBack');
        this.$nextDayButton = qs('#btnForward');
        this.$dayPickerDate = qs('#dayPickerDate');
        this.$errorDiv = qs('#errorDiv');
    }

    /**
     * Render the grid
     */
    View.prototype.render = function(error, gridData, date) {
        if (error) {
            // todo: use errorDiv
            alert(error);
            return;
        }
        this.$entryGrid.innerHTML = this.template.generateHtml(gridData);

        // get dynamic controls after binding
        this.$allSleepButtons = qsa('#entry-grid button');
        this.$allDiaperSelects = qsa('select.diaper');
        this.$allFeedSelects = qsa('select.feed');

        this.$dayPickerDate.innerHTML = datetime.getDateFormatForDay(date);
    }

    View.prototype.update = function(error, gridData, date) { 
        if (error) {
            alert(error);
            return;
        }
        this.template.updateHtml(this.$entryGrid, gridData);
        this.$dayPickerDate.innerHTML = datetime.getDateFormatForDay(date);
    }

    /**
     * Bind a dom event to a callback
     */
    View.prototype.bind = function(name, callback) {
        if (name === 'sleepButtonClick') {

            /**
             * Bind all the sleep toggle buttons.
             * When clicked, return the sleep data
             */
            this.$allSleepButtons.forEach(function(item) {
                $on(item, 'click', function() {
                    var sleepTime = datetime.parseAmPmTime(item.className.split('sleep_')[1]);
                    callback(sleepTime);
                });
            });

        }
        else if (name === 'setFeedValue') {
            /**
             * Bind all the feed value dropdowns.
             * When changed, return the data
             */
            this.$allFeedSelects.forEach(function(item) {
                $on(item, 'change', function() {
                    var sleepTime = datetime.parseAmPmTime(item.className.split('feed_')[1]);
                    callback(item.value, sleepTime);
                });
            });
        }
        else if (name === 'nextDay') {
            $on(this.$nextDayButton, 'click', function() {
                callback();
            });

            $on(window, 'keydown', function(e) {
                if (e.keyCode === 39) callback();
            });
        }
        else if (name==='prevDay'){
            $on(this.$prevDayButton, 'click', function() {
                callback();
            });

            $on(window, 'keydown', function(e) {
                if (e.keyCode === 37) callback();
            });
        }
        else if (name === 'setDiaperValue') {
    
            /**
             * Bind all the diaper value dropdowns.
             * When changed, return the data
             */
            this.$allDiaperSelects.forEach(function(item) {
                $on(item, 'change', function() {
                    var sleepTime = datetime.parseAmPmTime(item.className.split('diaper_')[1]);
                    callback(item.value, sleepTime);
                });
            });

        
        }
        else {
            throw 'Unexpected bind name:'+name;
        }
    }


    window.entry = window.entry || {};
    window.entry.View = View;

})(window);
