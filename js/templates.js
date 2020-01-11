(function () {

    function app(lists) {
        return `<header class="header shadow">
                    <h3>Task Manager</h3>
                </header>
                <main class="main-cont">
                    ${(lists).reduce((acc, list) => acc += List(list), '')}
                    <button id="add-list" class="btn addlist">add</button>
                </main>`
    }

    function List({ id, title, items }) {
        return `<div class="list shadow">
                    <div class="header border-bottom">
                        <h4 id="list-${id}-title" class="no-margin show list-title">${title}</h4>
                        <input id="list-${id}-title-input" type="text" class="hide list-title-input" value="${title}" placeholder="Title">
                        <button id="remove-list-${id}" class="btn remove remove-list">x</button>
                    </div>
                    <div id="items-container-${id}" class="items-container">
                        ${items.reduce((acc, item) => acc += Item(item), '')}
                        <button id="add-item-${id}" class="btn add add-item droppable">add</button>
                    </div>
                </div>`
    }

    function Item({ id, title }) {
        return `<div id="item-${id}-title" class="item show droppable" draggable="true">
                    <p class="no-margin border">${title}</p>
                </div>
                <textarea id="item-${id}-title-input" class="hide border  item-input">${title}</textarea>`
    }

    window.taskManager = window.taskManager || {}
    window.taskManager.Templates = { app }
})()