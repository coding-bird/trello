(function () {
    function TaskManager() {
        let taskManager = window.taskManager || {}
        this.store = taskManager.store
        this.model = new taskManager.Model(this.store)
        this.view = new taskManager.View()
        this.controller = new taskManager.Controller(this.model, this.view)
    }
    var app = new TaskManager()

})()