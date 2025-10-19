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
    name: string
    package: typeof loader.packages.manager.AlertManager
    manager: any;
    constructor() {
        this.package = loader.packages.manager.AlertManager;
        this.name = `submodule:alerts`;
        this.initalize()
    }

    public refresh() {
        loader.cache.internal.manager.setSettings()
    }

    private initalize() {
        loader.submodules.utils.log(`${this.name} initialized.`)
        this.instance();
    }

    private handle(alerts : any[]) {
        for (const alert of alerts) {
            let tracking = alert.tracking
            let find = loader.cache.internal.wire.features.findIndex(feature => feature && feature.tracking == tracking);
            if (alert.properties.is_cancelled && find !== -1) { loader.cache.internal.wire.features[find] = undefined;  }
            if (alert.properties.is_issued) { loader.cache.internal.wire.features.push(alert); }
            if (alert.properties.is_updated) {
                if (find !== -1) {
                    const newHistory = loader.cache.internal.wire.features[find].history.concat(alert.history).sort((a: { issued: string }, b: { issued: string }) => new Date(b.issued).getTime() - new Date(a.issued).getTime());
                    const newLocations = loader.cache.internal.wire.features[find].properties.locations;
                    loader.cache.internal.wire.features[find] = alert;
                    loader.cache.internal.wire.features[find].history = newHistory;
                    for (let i = 0; i < newHistory.length; i++) {
                        for (let j = 0; j < newHistory.length; j++) {
                            let vTimeDiff = Math.abs(new Date(newHistory[i].issued).getTime() - new Date(newHistory[j].issued).getTime());
                            if (vTimeDiff < 1000) {
                                let combinedLocations = newLocations + `; ` + loader.cache.internal.wire.features[find].properties.locations;
                                let uniqueLocations = [...new Set(combinedLocations.split(';').map(location => location.trim()))];
                                loader.cache.internal.wire.features[find].properties.locations = uniqueLocations.join('; ');
                            }
                        }
                    }
                } else { 
                    loader.cache.internal.wire.features.push(alert);
                }
            }
        }
        loader.submodules.networking.updateCache(true);
    }

    private instance(isRefreshing?: boolean) {
        if (isRefreshing && !this.manager) return;
        const configurations = loader.cache.internal.configurations as Record<string, any>;
        const alerts = configurations.sources.atmosx_parser_settings
        const nwws = alerts.weather_wire_settings
        const nws = alerts.national_weather_service_settings
        const filter = configurations.filters
        let now = new Date();
        let displayName = nwws.client_credentials.nickname.replace(`AtmosphericX`, ``).trim();
        let displayTimestamp = `${String(now.getUTCMonth() + 1).padStart(2, '0')}/${String(now.getUTCDate()).padStart(2, '0')} ${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')}`;
        const settings = {
            database: nwws.database,
            isNWWS: alerts.noaa_weather_wire_service,
            journal: alerts.journal,
            NoaaWeatherWireService: {
                clientReconnections: { canReconnect: nwws.client_reconnections.attempt_reconnections, currentInterval: nwws.client_reconnections.reconnection_attempt_interval, },
                clientCredentials: { username: nwws.client_credentials.username, password: nwws.client_credentials.password, nickname: `AtmosphericX v${loader.submodules.utils.version()} -> ${displayName} (${displayTimestamp})`, },   
                cache: { read: nwws.client_cache.read_cache, maxSizeMB: nwws.client_cache.max_size_mb, maxHistory: nwws.client_cache.max_db_history, directory: nwws.client_cache.directory, },
                alertPreferences: { isCapOnly: nwws.alert_preferences.cap_only, isShapefileUGC: nwws.alert_preferences.implement_db_ugc, }
            },
            NationalWeatherService: { checkInterval: nws.interval, endpoint: nws.endpoint, },
            global: {
                useParentEvents: alerts.global_settings.parent_events,
                betterEventParsing: alerts.global_settings.better_parsing,
                alertFiltering: { 
                    ignoreTestProducts: filter.ignore_tests,
                    locationFiltering: { maxDistance: filter.location_settings.max_distance, unit: filter.location_settings.unit, filter: filter.location_settings.enabled },
                    filteredEvents: filter.all_events == true ? [] : filter.listening_events, ignoredEvents: filter.ignored_events, filteredICOAs: filter.listening_icoa, ignoredICOAs: filter.ignored_icoa, ugcFilter: filter.listening_ugcs, stateFilter: filter.listening_states, checkExpired: filter.check_expired
                },
                easSettings: { easDirectory: filter.eas_settings.eas_directory, easIntroWav: filter.eas_settings.eas_intro }
            }
        }
        if (isRefreshing) { this.manager.setSettings(settings); return; }
        this.manager = new this.package(settings);
        this.manager.on(`onAlerts`, (alerts) => { this.handle(alerts);  });
        this.manager.on(`onConnection`, async (displayName) => {loader.submodules.utils.log(`Connected to NOAA Weather Wire Service as ${displayName}.`);});
        this.manager.on(`onReconnection`, (service) => { now = new Date(); displayTimestamp = `${String(now.getUTCMonth() + 1).padStart(2, '0')}/${String(now.getUTCDate()).padStart(2, '0')} ${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')}`; this.manager.setDisplayName(`AtmosphericX v${loader.submodules.utils.version()} -> ${displayName} (${displayTimestamp}) (x${service.reconnects})`) })
        loader.cache.internal.manager = this.manager;
    }

}

export default Alerts;

