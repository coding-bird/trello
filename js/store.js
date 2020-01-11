(function () {
  const storeKey = 'taskManager_monika'

  const getFromStorage = function () {
    let data
    try {
      data = JSON.parse(window.localStorage.getItem(storeKey)) || []
    } catch {
      console.error("error occurred while fetching data from storage")
      data = []
    }
    return data
  }

  const addToStorage = function (data) {
    try {
      window.localStorage.setItem(storeKey, JSON.stringify(data))
    } catch {
      console.error("Error occurred while setting data to storage")
    }
  }
  window.taskManager = window.taskManager || {}
  window.taskManager.store = {
    getFromStorage,
    addToStorage
  }
})()

