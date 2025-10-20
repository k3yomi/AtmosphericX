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

    private initalize() {
        loader.submodules.utils.log(`${this.name} initialized.`)
        this.instance();
    }

    /**
     * displayAlert generates a formatted alert message based on the event data.
     *
     * @public
     * @param {*} event 
     * @returns {string} 
     */
    public displayAlert(event: types.EventType): string {
        if (!loader.submodules.utils.isFancyDisplay()) { 
            return loader.strings.new_event_legacy
                .replace(`{EVENT}`, event.properties.event)
                .replace(`{STATUS}`, event.properties.action_type)
                .replace(`{TRACKING}`, event.tracking.substring(0, 18))
                .replace(`{SOURCE}`, loader.cache.internal.getSource)
        } else {
            return loader.cache.internal.events.features.sort((a: types.EventType, b: types.EventType) => {
                const dateA = new Date(a.properties.issued).getTime();
                const dateB = new Date(b.properties.issued).getTime();
                return dateA - dateB
            }).map((event: types.EventType) => {
                return loader.strings.new_event_fancy
                .replace(`{EVENT}`, event.properties.event)
                .replace(`{ACTION_TYPE}`, event.properties.action_type)
                .replace(`{TRACKING}`, event.tracking.substring(0, 18))
                .replace(`{SENDER}`, event.properties.sender_name)
                .replace(`{ISSUED}`, event.properties.issued)
                .replace(`{EXPIRES}`, loader.submodules.calculations.timeRemaining(new Date(event.properties.expires)))
                .replace(`{TAGS}`, event.properties.tags ? event.properties.tags.join(', ') : 'N/A')
                .replace(`{LOCATIONS}`, event.properties.locations.substring(0, 100))
                .replace(`{DISTANCE}`, (event.properties.distance?.range != null ? Object.entries(event.properties.distance.range).map(([key, value]: [string, any]) => {return `${key}: ${value.distance} ${value.unit}`;}).join(', ') : `No Distance Data Available`));
            }).join('\n')
        }
    }

    /**
     * handle processes incoming alerts and updates the internal cache accordingly.
     *
     * @private
     * @param {*} alerts 
     */
    private handle(alerts:  types.EventType[]): void {
        const InternalType = loader.cache.internal as types.InternalType;
        const features = loader.cache.internal.events.features;
        for (const alert of alerts) {
            const { tracking, properties, history = [] } = alert;
            const index = features.findIndex( feature => feature && feature.tracking === tracking );
            if (properties.is_cancelled && index !== -1) {
                features[index] = undefined; continue;
            }
            if (properties.is_issued && index === -1) {
                features.push(alert); continue;
            }
            if (properties.is_updated) {
                if (index !== -1 && features[index]) {
                    const existing = features[index];
                    const mergedHistory = [ ...(existing.history ?? []), ...history ].sort(
                        (a, b) => new Date(b.issued).getTime() - new Date(a.issued).getTime()
                    );
                    const existingLocations = existing.properties.locations ?? "";
                    const newLocations = alert.properties.locations ?? "";
                    const combinedLocations = [...new Set((existingLocations + "; " + newLocations)
                        .split(";")
                        .map(loc => loc.trim())
                        .filter(Boolean)),
                    ].join("; ");
                    features[index] = { ...alert, history: mergedHistory,
                        properties: { ...alert.properties, locations: combinedLocations, },
                    };
                } else {
                    features.push(alert);
                }
            }
        }
        loader.cache.internal.metrics.events_processed += alerts.length;
        InternalType.events = { features: InternalType.events?.features.filter(f => f !== undefined && new Date(f.properties.expires).getTime() > new Date().getTime())}
        InternalType.hashes = InternalType.hashes.filter(e => e !== undefined && new Date(e.expires).getTime() > new Date().getTime())
        loader.submodules.networking.updateCache(true);
    }

    /**
     * instance creates or refreshes the AlertManager instance with the current configurations.
     *
     * @private
     * @param {?boolean} [isRefreshing] 
     */
    private instance(isRefreshing?: boolean) {
        if (isRefreshing && !this.manager) return;
        const configurations = loader.cache.internal.configurations as types.ConfigurationsType
        const alerts = configurations.sources.atmosx_parser_settings
        const nwws = alerts.weather_wire_settings
        const nws = alerts.national_weather_service_settings
        const filter = configurations.filters
        let now = new Date();
        let displayName = nwws.client_credentials.nickname.replace(`AtmosphericX`, ``).trim();
        let displayTimestamp = `${String(now.getUTCMonth() + 1).padStart(2, '0')}/${String(now.getUTCDate()).padStart(2, '0')} ${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')}`;
        if (alerts.noaa_weather_wire_service == true) { loader.cache.internal.getSource = `NWWS`; } 
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
                    filteredEvents: filter.all_events == true ? [] : filter.listening_events, ignoredEvents: filter.ignored_events, filteredICOAs: filter.listening_icoa, ignoredICOAs: filter.ignored_icoa, ugcFilter: filter.listening_ugcs, stateFilter: filter.listening_states, checkExpired: false,
                },
                easSettings: { festivalVoice: filter.festival_voice, easDirectory: filter.eas_settings.eas_directory, easIntroWav: filter.eas_settings.eas_intro }
            }
        }

        if (isRefreshing) { this.manager.setSettings(settings); return; }
        this.manager = new this.package(settings);
        this.manager.on(`onAlerts`, (alerts) => { this.handle(alerts); });
        this.manager.on(`onConnection`, async (displayName) => {loader.submodules.utils.log(`Connected to NOAA Weather Wire Service as ${displayName}.`);});
        this.manager.on(`onReconnection`, (service) => { now = new Date(); displayTimestamp = `${String(now.getUTCMonth() + 1).padStart(2, '0')}/${String(now.getUTCDate()).padStart(2, '0')} ${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')}`; this.manager.setDisplayName(`AtmosphericX v${loader.submodules.utils.version()} -> ${displayName} (${displayTimestamp}) (x${service.reconnects})`) })
        this.manager.on(`log`, (message) => { loader.submodules.utils.log(message, { title: `\x1b[33m[ATMOSX-PARSER]\x1b[0m` }); });
        loader.cache.internal.manager = this.manager;
    }

}

export default Alerts;

