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

    notify = function(type, message, duration = 5000) {
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.classList.add('notification-container');
            document.body.appendChild(container);
        }
        const notif = document.createElement('div');
        notif.classList.add('notification', type);
        notif.innerText = message;
        const bar = document.createElement('div');
        bar.classList.add('notification-bar');
        const progress = document.createElement('div');
        progress.classList.add('notification-progress', type);
        progress.style.transition = `width ${duration}ms linear`;
        bar.appendChild(progress);
        notif.appendChild(bar);
        container.appendChild(notif);
        requestAnimationFrame(() => {
            progress.style.width = '0%';
        });
        setTimeout(() => {
            notif.classList.add('fade-out');
            setTimeout(() => {
                if (notif.parentNode === container) container.removeChild(notif);
            }, 500);
        }, duration);
    }

}
