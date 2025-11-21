import {
  cache,
  packages,
  submodules
} from "./chunk-V4INPCA6.mjs";

// src/submodules/express/@routes/data.ts
var Init = class {
  constructor() {
    this.NAME_SPACE = `submodule:@routes:data`;
    this.UNKNOWN_DIRECTORY = `/www/__pages/__404/index.html`;
    submodules.utils.log(`${this.NAME_SPACE} initialized.`);
    const parentDirectory = packages.path.resolve(`..`, `storage`);
    cache.internal.express.get(`/data/:endpoint/`, (request, response) => {
      const endpoint = request.params.endpoint;
      const isValid = Object.keys(cache.external).includes(endpoint);
      if (!isValid) {
        return response.sendFile(`${parentDirectory}${this.UNKNOWN_DIRECTORY}`);
      }
      return response.json(cache.external[endpoint]);
    });
  }
};
var data_default = Init;
export {
  Init,
  data_default as default
};
