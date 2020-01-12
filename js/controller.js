(function () {
    function Controller(model, view) {
        this.model = model
        this.view = view
        this.renderView()
    }

    Controller.prototype.renderView = function () {
        this.view.render(this.model.getLists())
        this.model.updateStore()
        this.setEventHandlers()
    }

    Controller.prototype.setEventHandlers = function () {
        this.view.addEvent('add-list', 'click', () => this.createList())

        this.view.getElements('.remove-list').forEach(ele => {
            this.view.addEvent(ele.id, 'click', () => this.removeList(ele.id.split('-')[2]))
        })
        this.view.getElements('.add-item').forEach(ele => {
            this.view.addEvent(ele.id, 'click', () => this.createItem(ele.id.split('-')[2]))
        })

        this.view.getElements('.list-title').forEach(list => {
            this.titleChange(list.id, list.id + '-input', 'list')
        })
        this.view.getElements('.item').forEach((item) => {
            this.titleChange(item.id, item.id + '-input', 'item')
            this.view.addEvent(item.id, 'dragstart', (event) => this.dragStarted(event, item.id))
            this.view.addEvent(item.id, 'dragend', (event) => this.dragEnded(event, item.id))
        })
        this.view.getElements('.droppable').forEach((element) => {
            this.view.addEvent(element.id, 'dragenter', (event) => this.dragEnter(event))
        })
    }

    Controller.prototype.titleChange = function (textID, inputID, type) {
        let elementID = textID.split('-')[1]
        this.view.addEvent(textID, 'click', () => this.view.showTitleInput(textID, inputID))
        this.view.addEvent(inputID, 'blur', () => this.changeElementTitle(type, elementID, this.view.getElement('#' + inputID).value))
        if (type === 'list') {
            this.view.addEvent(inputID, 'keyup', (e) => e.code === 'Enter' && this.changeElementTitle(type, elementID, this.view.getElement(`#${inputID}`).value))
        }
    }
    Controller.prototype.createList = function () {
        this.model.addList({
            id: this.model.uid(),
            title: 'List',
            items: [],
        })
        this.renderView()
    }

    Controller.prototype.removeList = function (listID) {
        this.model.removeList(listID)
        this.renderView()
    }

    Controller.prototype.createItem = function (listID) {
        this.model.addItem(listID, {
            id: this.model.uid(),
            title: 'add task'
        })
        this.renderView()
    }

    Controller.prototype.removeItem = function (itemID) {
        this.model.removeItem(itemID)
        this.renderView()
    }

    Controller.prototype.changeElementTitle = function (type, id, value) {
        if (value === '') {
            if (type === 'list') {
                this.view.setInputError(`list-${id}-title-input`)
            } else {
                this.removeItem(id)
            }
        } else {
            if (type === 'list') {
                this.model.updateListTitle(id, value)
            } else if (type === 'item') {
                this.model.updateItemTitle(id, value)
            }
            this.renderView()
        }
    }

    Controller.prototype.dragStarted = function (event, id) {
        event.dataTransfer.setData('id', id)
        event.dataTransfer.dropEffect = 'move'
        event.currentTarget.style.opacity = '0.6'
    }

    Controller.prototype.dragEnded = function (event, itemID) {
        if (document.querySelector('.drag-preview')) {
            document.querySelector('.drag-preview').remove()
        }
        event.target.style.opacity = '1'
    }

    Controller.prototype.dragEnter = function (event) {
        if (event.dataTransfer.types.includes('id') && !isPreview(event.fromElement) && !isSelected(event.currentTarget) && !previousIsSelected(event.currentTarget)) {
            event.preventDefault();
            event.currentTarget.parentNode.insertBefore(this.createDragPreview(), event.currentTarget)
        }
    }

    function isPreview(element) {
        return element && element.className === 'drag-preview'
    }

    function isSelected(element) {
        return element && element.style && element.style.opacity === '0.6'
    }

    function previousIsSelected(element) {
        let children = Array.from(element.parentNode.children)
        let currentTargetIndex = children.findIndex(ele => ele == element)
        let currentTargetLasttoLast = children[currentTargetIndex - 2]
        return currentTargetIndex !== 0 && currentTargetLasttoLast.style.opacity === '0.6'
    }

    Controller.prototype.createDragPreview = function () {
        document.querySelectorAll('.drag-preview').forEach(element => element.remove())
        let previewElement = document.createElement('div')
        previewElement.className = 'drag-preview'
        previewElement.innerHTML = '<div class="dashed"></>'
        previewElement.ondragover = (event) => event.preventDefault()
        previewElement.ondragleave = (event) => event.currentTarget.remove()
        previewElement.ondrop = (event) => this.dragDropped(event)
        return previewElement
    }

    Controller.prototype.dragDropped = function (event) {
        let sourceItemID = event.dataTransfer.getData('id').split('-')[1]
        let sourceItem = Object.assign({}, this.model.getItem(sourceItemID))
        let targetListID = event.currentTarget.parentNode.id.split('-')[2]
        let targetPosition = this.targetPosition(event, sourceItemID, targetListID)
        this.model.removeItem(sourceItemID)
        this.model.insertItem(targetListID, sourceItem, targetPosition)
        this.renderView()
    }

    Controller.prototype.targetPosition = function (event, sourceItemID, targetListID) {
        if (nextIsItem()) {
            let targetItemID = event.currentTarget.nextSibling.id.split('-')[1]
            let sourceListID = this.model.getItemList(sourceItemID).id
            if (targetListID === sourceListID && this.model.getItemIndex(sourceItemID) < this.model.getItemIndex(targetItemID)) {
                return this.model.getItemIndex(targetItemID) - 1
            } else {
                return this.model.getItemIndex(targetItemID)
            }
        } else {
            return this.model.getList(targetListID).items.length
        }
    }

    function nextIsItem() {
        return !event.currentTarget.nextSibling.className.includes('add-item')
    }
    window.taskManager = window.taskManager || {}
    window.taskManager.Controller = Controller
})()