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
        - Implemented calculations for geographic and temporal data.
        - Created methods for distance calculation, time remaining, and duration formatting.
        - Developed degree to cardinal direction conversion.
        - Enhanced accuracy and error handling in calculations.                   
*/


import * as loader from '../bootstrap';
import * as types from '../types';

export class Calculations { 
    NAME_SPACE: string
    constructor() {
        this.NAME_SPACE = `submodule:calculations`;
        this.initialize();
    }

    private initialize() {
        loader.submodules.utils.log(`${this.NAME_SPACE} initialized.`)
    }

    /**
     * Convert degrees to cardinal direction.
     * Example: 0 -> N, 45 -> NE, 90 -> E, etc.
     *
     * @public
     * @param {number} degrees 
     * @returns {string} 
     */
    public convertDegreesToCardinal(degrees: number): string { 
        if (!Number.isFinite(degrees) || degrees < 0 || degrees > 360) {
            return "Invalid";
        }
        const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
        const normalized = (degrees % 360 + 360) % 360; // normalize in case of floating precision
        const index = Math.round(normalized / 45) % 8;
        return directions[index];
    }

    /**
     * Calculate the distance between 2 given coordinates.
     *
     * @public
     * @async
     * @param {types.Coordinates} coord1 
     * @param {types.Coordinates} coord2 
     * @param {('miles' | 'kilometers')} [unit='miles'] 
     * @returns {Promise<number>} 
     */
    public calculateDistance(coord1: types.Coordinates, coord2: types.Coordinates, unit: 'miles' | 'kilometers' = 'miles'): number {
        if (!coord1 || !coord2) return 0;
        const { lat: lat1, lon: lon1 } = coord1;
        const { lat: lat2, lon: lon2 } = coord2;
        if ([lat1, lon1, lat2, lon2].some(v => typeof v !== 'number')) return 0;
        const toRad = (deg: number) => deg * Math.PI / 180;
        const R = unit === 'miles' ? 3958.8 : 6371;
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round(R * c * 100) / 100;
    }

    /**
     * Calculates the time remaining until a specified future date.
     * Example: 124560000 ms -> "1d 10h 20m 0s"
     *
     * @public
     * @param {Date} futureDate 
     * @returns {string} 
     */
    public timeRemaining(futureDate: Date): string {
        if (Number.isFinite(futureDate) || isNaN(futureDate.getTime())) {
            return "Invalid Date";
        }
        const now = new Date();
        const target = new Date(futureDate);
        const diff = target.getTime() - now.getTime();
        if (diff <= 0) { return "Expired"; }
        const totalSeconds = Math.floor(diff / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const parts: string[] = [];
        if (days) parts.push(`${days}d`);
        if (hours) parts.push(`${hours}h`);
        if (minutes) parts.push(`${minutes}m`);
        parts.push(`${seconds}s`);
        return parts.join(" ");
    }

    /**
     * Formats a duration given in milliseconds into a human-readable string.
     * Example: 90061000 ms -> "1d 1h 1m 1s"
     *
     * @public
     * @param {number} uptimeMs 
     * @returns {string} 
     */
    public formatDuration(uptimeMs: number): string {
        if (!Number.isFinite(uptimeMs) || uptimeMs < 0) {
            return "0s";
        }
        const totalSeconds = Math.floor(uptimeMs / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const parts: string[] = [];
        if (days) parts.push(`${days}d`);
        if (hours) parts.push(`${hours}h`);
        if (minutes) parts.push(`${minutes}m`);
        parts.push(`${seconds}s`);
        return parts.join(" ");
    }
    
}

export default Calculations;

