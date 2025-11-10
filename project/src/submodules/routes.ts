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
        - Added type definitions for better clarity and maintainability.
        - Attempted SSE but faced issues so moved back to websockets.
        - Added ratelimit handling for websocket requests from the client
        - Implemented maximum connections per IP to prevent abuse.
*/

import * as loader from '../bootstrap';
import * as types from '../types';

export class Routes {
    NAME_SPACE = `submodule:routes`;
    package: typeof loader.packages.express;
    clients: types.WebSocketClient[] = [];
    constructor() {
        this.initialize();
    }

    private async initialize(): Promise<void> {
        loader.submodules.utils.log(`${this.NAME_SPACE} initialized.`);
        const ConfigType = loader.cache.internal.configurations as types.ConfigurationsType;
        const isHttps = ConfigType.web_hosting_settings.settings.is_https;
        const isPortal = ConfigType.web_hosting_settings.is_login_required;
        const getPort = ConfigType.web_hosting_settings.settings.port_number;
        const getCertificates = isHttps ? this.getCertificates() : null;
        this.package = loader.cache.internal.express = loader.packages.express();
        this.middleware();
        if (isHttps) {
            loader.cache.internal.websocket = loader.packages.https.createServer(getCertificates, this.package).listen(getPort, () => {
                loader.submodules.utils.log(`${this.NAME_SPACE} HTTPS Server running on port ${getPort}`);
            }).on('error', (err: any) => {
                loader.submodules.utils.log(`${this.NAME_SPACE} ERROR: ${err.message}`);
            });
        } else {
            loader.cache.internal.websocket = loader.packages.http.createServer(this.package).listen(getPort, () => {
                loader.submodules.utils.log(`${this.NAME_SPACE} HTTP Server running on port ${getPort}`);
            }).on('error', (err: any) => {
                loader.submodules.utils.log(`${this.NAME_SPACE} ERROR: ${err.message}`);
            });
        }
        if (!isPortal) {
            loader.submodules.utils.log(`${loader.strings.portal_disabled_warning}`, { echoFile: true });
        }
        this.routes();
        this.websocket();
    }

    private middleware(): void {
        const parentDirectory = loader.packages.path.resolve(`..`, `storage`);
        this.package.use((request, response, next) => {
            response.setHeader('Access-Control-Allow-Origin', '*');
            response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            response.setHeader('Access-Control-Allow-Credentials', 'true');
            response.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
            response.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
            response.setHeader('Pragma', 'no-cache');
            response.setHeader('Expires', '0');
            response.setHeader('Surrogate-Control', 'no-store');
            next();
        })
        this.package.use(loader.packages.cookieParser());
        this.package.use(`/assets`, loader.packages.express.static(`${parentDirectory}/www`));
        this.package.use(`/widgets`, loader.packages.express.static(`${parentDirectory}/www/widgets`));
        this.package.set(`trust proxy`, 1); 
    }
    
    private routes(): void {
        const parentDirectory = loader.packages.path.resolve(`..`, `storage`);
        this.package.get(`/`, (request: Record<string, any>, response: Record<string, any>) => { return response })
        this.package.get(`/data/:endpoint/:id?`, (request: Record<string, any>, response: Record<string, any>) => { 
            const endpoint = request.params.endpoint;
            const id = request.params.id;
            const isValid = Object.keys(loader.cache.external).includes(endpoint);
            if (!isValid) { return this.redirect(response, `${parentDirectory}/www/sites/404/404.html`); }
            return response.json(id ? loader.cache.external[endpoint][id] : loader.cache.external[endpoint]);
        })
    }

    private redirect(response: Record<string, any>, path: string): void {
        response.sendFile(path);
        return;
    }
    
    private getCertificates(): types.CertificateCollection {
        const ConfigType = loader.cache.internal.configurations as types.ConfigurationsType;
        if (!ConfigType.web_hosting_settings.settings.is_https) {
            loader.submodules.utils.log(`${this.NAME_SPACE} ERROR: Tried to get SSL certificates while HTTPS is disabled in the configuration file.`);
        }
        const keyPath = ConfigType.web_hosting_settings.settings.certification_paths.private_key_path;
        const certPath = ConfigType.web_hosting_settings.settings.certification_paths.certificate_path;
        if (!loader.packages.fs.existsSync(keyPath)) { loader.submodules.utils.log(`${this.NAME_SPACE} ERROR: SSL key file not found at: ${keyPath}`); }
        if (!loader.packages.fs.existsSync(certPath)) { loader.submodules.utils.log(`${this.NAME_SPACE} ERROR: SSL certificate file not found at: ${certPath}`); }
        return { 
            key: loader.packages.fs.readFileSync(keyPath),
            certificate: loader.packages.fs.readFileSync(certPath)
        }
    }

    private websocket(): void {
        const cfg = loader.cache.internal.configurations as types.ConfigurationsType;
        const max = cfg.websocket_settings.maximum_connections_per_ip ?? 3;
        const wss = loader.cache.internal.socket = new loader.packages.ws.WebSocketServer({
            server: loader.cache.internal.websocket,
            path: '/stream'
        });
        wss.on('connection', (client: any, req: any) => {
            const ip = req?.socket?.remoteAddress ?? 'unknown';
            if (ip === 'unknown') return client.close(4000, 'Invalid IP');
            const count = this.clients.filter(c => c.address === ip).length;
            if (count >= max) {
                try { if (client.readyState === loader.packages.ws.OPEN) client.send(JSON.stringify({ type: 'eventConnection', message: `Connection limit reached (${max}).` })); } catch {}
                return client.close(4001, 'Connection limit reached');
            }
            this.clients.push({ client, unix: Date.now() - 1000, address: ip, requests: {}, hasSentInitialData: false });
            try { if (client.readyState === loader.packages.ws.OPEN) client.send(JSON.stringify({ type: 'eventConnection', message: 'WebSocket connection established.' })); } catch {}
            client.on('message', (msg: any) => this.onWebsocketClientMessage(client, msg));
            client.on('close', () => { this.clients = this.clients.filter(c => c.client !== client); });
        });
        loader.submodules.utils.log(`${this.NAME_SPACE} WebSocket server listening on /stream`);
    }

    private onWebsocketClientMessage(socket: any, message: string): void {
        const index = this.clients.findIndex(c => c.client === socket);
        if (index === -1) return;
        const clientData = this.clients[index];
        if (!clientData) return;
        if (clientData.hasSentInitialData) { 
            socket.send(JSON.stringify({ type: 'eventMessage', message: 'Initial data already sent - Closing connection.' }));
            return socket.close(4002, 'Initial data already sent');
        }
        clientData.hasSentInitialData = true;
        const data = (() => { try { return JSON.parse(message); } catch { return null; } })();
        if (!data) { socket.send(JSON.stringify({ type: 'eventMessage', message: 'Invalid JSON format' })); return socket.close(4002, 'Invalid JSON'); }
        if (!data?.type || !data?.message) { socket.send(JSON.stringify({ type: 'eventMessage', message: 'Missing type or message' })); return socket.close(4002, 'Missing Data'); }
        if (data.type === 'eventRequest') {
            let requestData;
            try { requestData = typeof data.message === 'string' ? JSON.parse(data.message) : data.message; } catch { requestData = null; }
            if (!requestData) { socket.send(JSON.stringify({ type: 'eventMessage', message: 'Invalid request payload' })); return socket.close(4002, 'Invalid Payload'); }
            return this.onWebsocketClientUpdate(socket, clientData, requestData);
        }
        socket.send(JSON.stringify({ type: 'eventMessage', message: 'Unknown type' }));
        socket.close(4002, 'Unknown type');
    }

    private onWebsocketClientUpdate(socket: any, clientData: types.WebSocketClient, data: string[]): void {
        const InternalConfig = loader.cache.internal.configurations as types.ConfigurationsType;
        if (!Array.isArray(data)) return;
        const now = Date.now();
        let isQueued = false;
        if (data[0] === '*') {
            data = Object.keys(loader.cache.external);
        }
        data.forEach((request: string) => {
            if (!clientData.requests[request]) clientData.requests[request] = { unix: 0 };
            const isPriority = InternalConfig.websocket_settings.priority_sockets.sockets.includes(request);
            const isSecondary = InternalConfig.websocket_settings.secondary_sockets.sockets.includes(request);
            const timeout = isPriority
                ? InternalConfig.websocket_settings.priority_sockets.timeout
                : isSecondary
                ? InternalConfig.websocket_settings.secondary_sockets.timeout
                : 0;
            const timeoutMs = timeout < 1000 ? timeout * 1000 : timeout;
            if (now - clientData.requests[request].unix < timeoutMs) { return; }
            clientData.requests[request].unix = now;
            const cache = loader.cache.external[request as keyof typeof loader.cache.external] || null;
            try { socket.send(JSON.stringify({ type: 'eventUpdate', message: cache, value: request })); } catch {}
            isQueued = true;
        });
        if (isQueued) { socket.send(JSON.stringify({ type: 'eventUpdateFinished', message: 'Update complete' })); }
    }

    public onUpdateRequest(): void {
        for (const clientData of this.clients) {
            this.onWebsocketClientUpdate(clientData.client, clientData, Object.keys(clientData.requests));
        }
    }

}
export default Routes;
