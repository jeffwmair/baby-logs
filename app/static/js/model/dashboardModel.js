(function(window) {
    'use strict'

    function Model() {
    }

    /**
     * Reads the model from storage
     */
    Model.prototype.read = function(callback) {
        UTILS.ajax("BabyApi?action=loadDashboard", callback);
    }

    Model.prototype.summarizeData = function(callback) {
        UTILS.ajax("BabyApi?action=summarize_data", callback);
    }

    window.dashboard = window.dashboard || {};
    window.dashboard.Model = Model;

})(window);
