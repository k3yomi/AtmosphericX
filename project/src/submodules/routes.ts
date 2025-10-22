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
    Last Updated: 2025-10-20
    Changelogs: 
        - Added type definitions for better clarity and maintainability.
        - Implemented a terminal-based display using Blessed for real-time monitoring.
        - Created dynamic elements for logs, system info, sessions, and active events.
        - Established periodic updates to refresh displayed information.
        - Integrated keybindings for graceful exit and interaction.
*/

import * as loader from '../bootstrap';
import * as types from '../types';

export class Routes {
    NAME_SPACE = `submodule:routes`;
    package: typeof loader.packages.express;
    constructor() {
        this.initialize();
    }

    /**
     * Initializes the display manager and sets up the terminal interface
     *
     * @private
     * @async
     * @returns {Promise<void>} 
     */
    private async initialize(): Promise<void> {
        loader.submodules.utils.log(`${this.NAME_SPACE} initialized.`);
        const defConfig = loader.cache.internal.configurations as types.ConfigurationsType;
        const isHttps = defConfig.web_hosting_settings.settings.is_https;
        const isPortal = defConfig.web_hosting_settings.is_login_required;
        const getPort = defConfig.web_hosting_settings.settings.port_number;
        const getCertificates = isHttps ? this.getCertificates() : null;
        this.package = loader.cache.internal.express = loader.packages.express();
        this.middleware(); this.routes();
        if (isHttps) {
            loader.cache.internal.websocket = loader.packages.https.createServer(getCertificates, this.package).listen(getPort, () => {
                loader.submodules.utils.log(`${this.NAME_SPACE} HTTPS Server running on port ${getPort}`);
            }).on('error', (err: any) => {
                loader.submodules.utils.log(`${this.NAME_SPACE} ERROR: ${err.message}`);
                process.exit(1);
            });
        } else {
            loader.cache.internal.websocket = loader.packages.http.createServer(this.package).listen(getPort, () => {
                loader.submodules.utils.log(`${this.NAME_SPACE} HTTP Server running on port ${getPort}`);
            }).on('error', (err: any) => {
                loader.submodules.utils.log(`${this.NAME_SPACE} ERROR: ${err.message}`);
                process.exit(1);
            });
        }
        if (!isPortal) {
            loader.submodules.utils.log(`${loader.strings.portal_disabled_warning}`, { echoFile: true });
        }
    }

    
    private middleware() {
        const parentDirectory = loader.packages.path.resolve(`..`, `storage`);
        console.log(this.package.use)
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

    private routes() {
        const parentDirectory = loader.packages.path.resolve(`..`, `storage`);
        this.package.get(`/`, (request: Record<string, any>, response: Record<string, any>) => { return response })
        this.package.get(`/widgets/:endpoint`, (request: Record<string, any>, response: Record<string, any>) => { return response })
        this.package.get(`/placefiles/:endpoint`, (request: Record<string, any>, response: Record<string, any>) => { return response })

        this.package.get(`/data/:endpoint/:id?`, (request: Record<string, any>, response: Record<string, any>) => { 
            const endpoint = request.params.endpoint;
            const id = request.params.id;
            const isValid = Object.keys(loader.cache.external).includes(endpoint);
            if (!isValid) { return this.redirect(response, `${parentDirectory}/www/sites/404/404.html`); }
            return response.json(id ? loader.cache.external[endpoint][id] : loader.cache.external[endpoint]);
        })

        this.package.get(`/api/:endpoint`, (request: Record<string, any>, response: Record<string, any>) => { return response })
    }

    private redirect(response: Record<string, any>, path: string) {
        response.sendFile(path);
        return;
    }

    private getCertificates() {
        const defConfig = loader.cache.internal.configurations as types.ConfigurationsType;
        if (!defConfig.web_hosting_settings.settings.is_https) {
            loader.submodules.utils.log(`${this.NAME_SPACE} ERROR: Tried to get SSL certificates while HTTPS is disabled in the configuration file.`);
            process.exit(1);
        }
        const keyPath = defConfig.web_hosting_settings.settings.certification_paths.private_key_path;
        const certPath = defConfig.web_hosting_settings.settings.certification_paths.certificate_path;
        if (!loader.packages.fs.existsSync(keyPath)) { loader.submodules.utils.log(`${this.NAME_SPACE} ERROR: SSL key file not found at: ${keyPath}`); process.exit(1); }
        if (!loader.packages.fs.existsSync(certPath)) { loader.submodules.utils.log(`${this.NAME_SPACE} ERROR: SSL certificate file not found at: ${certPath}`); process.exit(1); }
        return { 
            key: loader.packages.fs.readFileSync(keyPath),
            certificate: loader.packages.fs.readFileSync(certPath)
        }
    }


}
export default Routes;
