/*
              _                             _               _     __   __
         /\  | |                           | |             (_)    \ \ / /
        /  \ | |_ _ __ ___   ___  ___ _ __ | |__   ___ _ __ _  ___ \ V /
       / /\ \| __| '_ ` _ \ / _ \/ __| '_ \| '_ \ / _ \ '__| |/ __| > <
      / ____ \ |_| | | | | | (_) \__ \ |_) | | | |  __/ |  | | (__ / . \
     /_/    \_\__|_| |_| |_|\___/|___/ .__/|_| |_|\___|_|  |_|\___/_/ \_\
                                     | |
                                     |_|
    Written by: KiyoWx (k3yomi) & StarflightWx
    Last Updated: 2025-10-27
    Changelogs: 
        - Inital creation of Utils.
*/

class Utils {
    constructor() {
        this.script = 'Utils';
        this.storage = [];
        this.log(`${this.script} initialized.`);
    }

    websocket = async function(cached = [`configurations`]) {
        return new Promise((resolve) => {
            const url = `${window.location.protocol == `https:` ? `wss:` : `ws:`}//${window.location.hostname}:${window.location.port}/stream`
            this.storage.socket = new WebSocket(url);
            this.storage.socket.addEventListener('open', () => {
                this.log(`WebSocket connection established.`);
                this.storage.socket.send(JSON.stringify({ type: 'eventRequest', message: cached }));
            })
            this.storage.socket.addEventListener('close', () => {
                this.storage.socket.close()
                this.storage.socket = null
                setTimeout(() => { this.websocket(cached) }, 1000)
            });
            this.storage.socket.addEventListener('message', (event) => {
                const data = JSON.parse(event.data)
                const type = data.type || null;
                const message = data.message || null;
                const value = data.value || null;
                if (type === 'eventUpdate' && message != null) { this.storage[value] = message; }
                if (type === `eventUpdateFinished`) { 
                    setTimeout(() => { document.dispatchEvent(new Event('eventCacheUpdated')); }, 100);
                }
            })
        });
    }

    log = function(message) { 
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] [${this.script}] ${message}`);
    }
}
