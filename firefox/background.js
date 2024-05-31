
// Fungsi untuk mengambil data dari file JSON
browser.runtime.onInstalled.addListener(() => {
    browser.storage.sync.set({
        currentMap: null, currentPlayer: null, players: []
    });
});

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

const handleAccountChange = (newplayer) => new Promise(async(resolve, reject) => {
    try {
        delete newplayer.ip
        delete newplayer.cryptoWallets
        delete newplayer.current
        delete newplayer.currentAvatar
        delete newplayer.lastAuthenticated
        delete newplayer.lastShortValidation
        delete newplayer.location
        delete newplayer.playerAvatar
        // Menambahkan properti default untuk newplayer
        newplayer.lands = [{ landId: 'terravilla', work: [] }];
        newplayer.storages = []
        newplayer.tasks = []

        // Mengambil daftar pemain yang ada
        const oldPlayers = await get_data('players');

        // Periksa apakah oldPlayers ada dan bukan array kosong
        if (oldPlayers && Array.isArray(oldPlayers)) {
            const accountExist = oldPlayers.some(
                (player) => player.username === newplayer.username
            );

            // Jika pemain baru tidak ada dalam daftar, tambahkan ke daftar pemain
            if (!accountExist) {
                await set_data({ players: [...oldPlayers, newplayer] });
            }
        } else {
            // Jika oldPlayers tidak ada atau bukan array, inisialisasi dengan pemain baru
            await set_data({ players: [newplayer] });
        }

        return resolve(newplayer)
    } catch (error) {
        // console.error();
        return reject(error)
    }
})


// Listener untuk menerima pesan dari content script
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "AccountChange") {
        handleAccountChange(request.message)
            .then((e) => {
                set_data({currentPlayer: e})
                sendResponse({ message: `Account Change ${e.username}` });
            })
            .catch(error => {
                console.error(error.message);
            });
    }
    if (request.type === "MapChange") {
        set_data({ currentMap: request.message.split(':')[0].split('map ')[1] });
        sendResponse({ message: `Map Change ${request.message}` });
    }

    if (request.type === "sign_out") {
        sendResponse({ message: `Player Logout Change` });
    }
    return true;
});