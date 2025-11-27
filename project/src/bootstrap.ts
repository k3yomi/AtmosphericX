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


/* [ AtmosphericX Custom Modules ] */
import {AlertManager, TextParser} from 'atmosx-nwws-parser';
import * as tempest from 'atmosx-tempest-pulling';
import * as placefile from 'atmosx-placefile-parser';

/* [ Variable Exports ] */
import sqlite3 from 'better-sqlite3';
import express from 'express';
import rateLimit from 'express-rate-limit';
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
import parsing from './submodules/parsing';
import routes from './submodules/express/routing';
import gps from './submodules/gps';
import database from './submodules/database';



/* [ Global Cache ] */
export const cache = {
    external: {
        configurations: {}, 
        changelogs: null, 
        version: null,
        spotter_network_feed: [],
        storm_reports: [],
        storm_prediction_center_mesoscale: [],
        tropical_storm_tracks: [],
        sonde_project_weather_eye: [],
        wx_radio: [],
        tornado: [],
        severe: [],
        manual: {features: []},
        events: {features: []},
        rng: {index: 0, alert: null},
        hashes: [],
        placefiles: {},
        locations: {},
    }, 
    internal: {
        getSource: `NWS`,
        configurations: {}, 
        logs: {
            __console__: [],
            __events__: []
        },
        accounts: [],
        ratelimits: {},
        http_timers: {},
        express: null,
        limiter: null,
        manager: null,
        websocket: null,
        socket: null,
        webhooks: [],
        last_cache_update: 0,
        metrics: {
            start_uptime: Date.now(),
            memory_usage: 0,
            events_processed: 0,
        }
    },
};

export const strings = {
    updated_requied: `New version available: {ONLINE_PARSED} (Current version: {OFFLINE_VERSION})\n${("\t").repeat(5)} Update by running update.sh or download the latest version from GitHub.\n${("\t").repeat(5)} =================== CHANGE LOGS ======================= \n${("\t").repeat(5)} {ONLINE_CHANGELOGS}\n\n`,
    updated_required_failed: `Failed to check for updates. Please check your internet connection. This may also be due to an endpoint configuration change.`,
    new_event_legacy: `{SOURCE} | Alert {STATUS} >> {EVENT} [{TRACKING}]`,
    new_event_fancy: `├─ {bold}{EVENT} ({ACTION_TYPE}) [{TRACKING}]{/bold}\n` +`│  ├─ Issued: {ISSUED} ({EXPIRES})\n` +`│  ├─ Sender {SENDER}\n` + `│  ├─ Tags: {TAGS}\n` +`│  ├─ Locations: {LOCATIONS}\n` +`│  └─ Distance: {DISTANCE}`,
    system_info: `{bold}Uptime:{/bold} {UPTIME}\n{bold}Memory Usage:{/bold} {MEMORY} MB\n{bold}Heap Usage:{/bold} {HEAP} MB\n{bold}Events Processed:{/bold} {EVENTS_PROCESSED}\n`,
    portal_disabled_warning: `\n\n[SECURITY] THE PORTAL LOGIN PAGE IS DISABLED,\n\t   THIS IS NOT RECOMMENDED FOR PRODUCTION USE AS EVERYONE CAN ACCESS THE DASHBOARD WITHOUT AUTHENTICATION.\n\t   YOU CAN SIMPLY DO IP WHITELISTING THROUGH A WEB SERVER OR FIREWALL IF YOU WISH TO KEEP THIS OFF.\n\t   IF YOU WISH TO ENABLE THE PORTAL LOGIN PAGE, PLEASE SET THE PORTAL CONFIG TO TRUE IN THE CONFIGURATION FILE.\n\n`,
}

/* [ Package Exports ] */
export const packages = {
    events, path, fs, sqlite3,
    express, cookieParser, crypto, http,
    https, axios, xmpp, os, jsonc,
    xml2js, AlertManager, TextParser, tempest, placefile, 
    shapefile, ws, firebaseApp, 
    firebaseDatabase, streamerBot, jobs, 
    gui, rateLimit
};


/* [ Submodule Initialization ] */
const submoduleClasses = {
    utils, alerts, calculations, networking,
    structure, display, parsing, routes, gps,
    database
};

export const submodules: any = {};
Object.entries(submoduleClasses).forEach(([key, Class]) => {submodules[key] = new Class();});
