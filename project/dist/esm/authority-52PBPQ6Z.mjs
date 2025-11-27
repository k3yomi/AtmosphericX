import {
  cache,
  packages,
  submodules
} from "./chunk-LZBD7MCR.mjs";

// src/submodules/express/@middleware/authority.ts
var Init = class {
  constructor() {
    this.NAME_SPACE = `submodule:@middleware:authority`;
    this.SESSION_INVALID_MESSAGE = `Session invalidated`;
    this.RATELIMIT_INVALID_MESSAGE = `Too many requests - please try again later.`;
    this.RESPONSE_HEADERS = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Credentials": "true",
      "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
      "Surrogate-Control": "no-store"
    };
    var _a, _b, _c;
    submodules.utils.log(`${this.NAME_SPACE} initialized.`);
    const parentDirectory = packages.path.resolve(`..`, `storage`);
    const ConfigType = cache.internal.configurations;
    const limiter = packages.rateLimit({
      windowMs: ((_a = ConfigType.web_hosting_settings.settings.ratelimiting) == null ? void 0 : _a.window_ms) || 3e4,
      max: ((_b = ConfigType.web_hosting_settings.settings.ratelimiting) == null ? void 0 : _b.max_requests) || 125,
      handler: (__, response) => {
        return response.status(429).json({ message: this.RATELIMIT_INVALID_MESSAGE });
      }
    });
    if ((_c = ConfigType.web_hosting_settings.settings.ratelimiting) == null ? void 0 : _c.enabled) {
      cache.internal.express.use(limiter);
    }
    cache.internal.express.use((request, response, next) => {
      const session = cache.internal.accounts.find((a) => {
        var _a2;
        return a.session == ((_a2 = request.headers.cookie) == null ? void 0 : _a2.split(`=`)[1]);
      });
      const address = request.headers["cf-connecting-ip"] || request.connection.remoteAddress;
      const useragent = request.headers["user-agent"] || "Unknown";
      for (const key in this.RESPONSE_HEADERS) {
        response.setHeader(key, this.RESPONSE_HEADERS[key]);
      }
      if (session && session.address !== address || session && session.agent !== useragent) {
        this.invalidateSession(response, session);
      }
      next();
    });
    cache.internal.express.use(packages.cookieParser());
    cache.internal.express.use(`/src`, packages.express.static(`${parentDirectory}/www`));
    cache.internal.express.use(`/widgets`, packages.express.static(`${parentDirectory}/www/__pages/__widgets`));
    cache.internal.express.set(`trust proxy`, 1);
  }
  /**
   * @function invalidateSession
   * @description
   *      Invalidates the user session and clears the session cookie.
   *      Logs the logout event with the username and IP address.
   *      
   * @param response - The Express response object to send the logout confirmation.
   * @param session - The user session object containing username and session details.
   * @returns A JSON response confirming successful logout.
   */
  invalidateSession(response, session) {
    cache.internal.accounts = cache.internal.accounts.filter((a) => a.session != session.session);
    response.clearCookie(`session`);
    return response.status(401).json({ message: this.SESSION_INVALID_MESSAGE });
  }
};
var authority_default = Init;
export {
  Init,
  authority_default as default
};
