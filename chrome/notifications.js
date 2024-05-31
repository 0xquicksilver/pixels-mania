function crateNotifications(message) {
    const notify = document.createElement('div')
    notify.id = 'pixel-mania-notifications'
    notify.style = "position: absolute; top: 2rem; right: 0; left: 0; display: flex; background-color: transparent; border: none; outline: none; z-index: 9999999; justify-content: center; align-items: center;"
    notify.innerHTML = `<div style=" padding: 20px 30px; background-color: blanchedalmond; border-radius: 10px; " > ${message} </div>`
    document.body.appendChild(notify)
    setTimeout(removeNotifications, 3000)
}

function removeNotifications() {
    document.getElementById('pixel-mania-notifications')?.remove()
}