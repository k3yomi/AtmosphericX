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


import { config } from 'process';
import * as loader from '../bootstrap';
import * as types from '../types';




export class Utils { 
    NAME_SPACE: string
    VERSION_PATH: string
    LOGO_PATH: string
    LOGO_LEGACY_PATH: string
    LOGS_PATH: string
    CONFIGURATIONS_PATH: string
    constructor() {
        this.VERSION_PATH = `../version`;
        this.LOGO_LEGACY_PATH = `../storage/logo-legacy.txt`;
        this.LOGO_PATH = `../storage/logo.txt`;
        this.LOGS_PATH = `../storage/logs.txt`;
        this.CONFIGURATIONS_PATH = `../configurations`;
        this.NAME_SPACE = `submodule:utils`;
        this.initialize();
    }

    private initialize() {
        this.configurations();
        this.logo();
        this.log(`${this.NAME_SPACE} initialized.`)
    }

    /**
     * A simple sleep function that returns a promise that resolves after a specified number of milliseconds.
     *
     * @public
     * @param {number} ms 
     * @returns {Promise<void>} 
     */
    public sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Reads the version from a file, this will updated per update depending how big it is. This will also help us 
     * keep tracking of changelogs from the past and future. Each version is x.xx.xxx or similar.
     * If the version file isn't found, it will default to v0.0.0
     *
     * @public
     * @returns {string} 
     */
    public version(): string {
        const version = loader.packages.fs.existsSync(this.VERSION_PATH) 
            ? loader.packages.fs.readFileSync(this.VERSION_PATH, `utf-8`).replace(/\n/g, ``) 
            : `v0.0.0`;
        return version
    }

    /**
     * Checks if the fancy display is enabled in the configurations.
     *
     * @public
     * @returns {boolean} 
     */
    public isFancyDisplay(): boolean {
        return (loader.cache.internal.configurations as types.defConfigurations).internal_settings.fancy_interface || false;
    }

    /**
     * This prints out the logo while clearing the console and retrieves the version
     * by using version(). If no version found, it will simply by v0.0.0 as an undefined placeholder
     * If you have any ideas for the future use of the logo, please feel free to let StartflightWx know.
     *
     * @public
     */
    public logo(): string | void{
        const path = this.isFancyDisplay() ? this.LOGO_PATH : this.LOGO_LEGACY_PATH;
        const defConfig = loader.cache.internal.configurations as types.defConfigurations;
        const logo = loader.packages.fs.existsSync(path) 
            ? loader.packages.fs.readFileSync(path, `utf-8`).replace(`{VERSION}`, this.version()) 
            : `AtmosphericX {VERSION}`;
        if (defConfig.internal_settings.fancy_interface) { return logo } 
        console.clear();
        console.log(logo);
    }
  
    /**
     * The log function allows the backend to log messages in the console or send it off to the logs.txt file
     * for debugging purposes. This should really only be used for backend purposes and nothing else.
     * Basically, no different from console.log
     *
     * @public
     * @param {?string} [message] 
     * @param {?types.LogOptions} [options] 
     */
    public log(message?: string, options?: types.LogOptions): void {
        const title = options?.title || `\x1b[32m[ATMOSX-UTILS]\x1b[0m`;
        const msg = message || `No message provided.`;
        const rawConsole = options?.rawConsole || false;
        const echoFile = options?.echoFile || false;
        if (!rawConsole) {
            loader.cache.internal.logs.push({title: title, message: msg, timestamp: new Date().toLocaleString()}); 
            if (loader.cache.internal.logs.length > 25) { loader.cache.internal.logs.shift(); }
        }
        if (rawConsole || !this.isFancyDisplay()) { console.log(`${title}\x1b[0m [${new Date().toLocaleString()}] ${msg}`); }
        if (echoFile) { 
            loader.packages.fs.appendFileSync(this.LOGS_PATH, `[${title}] [${new Date().toLocaleString()}] ${msg}\n`);
        }
    }

    /**
     * This grabs the latest configurations and stores it into the internal and external cache.
     * External cache is used for the client side (frontend) hence the limited data provided.
     * The internal is strictly for the use of the server (backend).
     * 
     * Each JSON file is merged into one object for easier access.
     * You may have also noticed that all the configurations are seperate and encoded in JSONC which
     * allows for comments. This is to make it easier for you all to understand what each
     * configuration does and how to use it. 
     * 
     * Also, if a JSONC parse fails or there is a malformed JSONC file, it will still technically work
     * thanks to the package for fixing any mistakes automatically. However, if you want to be safe,
     * it will log the error and terminate the program to prevent any issues.
     * 
     *
     * @public
     */
    public configurations(): void {
        let configurations = loader.packages.fs.existsSync(this.CONFIGURATIONS_PATH)
            ? loader.packages.fs.readdirSync(this.CONFIGURATIONS_PATH).reduce((acc: Record<string, any>, file: string) => {
            const filePath = `${this.CONFIGURATIONS_PATH}/${file}`;
            if (loader.packages.fs.statSync(filePath).isFile()) {
                try {
                    const fileContent = loader.packages.jsonc.parse(loader.packages.fs.readFileSync(filePath, 'utf-8'));
                    acc = {...acc, ...fileContent};
                } catch (e) { 
                    this.log(`Failed to parse ${file}, malfored JSONC configuration`); process.exit(1); 
                }
            } 
            return acc;
            }, {} as Record<string, unknown>)  : {};
        loader.cache.internal.configurations = configurations
        loader.cache.external.configurations = {
            alerts: configurations.filters?.listening_events,
            tones: configurations.tones,
            dictionary: configurations.alert_dictionary,
            schemes: configurations.alert_schemes,
            spc_outlooks: configurations.spc_outlooks, 
            third_party_services: configurations.third_party_services,
            forecasting_services: configurations.forecasting_services,
        };
    }
    
    /**
     * This filters web content based such as HTML tags. Mostly for sanitization to prevent XSS attacks 
     * from client->server->client interactions. Even though the admins are trusted, wanted to implement this
     * in case of future updates that may allow user requests.
     * 
     * @example: this.filterWebContent("<div>Hello <b>World</b></div>") // returns "Hello World"
     *
     * @public
     * @param {string} content 
     * @returns {(string | unknown)} 
     */
    public filterWebContent(content: string): string | unknown {
        if (typeof content == 'string') try { content = JSON.parse(content); } catch (e) { return content.replace(/<[^>]*>/g, ''); }
        if (Array.isArray(content)) return content.map(item => this.filterWebContent(item));
        if (typeof content == 'object' && content !== null) {
            const obj = content as Record<string, any>;
            for (let key in obj) {
                let value = obj[key];
                obj[key] = typeof value == 'string' ? value.replace(/<[^>]*>/g, '') : this.filterWebContent(value);
            }
        }
        return content;
    }

    /**
     * Filters internal cache with events and event hashes. 
     *
     * @public
     */
    public filterInternals(): void {
        const defInternal = loader.cache.internal as types.defInternal;
        defInternal.events = { features: defInternal.events?.features.filter(f => f !== undefined && new Date(f.properties.expires).getTime() > new Date().getTime())}
        defInternal.hashes = defInternal.hashes.filter(e => e !== undefined && new Date(e.expires).getTime() > new Date().getTime())
    }

}

export default Utils;

