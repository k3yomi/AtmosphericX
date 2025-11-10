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
        - Added periodic update checks and random alert cycles.
        - Added immediate initialization of networking and alert submodules.                  
*/


import * as loader from './bootstrap';
import * as types from './types';

new Promise(async (resolve) => {
    const ConfigType = loader.cache.internal.configurations as types.ConfigurationsType;
    loader.submodules.networking.updateCache();
    loader.submodules.networking.getUpdates();
    loader.submodules.alerts.randomize();
    new loader.packages.jobs.Cron(ConfigType.internal_settings.global_update, () => { loader.submodules.networking.updateCache();  });
    new loader.packages.jobs.Cron(ConfigType.internal_settings.update_check, () => { loader.submodules.networking.getUpdates(); });
    new loader.packages.jobs.Cron(ConfigType.internal_settings.random_update, () => { loader.submodules.alerts.randomize(); });
})

 
