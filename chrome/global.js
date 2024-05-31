var oldConsoleLog = console.log;
var consoleLogMessages = [];
console.log = function () {
    var args = Array.from(arguments);
    var message = args.join(' ');

    if(message.includes('joining map')){
        window.postMessage({type: 'MapChange', message}, '*')
    }
    oldConsoleLog.apply(console, args);
};

// Expose consoleLogMessages to the window object
window.consoleLogMessages = consoleLogMessages;

// Simpan referensi asli dari XMLHttpRequest open dan send
const originalXhrOpen = XMLHttpRequest.prototype.open;
const originalXhrSend = XMLHttpRequest.prototype.send;

XMLHttpRequest.prototype.open = function (...args) {
    this._url = args[1]; // Simpan URL permintaan
    return originalXhrOpen.apply(this, args);
};


let body;

XMLHttpRequest.prototype.send = function (...args) {
    // Tambahkan event listener pada load event
    this.addEventListener('load', function () {
        if (this._url.includes('complete_crypto_authentication')) { // Ganti dengan URL yang relevan
            try {
                // Proses modifikasi hanya jika responseType adalah '' atau 'text'
                if (this.responseType === '' || this.responseType === 'text') {
                    const responseText = this.responseText;
                    body = JSON.parse(responseText)
                    window.postMessage({type: 'AccountChange', message: body.player}, '*')
                }
            } catch (error) {
                // console.error('Error processing response:', error);
            }
        }
        if (this._url.includes('sign_out')) {
            window.postMessage({type: 'sign_out'}, '*')
        }
    });
    return originalXhrSend.apply(this, args);
};