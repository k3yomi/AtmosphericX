import {
  cache,
  packages,
  submodules
} from "./chunk-US3JLQEF.mjs";

// src/submodules/express/@routes/core.ts
var Init = class {
  constructor() {
    this.NAME_SPACE = `submodule:@routes:core`;
    this.PORTAL_DIRECT = `/www/__pages/__portal/index.html`;
    this.DASHBOARD_DIRECT = `/www/__pages/__dashboard/index.html`;
    submodules.utils.log(`${this.NAME_SPACE} initialized.`);
    const parentDirectory = packages.path.resolve(`..`, `storage`);
    cache.handlers.express.get(`/`, (request, response) => {
      const ConfigType = cache.internal.configurations;
      const isPortal = ConfigType.web_hosting_settings.is_login_required;
      const isLogon = cache.internal.accounts.find((a) => {
        var _a;
        return a.session == ((_a = request.headers.cookie) == null ? void 0 : _a.split(`=`)[1]);
      });
      if (isPortal && !isLogon) {
        return response.sendFile(`${parentDirectory}${this.PORTAL_DIRECT}`);
      }
      return response.sendFile(`${parentDirectory}${this.DASHBOARD_DIRECT}`);
    });
  }
};
var core_default = Init;
export {
  Init,
  core_default as default
};
