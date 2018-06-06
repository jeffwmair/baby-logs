(function() {

    'use strict'

    function Page() {
        this.model = new entry.Model();	
        this.template = new entry.Template();	
        this.view = new entry.View(this.template);
        this.controller = new entry.Controller(this.model, this.view, new Date());
    }

    var page = new Page();

    function setView() {
        page.controller.setView();
    }

    $on(window, 'load', setView);

})();
