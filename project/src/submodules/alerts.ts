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
    Last Updated: 2025-11-10
    Changelogs: 
        - randomize method for random alert cycles.

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

    public displayAlert(registry?: types.RegisterType, isLiveFeed?: boolean): string {
        if (!loader.submodules.utils.isFancyDisplay() || !isLiveFeed) {
            return loader.strings.new_event_legacy
                .replace(`{EVENT}`, registry.event.properties.event)
                .replace(`{STATUS}`, registry.event.properties.action_type)
                .replace(`{TRACKING}`, registry.event.tracking.substring(0, 18))
                .replace(`{SOURCE}`, loader.cache.internal.getSource)
        } else {
            if (isLiveFeed) { 
                return loader.cache.external.events.features.sort((a: types.RegisterType, b: types.RegisterType) => {
                    const dateA = new Date(a.event.properties.issued).getTime();
                    const dateB = new Date(b.event.properties.issued).getTime();
                    return dateA - dateB
                }).map((registry: types.RegisterType) => {
                    return loader.strings.new_event_fancy
                    .replace(`{EVENT}`, registry.event.properties.event)
                    .replace(`{ACTION_TYPE}`, registry.event.properties.action_type)
                    .replace(`{TRACKING}`, registry.event.tracking.substring(0, 18))
                    .replace(`{SENDER}`, registry.event.properties.sender_name)
                    .replace(`{ISSUED}`, registry.event.properties.issued)
                    .replace(`{EXPIRES}`, loader.submodules.calculations.timeRemaining(registry.event.properties.expires))
                    .replace(`{TAGS}`, registry.event.properties.tags ? registry.event.properties.tags.join(', ') : 'N/A')
                    .replace(`{LOCATIONS}`, registry.event.properties.locations.substring(0, 100))
                    .replace(`{DISTANCE}`, (registry.event.properties.distance?.range != null ? Object.entries(registry.event.properties.distance.range).map(([key, value]: [string, any]) => {return `${key}: ${value.distance} ${value.unit}`;}).join(', ') : `No Distance Data Available`));
                }).join('\n')
            }
        }
    }

    public randomize(): types.EventType | null {
        const manual = Array.isArray(loader.cache.external.manual?.features) ? loader.cache.external.manual.features : [];
        const active = Array.isArray(loader.cache.external.events?.features) ? loader.cache.external.events.features : [];
        const alerts = [...manual, ...active].filter(alert => alert && Object.keys(alert).length > 0);
        if (alerts.length === 0) {
            loader.cache.external.rng = { alert: null, index: null };
            return null;
        }
        const currentIndex = loader.cache.external.rng?.index ?? 0;
        const nextIndex = (currentIndex + 1) % alerts.length;
        loader.cache.external.rng = {
            alert: alerts[currentIndex],
            index: nextIndex
        };
        return loader.cache.external.rng.alert;
    }

    private handle(events:  types.EventType[]): void {
        const features = loader.cache.external.events.features;
        for (const event of events) {
            const registeredEvent = loader.submodules.structure.register(event);
            const { tracking, properties, history = [] } = registeredEvent.event;
            const index = features.findIndex( feature => feature && feature.event.tracking === tracking );
            if (properties.is_cancelled && index !== -1) {
                features[index] = undefined; continue;
            }
            if (properties.is_issued && index === -1) {
                features.push(registeredEvent); continue;
            }
            if (properties.is_updated) {
                if (index !== -1 && features[index]) {
                    const existing = features[index];
                    const existingLocations = existing.event.properties.locations ?? "";
                    const mergedHistory = [ ...(existing.event.history ?? []), ...history ].sort(
                        (a, b) => new Date(b.issued).getTime() - new Date(a.issued).getTime()
                    );
                    existing.event.properties.event = properties.event;
                    existing.event.history = mergedHistory;
                    existing.event.properties = registeredEvent.event.properties;
                    const combinedLocations = [...new Set((existingLocations + "; " + registeredEvent.event.properties.locations)
                        .split(";")
                        .map(loc => loc.trim())
                        .filter(Boolean)),
                    ].join("; ");
                    existing.event.properties.locations = combinedLocations;
                } else {
                    features.push(registeredEvent);
                }
            }
        }
        loader.cache.internal.metrics.events_processed += events.length;
        loader.submodules.networking.updateCache(true);
    }

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
            is_wire: alerts.noaa_weather_wire_service,
            journal: alerts.journal,
            noaa_weather_wire_service_settings: {
                reconnection_settings: { enabled: nwws.client_reconnections.attempt_reconnections, interval: nwws.client_reconnections.reconnection_attempt_interval, },
                credentials: { username: nwws.client_credentials.username, password: nwws.client_credentials.password, nickname: `AtmosphericX v${loader.submodules.utils.version()} -> ${displayName} (${displayTimestamp})`, },   
                cache: { enabled: nwws.client_cache.read_cache, max_file_size: nwws.client_cache.max_size_mb, max_db_history: nwws.client_cache.max_db_history, directory: nwws.client_cache.directory, },
                preferences: { cap_only: nwws.alert_preferences.cap_only, shapefile_coordinates: nwws.alert_preferences.implement_db_ugc, }
            },
            national_weather_service_settings: { interval: nws.interval, endpoint: nws.endpoint, },
            global_settings: {
                parent_events_only: alerts.global_settings.parent_events,
                better_event_parsing: alerts.global_settings.better_parsing,
                filtering: { 
                    location: { max_distance: filter.location_settings.max_distance, unit: filter.location_settings.unit, filter: filter.location_settings.enabled },
                    ignore_text_products: filter.ignore_tests,
                    events: filter.all_events == true ? [] : filter.listening_events, ignored_events: filter.ignored_events, filtered_icoa: filter.listening_icoa, ignored_icoa: filter.ignored_icoa, ugc_filter: filter.listening_ugcs, state_filter: filter.listening_states, check_expired: false,
                },
                eas_settings: { festival_tts_voice: filter.festival_voice, directory: filter.eas_settings.eas_directory, intro_wav: filter.eas_settings.eas_intro }
            }
        }
        if (isRefreshing) { this.manager.setSettings(settings); return; }
        this.manager = new this.package(settings);
        this.manager.on(`onAlerts`, (alerts) => { this.handle(alerts); });
        this.manager.on(`onMessage`, async (message) => { 
            const ConfigType = loader.cache.internal.configurations as types.ConfigurationsType;
            const webhooks = ConfigType.webhook_settings;
            await loader.submodules.networking.sendWebhook(`New Stanza - ${message.awipsType.type}`, `\`\`\`${message.message}\`\`\``, webhooks.misc_alerts);
        });
        this.manager.on(`onConnection`, async (displayName) => {loader.submodules.utils.log(`Connected to NOAA Weather Wire Service as ${displayName}.`);});
        this.manager.on(`onReconnection`, (service) => { now = new Date(); displayTimestamp = `${String(now.getUTCMonth() + 1).padStart(2, '0')}/${String(now.getUTCDate()).padStart(2, '0')} ${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')}`; this.manager.setDisplayName(`AtmosphericX v${loader.submodules.utils.version()} -> ${displayName} (${displayTimestamp}) (x${service.reconnects})`) })
        this.manager.on(`log`, (message) => { loader.submodules.utils.log(message, { title: `\x1b[33m[ATMOSX-PARSER]\x1b[0m` }); });
        loader.cache.internal.manager = this.manager;
    }

}

export default Alerts;

