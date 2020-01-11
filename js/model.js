(function () {

    function Model(store) {
        this.getFromStorage = store.getFromStorage
        this.addToStorage = store.addToStorage
        this.lists = this.getFromStorage() || []
        console.log("asdna,d", this.lists)
    }

    Model.prototype.uid = function () {
        return Array(5).fill().map(i => Math.floor(Math.random() * (10 - 0)) + 0).join('')
    }
    Model.prototype.getLists = function () {
        return this.lists
    }
    Model.prototype.addList = function (list) {
        this.lists.push(list)
    }
    Model.prototype.getList = function (listID) {
        return this.lists.find(list => list.id == listID)
    }
    Model.prototype.getListIndex = function (listID) {
        return this.lists.findIndex(list => list.id == listID)
    }
    Model.prototype.removeList = function (listID) {
        this.lists.splice(this.getListIndex(listID), 1)
    }
    Model.prototype.updateListTitle = function (listID, title) {
        this.getList(listID).title = title
    }
    Model.prototype.addItem = function (listID, item) {
        this.getList(listID).items.push(item)
    }
    Model.prototype.getItemList = function (itemID) {
        let itemList
        this.lists.forEach(list => {
            list.items.forEach(item => {
                if (item.id == itemID) {
                    itemList = list
                }
            })
        })
        return itemList
    }
    Model.prototype.getItem = function (itemID) {
        return this.getItemList(itemID).items.find((item) => item.id == itemID)
    }
    Model.prototype.insertItem = function (listID, item, position) {
        this.getList(listID).items.splice(position, 0, item)
    }
    Model.prototype.updateItemTitle = function (itemID, title) {
        this.getItem(itemID).title = title
    }
    Model.prototype.removeItem = function (itemID) {
        this.getItemList(itemID).items.splice(this.getItemIndex(itemID), 1)
    }
    Model.prototype.getItemIndex = function (itemID) {
        return this.getItemList(itemID).items.findIndex((item) => item.id == itemID)
    }
    Model.prototype.updateStore = function () {
        this.addToStorage(this.lists)
    }
    window.taskManager = window.taskManager || {}
    window.taskManager.Model = Model
})()