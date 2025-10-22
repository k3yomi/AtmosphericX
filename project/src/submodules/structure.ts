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
		- Refactored parsing and event registration methods for improved structure.
		- Enhanced event metadata retrieval for flexibility.
		- Implemented event registration with filtering options.
		- Created a comprehensive create method for handling various data types and alert updates.
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

    /**
	 * Parses incoming data based on type 
	 * Anything that requires specific parsing should be handled here 
	 *
	 * @private
	 * @async
	 * @param {?unknown} [body] 
	 * @param {?string} [type] 
	 * @returns {Promise<any[]>} 
	 */
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

    /**
	 * Retrieves event metadata such as SFX, scheme, and additional metadata 
	 *
	 * @private
	 * @param {types.EventType} event 
	 * @returns {{ sfx: string; scheme: Record<string, string>; metadata: Record<string, unknown>; }} 
	 */
	private getEventMetadata(event: types.EventType) {
    	const defConfig = loader.cache.internal.configurations as types.ConfigurationsType;
		const schemes = defConfig.alert_schemes[event.properties.event]
			|| defConfig.alert_schemes[event.properties.parent]
			|| defConfig.alert_schemes['Default'];
		const dictionary = defConfig.alert_dictionary[event.properties.event]
			|| defConfig.alert_dictionary[event.properties.parent]
			|| defConfig.alert_dictionary['Special Event'];
		// Determine SFX based on event status
		let sfx = dictionary.sfx_cancel;
		if (event.properties.is_issued) sfx = dictionary.sfx_issued;
		else if (event.properties.is_updated) sfx = dictionary.sfx_update;
		else if (event.properties.is_cancelled) sfx = dictionary.sfx_cancel;
		return { sfx, scheme: schemes, metadata: dictionary.metadata };
	}

    /**
	 * Registers an event with additional data such as sfx type, color scheme, and event metadata
	 *
	 * @private
	 * @param {types.EventType} event 
	 * @returns {{ event: types.EventType; metadata: any; scheme: any; sfx: any; ignored: boolean; beep: any; }} 
	 */
	private register(event: types.EventType) {
		const defConfig = loader.cache.internal.configurations as types.ConfigurationsType;
		const eventName = event.properties.event;
		const isPriorityEvent = defConfig.filters.priority_events.includes(eventName);
		const isBeepAuthorizedOnly = defConfig.filters.sfx_beep_only;
		const isShowingUpdatesAllowed = defConfig.filters.show_updates;
		const eventMetadata = this.getEventMetadata(event);
		const isBeepOnly = isBeepAuthorizedOnly && isPriorityEvent;
		const isIgnored = !isShowingUpdatesAllowed && !isPriorityEvent;
		return {
			event,
			metadata: eventMetadata.metadata,
			scheme: eventMetadata.scheme,
			sfx: isBeepOnly ? defConfig.tones.sfx_beep : eventMetadata.sfx,
			ignored: isIgnored,
			beep: isBeepOnly,
		};
	}

    /**
	 * Creates external cache entries and processes alert updates
	 *
	 * @public
	 * @async
	 * @param {unknown} data 
	 * @param {?boolean} [isAlertupdate] 
	 * @returns {Promise<void>} 
	 */
	public async create(data: unknown, isAlertupdate?: boolean): Promise<void> {
		const clean = loader.submodules.utils.filterWebContent(data);
		const dataTypes = [
			{ key: 'spotter_network_feed', cache: 'spotter_network_feed' },
			{ key: 'spotter_reports', cache: 'spotter_reports' },
			{ key: 'grlevelx_reports', cache: 'grlevelx_reports' },
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
		if (isAlertupdate && clean.alerts?.length) {
			for (const event of clean.alerts) {
				const isAlreadyLogged = loader.cache.internal.hashes.some(log => log.id === event.hash);
				if (isAlreadyLogged) continue;
				loader.cache.internal.hashes.push({ id: event.hash, expires: event.properties.expires });
				if (event.ignored) continue;
				if (!loader.submodules.utils.isFancyDisplay()) {
					loader.submodules.utils.log(loader.submodules.alerts.displayAlert(event.event));
				}
			}
		}
		loader.cache.external.events = clean.events || [];
	}
}

export default Structure;

