const eventTarget = new EventTarget();

function convertMinutesToTime(minutes) {
    // Ubah menit menjadi detik
    let totalSeconds = Math.round(minutes * 60);

    // Hitung jam
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;

    // Hitung menit
    let remainingMinutes = Math.floor(totalSeconds / 60);

    // Hitung detik
    let seconds = totalSeconds % 60;

    // Pad dengan nol untuk format dua digit
    let hoursStr = String(hours).padStart(2, '0');
    let minutesStr = String(remainingMinutes).padStart(2, '0');
    let secondsStr = String(seconds).padStart(2, '0');

    // Gabungkan ke format hh:mm:ss
    return `${hoursStr}:${minutesStr}:${secondsStr}`;
}

function addTimeToNow(timeString) {
    // Pecah string waktu menjadi bagian-bagian
    let [hours, minutes, seconds] = timeString.split(':').map(Number);

    // Konversi bagian-bagian waktu ke dalam milidetik
    let millisecondsToAdd = (hours * 3600 + minutes * 60 + seconds) * 1000;

    // Dapatkan waktu saat ini dalam milidetik
    let now = Date.now();

    // Tambahkan milidetik yang dikonversi ke waktu saat ini
    let newTime = new Date(now + millisecondsToAdd);

    return newTime.getTime();
}

function filterItemsByName(data, query) {
    const result = [];

    data.forEach(craft => {
        const filteredItems = craft.items.filter(item =>
            item.name.toLowerCase().includes(query.toLowerCase())
        );
        if (filteredItems.length > 0) {
            result.push({
                craft_name: craft.craft_name,
                craft_image: craft.craft_image,
                items: filteredItems
            });
        }
    });

    return result;
}

function filterItemsById(data, query) {
    const result = [];

    data.forEach(craft => {
        const filteredItems = craft.items.filter(item =>
            item.id.toLowerCase().includes(query.toLowerCase())
        );
        if (filteredItems.length > 0) {
            result.push({
                craft_name: craft.craft_name,
                craft_image: craft.craft_image,
                items: filteredItems
            });
        }
    });

    return result;
}
// var fs = require('fs')

// const data = JSON.parse(fs.readFileSync('industries.json'))
// // Contoh penggunaan
// const query = "popberry";
// const filteredData = filterItemsByName(data, query);
// console.log(filteredData);

function injectScript() {
    var script = document.createElement('script');
    script.src = browser.runtime.getURL('global.js');
    document.head.insertBefore(script, document.head.children[10]);
}

var handleToggle = () => {
    let sidebar = document.getElementById(nodeNames.sidebar)
    let toggle = document.getElementById(nodeNames.toggle)
    if (sidebar.className.includes("opened")) {
        sidebar.classList.remove("opened");
        sidebar.style.marginLeft = "-500px";
        sidebar.style.borderRight = 'none'
        toggle.style.opacity = 0.2
    } else {
        sidebar.classList.add("opened");
        sidebar.style.marginLeft = "0px";
        sidebar.style.borderRight = '3px solid var(--border-color)'
        toggle.style.opacity = 1
    }
}

function sendMessage(data, response) {
    return new Promise((resolve, reject) => {
        try {
            browser.runtime.sendMessage(data, (e) => {
                if (response) resolve(response(e));
                resolve(e)
            });
        } catch (error) {
            reject(error)
        }
    })
}

function startCountdown(targetTimestamp, node, notify) {
    const target = document.createElement('span')
    target.style = "font-size: 12px;"
    node.appendChild(target)
    function updateCountdown() {
        let now = Date.now();
        let timeDifference = targetTimestamp - now;

        if (timeDifference <= 0) {
            if(notify){
                crateNotifications(`congratulations finish! :v`)
            }
            target.innerText = 'ready'
            clearInterval(countdownInterval);
            return;
        }
        let hours = Math.floor(timeDifference / (1000 * 60 * 60));
        let minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
        let result = hours > 0 ? `${hours}h` : minutes > 0 ? `${minutes}m` : seconds > 0 ? `${seconds}s` : 'ready'
        target.innerText = result
    }

    updateCountdown();
    var countdownInterval = setInterval(updateCountdown, 1000);
}

const shortcut = async (e) => {
    try {
        let currentPlayer = await get_data('currentPlayer');

        // Periksa apakah tombol "Q" atau "Shift + q" ditekan
        if (e.key === "Q" || (e.key === "q" && e.shiftKey)) {
            const menus = Array.from(pixel_mania_menu.children);

            // Temukan index menu yang aktif saat ini
            menus.forEach((child, index) => {
                if (child.classList.contains('active')) {
                    currentIndex = index;
                }
            });

            // Tentukan index menu berikutnya
            const nextIndex = (currentIndex + 1) % menus.length;

            // Hapus kelas 'active' dari menu saat ini
            const currentMenu = menus[currentIndex];
            const nextMenu = menus[nextIndex];
            activemenu = currentMenu.id
            // Hapus inisialisasi menu saat ini berdasarkan ID
            removeStats();
            removeTimer();
            removeStorage();
            removeTask();

            currentMenu.classList.remove('active');
            nextMenu.classList.add('active');

            // Inisialisasi menu berikutnya berdasarkan ID
            if (nextMenu.id === 'stats') initStats(currentPlayer);
            if (nextMenu.id === 'timer') initTimer(currentPlayer);
            if (nextMenu.id === 'storage') initStorage(currentPlayer);
            if (nextMenu.id === 'task') initTask(currentPlayer);
        }
    } catch (error) {
        // console.error('Error in shortcut function:', error);
    }
};

const get_data = (key) => {
    return new Promise((resolve, reject) => {
        browser.storage.sync.get(key, (data) => {
            if (browser.runtime.lastError) {
                reject(browser.runtime.lastError);
            } else {
                resolve(data[key]);
            }
        });
    });
};


const set_data = (data) => new Promise((resolve, reject) => {
    try {
        browser.storage.sync.set(data);
        resolve('')
    } catch (error) {
        reject(error)
    }
})

const checkPlayers = async () => {
    removeTimer()
    removeStats()
    removeTask()
    removeStorage()
    try {
        const currentPlayer = await get_data('currentPlayer');
        if (currentPlayer) {
            initStats(currentPlayer);
            if (interval) {
                clearInterval(interval);
                interval = null;
            }
            document.querySelector(nodeNames.loader).style.display = 'none';
        }
    } catch (error) {
        // console.error('Error fetching players:', error);
    }
};

function add_button_delevery_all() {
    var new_button = document.createElement('button')
    new_button.innerText = 'Delevery all'
    new_button.style = 'font-size: 0.75rem;padding: 10px 10px;background-color: mediumblue;color: white;border-radius: 5px;'
    function delevery() {
        const delivery_button = document.querySelectorAll('[class*="Store_card-footer"]')
        const isReadyToDelevery = []
        delivery_button.forEach((button, i) => {
            if (button.children[1] && button.children[1].getAttribute('disabled') == null && button.children[1].textContent.trim() == 'DELIVER' && button.children[0].textContent.trim().toLowerCase() !== 'softwood') {
                isReadyToDelevery.push(button.children[1])
            }
        })
        
        isReadyToDelevery.forEach((ready, index) => {
            setTimeout(ready.click(), index * 2000)
        })
    }

    new_button.addEventListener('click', delevery)
    const list = document.querySelector('[class*="Store_items-header"]')
    if (list) {
        const exportTaskButton = document.createElement('button')
        exportTaskButton.innerText = 'Export Tasks'
        exportTaskButton.style = 'font-size: 0.75rem;padding: 10px 10px;background-color: mediumblue;color: white;border-radius: 5px;'
        exportTaskButton.addEventListener('click', handleExportTask)
        if (list.children.length > 1) return;
        list.appendChild(new_button)
        list.appendChild(exportTaskButton)
        // console.log(list.children)
    }
}

async function handleExportTask(){
    const isActive = activeMenu === 'task'
    if(isActive) removeTask();
    const currentPlayer = await get_data('currentPlayer')
    currentPlayer.tasks = exportTask()
    await updatePlayers(currentPlayer)
    if(isActive) await initTask(currentPlayer);
    crateNotifications('exoprt tasks done ')
}

function element_change_detection(targetNode, callback) {
    // Konfigurasi untuk MutationObserver
    const config = {
        attributes: false,   // Perubahan atribut
        childList: true,    // Perubahan pada child nodes (penambahan/penghapusan)
        subtree: true,      // Pengamatan subtree dari node target
        characterData: false // Perubahan pada data karakter dalam node
    };

    // Callback yang akan dipanggil ketika perubahan terdeteksi
    const observerCallback = function (mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'attributes') {
                // console.log(`Atribut ${mutation.attributeName} pada ${mutation.target} telah berubah.`);
            } else if (mutation.type === 'childList') {
                // console.log('Perubahan pada child nodes:', mutation.target.className);
                if (mutation.target.className.includes('Store_store-tabs-wrapper')) {
                    add_button_delevery_all()
                }
                if (mutation.target.className.includes('UIContainer_uiContainer')) {
                    // console.log('add node :', mutation.addedNodes)
                    // console.log('remove node :', mutation.removedNodes)
                    mutation.addedNodes.forEach((node) => {
                        if (node.className.includes('Store_storeDialog')) {
                            node.querySelector('.Store_box__j6_U4').style.width = '100%'
                            document.body.addEventListener('keydown', CloseModal);
                            setTimeout(() => node.querySelector('.Store_tabBuySell__TPRX5')?.children[1].click(), 2000)
                        }

                        if(node.className.includes('commons_modalBackdrop__EOPaN')){
                            const elementBox = document.querySelector('.Marketplace_items__Jw4De.commons_scrollArea__dCnqw')
                            if(elementBox){
                                
                            }
                        }
                    })
                    // Store_box__j6_U4 Store_modal-box-container__S2ExC commons_uikit__Nmsxg commons_frame__f5hXE commons_purpleinset___KfX2
                    mutation.removedNodes.forEach((node) => {
                        if (node.className.includes('Store_storeDialog')) {
                            document.removeEventListener('keydown', CloseModal);
                        }
                    })
                }
            } else if (mutation.type === 'characterData') {
                // console.log('Perubahan pada data karakter:', mutation);
            }
        }
        // Panggil callback yang diberikan pengguna
        if (callback) {
            callback(mutationsList);
        }
    };

    // Membuat instance MutationObserver
    const observer = new MutationObserver(observerCallback);

    // Memulai observasi pada targetNode dengan konfigurasi yang diberikan
    observer.observe(targetNode, config);

    // Mengembalikan fungsi untuk menghentikan observasi
    return function stopObservation() {
        observer.disconnect();
    };
}

async function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function CloseModal(event) {
    // const sidebar = document.getElementById('sidebar')
    if (event.key === 'x' || event.key === 'X') {
        document.querySelectorAll('button').forEach((x) => {
            if (x.className.toLowerCase().includes('close')) {
                return x.click()
            };
        })
    }
}

function LandModal(event) {
    // const sidebar = document.getElementById('sidebar')
    if (event.key === 'l' || event.key === 'L') {  // Memeriksa apakah tombol yang ditekan adalah 'K'
        document.querySelectorAll('button').forEach(async (x) => {
            if (x.children[0] && x.children[0].getAttribute('aria-label') === 'Land and Bookmarks') {
                x.click()
                await waitForElm('[class*="LandAndTravel_container"]')
                await waitForElm('[class*="LandAndTravel_tabs"]')
                const list = document.querySelector('[class*="LandAndTravel_tabs"]')
                if (list) {
                    list.children[2].click()
                }
            };
        })
    }
}

function calculateAverageColor(e) {
    let t = document.createElement("canvas"),
        n = t.getContext("2d");
    (t.width = e.width),
        (t.height = e.height),
        n.drawImage(e, 0, 0, e.width, e.height);
    let r = n.getImageData(0, 0, e.width, e.height).data,
        i = 0,
        l = 0,
        o = 0;
    for (let a = 0; a < r.length; a += 4)
        (i += r[a]), (l += r[a + 1]), (o += r[a + 2]);
    let s = r.length / 4,
        c = i / s,
        y = l / s,
        d = o / s,
        u = generateColorHash(c, y, d);
    return u;
}

function generateColorHash(e, t, n) {
    let r = `${Math.round(e)},${Math.round(t)},${Math.round(n)}`,
        i = 0;
    for (let l = 0; l < r.length; l++) {
        let o = r.charCodeAt(l);
        i = (i << 5) - i + o;
    }
    let a = (i >>> 0).toString(16);
    return a;
}

async function handleAddstorage() {
    const list = exportStorage()
    if (!list) return;
    const currentPlayer = await get_data('currentPlayer')
    const iventory_modal = document.createElement('div')
    iventory_modal.style = "position: absolute;display: flex;justify-content: center;align-items: center;top: 0%;left: 0;right: 0;backdrop-filter: blur(22px);bottom: 0;"
    const iventory_content = `<div ><div style="padding: 1rem 2rem;display: flex;flex-direction: column;gap: 1rem;border-radius: 10px;background-color: aliceblue;"><span>enter storage name:</span><input id="inventory-name" type="text" style="outline: none;border: none;background: rgba(0, 0, 0, 0.1);height: 2.5rem;border-radius: 5px;"><button id="iventory-submit" style="width: max-content;margin-left: auto;padding: 0.5rem 1rem;border-radius: 0.5rem;border: none;outline: none;">ok</button></div></div>`
    iventory_modal.innerHTML = iventory_content
    document.body.appendChild(iventory_modal)
    var iventory_name;
    const input = document.getElementById('inventory-name')
    input.addEventListener('input', (e) => {
        e.preventDefault()
        iventory_name = e.target.value
    })
    input.addEventListener('keydown', (e) => {
        e.stopPropagation()
        if (e.key === 'Enter') {
            updateStorage(currentPlayer, { storageId: iventory_name.toLowerCase(), storageName: iventory_name, items: list })
            document.body.removeChild(iventory_modal)
        }
    })
    document.getElementById('iventory-submit').addEventListener('click', () => {
        updateStorage(currentPlayer, { storageId: iventory_name.toLowerCase(), storageName: iventory_name, items: list })
        document.body.removeChild(iventory_modal)
    })
}

async function handleReloadStorage(storageId) {
    const currentPlayer = await get_data('currentPlayer')
    const items = exportStorage()
    if (items) {
        currentPlayer.storages = currentPlayer.storages.map((storage) => {
            if (storage.storageId === storageId) {
                storage.items = items
                return storage
            }
            return storage
        })
        removeStorage()
        await updatePlayers(currentPlayer)
        crateNotifications(`congratulations storage ${storageId} uptodate! :v`)
        await initStorage(currentPlayer)
    }
}

function exportStorage() {
    const list = []
    const storageElement = document.querySelectorAll('.InventoryWindow_inventoryBox__in74A')
    if (storageElement.length <= 0) {
        crateNotifications('InventoryWindow not open!')
        return null
    } else {
        storageElement.forEach((x, i) => {
            var data = {
                slot: i
            }
            const img = x.querySelector('.InventoryWindow_itemImage__0KLPV>img')
            const quantity = x.querySelector('.InventoryWindow_itemQuantity__SNjQU')
            if (img && quantity) {
                data.averageColor = calculateAverageColor(img)
                data.quantity = quantity.textContent.trim()
                data.images = img.src
            }
            list.push(data)
        })

        return list
    }
}

async function removeStorageItem(targetRemove) {
    console.log(targetRemove)
    removeStorage()
    const currentPlayer = await get_data('currentPlayer')
    const isMatch = currentPlayer.storages.some((storage) => storage.storageId === targetRemove.storageId)
    if (!isMatch) return crateNotifications('Inventory not found!');
    currentPlayer.storages = currentPlayer.storages.filter((storage) => storage.storageId !== targetRemove.storageId)
    await updatePlayers(currentPlayer)
    await initStorage(currentPlayer)
}

async function updateStorage(currentPlayer, newstorages) {
    const isMatch = currentPlayer.storages.some((storage) => storage.storageId === newstorages.storageId)
    if (isMatch) return crateNotifications('Inventory Exist!');
    currentPlayer.storages.push(newstorages)
    currentPlayer.storages = currentPlayer.storages.reverse()
    removeStorage()
    await updatePlayers(currentPlayer)
    await initStorage(currentPlayer)
}

async function updateLand(player) {
    try {
        const currentMap = await get_data('currentMap');
        const existLand = player.lands.some((land) => land.landId === currentMap)
        if (existLand) return;
        removeTimer()
        player.lands.push({ landId: currentMap, work: [] });
        player.lands = player.lands.reverse()
        await updatePlayers(player)
        await initTimer(player)
    } catch (error) {
        console.error('Error updating land:', error);
    }
}

async function removeLand(player, landId) {
    try {
        removeTimer()
        let newlands = player.lands.filter((land) => land.landId !== landId)
        player.lands = newlands
        await updatePlayers(player)
        await initTimer(player)
    } catch (error) {
        console.error('Error updating land:', error);
    }
}

async function updatePlayers(player) {
    try {
        let players = await get_data('players');
        players = players.map((old_player) => {
            if (old_player.username === player.username) {
                return player
            }
            return old_player
        })
        await set_data({ players, currentPlayer: player })
    } catch (error) {
        console.error('Error updating players')
    }
}

async function handleIndustryClick(industry, craft, datas, land_data) {
    try {
        const currentPlayer = await get_data('currentPlayer');
        if (industry.textContent.trim() === 'ready') {
            const newlands = currentPlayer.lands.map((land) => {
                if (land.landId === land_data.landId) {
                    const newWork = land.work.filter((work) => {
                        const filteredByid = filterItemsById(datas, work.id);
                        return filteredByid[0].craft_name !== craft.craft_name;
                    });
                    return { ...land, work: newWork };
                }
                return land;
            });

            currentPlayer.lands = newlands;
            removeTimer()
            await updatePlayers(currentPlayer)
            await initTimer(currentPlayer);
        } else {
            createTimerModal(craft, currentPlayer, land_data.landId);
        }
    } catch (error) {
        console.error('Error handling industry click:', error);
    }
}

function loadJSONData(file) {
    return new Promise((resolve, reject) => {
        fetch(browser.runtime.getURL(file))
            .then(response => response.json())
            .then(data => {
                // industries = data
                resolve(data)
            })
            .catch(error => {
                reject('Error loading JSON:', error);
            });
    })
}


function exportTask() {
    const taskElements = document.querySelectorAll('[class*="Store_store-item-container"]')
    const tasks = []
    taskElements.forEach(taskElement => {
        try {
            const img = taskElement.querySelector('.Store_card-img-wrapper__hyk51 > img')
            const name = taskElement.querySelector('.Store_card-title__InPpB').textContent
            const quantity = taskElement.querySelector('.Store_item-quantity__cFhDE').textContent
            tasks.push({ img: img.src, averageColor: calculateAverageColor(img), name, quantity })
        } catch (error) {

        }
    })
    return tasks
}