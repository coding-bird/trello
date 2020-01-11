(function () {
    function View() {
        this.templates = window.taskManager.Templates
    }

    View.prototype.render = function (lists) {
        document.querySelector('#app').innerHTML = this.templates.app(lists)
    }

    View.prototype.addEvent = function (elementID, event, handler) {
        document.getElementById(elementID).addEventListener(event, handler)
    }

    View.prototype.getElement = function (selector) {
        return document.querySelector(selector)
    }

    View.prototype.getElements = function (selector) {
        return document.querySelectorAll(selector)
    }

    View.prototype.showTitleInput = function (textID, inputID) {
        document.getElementById(textID).className = document.getElementById(textID).className.replace('show', 'hide')
        document.getElementById(inputID).className = document.getElementById(inputID).className.replace('hide', 'show')
        document.getElementById(inputID).focus()
    }

    View.prototype.setInputError = function (inputID) {
        this.querySelector('#' + inputID).className += this.getElement('#' + inputID).className.includes('input-error') ? '' : ' input-error'
    }
    window.taskManager = window.taskManager || {}
    window.taskManager.View = View
})()