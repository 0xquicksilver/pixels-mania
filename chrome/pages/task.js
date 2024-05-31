function removeTask() {
    document.getElementById('tasks-elm')?.remove()
}
async function initTask(player) {
    const constants = await loadJSONData('constants.json');
    const tasksElement = document.createElement('div');
    tasksElement.id = 'tasks-elm'
    const taskElement = document.createElement('div');
    tasksElement.className = nodeNames.pixel_mania_land.replace('.', '');
    taskElement.className = nodeNames.pixel_mania_industries.replace('.', '');

    player.tasks.forEach((task) => {
        const taskItem = document.createElement('div')
        taskItem.style = styles.industry;
        const taskBackpack = document.createElement('img');
        const img = document.createElement('img');

        taskBackpack.src = 'https://d31ss916pli4td.cloudfront.net/game/ui/backpack/backpack_button_slot.png';
        taskBackpack.style = styles.industry_backpack;
        img.src = constants.find((constan) => constan.name.toLowerCase() === task.name.toLowerCase())?.images
        img.style = "height: 2.5rem; position: absolute;";
        taskItem.appendChild(taskBackpack)
        taskItem.appendChild(img)
        const quantity = document.createElement('span')
        quantity.style = "position: absolute;font-size: 11px;bottom: 11px;right: 10px;"
        quantity.innerText = task.quantity
        taskItem.appendChild(quantity)
        taskElement.appendChild(taskItem)
    })
    tasksElement.appendChild(taskElement)
    document.querySelector(nodeNames.pixel_mania_sidebar_content).appendChild(tasksElement);
}