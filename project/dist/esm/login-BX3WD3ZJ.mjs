import {
  __async,
  cache,
  packages,
  submodules
} from "./chunk-V4INPCA6.mjs";

// src/submodules/express/@routes/login.ts
var Init = class {
  constructor() {
    this.NAME_SPACE = `submodule:@routes:login`;
    this.SESSION_ACCOUNT_INACTIVE_MESSAGE = `Account is not activated. Please contact the host administrator. If this is your instance, you must activate your account via the root account.`;
    this.SESSION_ACCOUNT_DUPLICATE_MESSAGE = `An active session already exists for this account. Please logout from other sessions before logging in again.`;
    this.SESSION_INVALID_MESSAGE = `Invalid username or password.`;
    this.SESSION_SUCCESS_MESSAGE = `Login successful.`;
    submodules.utils.log(`${this.NAME_SPACE} initialized.`);
    cache.internal.express.post(`/api/login`, (request, response) => __async(this, null, function* () {
      const ConfigType = cache.internal.configurations;
      const body = JSON.parse(yield new Promise((resolve, reject) => {
        let data = ``;
        request.on(`data`, (chunk) => data += chunk);
        request.on(`end`, () => resolve(data));
        request.on(`error`, (error) => reject(error));
      }));
      const username = body.username;
      const password = body.password ? packages.crypto.createHash(`sha256`).update(body.password).digest(`base64`) : "";
      const account = submodules.database.query(`SELECT * FROM accounts WHERE username = ? AND hash = ? LIMIT 1`, [username, password]);
      if (account.length == 0) {
        submodules.utils.log(`${this.NAME_SPACE} - Failed login attempt for username: ${username} @ ${request.headers["cf-connecting-ip"] || request.connection.remoteAddress}`);
        return response.status(401).json({ message: this.SESSION_INVALID_MESSAGE });
      }
      if (account[0].activated == 0) {
        submodules.utils.log(`${this.NAME_SPACE} - Inactive account login attempt for username: ${username} @ ${request.headers["cf-connecting-ip"] || request.connection.remoteAddress}`);
        return response.status(403).json({ message: this.SESSION_ACCOUNT_INACTIVE_MESSAGE });
      }
      if (cache.internal.accounts.find((a) => a.username == username)) {
        submodules.utils.log(`${this.NAME_SPACE} - Duplicate login attempt for username: ${username} @ ${request.headers["cf-connecting-ip"] || request.connection.remoteAddress}`);
        return response.status(409).json({ message: this.SESSION_ACCOUNT_DUPLICATE_MESSAGE });
      }
      const session = packages.crypto.randomBytes(32).toString("hex");
      response.cookie(`session`, session, {
        httpOnly: true,
        secure: ConfigType.web_hosting_settings.settings.is_https,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1e3
      });
      cache.internal.accounts.push({
        username,
        session,
        address: request.headers["cf-connecting-ip"] || request.connection.remoteAddress,
        agent: request.headers["user-agent"] || "unknown"
      });
      submodules.utils.log(`${this.NAME_SPACE} - Successful login for username: ${username} @ ${request.headers["cf-connecting-ip"] || request.connection.remoteAddress}`);
      return response.status(200).json({ message: this.SESSION_SUCCESS_MESSAGE });
    }));
  }
};
var login_default = Init;
export {
  Init,
  login_default as default
};
