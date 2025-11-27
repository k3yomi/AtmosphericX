import {
  cache,
  packages,
  submodules
} from "./chunk-LZBD7MCR.mjs";

// src/index.ts
new Promise(() => {
  const ConfigType = cache.internal.configurations;
  new packages.jobs.Cron(ConfigType.internal_settings.global_update, () => {
    submodules.networking.updateCache();
  });
  new packages.jobs.Cron(ConfigType.internal_settings.update_check, () => {
    submodules.networking.getUpdates();
  });
  new packages.jobs.Cron(ConfigType.internal_settings.random_update, () => {
    submodules.alerts.randomize();
  });
});
