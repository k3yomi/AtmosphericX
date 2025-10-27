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
        - Refactored configuration and logging methods for improved structure.
        - Implemented JSONC parsing for configurations with error handling.
        - Enhanced logging functionality with options for raw console output and file echoing.
        - Created a web content filtering method for sanitization.            
*/

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

    public sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    public version(): string {
        const version = loader.packages.fs.existsSync(this.VERSION_PATH) 
            ? loader.packages.fs.readFileSync(this.VERSION_PATH, `utf-8`).replace(/\n/g, ``) 
            : `v0.0.0`;
        return version
    }

    public isFancyDisplay(): boolean {
        return (loader.cache.internal.configurations as types.ConfigurationsType).internal_settings.fancy_interface || false;
    }

    public logo(): string | void{
        const path = this.isFancyDisplay() ? this.LOGO_PATH : this.LOGO_LEGACY_PATH;
        const ConfigType = loader.cache.internal.configurations as types.ConfigurationsType;
        const logo = loader.packages.fs.existsSync(path) 
            ? loader.packages.fs.readFileSync(path, `utf-8`).replace(`{VERSION}`, this.version()) 
            : `AtmosphericX {VERSION}`;
        if (ConfigType.internal_settings.fancy_interface) { return logo } 
        console.clear();
        console.log(logo);
    }
  
    public log(message?: string, options?: types.LogOptions, logType: string = `__console__`): void {
        const title = options?.title || `\x1b[32m[ATMOSX-UTILS]\x1b[0m`;
        const msg = message || `No message provided.`;
        const rawConsole = options?.rawConsole || false;
        const echoFile = options?.echoFile || false;
        if (!rawConsole) {
            loader.cache.internal.logs[logType].push({title: title, message: msg, timestamp: new Date().toLocaleString()}); 
            if (loader.cache.internal.logs[logType].length > 25) { loader.cache.internal.logs[logType].shift(); }
        }
        if (rawConsole || !this.isFancyDisplay()) { console.log(`${title}\x1b[0m [${new Date().toLocaleString()}] ${msg}`); }
        if (echoFile) { 
            loader.packages.fs.appendFileSync(this.LOGS_PATH, `[${title.replace(/\x1b\[[0-9;]*m/g, '')}] [${new Date().toLocaleString()}] ${msg}\n`);
        }
    }

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
}

export default Utils;

