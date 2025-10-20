/*
                                            _               _     __   __
         /\  | |                           | |             (_)    \ \ / /
        /  \ | |_ _ __ ___   ___  ___ _ __ | |__   ___ _ __ _  ___ \ V / 
       / /\ \| __| '_ ` _ \ / _ \/ __| '_ \| '_ \ / _ \ '__| |/ __| > <  
      / ____ \ |_| | | | | | (_) \__ \ |_) | | | |  __/ |  | | (__ / . \ 
     /_/    \_\__|_| |_| |_|\___/|___/ .__/|_| |_|\___|_|  |_|\___/_/ \_\
                                     | |                                 
                                     |_|                                                                                                                
    
    Written by: KiyoWx (k3yomi) & StarflightWx                    
*/


/* [ AtmosphericX Custom Modules ] */
import * as manager from 'atmosx-nwws-parser';
import * as tempest from 'atmosx-tempest-pulling';
import * as placefile from 'atmosx-placefile-parser';

/* [ Variable Exports ] */
import sqlite3 from 'better-sqlite3';
import express from 'express';
import cookieParser from 'cookie-parser';
import axios from 'axios';

/* [ All Modules Export ] */
import * as gui from 'blessed';
import * as events from 'events';
import * as path from 'path'; 
import * as fs from 'fs';
import * as crypto from 'crypto';
import * as http from 'http';
import * as https from 'https';
import * as xmpp from '@xmpp/client';
import * as os from 'os';
import * as xml2js from 'xml2js';
import * as shapefile from 'shapefile';
import * as ws from 'ws';
import * as firebaseApp from 'firebase/app';
import * as firebaseDatabase from 'firebase/database';
import * as streamerBot from '@streamerbot/client';
import * as jobs from 'croner';
import * as jsonc from 'jsonc-parser';

/* [ Submodule Exports ] */
import utils from './submodules/utils';
import alerts from './submodules/alerts';
import calculations from './submodules/calculations';
import networking from './submodules/networking';
import structure from './submodules/structure';
import display from './submodules/display';

/* [ Global Cache ] */
export const cache = {
    external: {
        configurations: {}, 
        changelogs: undefined, 
        version: undefined,
        spotter_network_feed: [],
        spotter_reports: [],
        grlevelx_reports: [],
        storm_prediction_center_mesoscale: [],
        tropical_storm_tracks: [],
        sonde_project_weather_eye: [],
        wx_radio: [],
        tornado: [],
        severe: [],
        manual_alert: [],
        active_alerts: [],
        locations: {
            spotter_network: {
                lat: 0,
                lon: 0
            },
            realtime_irl: {
                lat: 0,
                lon: 0
            },
        },
    }, 
    internal: {
        getSource: `NWS`,
        configurations: {}, 
        random_alert_ms: undefined,
        random_alert_index: undefined,
        webhook_queue: [],
        events: {features: []},
        hashes: [],
        logs: [],
        http_timers: {},
        express: undefined,
        manager: undefined,
        websocket: undefined,
        sessions: [],
        metrics: {
            start_uptime: Date.now(),
            memory_usage: 0,
            events_processed: 0,
        }
    },
    placefiles: {},
};

export const strings = {
    updated_requied: `New version available: {ONLINE_PARSED} (Current version: {OFFLINE_VERSION})\n${("\t").repeat(5)} Update by running update.sh or download the latest version from GitHub.\n${("\t").repeat(5)} =================== CHANGE LOGS ======================= \n${("\t").repeat(5)} {ONLINE_CHANGELOGS}\n\n`,
    updated_required_failed: `Failed to check for updates. Please check your internet connection. This may also be due to an endpoint configuration change.`,
    new_event_legacy: `{SOURCE} | Alert {STATUS} >> {EVENT} [{TRACKING}]`,
    new_event_fancy: `├─ {bold}{EVENT} ({ACTION_TYPE}) [{TRACKING}]{/bold}\n` +`│  ├─ Issued: {ISSUED} ({EXPIRES})\n` +`│  ├─ Sender {SENDER}\n` + `│  ├─ Tags: {TAGS}\n` +`│  ├─ Locations: {LOCATIONS}\n` +`│  └─ Distance: {DISTANCE})`,
    system_info: `{bold}Uptime:{/bold} {UPTIME}\n{bold}Memory Usage:{/bold} {MEMORY} MB\n{bold}Heap Usage:{/bold} {HEAP} MB\n{bold}Events Processed:{/bold} {EVENTS_PROCESSED}\n`,
}

/* [ Package Exports ] */
export const packages = {
    events, path, fs, sqlite3,
    express, cookieParser, crypto, http,
    https, axios, xmpp, os, jsonc,
    xml2js, manager, tempest, placefile, 
    shapefile, ws, firebaseApp, 
    firebaseDatabase, streamerBot, jobs, 
    gui
};


/* [ Submodule Initialization ] */
const submoduleClasses = {
    utils, alerts, calculations, networking,
    structure, display,
};

export const submodules: any = {};
Object.entries(submoduleClasses).forEach(([key, Class]) => {submodules[key] = new Class();});
