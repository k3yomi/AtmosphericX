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
        - Improved type safety and method accessibility
        - Refactored parsing methods for that better clarity so I'm not left wondering what the
          hell I was thinking when I wrote this in the future.  
        - Added Sonde Project Weather Eye data (https://sonde.projectweathereye.org/map) parsing support.
          Credits: Vince Waelti (https://www.youtube.com/@stormchaservince)  
        - Added Tropical Storm Tracking + SPC Mesoscale Discussions parsing support from 
          WeatherWise API (https://weatherwise.app)             
*/


import * as loader from '../bootstrap';
import * as types from '../types';

export class Parsing { 
    NAME_SPACE: string
    constructor() {
        this.NAME_SPACE = `submodule:parsing`;
        this.initialize();
    }

    private initialize() {
        loader.submodules.utils.log(`${this.NAME_SPACE} initialized.`)
    }

    public async getGibsonReportStructure(body: string): Promise<types.GeoJSONFeatureCollection> {
        const structure: types.GeoJSONFeatureCollection = { type: 'FeatureCollection', features: [] };
        const parsed = await loader.packages.placefile.PlacefileManager.parseTable(body) as types.GibsonRidgeReportTypes[];
        for (const feature of parsed) {
            const lon = parseFloat(feature.lon);
            const lat = parseFloat(feature.lat);
            if (isNaN(lon) || isNaN(lat)) continue;
            structure.features.push({
                type: 'Feature',
                geometry: { type: 'Point', coordinates: [lon, lat] },
                properties: {
                    location: `${feature.city ?? 'N/A'}, ${feature.county ?? 'N/A'}, ${feature.state ?? 'N/A'}`,
                    event: feature.event ?? 'N/A',
                    sender: feature.source ?? 'N/A',
                    description: `${feature.event ?? 'Event'} reported at ${feature.city ?? 'Unknown'}, ${feature.county ?? 'Unknown'}, ${feature.state ?? 'Unknown'}. ${feature.comment ?? 'No additional details.'}`,
                    magnitude: feature.mag ?? 0,
                    office: feature.office ?? 'N/A',
                    date: feature.date ?? 'N/A',
                    time: feature.time ?? 'N/A'
                }
            });
        }
        return structure;
    }

    public async getSpotterReportStructure(body: string): Promise<types.GeoJSONFeatureCollection> {
        const structure: types.GeoJSONFeatureCollection = { type: 'FeatureCollection', features: [] };
        const parsed = await loader.packages.placefile.PlacefileManager.parsePlacefile(body) as types.DefaultPlacefileParsingTypes[];
        for (const feature of parsed) {
            const lon = parseFloat(feature.icon.x);
            const lat = parseFloat(feature.icon.y);
            if (isNaN(lon) || isNaN(lat)) continue;
            const lines = feature.icon.label.split('\n').map(l => l.trim());
            structure.features.push({
                type: 'Feature',
                geometry: { type: 'Point', coordinates: [lon, lat] },
                properties: {
                    event: lines[1] ?? 'N/A',
                    reporter: lines[0]?.replace('Reported By:', '').trim() ?? 'N/A',
                    size: lines[2]?.replace('Size:', '').trim() ?? 'N/A',
                    notes: lines[3]?.replace('Notes:', '').trim() ?? 'N/A',
                    sender: "Spotter Network",
                    description: feature.icon.label.replace(/\n/g, '<br>').trim() ?? 'N/A'
                }
            });
        }
        return structure;
    }
    
    public async getSPCDiscussions(body: string): Promise<types.GeoJSONFeatureCollection> {
        const structure: types.GeoJSONFeatureCollection = { type: 'FeatureCollection', features: [] };
        const parsed = await loader.packages.placefile.PlacefileManager.parseGeoJSON(body) as types.SPCDiscussionTypes[];
        for (const feature of parsed) {
            if (!feature.properties || !feature.coordinates) continue;
            if (feature.properties.expires_at_ms < Date.now()) continue;
            const torProb = loader.packages.manager.TextParser.textProductToString(feature.properties.text, 'MOST PROBABLE PEAK TORNADO INTENSITY...', []);
            const winProb = loader.packages.manager.TextParser.textProductToString(feature.properties.text, 'MOST PROBABLE PEAK WIND GUST...', []);
            const hagProb = loader.packages.manager.TextParser.textProductToString(feature.properties.text, 'MOST PROBABLE PEAK HAIL SIZE...', []);
            structure.features.push({
                type: 'Feature',
                geometry: { type: 'Polygon', coordinates: feature.coordinates },
                properties: {
                    mesoscale_id: feature.properties.number ?? 'N/A',
                    expires: feature.properties.expires_at_ms ? new Date(feature.properties.expires_at_ms).toLocaleString() : 'N/A',
                    issued: feature.properties.issued_at_ms ? new Date(feature.properties.issued_at_ms).toLocaleString() : 'N/A',
                    description: loader.packages.manager.TextParser.textProductToDescription(feature.properties.text)?.replace(/\n/g, '<br>') ?? 'N/A',
                    locations: feature.properties.tags?.AREAS_AFFECTED?.join(', ') ?? 'N/A',
                    outlook: feature.properties.tags?.CONCERNING?.join(', ') ?? 'N/A',
                    population: feature.properties.population?.people?.toLocaleString() ?? '0',
                    homes: feature.properties.population?.homes?.toLocaleString() ?? '0',
                    parameters: {
                        tornado_probability: torProb,
                        wind_probability: winProb,
                        hail_probability: hagProb,
                    },
                }
            });
        }
        return structure;
    }

    public async getSpotterFeed(body: string): Promise<types.GeoJSONFeatureCollection> {
        const ConfigType = loader.cache.internal.configurations as types.ConfigurationsType;
        const feedConfig = ConfigType.sources?.location_settings?.spotter_network_feed;
        const structure: types.GeoJSONFeatureCollection = { type: 'FeatureCollection', features: [] };
        const parsed = await loader.packages.placefile.PlacefileManager.parsePlacefile(body) as types.DefaultPlacefileParsingTypes[];
        for (const feature of parsed) {
            const lon = parseFloat(feature.object.coordinates[1]);
            const lat = parseFloat(feature.object.coordinates[0]);
            if (isNaN(lon) || isNaN(lat)) continue;
            const isActive = (feature.icon.scale === 6 && feature.icon.type === '2') && feedConfig.pins.active;
            const isStreaming = (feature.icon.scale === 1 && feature.icon.type === '19') && feedConfig.pins.streaming;
            const isIdle = (feature.icon.scale === 6 && feature.icon.type === '6') && feedConfig.pins.idle;
            if (!isActive && !isStreaming && (!isIdle || !feedConfig.pins.offline)) continue;
            if (feedConfig.pin_by_name.length > 0) {
                const idx = feedConfig.pin_by_name.findIndex(name => feature.icon.label.includes(name));
                if (idx !== -1) {
                    const name = feedConfig.pin_by_name[idx];
                    loader.cache.external.locations.spotter_network = { lat, lon };
                    loader.cache.internal.manager.setCurrentLocation(name, { lat, lon });
                }
            }
            let distance = 0;
            if (loader.cache.external.locations.spotter_network) {
                distance = loader.submodules.calculations.calculateDistance(
                    { lat, lon },
                    { lat: loader.cache.external.locations.spotter_network.lat, lon: loader.cache.external.locations.spotter_network.lon }
                );
            }
            structure.features.push({
                type: 'Feature',
                geometry: { type: 'Point', coordinates: [lon, lat] },
                properties: {
                    description: feature.icon.label?.replace(/\n/g, '<br>') ?? 'N/A',
                    distance,
                    status: isActive ? 'Active' : isStreaming ? 'Streaming' : isIdle ? 'Idle' : 'Unknown',
                }
            });
        }
        return structure;
    }

    public async getProbabilityStructure(body: string, type: 'tornado' | 'severe'): Promise<types.ProbabilityTypes[]> {
        const structure: types.ProbabilityTypes[] = [];
        const ConfigType = loader.cache.internal.configurations as types.ConfigurationsType;
        const threshold = ConfigType.sources.probability_settings[type]?.percentage_threshold ?? 50;
        const typeRegexp = type === 'tornado' ? /ProbTor: (\d+)%\// : /PSv3: (\d+)%\//;
        const parsed = await loader.packages.placefile.PlacefileManager.parsePlacefile(body) as types.DefaultPlacefileParsingTypes[];
        for (const feature of parsed) {
            if (!feature.line?.text) continue;
            const probMatch = feature.line.text.match(typeRegexp);
            const probability = probMatch ? parseInt(probMatch[1]) : 0;
            const shearMatch = feature.line.text.match(/Max LLAzShear: ([\d.]+)/);
            const shear = shearMatch ? parseFloat(shearMatch[1]) : 0;
            if (probability >= threshold) {
                structure.push({
                    type,
                    probability,
                    shear,
                    description: feature.line.text.replace(/\n/g, '<br>') ?? 'N/A'
                });
            }
        }
        return structure;
    }
  
    public getWxRadioStructure(body: types.WxRadioTypes): types.GeoJSONFeatureCollection {
        let structure = { type: 'FeatureCollection', features: [] }
        for (const feature of body.sources) {
            const lon = parseFloat(feature.lon as string);
            const lat = parseFloat(feature.lat as string);
            if (isNaN(lon) || isNaN(lat)) continue;
            structure.features.push({
                type: 'Feature',
                geometry: {type: 'Point', coordinates: [lon, lat]},
                properties: {
                    location: feature?.location ?? 'N/A', callsign: feature?.callsign ?? 'N/A',
                    frequency: feature?.frequency ?? 'N/A', stream: feature?.listen_url ?? 'N/A',
                }
            })
        }
        return structure;
    }

    public getTropicalStormStructure(body: types.TropicalStormTypes[]): types.GeoJSONFeatureCollection {
        const structure: types.GeoJSONFeatureCollection = { type: 'FeatureCollection', features: [] };
        for (const feature of body) {
            structure.features.push({
                type: 'Feature',
                properties: {
                    name: feature.name ?? 'N/A',
                    discussion: feature.forecast_discussion ?? 'N/A',
                    classification: feature.classification ?? 'N/A',
                    pressure: feature.pressure ?? 0,
                    wind_speed: feature.wind_speed_mph ?? 0,
                    last_updated: feature.last_update_at ? new Date(feature.last_update_at).toLocaleString() : 'N/A'
                }
            });
        }
        return structure;
    }

    public getWxEyeSondeStructure(body: unknown[]): Record<string, string>[] {
        return body.map(feature => feature as Record<string, string>);
    }
}

export default Parsing;

