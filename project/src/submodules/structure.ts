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
        - Webhook integration for alert dispatching.
*/

import * as loader from '../bootstrap';
import * as types from '../types';

export class Structure { 
    NAME_SPACE: string
    constructor() {
        this.NAME_SPACE = `submodule:structure`;
        this.initialize();
    }

    private initialize() {
        loader.submodules.utils.log(`${this.NAME_SPACE} initialized.`)
    }

	private async parsing(body?: unknown, type?: string): Promise<any[]> {
        switch (type) {
            case 'spotter_network_feed': return loader.submodules.parsing.getSpotterFeed(body);
            case 'storm_prediction_center_mesoscale': return loader.submodules.parsing.getSPCDiscussions(body);
            case 'spotter_reports': return loader.submodules.parsing.getSpotterReportStructure(body);
            case 'grlevelx_reports': return loader.submodules.parsing.getGibsonReportStructure(body);
            case 'tropical_storm_tracks': return loader.submodules.parsing.getTropicalStormStructure(body);
            case 'tornado': return loader.submodules.parsing.getProbabilityStructure(body, 'tornado');
            case 'severe': return loader.submodules.parsing.getProbabilityStructure(body, 'severe');
            case 'sonde_project_weather_eye': return loader.submodules.parsing.getWxEyeSondeStructure(body);
            case 'wx_radio': return loader.submodules.parsing.getWxRadioStructure(body);
            default: return [];
        }
    }

	private getEventMetadata(event: types.EventType) {
    	const ConfigType = loader.cache.internal.configurations as types.ConfigurationsType;
		const schemes = ConfigType.alert_schemes[event.properties.event]
			|| ConfigType.alert_schemes[event.properties.parent]
			|| ConfigType.alert_schemes['Default'];
		const dictionary = ConfigType.alert_dictionary[event.properties.event]
			|| ConfigType.alert_dictionary[event.properties.parent]
			|| ConfigType.alert_dictionary['Special Event'];
		// Determine SFX based on event status
		let sfx = dictionary.sfx_cancel;
		if (event.properties.is_issued) sfx = dictionary.sfx_issued;
		else if (event.properties.is_updated) sfx = dictionary.sfx_update;
		else if (event.properties.is_cancelled) sfx = dictionary.sfx_cancel;
		return { sfx, scheme: schemes, metadata: dictionary.metadata };
	}

	public register(event: types.EventType) {
		const ConfigType = loader.cache.internal.configurations as types.ConfigurationsType;
		const eventName = event.properties.event;
		const isPriorityEvent = ConfigType.filters.priority_events.includes(eventName);
		const isBeepAuthorizedOnly = ConfigType.filters.sfx_beep_only;
		const isShowingUpdatesAllowed = ConfigType.filters.show_updates;
		const eventMetadata = this.getEventMetadata(event);
		const isBeepOnly = isBeepAuthorizedOnly && isPriorityEvent;
		const isIgnored = !isShowingUpdatesAllowed && !isPriorityEvent;
		return {
			event,
			metadata: eventMetadata.metadata,
			scheme: eventMetadata.scheme,
			sfx: isBeepOnly ? ConfigType.tones.sfx_beep : eventMetadata.sfx,
			ignored: isIgnored,
			beep: isBeepOnly,
		};
	}

	public async create(data: unknown, isAlertupdate?: boolean): Promise<void> {
		const clean = loader.submodules.utils.filterWebContent(data);
		const ConfigType = loader.cache.internal.configurations as types.ConfigurationsType;
		const dataTypes = [
			{ key: 'spotter_network_feed', cache: 'spotter_network_feed' },
			{ key: 'spotter_reports', cache: 'storm_reports' },
			{ key: 'grlevelx_reports', cache: 'storm_reports' },
			{ key: 'storm_prediction_center_mesoscale', cache: 'storm_prediction_center_mesoscale' },
			{ key: 'tropical_storm_tracks', cache: 'tropical_storm_tracks' },
			{ key: 'tornado', cache: 'tornado' },
			{ key: 'severe', cache: 'severe' },
			{ key: 'sonde_project_weather_eye', cache: 'sonde_project_weather_eye' },
			{ key: 'wx_radio', cache: 'wx_radio' },
		];
		for (const { key, cache } of dataTypes) {
			if (clean[key]) {
				loader.cache.external[cache] = await this.parsing(clean[key], key);
			}
		}
		if (isAlertupdate && clean.events?.length) {
			for (const ev of clean.events) {
				const isAlreadyLogged = loader.cache.external.hashes.some(log => log.id === ev.event.hash);
				if (isAlreadyLogged) continue;
				if (ev.ignored) continue;
				loader.cache.external.hashes.push({ id: ev.event.hash, expires: ev.event.properties.expires });
				if (!loader.submodules.utils.isFancyDisplay()) {
					loader.submodules.utils.log(loader.submodules.alerts.displayAlert(ev));
				} else { 
					loader.submodules.utils.log(loader.submodules.alerts.displayAlert(ev), {}, `__events__`);
				}
				const webhooks = ConfigType.webhook_settings;
				const pSet = new Set((ConfigType.filters.priority_events || []).map(p => String(p).toLowerCase()));
				const title = `${ev.event.properties.event} (${ev.event.properties.action_type})`;
				const body = [
					`**Locations:** ${ev.event.properties.locations.slice(0, 259)}`,
					`**Issued:** ${ev.event.properties.issued}`,
					`**Expires:** ${ev.event.properties.expires}`,
					`**Wind Gusts:** ${ev.event.properties.parameters.max_wind_gust}`,
					`**Hail Size:** ${ev.event.properties.parameters.max_hail_size}`,
					`**Damage Threat:** ${ev.event.properties.parameters.damage_threat}`,
					`**Tornado Threat:** ${ev.event.properties.parameters.tornado_detection}`,
					`**Flood Threat:** ${ev.event.properties.parameters.flood_detection}`,
					`**Tags:** ${ev.event.properties.tags ? ev.event.properties.tags.join(', ') : 'N/A'}`,
					`**Sender:** ${ev.event.properties.sender_name}`,
					`**Tracking ID:** ${ev.event.tracking}`,
					'```',
					ev.event.properties.description.split('\n').map(line => line.trim()).filter(line => line.length > 0).join('\n'),
					'```'
				].join('\n');
				await loader.submodules.networking.sendWebhook(title,body, webhooks.general_alerts);
				if (pSet.has(ev.event.properties.event.toLowerCase())) {
					await loader.submodules.networking.sendWebhook(title, body, webhooks.critical_alerts);
				}
			}
		}
		loader.cache.external.events.features = clean.events || [];
		loader.submodules.routes.onUpdateRequest();
	}
}

export default Structure;

