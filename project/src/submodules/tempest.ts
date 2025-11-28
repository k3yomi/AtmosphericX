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


import * as loader from '../bootstrap';
import * as types from '../types';

export class Alerts { 
    NAME_SPACE: string = `submodule:tempest`;
    PACKAGE: typeof loader.packages.TempestStation
    DATA: any = {forecast: null, observation: null, rapidWind: null, lightning: null};
    MANAGER: any;
    constructor() {
        this.PACKAGE = loader.packages.TempestStation;
        loader.submodules.utils.log(`${this.NAME_SPACE} initialized.`)
        this.instance();
    }

    public instance(): void {
        const ConfigType = loader.cache.internal.configurations as types.ConfigurationsType;
        if (!ConfigType.sources.miscellaneous_settings.tempest_station.enabled) { return }
        this.MANAGER = new this.PACKAGE({
            api: ConfigType.sources.miscellaneous_settings.tempest_station.api_key,
            deviceId: ConfigType.sources.miscellaneous_settings.tempest_station.device,
            stationId: ConfigType.sources.miscellaneous_settings.tempest_station.station,
            journal: false,
        });
        this.MANAGER.on(`onObservation`, (data) => { 
            this.DATA.observation = data; 
            loader.cache.external.mesonet = loader.submodules.parsing.getWeatherStationStructure({
                longitude: this.DATA?.forecast?.features?.[0]?.geometry?.coordinates?.[1] ?? null,
                latitude: this.DATA?.forecast?.features?.[0]?.geometry?.coordinates?.[0] ?? null,
                temperature: this.DATA?.forecast?.features?.[0]?.properties?.temperature ?? null,
                dewpoints: this.DATA?.forecast?.features?.[0]?.properties?.dew_point ?? null,
                humidity: this.DATA?.forecast?.features?.[0]?.properties?.humidity ?? null,
                wind_speed: this.DATA?.rapidWind?.features?.[0]?.properties?.speed ?? null,
                wind_direction: this.DATA?.rapidWind?.features?.[0]?.properties?.direction ?? null,
                conditions: this.DATA?.forecast?.features?.[0]?.properties?.conditions ?? null,
                location: this.DATA?.forecast?.features?.[0]?.properties?.station_name ?? null,
            });
        });
        this.MANAGER.on(`onForecast`, (data) => { this.DATA.forecast = data; });
        this.MANAGER.on(`onRapidWind`, (data) => { this.DATA.rapidWind = data; });
        this.MANAGER.on(`onLightning`, (data) => { this.DATA.lightning = data; });
        this.MANAGER.on(`log`, (message: string) => { loader.submodules.utils.log(message, { title: `\x1b[33m[ATMOSX-TEMPEST]\x1b[0m` }); });
        loader.cache.handlers.tempestStation = this.MANAGER;
    }
}

export default Alerts;

