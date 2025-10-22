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
        - Implemented caching and contradiction resolution for data sources.
        - Enhanced error handling and retry logic for data fetching.
        - Created methods for update checking and cache refreshing.
        - Developed a comprehensive HTTP request handler with customizable options.                             
*/


import * as loader from '../bootstrap';
import * as types from '../types';

export class Alerts { 
    name: string
    constructor() {
        this.name = `submodule:networking`;
        this.initalize()
    }

    private initalize() {
        loader.submodules.utils.log(`${this.name} initialized.`)
        this.getUpdates();
        this.updateCache();
    }

    /**
     * buildSourceStructure constructs an array of CacheStructure objects from the provided sources.
     *
     * @private
     * @param {*} sources 
     * @returns {types.CacheStructure[]} 
     */
    private buildSourceStructure(sources: any): types.CacheStructure[] {
        const structure: types.CacheStructure[] = [];
        for (const source in sources) {
            for (const [key, value] of Object.entries(sources[source])) {
                const source = value as Record<string, any>;
                structure.push({
                    name: key,
                    url: source.endpoint,
                    enabled: source.enabled,
                    cache: source.cache_time,
                    contradictions: source.contradictions ?? [],
                });
            }
        }
        return structure;
    }

    /**
     * resolveContradictions disables sources based on their defined contradictions.
     *
     * @private
     * @param {types.CacheStructure[]} structure 
     */
    private resolveContradictions(structure: types.CacheStructure[]): void {
        for (const source of structure.filter(s => s.enabled)) {
            for (const contradiction of source.contradictions) {
                const index = structure.findIndex(s => s.name === contradiction);
                if (index !== -1 && structure[index].enabled) {
                    loader.submodules.utils.log(`Evoking contradiction: ${source.name} disables ${structure[index].name}`, { echoFile: true });
                    structure[index].enabled = false;
                }
            }
        }
    }

    /**
     * getDataFromSource retrieves data from the specified URL and handles errors.
     *
     * @private
     * @async
     * @param {string} url 
     * @returns {Promise<{ error: boolean; message: any }>} 
     */
    private async getDataFromSource(url: string): Promise<{ error: boolean; message: any }> {
        try {
            const response = await this.httpRequest(url);
            if (response?.error) {
                return { error: true, message: `Error fetching data from ${url}`, };
            }
            return { error: false, message: response?.message ?? response, };
        } catch (error) {
            return { error: true, message: `Exception fetching data from ${url}: ${(error as Error).message ?? error}`, };
        }
    }

    /**
     * httpRequest performs an HTTP GET request to the specified URL with optional settings.
     *
     * @public
     * @param {string} url 
     * @param {?types.HTTPOptions} [options] 
     * @returns {Promise<any>} 
     */
    public httpRequest(url: string, options?: types.HTTPOptions): Promise<any> {
        return new Promise(async (resolve) => {
            try { 
                const config = loader.cache.internal.configurations as types.ConfigurationsType;
                const isOptionsProvided = options !== undefined;
                if (!isOptionsProvided) {
                    options = {
                        timeout: config.internal_settings.request_timeout * 1000,
                        headers: {
                            "User-Agent": `AtmosphericX/${loader.submodules.utils.version()}`,
                            "Accept": "application/geo+json, text/plain, */*; q=0.",
                            "Accept-Language": "en-US,en;q=0.9",
                        },
                        method: 'GET',
                        body: null,
                    }
                }
                const response = await loader.packages.axios.get(url, {
                    headers: options.headers,
                    maxRedirects: 0,
                    timeout: options.timeout,
                    httpsAgent: new loader.packages.https.Agent({ rejectUnauthorized: false }),
                    validateStatus: (status: number) => status == 200 || status == 500,
                });
                const { data: responseMessage } = response;
                return resolve({message: responseMessage, error: false});
            } catch (error) {
                return resolve({message: error, error: true});
            }
        });
    }

    /**
     * getUpdates checks for updates by comparing the online version with the local version.
     *
     * @public
     * @returns {Promise<{error: boolean, message: string}>} 
     */
    public getUpdates(): Promise<{error: boolean, message: string}> {
        return new Promise(async (resolve) => {
            const onlineVersion = await this.httpRequest(`https://raw.githubusercontent.com/k3yomi/AtmosphericX/main/version`, undefined)
            const onlineChangelogs = await this.httpRequest(`https://raw.githubusercontent.com/k3yomi/AtmosphericX/main/changelogs-history.json`, undefined)
            const offlineVersion = loader.submodules.utils.version();
            if (onlineVersion.error == true || onlineChangelogs.error == true) { loader.submodules.utils.log(loader.strings.updated_required_failed, {echoFile: true}); return resolve({error: true, message: `Failed to check for updates.`}); }
            const onlineVersionParsed = onlineVersion.message.replace(/\n/g, ``);
            const onlineChangelogsParsed = onlineChangelogs.message[onlineVersion] ? 
                onlineChangelogs.message[onlineVersionParsed].changelogs.join(`\n\t`) : `No changelogs available.`;
            loader.cache.external.version = offlineVersion;
            loader.cache.external.changelogs = onlineChangelogsParsed;
            const isNewerVersionDiscovered = (a: string, b: string) => {
                const [ma, mi, pa] = a.split(".").map(Number);
                const [mb, mi2, pb] = b.split(".").map(Number);
                return ma > mb || (ma === mb && mi > mi2) || (ma === mb && mi === mi2 && pa > pb);
            }
            if (isNewerVersionDiscovered(onlineVersionParsed, offlineVersion)) {
                loader.submodules.utils.log(loader.strings.updated_requied.replace(`{ONLINE_PARSED}`, onlineVersionParsed).replace(`{OFFLINE_VERSION}`, offlineVersion).replace(`{ONLINE_CHANGELOGS}`, onlineChangelogsParsed), {echoFile: true});
            }
            return {error: false, message: `Update check completed.`};
        });
    }

    /**
     * updateCache refreshes the internal cache by fetching data from active sources.
     *
     * @public
     * @async
     * @param {?boolean} [isAlertUpdate] 
     * @returns {Promise<void>} 
     */
    public async updateCache(isAlertUpdate?: boolean): Promise<void> {
        loader.submodules.utils.configurations();
        loader.submodules.alerts.instance(true);
        await loader.submodules.utils.sleep(200);
        let data = {}
        let stringText = ``
        const setTime = Date.now();
        const defConfig = loader.cache.internal.configurations as types.ConfigurationsType;
        const { atmosx_parser_settings, ...sources } = defConfig.sources;
        if (!isAlertUpdate) { 
            const structure = this.buildSourceStructure(sources);
            this.resolveContradictions(structure);
            const activeSources = structure.filter(s => s.enabled && s.url != null);
            await Promise.all(activeSources.map(async source => {
                const lastFetched = loader.cache.internal.http_timers[source.name] ?? 0;
                if (setTime - lastFetched <= source.cache * 1000) return;
                loader.cache.internal.http_timers[source.name] = setTime;
                for (let attempt = 0; attempt < 3; attempt++) {
                    const response = await this.getDataFromSource(source.url);
                    if (!response.error) {
                        data[source.name] = response.message;
                        stringText += `(OK) ${source.name.toUpperCase()}, `
                        break;
                    } else { 
                        loader.submodules.utils.log(`Error fetching data from ${source.name.toUpperCase()} (${attempt + 1}/3)`, { echoFile: true });
                        if (attempt === 2) {
                            data[source.name] = undefined;
                            stringText += `(ERR) ${source.name.toUpperCase()}, `
                        }
                    }
                }})
            )
        }
        if (isAlertUpdate) {
            if (!atmosx_parser_settings.noaa_weather_wire_service) {
                const lastFetched = loader.cache.internal.http_timers[`NWS`] ?? 0;
                if (setTime - lastFetched <= atmosx_parser_settings.national_weather_service_settings.internal * 1000) return;
                loader.cache.internal.http_timers[`NWS`] = setTime;
                stringText += `(OK) NWS, `
            }   
        }
        data["events"] = loader.cache.internal.events.features;
        if (Object.keys(data).length > 0) {
            if (stringText.length > 0) {
                loader.submodules.utils.log(`Cache Updated: - Taken: ${Date.now() - setTime}ms - ${stringText.slice(0, -2)}`, { echoFile: true })
            }
            loader.submodules.structure.create(data, isAlertUpdate);
        }
    }
}

export default Alerts;

