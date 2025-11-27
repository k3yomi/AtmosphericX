import {
  __async,
  cache,
  packages,
  submodules
} from "./chunk-LZBD7MCR.mjs";

// src/submodules/express/@routes/signup.ts
var Init = class {
  constructor() {
    this.NAME_SPACE = `submodule:@routes:signup`;
    this.SESSION_ACCOUNT_EXISTS_MESSAGE = `Account with this username already exists.`;
    this.SESSION_INVALID_USERNAME_MESSAGE = `Invalid username. Usernames must be 3-20 characters long and can only contain letters, numbers, underscores, hyphens, and periods.`;
    this.SESSION_SUCCESS_MESSAGE = `Account created successfully. Please contact the host administrator to activate your account.`;
    this.ALLOWED_CHARS = /^[a-zA-Z0-9_\-\.]{3,20}$/;
    submodules.utils.log(`${this.NAME_SPACE} initialized.`);
    cache.internal.express.post(`/api/signup`, (request, response) => __async(this, null, function* () {
      const body = JSON.parse(yield new Promise((resolve, reject) => {
        let data = ``;
        request.on(`data`, (chunk) => data += chunk);
        request.on(`end`, () => resolve(data));
        request.on(`error`, (error) => reject(error));
      }));
      const username = body.username;
      const password = body.password ? packages.crypto.createHash(`sha256`).update(body.password).digest(`base64`) : "";
      const account = submodules.database.query(`SELECT * FROM accounts WHERE username = ? LIMIT 1`, [username]);
      if (account.length != 0) {
        return response.status(409).json({ message: this.SESSION_ACCOUNT_EXISTS_MESSAGE });
      }
      if (!this.ALLOWED_CHARS.test(username)) {
        return response.status(400).json({ message: this.SESSION_INVALID_USERNAME_MESSAGE });
      }
      submodules.database.query(`INSERT INTO accounts (username, hash, activated) VALUES (?, ?, ?)`, [username, password, 0]);
      submodules.utils.log(`${this.NAME_SPACE} - New account created for username: ${username} @ ${request.headers["cf-connecting-ip"] || request.connection.remoteAddress}`);
      return response.status(201).json({ message: this.SESSION_SUCCESS_MESSAGE });
    }));
  }
};
var signup_default = Init;
export {
  Init,
  signup_default as default
};
