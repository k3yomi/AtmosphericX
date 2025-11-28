import {
  cache,
  packages,
  submodules
} from "./chunk-US3JLQEF.mjs";

// src/index.ts
new Promise(() => {
  const ConfigType = cache.internal.configurations;
  new packages.jobs.Cron(ConfigType.internal_settings.global_update, () => {
    submodules.networking.updateCache();
    submodules.gps.getTrackingInformation();
  });
  new packages.jobs.Cron(ConfigType.internal_settings.update_check, () => {
    submodules.networking.getUpdates();
  });
  new packages.jobs.Cron(ConfigType.internal_settings.random_update, () => {
    submodules.alerts.randomize();
  });
});
