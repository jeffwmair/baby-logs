(function(window) {
    'use strict'

    function Controller(model, view, day) {
        this.model = model;
        this.view = view;
    }

    /**
     * Loads and initializes the view
     */
    Controller.prototype.setView = function() {
        var render = this.view.render.bind(this.view);
        this.model.read(function(error, data) {
            render(error, data);
        });
    }

    Controller.prototype.summarizeData = function() {
        var setDataIsSummarizedStatus = this.view.setDataIsSummarizedStatus.bind(this.view);
        this.model.summarizeData(function(data) {
            setDataIsSummarizedStatus(data);
        });
    }

    window.dashboard = window.dashboard || {};
    window.dashboard.Controller = Controller;

})(window);
