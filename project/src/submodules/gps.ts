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

export class GlobalPositioningSystem { 
    NAME_SPACE: string = `submodule:gps`;
    constructor() {
        loader.submodules.utils.log(`${this.NAME_SPACE} initialized.`)
    }
 
    public setCurrentCoordinates(name: string, coords: types.CoordinatesDefined) {
        loader.cache.external.locations[name] = coords;
        loader.cache.internal.manager.setCurrentLocation(name, coords);
        loader.submodules.utils.log(`Updated current coordinates for ${name} [LAT: ${coords.lat}, LON: ${coords.lon}]`);
    }

}

export default GlobalPositioningSystem;

