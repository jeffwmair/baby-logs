(function(window) {
    'use strict'

    function Controller(model, view, day) {
        this.model = model;
        this.view = view;
    }

    /**
     * Update the day
     */
    Controller.prototype.setDay = function(day) {
        this.day = day;
    }

    Controller.prototype._renderAndBindGrid = function(error, gridData, date) {
        this.view.render(error, gridData, this.model.getDate());

        // might be best to move this elsewhere, but it works here.
        $('#tblEntries').stickyTableHeaders({ fixedOffset : 50 });

        var update = this.view.update.bind(this.view);
        var toggleSleep = this.model.toggleSleep.bind(this.model);
        var setDiaper = this.model.setDiaper.bind(this.model);
        var setFeed = this.model.setFeed.bind(this.model);

        /* rendering must happen before binding so that we have all the elements that need to be bound */
        this.view.bind('sleepButtonClick', function(sleepTime) {

            // sleep button toggled
            toggleSleep(sleepTime, function(error, data) {
                update(error, data, this.getDate());
            });

        });

        this.view.bind('setDiaperValue', function(val, diaperTime) {
            setDiaper(diaperTime, val, function(error, data) {
                update(error, data, this.getDate());
            });
        });

        this.view.bind('setFeedValue', function(val, feedTime) {
            setFeed(feedTime, val, function(error, data) {
                update(error, data, this.getDate());
            });
        });
    }

    /**
     * Loads and initializes the view
     */
    Controller.prototype.setView = function() {

        var renderAndBindGrid = this._renderAndBindGrid.bind(this);
        var moveToNextDay = this.model.moveToNextDay.bind(this.model);
        var moveToPrevDay = this.model.moveToNextDay.bind(this.model);
        var update = this.view.update.bind(this.view);
        var bindView = this.view.bind.bind(this.view);

        this.model.read(function(error, gridData, date) {

            renderAndBindGrid(error, gridData, date);

            // bind the controls that never go away
            
            bindView('nextDay', function() {
                moveToNextDay(function(error, gridData, date) {
                    update(error, gridData, date);
                });
            });

            bindView('prevDay', function() {
                moveToPrevDay(function(error, gridData, date) {
                    update(error, gridData, date);
                });
            });
        });

    }

    window.entry = window.entry || {};
    window.entry.Controller = Controller;

})(window);
