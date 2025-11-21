import {
  cache,
  submodules
} from "./chunk-V4INPCA6.mjs";

// src/submodules/express/@routes/logout.ts
var Init = class {
  constructor() {
    this.NAME_SPACE = `submodule:@routes:logout`;
    this.SESSION_INVALID_MESSAGE = `Session invalidated`;
    this.SESSION_LOGOUT_SUCCESS_MESSAGE = `Logout successful.`;
    this.SESSION_LOGOUT_NO_ACTIVE_MESSAGE = `No active session found.`;
    submodules.utils.log(`${this.NAME_SPACE} initialized.`);
    cache.internal.express.post(`/api/logout`, (request, response) => {
      const session = cache.internal.accounts.find((a) => {
        var _a;
        return a.session == ((_a = request.headers.cookie) == null ? void 0 : _a.split(`=`)[1]);
      });
      if (!session) {
        return response.status(401).json({ message: this.SESSION_LOGOUT_NO_ACTIVE_MESSAGE });
      }
      submodules.utils.log(`${this.NAME_SPACE} - Successful logout for username: ${session.username} @ ${request.headers["cf-connecting-ip"] || request.connection.remoteAddress}`);
      return this.invalidateSession(response, session);
    });
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
var logout_default = Init;
export {
  Init,
  logout_default as default
};
