
// Fungsi untuk mengambil data dari file JSON
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({
        currentMap: null, currentPlayer: null, players: []
    });
    // loadJSONData();
});

const get_data = (key) => {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(key, (data) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(data[key]);
            }
        });
    });
};

const handleAccountChange = async (newplayer) => {
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
                await chrome.storage.sync.set({ players: [...oldPlayers, newplayer] });
            }
        } else {
            // Jika oldPlayers tidak ada atau bukan array, inisialisasi dengan pemain baru
            await chrome.storage.sync.set({ players: [newplayer] });
        }

        return newplayer
    } catch (error) {
        console.error('Failed to handle account change:', error);
    }
};


// Listener untuk menerima pesan dari content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "AccountChange") {
        handleAccountChange(request.message)
            .then((e) => {
                chrome.storage.sync.set({ currentPlayer: e });
                sendResponse({ message: `Account Change ${e.username}` });
            })
            .catch(error => {
                console.error(error.message);
            });
    }
    if (request.type === "MapChange") {
        chrome.storage.sync.set({ currentMap: request.message.split(':')[0].split('map ')[1] });
        sendResponse({ message: `Map Change ${request.message}` });
    }

    if (request.type === "sign_out") {
        sendResponse({ message: `Player Logout Change` });
    }
    return true;
});