

async function initStorage(player) {
    var constants = await loadJSONData('constants.json');
    const storage = document.createElement('div');
    storage.id = 'storage-elm'
    storage.className = nodeNames.pixel_mania_timer.replace('.', '');

    const addStorageButton = document.createElement('button');
    addStorageButton.style = styles.addStorageButton;
    addStorageButton.innerHTML = innerHtmls.addStorageButton;
    addStorageButton.addEventListener('click', handleAddstorage);

    storage.appendChild(addStorageButton);

    const storages = document.createElement('div');
    storages.className = 'hide-scrollbar ' + nodeNames.pixel_mania_lands.replace('.', '');
    player.storages.forEach((storageData) => {
        const storageElm = document.createElement('div');
        storageElm.setAttribute('data-key', storageData.storageId);
        storageElm.className = nodeNames.pixel_mania_land.replace('.', '');
        const closeButton = document.createElement('button');
        const reloadButton = document.createElement('button')
        reloadButton.style = styles.reloadButton
        reloadButton.innerHTML = innerHtmls.reloadButton
        reloadButton.addEventListener('click', () => {
            handleReloadStorage(storageData.storageId)
        })

        closeButton.style = styles.closeButton;
        closeButton.innerHTML = innerHtmls.closeButton;
        closeButton.addEventListener('click', () => {
            removeStorageItem(storageData)
        })

        const storage_name = document.createElement('span');
        storage_name.textContent = storageData.storageName;
        const IventoryElement = document.createElement('div');
        IventoryElement.className = nodeNames.pixel_mania_industries.replace('.', '');

        storageData.items.forEach((item) => {
            const storageItem = document.createElement('div')
            storageItem.style = styles.industry;
            const storage_backpack = document.createElement('img');
            const img = document.createElement('img');
            // images
            storage_backpack.src = 'https://d31ss916pli4td.cloudfront.net/game/ui/backpack/backpack_button_slot.png';
            storage_backpack.style = styles.industry_backpack;
            if (item.images) {
                const isMatch = constants.some((constan) => constan.averageColor === item.averageColor)
                if (isMatch) {
                    img.src = constants.find((constan) => constan.averageColor === item.averageColor).images
                }
            }
            img.style = "height: 2.5rem; position: absolute;";
            storageItem.appendChild(storage_backpack)
            storageItem.appendChild(img)

            if (item.quantity) {
                const quantity = document.createElement('span')
                quantity.style = "position: absolute;font-size: 11px;bottom: 11px;right: 10px;"
                quantity.innerText = item.quantity
                storageItem.appendChild(quantity)
            }
            IventoryElement.appendChild(storageItem)
        })
        storageElm.appendChild(storage_name)
        storageElm.appendChild(reloadButton)
        storageElm.appendChild(closeButton)
        storageElm.appendChild(IventoryElement);
        storages.appendChild(storageElm)
    })

    storage.appendChild(storages)
    document.querySelector(nodeNames.pixel_mania_sidebar_content).appendChild(storage);
}
function removeStorage() {
    document.getElementById('storage-elm')?.remove()
}