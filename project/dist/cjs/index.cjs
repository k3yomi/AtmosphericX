var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __pow = Math.pow;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// node_modules/ws/lib/constants.js
var require_constants = __commonJS({
  "node_modules/ws/lib/constants.js"(exports2, module2) {
    "use strict";
    var BINARY_TYPES = ["nodebuffer", "arraybuffer", "fragments"];
    var hasBlob = typeof Blob !== "undefined";
    if (hasBlob) BINARY_TYPES.push("blob");
    module2.exports = {
      BINARY_TYPES,
      EMPTY_BUFFER: Buffer.alloc(0),
      GUID: "258EAFA5-E914-47DA-95CA-C5AB0DC85B11",
      hasBlob,
      kForOnEventAttribute: Symbol("kIsForOnEventAttribute"),
      kListener: Symbol("kListener"),
      kStatusCode: Symbol("status-code"),
      kWebSocket: Symbol("websocket"),
      NOOP: () => {
      }
    };
  }
});

// node_modules/node-gyp-build/node-gyp-build.js
var require_node_gyp_build = __commonJS({
  "node_modules/node-gyp-build/node-gyp-build.js"(exports2, module2) {
    var fs2 = require("fs");
    var path2 = require("path");
    var os2 = require("os");
    var runtimeRequire = typeof __webpack_require__ === "function" ? __non_webpack_require__ : require;
    var vars = process.config && process.config.variables || {};
    var prebuildsOnly = !!process.env.PREBUILDS_ONLY;
    var abi = process.versions.modules;
    var runtime = isElectron() ? "electron" : isNwjs() ? "node-webkit" : "node";
    var arch = process.env.npm_config_arch || os2.arch();
    var platform = process.env.npm_config_platform || os2.platform();
    var libc = process.env.LIBC || (isAlpine(platform) ? "musl" : "glibc");
    var armv = process.env.ARM_VERSION || (arch === "arm64" ? "8" : vars.arm_version) || "";
    var uv = (process.versions.uv || "").split(".")[0];
    module2.exports = load;
    function load(dir) {
      return runtimeRequire(load.resolve(dir));
    }
    load.resolve = load.path = function(dir) {
      dir = path2.resolve(dir || ".");
      try {
        var name = runtimeRequire(path2.join(dir, "package.json")).name.toUpperCase().replace(/-/g, "_");
        if (process.env[name + "_PREBUILD"]) dir = process.env[name + "_PREBUILD"];
      } catch (err) {
      }
      if (!prebuildsOnly) {
        var release = getFirst(path2.join(dir, "build/Release"), matchBuild);
        if (release) return release;
        var debug = getFirst(path2.join(dir, "build/Debug"), matchBuild);
        if (debug) return debug;
      }
      var prebuild = resolve(dir);
      if (prebuild) return prebuild;
      var nearby = resolve(path2.dirname(process.execPath));
      if (nearby) return nearby;
      var target = [
        "platform=" + platform,
        "arch=" + arch,
        "runtime=" + runtime,
        "abi=" + abi,
        "uv=" + uv,
        armv ? "armv=" + armv : "",
        "libc=" + libc,
        "node=" + process.versions.node,
        process.versions.electron ? "electron=" + process.versions.electron : "",
        typeof __webpack_require__ === "function" ? "webpack=true" : ""
        // eslint-disable-line
      ].filter(Boolean).join(" ");
      throw new Error("No native build was found for " + target + "\n    loaded from: " + dir + "\n");
      function resolve(dir2) {
        var tuples = readdirSync(path2.join(dir2, "prebuilds")).map(parseTuple);
        var tuple = tuples.filter(matchTuple(platform, arch)).sort(compareTuples)[0];
        if (!tuple) return;
        var prebuilds = path2.join(dir2, "prebuilds", tuple.name);
        var parsed = readdirSync(prebuilds).map(parseTags);
        var candidates = parsed.filter(matchTags(runtime, abi));
        var winner = candidates.sort(compareTags(runtime))[0];
        if (winner) return path2.join(prebuilds, winner.file);
      }
    };
    function readdirSync(dir) {
      try {
        return fs2.readdirSync(dir);
      } catch (err) {
        return [];
      }
    }
    function getFirst(dir, filter) {
      var files = readdirSync(dir).filter(filter);
      return files[0] && path2.join(dir, files[0]);
    }
    function matchBuild(name) {
      return /\.node$/.test(name);
    }
    function parseTuple(name) {
      var arr = name.split("-");
      if (arr.length !== 2) return;
      var platform2 = arr[0];
      var architectures = arr[1].split("+");
      if (!platform2) return;
      if (!architectures.length) return;
      if (!architectures.every(Boolean)) return;
      return { name, platform: platform2, architectures };
    }
    function matchTuple(platform2, arch2) {
      return function(tuple) {
        if (tuple == null) return false;
        if (tuple.platform !== platform2) return false;
        return tuple.architectures.includes(arch2);
      };
    }
    function compareTuples(a, b) {
      return a.architectures.length - b.architectures.length;
    }
    function parseTags(file) {
      var arr = file.split(".");
      var extension = arr.pop();
      var tags = { file, specificity: 0 };
      if (extension !== "node") return;
      for (var i = 0; i < arr.length; i++) {
        var tag = arr[i];
        if (tag === "node" || tag === "electron" || tag === "node-webkit") {
          tags.runtime = tag;
        } else if (tag === "napi") {
          tags.napi = true;
        } else if (tag.slice(0, 3) === "abi") {
          tags.abi = tag.slice(3);
        } else if (tag.slice(0, 2) === "uv") {
          tags.uv = tag.slice(2);
        } else if (tag.slice(0, 4) === "armv") {
          tags.armv = tag.slice(4);
        } else if (tag === "glibc" || tag === "musl") {
          tags.libc = tag;
        } else {
          continue;
        }
        tags.specificity++;
      }
      return tags;
    }
    function matchTags(runtime2, abi2) {
      return function(tags) {
        if (tags == null) return false;
        if (tags.runtime && tags.runtime !== runtime2 && !runtimeAgnostic(tags)) return false;
        if (tags.abi && tags.abi !== abi2 && !tags.napi) return false;
        if (tags.uv && tags.uv !== uv) return false;
        if (tags.armv && tags.armv !== armv) return false;
        if (tags.libc && tags.libc !== libc) return false;
        return true;
      };
    }
    function runtimeAgnostic(tags) {
      return tags.runtime === "node" && tags.napi;
    }
    function compareTags(runtime2) {
      return function(a, b) {
        if (a.runtime !== b.runtime) {
          return a.runtime === runtime2 ? -1 : 1;
        } else if (a.abi !== b.abi) {
          return a.abi ? -1 : 1;
        } else if (a.specificity !== b.specificity) {
          return a.specificity > b.specificity ? -1 : 1;
        } else {
          return 0;
        }
      };
    }
    function isNwjs() {
      return !!(process.versions && process.versions.nw);
    }
    function isElectron() {
      if (process.versions && process.versions.electron) return true;
      if (process.env.ELECTRON_RUN_AS_NODE) return true;
      return typeof window !== "undefined" && window.process && window.process.type === "renderer";
    }
    function isAlpine(platform2) {
      return platform2 === "linux" && fs2.existsSync("/etc/alpine-release");
    }
    load.parseTags = parseTags;
    load.matchTags = matchTags;
    load.compareTags = compareTags;
    load.parseTuple = parseTuple;
    load.matchTuple = matchTuple;
    load.compareTuples = compareTuples;
  }
});

// node_modules/node-gyp-build/index.js
var require_node_gyp_build2 = __commonJS({
  "node_modules/node-gyp-build/index.js"(exports2, module2) {
    var runtimeRequire = typeof __webpack_require__ === "function" ? __non_webpack_require__ : require;
    if (typeof runtimeRequire.addon === "function") {
      module2.exports = runtimeRequire.addon.bind(runtimeRequire);
    } else {
      module2.exports = require_node_gyp_build();
    }
  }
});

// node_modules/bufferutil/fallback.js
var require_fallback = __commonJS({
  "node_modules/bufferutil/fallback.js"(exports2, module2) {
    "use strict";
    var mask = (source, mask2, output, offset, length) => {
      for (var i = 0; i < length; i++) {
        output[offset + i] = source[i] ^ mask2[i & 3];
      }
    };
    var unmask = (buffer, mask2) => {
      const length = buffer.length;
      for (var i = 0; i < length; i++) {
        buffer[i] ^= mask2[i & 3];
      }
    };
    module2.exports = { mask, unmask };
  }
});

// node_modules/bufferutil/index.js
var require_bufferutil = __commonJS({
  "node_modules/bufferutil/index.js"(exports2, module2) {
    "use strict";
    try {
      module2.exports = require_node_gyp_build2()(__dirname);
    } catch (e) {
      module2.exports = require_fallback();
    }
  }
});

// node_modules/ws/lib/buffer-util.js
var require_buffer_util = __commonJS({
  "node_modules/ws/lib/buffer-util.js"(exports2, module2) {
    "use strict";
    var { EMPTY_BUFFER } = require_constants();
    var FastBuffer = Buffer[Symbol.species];
    function concat(list, totalLength) {
      if (list.length === 0) return EMPTY_BUFFER;
      if (list.length === 1) return list[0];
      const target = Buffer.allocUnsafe(totalLength);
      let offset = 0;
      for (let i = 0; i < list.length; i++) {
        const buf = list[i];
        target.set(buf, offset);
        offset += buf.length;
      }
      if (offset < totalLength) {
        return new FastBuffer(target.buffer, target.byteOffset, offset);
      }
      return target;
    }
    function _mask(source, mask, output, offset, length) {
      for (let i = 0; i < length; i++) {
        output[offset + i] = source[i] ^ mask[i & 3];
      }
    }
    function _unmask(buffer, mask) {
      for (let i = 0; i < buffer.length; i++) {
        buffer[i] ^= mask[i & 3];
      }
    }
    function toArrayBuffer(buf) {
      if (buf.length === buf.buffer.byteLength) {
        return buf.buffer;
      }
      return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length);
    }
    function toBuffer(data) {
      toBuffer.readOnly = true;
      if (Buffer.isBuffer(data)) return data;
      let buf;
      if (data instanceof ArrayBuffer) {
        buf = new FastBuffer(data);
      } else if (ArrayBuffer.isView(data)) {
        buf = new FastBuffer(data.buffer, data.byteOffset, data.byteLength);
      } else {
        buf = Buffer.from(data);
        toBuffer.readOnly = false;
      }
      return buf;
    }
    module2.exports = {
      concat,
      mask: _mask,
      toArrayBuffer,
      toBuffer,
      unmask: _unmask
    };
    if (!process.env.WS_NO_BUFFER_UTIL) {
      try {
        const bufferUtil = require_bufferutil();
        module2.exports.mask = function(source, mask, output, offset, length) {
          if (length < 48) _mask(source, mask, output, offset, length);
          else bufferUtil.mask(source, mask, output, offset, length);
        };
        module2.exports.unmask = function(buffer, mask) {
          if (buffer.length < 32) _unmask(buffer, mask);
          else bufferUtil.unmask(buffer, mask);
        };
      } catch (e) {
      }
    }
  }
});

// node_modules/ws/lib/limiter.js
var require_limiter = __commonJS({
  "node_modules/ws/lib/limiter.js"(exports2, module2) {
    "use strict";
    var kDone = Symbol("kDone");
    var kRun = Symbol("kRun");
    var Limiter = class {
      /**
       * Creates a new `Limiter`.
       *
       * @param {Number} [concurrency=Infinity] The maximum number of jobs allowed
       *     to run concurrently
       */
      constructor(concurrency) {
        this[kDone] = () => {
          this.pending--;
          this[kRun]();
        };
        this.concurrency = concurrency || Infinity;
        this.jobs = [];
        this.pending = 0;
      }
      /**
       * Adds a job to the queue.
       *
       * @param {Function} job The job to run
       * @public
       */
      add(job) {
        this.jobs.push(job);
        this[kRun]();
      }
      /**
       * Removes a job from the queue and runs it if possible.
       *
       * @private
       */
      [kRun]() {
        if (this.pending === this.concurrency) return;
        if (this.jobs.length) {
          const job = this.jobs.shift();
          this.pending++;
          job(this[kDone]);
        }
      }
    };
    module2.exports = Limiter;
  }
});

// node_modules/ws/lib/permessage-deflate.js
var require_permessage_deflate = __commonJS({
  "node_modules/ws/lib/permessage-deflate.js"(exports2, module2) {
    "use strict";
    var zlib = require("zlib");
    var bufferUtil = require_buffer_util();
    var Limiter = require_limiter();
    var { kStatusCode } = require_constants();
    var FastBuffer = Buffer[Symbol.species];
    var TRAILER = Buffer.from([0, 0, 255, 255]);
    var kPerMessageDeflate = Symbol("permessage-deflate");
    var kTotalLength = Symbol("total-length");
    var kCallback = Symbol("callback");
    var kBuffers = Symbol("buffers");
    var kError = Symbol("error");
    var zlibLimiter;
    var PerMessageDeflate = class {
      /**
       * Creates a PerMessageDeflate instance.
       *
       * @param {Object} [options] Configuration options
       * @param {(Boolean|Number)} [options.clientMaxWindowBits] Advertise support
       *     for, or request, a custom client window size
       * @param {Boolean} [options.clientNoContextTakeover=false] Advertise/
       *     acknowledge disabling of client context takeover
       * @param {Number} [options.concurrencyLimit=10] The number of concurrent
       *     calls to zlib
       * @param {(Boolean|Number)} [options.serverMaxWindowBits] Request/confirm the
       *     use of a custom server window size
       * @param {Boolean} [options.serverNoContextTakeover=false] Request/accept
       *     disabling of server context takeover
       * @param {Number} [options.threshold=1024] Size (in bytes) below which
       *     messages should not be compressed if context takeover is disabled
       * @param {Object} [options.zlibDeflateOptions] Options to pass to zlib on
       *     deflate
       * @param {Object} [options.zlibInflateOptions] Options to pass to zlib on
       *     inflate
       * @param {Boolean} [isServer=false] Create the instance in either server or
       *     client mode
       * @param {Number} [maxPayload=0] The maximum allowed message length
       */
      constructor(options, isServer, maxPayload) {
        this._maxPayload = maxPayload | 0;
        this._options = options || {};
        this._threshold = this._options.threshold !== void 0 ? this._options.threshold : 1024;
        this._isServer = !!isServer;
        this._deflate = null;
        this._inflate = null;
        this.params = null;
        if (!zlibLimiter) {
          const concurrency = this._options.concurrencyLimit !== void 0 ? this._options.concurrencyLimit : 10;
          zlibLimiter = new Limiter(concurrency);
        }
      }
      /**
       * @type {String}
       */
      static get extensionName() {
        return "permessage-deflate";
      }
      /**
       * Create an extension negotiation offer.
       *
       * @return {Object} Extension parameters
       * @public
       */
      offer() {
        const params = {};
        if (this._options.serverNoContextTakeover) {
          params.server_no_context_takeover = true;
        }
        if (this._options.clientNoContextTakeover) {
          params.client_no_context_takeover = true;
        }
        if (this._options.serverMaxWindowBits) {
          params.server_max_window_bits = this._options.serverMaxWindowBits;
        }
        if (this._options.clientMaxWindowBits) {
          params.client_max_window_bits = this._options.clientMaxWindowBits;
        } else if (this._options.clientMaxWindowBits == null) {
          params.client_max_window_bits = true;
        }
        return params;
      }
      /**
       * Accept an extension negotiation offer/response.
       *
       * @param {Array} configurations The extension negotiation offers/reponse
       * @return {Object} Accepted configuration
       * @public
       */
      accept(configurations) {
        configurations = this.normalizeParams(configurations);
        this.params = this._isServer ? this.acceptAsServer(configurations) : this.acceptAsClient(configurations);
        return this.params;
      }
      /**
       * Releases all resources used by the extension.
       *
       * @public
       */
      cleanup() {
        if (this._inflate) {
          this._inflate.close();
          this._inflate = null;
        }
        if (this._deflate) {
          const callback = this._deflate[kCallback];
          this._deflate.close();
          this._deflate = null;
          if (callback) {
            callback(
              new Error(
                "The deflate stream was closed while data was being processed"
              )
            );
          }
        }
      }
      /**
       *  Accept an extension negotiation offer.
       *
       * @param {Array} offers The extension negotiation offers
       * @return {Object} Accepted configuration
       * @private
       */
      acceptAsServer(offers) {
        const opts = this._options;
        const accepted = offers.find((params) => {
          if (opts.serverNoContextTakeover === false && params.server_no_context_takeover || params.server_max_window_bits && (opts.serverMaxWindowBits === false || typeof opts.serverMaxWindowBits === "number" && opts.serverMaxWindowBits > params.server_max_window_bits) || typeof opts.clientMaxWindowBits === "number" && !params.client_max_window_bits) {
            return false;
          }
          return true;
        });
        if (!accepted) {
          throw new Error("None of the extension offers can be accepted");
        }
        if (opts.serverNoContextTakeover) {
          accepted.server_no_context_takeover = true;
        }
        if (opts.clientNoContextTakeover) {
          accepted.client_no_context_takeover = true;
        }
        if (typeof opts.serverMaxWindowBits === "number") {
          accepted.server_max_window_bits = opts.serverMaxWindowBits;
        }
        if (typeof opts.clientMaxWindowBits === "number") {
          accepted.client_max_window_bits = opts.clientMaxWindowBits;
        } else if (accepted.client_max_window_bits === true || opts.clientMaxWindowBits === false) {
          delete accepted.client_max_window_bits;
        }
        return accepted;
      }
      /**
       * Accept the extension negotiation response.
       *
       * @param {Array} response The extension negotiation response
       * @return {Object} Accepted configuration
       * @private
       */
      acceptAsClient(response) {
        const params = response[0];
        if (this._options.clientNoContextTakeover === false && params.client_no_context_takeover) {
          throw new Error('Unexpected parameter "client_no_context_takeover"');
        }
        if (!params.client_max_window_bits) {
          if (typeof this._options.clientMaxWindowBits === "number") {
            params.client_max_window_bits = this._options.clientMaxWindowBits;
          }
        } else if (this._options.clientMaxWindowBits === false || typeof this._options.clientMaxWindowBits === "number" && params.client_max_window_bits > this._options.clientMaxWindowBits) {
          throw new Error(
            'Unexpected or invalid parameter "client_max_window_bits"'
          );
        }
        return params;
      }
      /**
       * Normalize parameters.
       *
       * @param {Array} configurations The extension negotiation offers/reponse
       * @return {Array} The offers/response with normalized parameters
       * @private
       */
      normalizeParams(configurations) {
        configurations.forEach((params) => {
          Object.keys(params).forEach((key) => {
            let value = params[key];
            if (value.length > 1) {
              throw new Error(`Parameter "${key}" must have only a single value`);
            }
            value = value[0];
            if (key === "client_max_window_bits") {
              if (value !== true) {
                const num = +value;
                if (!Number.isInteger(num) || num < 8 || num > 15) {
                  throw new TypeError(
                    `Invalid value for parameter "${key}": ${value}`
                  );
                }
                value = num;
              } else if (!this._isServer) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value}`
                );
              }
            } else if (key === "server_max_window_bits") {
              const num = +value;
              if (!Number.isInteger(num) || num < 8 || num > 15) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value}`
                );
              }
              value = num;
            } else if (key === "client_no_context_takeover" || key === "server_no_context_takeover") {
              if (value !== true) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value}`
                );
              }
            } else {
              throw new Error(`Unknown parameter "${key}"`);
            }
            params[key] = value;
          });
        });
        return configurations;
      }
      /**
       * Decompress data. Concurrency limited.
       *
       * @param {Buffer} data Compressed data
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @public
       */
      decompress(data, fin, callback) {
        zlibLimiter.add((done) => {
          this._decompress(data, fin, (err, result) => {
            done();
            callback(err, result);
          });
        });
      }
      /**
       * Compress data. Concurrency limited.
       *
       * @param {(Buffer|String)} data Data to compress
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @public
       */
      compress(data, fin, callback) {
        zlibLimiter.add((done) => {
          this._compress(data, fin, (err, result) => {
            done();
            callback(err, result);
          });
        });
      }
      /**
       * Decompress data.
       *
       * @param {Buffer} data Compressed data
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @private
       */
      _decompress(data, fin, callback) {
        const endpoint = this._isServer ? "client" : "server";
        if (!this._inflate) {
          const key = `${endpoint}_max_window_bits`;
          const windowBits = typeof this.params[key] !== "number" ? zlib.Z_DEFAULT_WINDOWBITS : this.params[key];
          this._inflate = zlib.createInflateRaw(__spreadProps(__spreadValues({}, this._options.zlibInflateOptions), {
            windowBits
          }));
          this._inflate[kPerMessageDeflate] = this;
          this._inflate[kTotalLength] = 0;
          this._inflate[kBuffers] = [];
          this._inflate.on("error", inflateOnError);
          this._inflate.on("data", inflateOnData);
        }
        this._inflate[kCallback] = callback;
        this._inflate.write(data);
        if (fin) this._inflate.write(TRAILER);
        this._inflate.flush(() => {
          const err = this._inflate[kError];
          if (err) {
            this._inflate.close();
            this._inflate = null;
            callback(err);
            return;
          }
          const data2 = bufferUtil.concat(
            this._inflate[kBuffers],
            this._inflate[kTotalLength]
          );
          if (this._inflate._readableState.endEmitted) {
            this._inflate.close();
            this._inflate = null;
          } else {
            this._inflate[kTotalLength] = 0;
            this._inflate[kBuffers] = [];
            if (fin && this.params[`${endpoint}_no_context_takeover`]) {
              this._inflate.reset();
            }
          }
          callback(null, data2);
        });
      }
      /**
       * Compress data.
       *
       * @param {(Buffer|String)} data Data to compress
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @private
       */
      _compress(data, fin, callback) {
        const endpoint = this._isServer ? "server" : "client";
        if (!this._deflate) {
          const key = `${endpoint}_max_window_bits`;
          const windowBits = typeof this.params[key] !== "number" ? zlib.Z_DEFAULT_WINDOWBITS : this.params[key];
          this._deflate = zlib.createDeflateRaw(__spreadProps(__spreadValues({}, this._options.zlibDeflateOptions), {
            windowBits
          }));
          this._deflate[kTotalLength] = 0;
          this._deflate[kBuffers] = [];
          this._deflate.on("data", deflateOnData);
        }
        this._deflate[kCallback] = callback;
        this._deflate.write(data);
        this._deflate.flush(zlib.Z_SYNC_FLUSH, () => {
          if (!this._deflate) {
            return;
          }
          let data2 = bufferUtil.concat(
            this._deflate[kBuffers],
            this._deflate[kTotalLength]
          );
          if (fin) {
            data2 = new FastBuffer(data2.buffer, data2.byteOffset, data2.length - 4);
          }
          this._deflate[kCallback] = null;
          this._deflate[kTotalLength] = 0;
          this._deflate[kBuffers] = [];
          if (fin && this.params[`${endpoint}_no_context_takeover`]) {
            this._deflate.reset();
          }
          callback(null, data2);
        });
      }
    };
    module2.exports = PerMessageDeflate;
    function deflateOnData(chunk) {
      this[kBuffers].push(chunk);
      this[kTotalLength] += chunk.length;
    }
    function inflateOnData(chunk) {
      this[kTotalLength] += chunk.length;
      if (this[kPerMessageDeflate]._maxPayload < 1 || this[kTotalLength] <= this[kPerMessageDeflate]._maxPayload) {
        this[kBuffers].push(chunk);
        return;
      }
      this[kError] = new RangeError("Max payload size exceeded");
      this[kError].code = "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH";
      this[kError][kStatusCode] = 1009;
      this.removeListener("data", inflateOnData);
      this.reset();
    }
    function inflateOnError(err) {
      this[kPerMessageDeflate]._inflate = null;
      if (this[kError]) {
        this[kCallback](this[kError]);
        return;
      }
      err[kStatusCode] = 1007;
      this[kCallback](err);
    }
  }
});

// node_modules/ws/lib/validation.js
var require_validation = __commonJS({
  "node_modules/ws/lib/validation.js"(exports2, module2) {
    "use strict";
    var { isUtf8 } = require("buffer");
    var { hasBlob } = require_constants();
    var tokenChars = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      // 0 - 15
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      // 16 - 31
      0,
      1,
      0,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      1,
      1,
      0,
      1,
      1,
      0,
      // 32 - 47
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      // 48 - 63
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      // 64 - 79
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      1,
      1,
      // 80 - 95
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      // 96 - 111
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      1,
      0,
      1,
      0
      // 112 - 127
    ];
    function isValidStatusCode(code) {
      return code >= 1e3 && code <= 1014 && code !== 1004 && code !== 1005 && code !== 1006 || code >= 3e3 && code <= 4999;
    }
    function _isValidUTF8(buf) {
      const len = buf.length;
      let i = 0;
      while (i < len) {
        if ((buf[i] & 128) === 0) {
          i++;
        } else if ((buf[i] & 224) === 192) {
          if (i + 1 === len || (buf[i + 1] & 192) !== 128 || (buf[i] & 254) === 192) {
            return false;
          }
          i += 2;
        } else if ((buf[i] & 240) === 224) {
          if (i + 2 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || buf[i] === 224 && (buf[i + 1] & 224) === 128 || // Overlong
          buf[i] === 237 && (buf[i + 1] & 224) === 160) {
            return false;
          }
          i += 3;
        } else if ((buf[i] & 248) === 240) {
          if (i + 3 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || (buf[i + 3] & 192) !== 128 || buf[i] === 240 && (buf[i + 1] & 240) === 128 || // Overlong
          buf[i] === 244 && buf[i + 1] > 143 || buf[i] > 244) {
            return false;
          }
          i += 4;
        } else {
          return false;
        }
      }
      return true;
    }
    function isBlob(value) {
      return hasBlob && typeof value === "object" && typeof value.arrayBuffer === "function" && typeof value.type === "string" && typeof value.stream === "function" && (value[Symbol.toStringTag] === "Blob" || value[Symbol.toStringTag] === "File");
    }
    module2.exports = {
      isBlob,
      isValidStatusCode,
      isValidUTF8: _isValidUTF8,
      tokenChars
    };
    if (isUtf8) {
      module2.exports.isValidUTF8 = function(buf) {
        return buf.length < 24 ? _isValidUTF8(buf) : isUtf8(buf);
      };
    } else if (!process.env.WS_NO_UTF_8_VALIDATE) {
      try {
        const isValidUTF8 = require("utf-8-validate");
        module2.exports.isValidUTF8 = function(buf) {
          return buf.length < 32 ? _isValidUTF8(buf) : isValidUTF8(buf);
        };
      } catch (e) {
      }
    }
  }
});

// node_modules/ws/lib/receiver.js
var require_receiver = __commonJS({
  "node_modules/ws/lib/receiver.js"(exports2, module2) {
    "use strict";
    var { Writable } = require("stream");
    var PerMessageDeflate = require_permessage_deflate();
    var {
      BINARY_TYPES,
      EMPTY_BUFFER,
      kStatusCode,
      kWebSocket
    } = require_constants();
    var { concat, toArrayBuffer, unmask } = require_buffer_util();
    var { isValidStatusCode, isValidUTF8 } = require_validation();
    var FastBuffer = Buffer[Symbol.species];
    var GET_INFO = 0;
    var GET_PAYLOAD_LENGTH_16 = 1;
    var GET_PAYLOAD_LENGTH_64 = 2;
    var GET_MASK = 3;
    var GET_DATA = 4;
    var INFLATING = 5;
    var DEFER_EVENT = 6;
    var Receiver2 = class extends Writable {
      /**
       * Creates a Receiver instance.
       *
       * @param {Object} [options] Options object
       * @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether
       *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
       *     multiple times in the same tick
       * @param {String} [options.binaryType=nodebuffer] The type for binary data
       * @param {Object} [options.extensions] An object containing the negotiated
       *     extensions
       * @param {Boolean} [options.isServer=false] Specifies whether to operate in
       *     client or server mode
       * @param {Number} [options.maxPayload=0] The maximum allowed message length
       * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
       *     not to skip UTF-8 validation for text and close messages
       */
      constructor(options = {}) {
        super();
        this._allowSynchronousEvents = options.allowSynchronousEvents !== void 0 ? options.allowSynchronousEvents : true;
        this._binaryType = options.binaryType || BINARY_TYPES[0];
        this._extensions = options.extensions || {};
        this._isServer = !!options.isServer;
        this._maxPayload = options.maxPayload | 0;
        this._skipUTF8Validation = !!options.skipUTF8Validation;
        this[kWebSocket] = void 0;
        this._bufferedBytes = 0;
        this._buffers = [];
        this._compressed = false;
        this._payloadLength = 0;
        this._mask = void 0;
        this._fragmented = 0;
        this._masked = false;
        this._fin = false;
        this._opcode = 0;
        this._totalPayloadLength = 0;
        this._messageLength = 0;
        this._fragments = [];
        this._errored = false;
        this._loop = false;
        this._state = GET_INFO;
      }
      /**
       * Implements `Writable.prototype._write()`.
       *
       * @param {Buffer} chunk The chunk of data to write
       * @param {String} encoding The character encoding of `chunk`
       * @param {Function} cb Callback
       * @private
       */
      _write(chunk, encoding, cb) {
        if (this._opcode === 8 && this._state == GET_INFO) return cb();
        this._bufferedBytes += chunk.length;
        this._buffers.push(chunk);
        this.startLoop(cb);
      }
      /**
       * Consumes `n` bytes from the buffered data.
       *
       * @param {Number} n The number of bytes to consume
       * @return {Buffer} The consumed bytes
       * @private
       */
      consume(n) {
        this._bufferedBytes -= n;
        if (n === this._buffers[0].length) return this._buffers.shift();
        if (n < this._buffers[0].length) {
          const buf = this._buffers[0];
          this._buffers[0] = new FastBuffer(
            buf.buffer,
            buf.byteOffset + n,
            buf.length - n
          );
          return new FastBuffer(buf.buffer, buf.byteOffset, n);
        }
        const dst = Buffer.allocUnsafe(n);
        do {
          const buf = this._buffers[0];
          const offset = dst.length - n;
          if (n >= buf.length) {
            dst.set(this._buffers.shift(), offset);
          } else {
            dst.set(new Uint8Array(buf.buffer, buf.byteOffset, n), offset);
            this._buffers[0] = new FastBuffer(
              buf.buffer,
              buf.byteOffset + n,
              buf.length - n
            );
          }
          n -= buf.length;
        } while (n > 0);
        return dst;
      }
      /**
       * Starts the parsing loop.
       *
       * @param {Function} cb Callback
       * @private
       */
      startLoop(cb) {
        this._loop = true;
        do {
          switch (this._state) {
            case GET_INFO:
              this.getInfo(cb);
              break;
            case GET_PAYLOAD_LENGTH_16:
              this.getPayloadLength16(cb);
              break;
            case GET_PAYLOAD_LENGTH_64:
              this.getPayloadLength64(cb);
              break;
            case GET_MASK:
              this.getMask();
              break;
            case GET_DATA:
              this.getData(cb);
              break;
            case INFLATING:
            case DEFER_EVENT:
              this._loop = false;
              return;
          }
        } while (this._loop);
        if (!this._errored) cb();
      }
      /**
       * Reads the first two bytes of a frame.
       *
       * @param {Function} cb Callback
       * @private
       */
      getInfo(cb) {
        if (this._bufferedBytes < 2) {
          this._loop = false;
          return;
        }
        const buf = this.consume(2);
        if ((buf[0] & 48) !== 0) {
          const error = this.createError(
            RangeError,
            "RSV2 and RSV3 must be clear",
            true,
            1002,
            "WS_ERR_UNEXPECTED_RSV_2_3"
          );
          cb(error);
          return;
        }
        const compressed = (buf[0] & 64) === 64;
        if (compressed && !this._extensions[PerMessageDeflate.extensionName]) {
          const error = this.createError(
            RangeError,
            "RSV1 must be clear",
            true,
            1002,
            "WS_ERR_UNEXPECTED_RSV_1"
          );
          cb(error);
          return;
        }
        this._fin = (buf[0] & 128) === 128;
        this._opcode = buf[0] & 15;
        this._payloadLength = buf[1] & 127;
        if (this._opcode === 0) {
          if (compressed) {
            const error = this.createError(
              RangeError,
              "RSV1 must be clear",
              true,
              1002,
              "WS_ERR_UNEXPECTED_RSV_1"
            );
            cb(error);
            return;
          }
          if (!this._fragmented) {
            const error = this.createError(
              RangeError,
              "invalid opcode 0",
              true,
              1002,
              "WS_ERR_INVALID_OPCODE"
            );
            cb(error);
            return;
          }
          this._opcode = this._fragmented;
        } else if (this._opcode === 1 || this._opcode === 2) {
          if (this._fragmented) {
            const error = this.createError(
              RangeError,
              `invalid opcode ${this._opcode}`,
              true,
              1002,
              "WS_ERR_INVALID_OPCODE"
            );
            cb(error);
            return;
          }
          this._compressed = compressed;
        } else if (this._opcode > 7 && this._opcode < 11) {
          if (!this._fin) {
            const error = this.createError(
              RangeError,
              "FIN must be set",
              true,
              1002,
              "WS_ERR_EXPECTED_FIN"
            );
            cb(error);
            return;
          }
          if (compressed) {
            const error = this.createError(
              RangeError,
              "RSV1 must be clear",
              true,
              1002,
              "WS_ERR_UNEXPECTED_RSV_1"
            );
            cb(error);
            return;
          }
          if (this._payloadLength > 125 || this._opcode === 8 && this._payloadLength === 1) {
            const error = this.createError(
              RangeError,
              `invalid payload length ${this._payloadLength}`,
              true,
              1002,
              "WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH"
            );
            cb(error);
            return;
          }
        } else {
          const error = this.createError(
            RangeError,
            `invalid opcode ${this._opcode}`,
            true,
            1002,
            "WS_ERR_INVALID_OPCODE"
          );
          cb(error);
          return;
        }
        if (!this._fin && !this._fragmented) this._fragmented = this._opcode;
        this._masked = (buf[1] & 128) === 128;
        if (this._isServer) {
          if (!this._masked) {
            const error = this.createError(
              RangeError,
              "MASK must be set",
              true,
              1002,
              "WS_ERR_EXPECTED_MASK"
            );
            cb(error);
            return;
          }
        } else if (this._masked) {
          const error = this.createError(
            RangeError,
            "MASK must be clear",
            true,
            1002,
            "WS_ERR_UNEXPECTED_MASK"
          );
          cb(error);
          return;
        }
        if (this._payloadLength === 126) this._state = GET_PAYLOAD_LENGTH_16;
        else if (this._payloadLength === 127) this._state = GET_PAYLOAD_LENGTH_64;
        else this.haveLength(cb);
      }
      /**
       * Gets extended payload length (7+16).
       *
       * @param {Function} cb Callback
       * @private
       */
      getPayloadLength16(cb) {
        if (this._bufferedBytes < 2) {
          this._loop = false;
          return;
        }
        this._payloadLength = this.consume(2).readUInt16BE(0);
        this.haveLength(cb);
      }
      /**
       * Gets extended payload length (7+64).
       *
       * @param {Function} cb Callback
       * @private
       */
      getPayloadLength64(cb) {
        if (this._bufferedBytes < 8) {
          this._loop = false;
          return;
        }
        const buf = this.consume(8);
        const num = buf.readUInt32BE(0);
        if (num > Math.pow(2, 53 - 32) - 1) {
          const error = this.createError(
            RangeError,
            "Unsupported WebSocket frame: payload length > 2^53 - 1",
            false,
            1009,
            "WS_ERR_UNSUPPORTED_DATA_PAYLOAD_LENGTH"
          );
          cb(error);
          return;
        }
        this._payloadLength = num * Math.pow(2, 32) + buf.readUInt32BE(4);
        this.haveLength(cb);
      }
      /**
       * Payload length has been read.
       *
       * @param {Function} cb Callback
       * @private
       */
      haveLength(cb) {
        if (this._payloadLength && this._opcode < 8) {
          this._totalPayloadLength += this._payloadLength;
          if (this._totalPayloadLength > this._maxPayload && this._maxPayload > 0) {
            const error = this.createError(
              RangeError,
              "Max payload size exceeded",
              false,
              1009,
              "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"
            );
            cb(error);
            return;
          }
        }
        if (this._masked) this._state = GET_MASK;
        else this._state = GET_DATA;
      }
      /**
       * Reads mask bytes.
       *
       * @private
       */
      getMask() {
        if (this._bufferedBytes < 4) {
          this._loop = false;
          return;
        }
        this._mask = this.consume(4);
        this._state = GET_DATA;
      }
      /**
       * Reads data bytes.
       *
       * @param {Function} cb Callback
       * @private
       */
      getData(cb) {
        let data = EMPTY_BUFFER;
        if (this._payloadLength) {
          if (this._bufferedBytes < this._payloadLength) {
            this._loop = false;
            return;
          }
          data = this.consume(this._payloadLength);
          if (this._masked && (this._mask[0] | this._mask[1] | this._mask[2] | this._mask[3]) !== 0) {
            unmask(data, this._mask);
          }
        }
        if (this._opcode > 7) {
          this.controlMessage(data, cb);
          return;
        }
        if (this._compressed) {
          this._state = INFLATING;
          this.decompress(data, cb);
          return;
        }
        if (data.length) {
          this._messageLength = this._totalPayloadLength;
          this._fragments.push(data);
        }
        this.dataMessage(cb);
      }
      /**
       * Decompresses data.
       *
       * @param {Buffer} data Compressed data
       * @param {Function} cb Callback
       * @private
       */
      decompress(data, cb) {
        const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];
        perMessageDeflate.decompress(data, this._fin, (err, buf) => {
          if (err) return cb(err);
          if (buf.length) {
            this._messageLength += buf.length;
            if (this._messageLength > this._maxPayload && this._maxPayload > 0) {
              const error = this.createError(
                RangeError,
                "Max payload size exceeded",
                false,
                1009,
                "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"
              );
              cb(error);
              return;
            }
            this._fragments.push(buf);
          }
          this.dataMessage(cb);
          if (this._state === GET_INFO) this.startLoop(cb);
        });
      }
      /**
       * Handles a data message.
       *
       * @param {Function} cb Callback
       * @private
       */
      dataMessage(cb) {
        if (!this._fin) {
          this._state = GET_INFO;
          return;
        }
        const messageLength = this._messageLength;
        const fragments = this._fragments;
        this._totalPayloadLength = 0;
        this._messageLength = 0;
        this._fragmented = 0;
        this._fragments = [];
        if (this._opcode === 2) {
          let data;
          if (this._binaryType === "nodebuffer") {
            data = concat(fragments, messageLength);
          } else if (this._binaryType === "arraybuffer") {
            data = toArrayBuffer(concat(fragments, messageLength));
          } else if (this._binaryType === "blob") {
            data = new Blob(fragments);
          } else {
            data = fragments;
          }
          if (this._allowSynchronousEvents) {
            this.emit("message", data, true);
            this._state = GET_INFO;
          } else {
            this._state = DEFER_EVENT;
            setImmediate(() => {
              this.emit("message", data, true);
              this._state = GET_INFO;
              this.startLoop(cb);
            });
          }
        } else {
          const buf = concat(fragments, messageLength);
          if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
            const error = this.createError(
              Error,
              "invalid UTF-8 sequence",
              true,
              1007,
              "WS_ERR_INVALID_UTF8"
            );
            cb(error);
            return;
          }
          if (this._state === INFLATING || this._allowSynchronousEvents) {
            this.emit("message", buf, false);
            this._state = GET_INFO;
          } else {
            this._state = DEFER_EVENT;
            setImmediate(() => {
              this.emit("message", buf, false);
              this._state = GET_INFO;
              this.startLoop(cb);
            });
          }
        }
      }
      /**
       * Handles a control message.
       *
       * @param {Buffer} data Data to handle
       * @return {(Error|RangeError|undefined)} A possible error
       * @private
       */
      controlMessage(data, cb) {
        if (this._opcode === 8) {
          if (data.length === 0) {
            this._loop = false;
            this.emit("conclude", 1005, EMPTY_BUFFER);
            this.end();
          } else {
            const code = data.readUInt16BE(0);
            if (!isValidStatusCode(code)) {
              const error = this.createError(
                RangeError,
                `invalid status code ${code}`,
                true,
                1002,
                "WS_ERR_INVALID_CLOSE_CODE"
              );
              cb(error);
              return;
            }
            const buf = new FastBuffer(
              data.buffer,
              data.byteOffset + 2,
              data.length - 2
            );
            if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
              const error = this.createError(
                Error,
                "invalid UTF-8 sequence",
                true,
                1007,
                "WS_ERR_INVALID_UTF8"
              );
              cb(error);
              return;
            }
            this._loop = false;
            this.emit("conclude", code, buf);
            this.end();
          }
          this._state = GET_INFO;
          return;
        }
        if (this._allowSynchronousEvents) {
          this.emit(this._opcode === 9 ? "ping" : "pong", data);
          this._state = GET_INFO;
        } else {
          this._state = DEFER_EVENT;
          setImmediate(() => {
            this.emit(this._opcode === 9 ? "ping" : "pong", data);
            this._state = GET_INFO;
            this.startLoop(cb);
          });
        }
      }
      /**
       * Builds an error object.
       *
       * @param {function(new:Error|RangeError)} ErrorCtor The error constructor
       * @param {String} message The error message
       * @param {Boolean} prefix Specifies whether or not to add a default prefix to
       *     `message`
       * @param {Number} statusCode The status code
       * @param {String} errorCode The exposed error code
       * @return {(Error|RangeError)} The error
       * @private
       */
      createError(ErrorCtor, message, prefix, statusCode, errorCode) {
        this._loop = false;
        this._errored = true;
        const err = new ErrorCtor(
          prefix ? `Invalid WebSocket frame: ${message}` : message
        );
        Error.captureStackTrace(err, this.createError);
        err.code = errorCode;
        err[kStatusCode] = statusCode;
        return err;
      }
    };
    module2.exports = Receiver2;
  }
});

// node_modules/ws/lib/sender.js
var require_sender = __commonJS({
  "node_modules/ws/lib/sender.js"(exports2, module2) {
    "use strict";
    var { Duplex } = require("stream");
    var { randomFillSync } = require("crypto");
    var PerMessageDeflate = require_permessage_deflate();
    var { EMPTY_BUFFER, kWebSocket, NOOP } = require_constants();
    var { isBlob, isValidStatusCode } = require_validation();
    var { mask: applyMask, toBuffer } = require_buffer_util();
    var kByteLength = Symbol("kByteLength");
    var maskBuffer = Buffer.alloc(4);
    var RANDOM_POOL_SIZE = 8 * 1024;
    var randomPool;
    var randomPoolPointer = RANDOM_POOL_SIZE;
    var DEFAULT = 0;
    var DEFLATING = 1;
    var GET_BLOB_DATA = 2;
    var Sender2 = class _Sender {
      /**
       * Creates a Sender instance.
       *
       * @param {Duplex} socket The connection socket
       * @param {Object} [extensions] An object containing the negotiated extensions
       * @param {Function} [generateMask] The function used to generate the masking
       *     key
       */
      constructor(socket, extensions, generateMask) {
        this._extensions = extensions || {};
        if (generateMask) {
          this._generateMask = generateMask;
          this._maskBuffer = Buffer.alloc(4);
        }
        this._socket = socket;
        this._firstFragment = true;
        this._compress = false;
        this._bufferedBytes = 0;
        this._queue = [];
        this._state = DEFAULT;
        this.onerror = NOOP;
        this[kWebSocket] = void 0;
      }
      /**
       * Frames a piece of data according to the HyBi WebSocket protocol.
       *
       * @param {(Buffer|String)} data The data to frame
       * @param {Object} options Options object
       * @param {Boolean} [options.fin=false] Specifies whether or not to set the
       *     FIN bit
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
       *     key
       * @param {Number} options.opcode The opcode
       * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
       *     modified
       * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
       *     RSV1 bit
       * @return {(Buffer|String)[]} The framed data
       * @public
       */
      static frame(data, options) {
        let mask;
        let merge = false;
        let offset = 2;
        let skipMasking = false;
        if (options.mask) {
          mask = options.maskBuffer || maskBuffer;
          if (options.generateMask) {
            options.generateMask(mask);
          } else {
            if (randomPoolPointer === RANDOM_POOL_SIZE) {
              if (randomPool === void 0) {
                randomPool = Buffer.alloc(RANDOM_POOL_SIZE);
              }
              randomFillSync(randomPool, 0, RANDOM_POOL_SIZE);
              randomPoolPointer = 0;
            }
            mask[0] = randomPool[randomPoolPointer++];
            mask[1] = randomPool[randomPoolPointer++];
            mask[2] = randomPool[randomPoolPointer++];
            mask[3] = randomPool[randomPoolPointer++];
          }
          skipMasking = (mask[0] | mask[1] | mask[2] | mask[3]) === 0;
          offset = 6;
        }
        let dataLength;
        if (typeof data === "string") {
          if ((!options.mask || skipMasking) && options[kByteLength] !== void 0) {
            dataLength = options[kByteLength];
          } else {
            data = Buffer.from(data);
            dataLength = data.length;
          }
        } else {
          dataLength = data.length;
          merge = options.mask && options.readOnly && !skipMasking;
        }
        let payloadLength = dataLength;
        if (dataLength >= 65536) {
          offset += 8;
          payloadLength = 127;
        } else if (dataLength > 125) {
          offset += 2;
          payloadLength = 126;
        }
        const target = Buffer.allocUnsafe(merge ? dataLength + offset : offset);
        target[0] = options.fin ? options.opcode | 128 : options.opcode;
        if (options.rsv1) target[0] |= 64;
        target[1] = payloadLength;
        if (payloadLength === 126) {
          target.writeUInt16BE(dataLength, 2);
        } else if (payloadLength === 127) {
          target[2] = target[3] = 0;
          target.writeUIntBE(dataLength, 4, 6);
        }
        if (!options.mask) return [target, data];
        target[1] |= 128;
        target[offset - 4] = mask[0];
        target[offset - 3] = mask[1];
        target[offset - 2] = mask[2];
        target[offset - 1] = mask[3];
        if (skipMasking) return [target, data];
        if (merge) {
          applyMask(data, mask, target, offset, dataLength);
          return [target];
        }
        applyMask(data, mask, data, 0, dataLength);
        return [target, data];
      }
      /**
       * Sends a close message to the other peer.
       *
       * @param {Number} [code] The status code component of the body
       * @param {(String|Buffer)} [data] The message component of the body
       * @param {Boolean} [mask=false] Specifies whether or not to mask the message
       * @param {Function} [cb] Callback
       * @public
       */
      close(code, data, mask, cb) {
        let buf;
        if (code === void 0) {
          buf = EMPTY_BUFFER;
        } else if (typeof code !== "number" || !isValidStatusCode(code)) {
          throw new TypeError("First argument must be a valid error code number");
        } else if (data === void 0 || !data.length) {
          buf = Buffer.allocUnsafe(2);
          buf.writeUInt16BE(code, 0);
        } else {
          const length = Buffer.byteLength(data);
          if (length > 123) {
            throw new RangeError("The message must not be greater than 123 bytes");
          }
          buf = Buffer.allocUnsafe(2 + length);
          buf.writeUInt16BE(code, 0);
          if (typeof data === "string") {
            buf.write(data, 2);
          } else {
            buf.set(data, 2);
          }
        }
        const options = {
          [kByteLength]: buf.length,
          fin: true,
          generateMask: this._generateMask,
          mask,
          maskBuffer: this._maskBuffer,
          opcode: 8,
          readOnly: false,
          rsv1: false
        };
        if (this._state !== DEFAULT) {
          this.enqueue([this.dispatch, buf, false, options, cb]);
        } else {
          this.sendFrame(_Sender.frame(buf, options), cb);
        }
      }
      /**
       * Sends a ping message to the other peer.
       *
       * @param {*} data The message to send
       * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
       * @param {Function} [cb] Callback
       * @public
       */
      ping(data, mask, cb) {
        let byteLength;
        let readOnly;
        if (typeof data === "string") {
          byteLength = Buffer.byteLength(data);
          readOnly = false;
        } else if (isBlob(data)) {
          byteLength = data.size;
          readOnly = false;
        } else {
          data = toBuffer(data);
          byteLength = data.length;
          readOnly = toBuffer.readOnly;
        }
        if (byteLength > 125) {
          throw new RangeError("The data size must not be greater than 125 bytes");
        }
        const options = {
          [kByteLength]: byteLength,
          fin: true,
          generateMask: this._generateMask,
          mask,
          maskBuffer: this._maskBuffer,
          opcode: 9,
          readOnly,
          rsv1: false
        };
        if (isBlob(data)) {
          if (this._state !== DEFAULT) {
            this.enqueue([this.getBlobData, data, false, options, cb]);
          } else {
            this.getBlobData(data, false, options, cb);
          }
        } else if (this._state !== DEFAULT) {
          this.enqueue([this.dispatch, data, false, options, cb]);
        } else {
          this.sendFrame(_Sender.frame(data, options), cb);
        }
      }
      /**
       * Sends a pong message to the other peer.
       *
       * @param {*} data The message to send
       * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
       * @param {Function} [cb] Callback
       * @public
       */
      pong(data, mask, cb) {
        let byteLength;
        let readOnly;
        if (typeof data === "string") {
          byteLength = Buffer.byteLength(data);
          readOnly = false;
        } else if (isBlob(data)) {
          byteLength = data.size;
          readOnly = false;
        } else {
          data = toBuffer(data);
          byteLength = data.length;
          readOnly = toBuffer.readOnly;
        }
        if (byteLength > 125) {
          throw new RangeError("The data size must not be greater than 125 bytes");
        }
        const options = {
          [kByteLength]: byteLength,
          fin: true,
          generateMask: this._generateMask,
          mask,
          maskBuffer: this._maskBuffer,
          opcode: 10,
          readOnly,
          rsv1: false
        };
        if (isBlob(data)) {
          if (this._state !== DEFAULT) {
            this.enqueue([this.getBlobData, data, false, options, cb]);
          } else {
            this.getBlobData(data, false, options, cb);
          }
        } else if (this._state !== DEFAULT) {
          this.enqueue([this.dispatch, data, false, options, cb]);
        } else {
          this.sendFrame(_Sender.frame(data, options), cb);
        }
      }
      /**
       * Sends a data message to the other peer.
       *
       * @param {*} data The message to send
       * @param {Object} options Options object
       * @param {Boolean} [options.binary=false] Specifies whether `data` is binary
       *     or text
       * @param {Boolean} [options.compress=false] Specifies whether or not to
       *     compress `data`
       * @param {Boolean} [options.fin=false] Specifies whether the fragment is the
       *     last one
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Function} [cb] Callback
       * @public
       */
      send(data, options, cb) {
        const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];
        let opcode = options.binary ? 2 : 1;
        let rsv1 = options.compress;
        let byteLength;
        let readOnly;
        if (typeof data === "string") {
          byteLength = Buffer.byteLength(data);
          readOnly = false;
        } else if (isBlob(data)) {
          byteLength = data.size;
          readOnly = false;
        } else {
          data = toBuffer(data);
          byteLength = data.length;
          readOnly = toBuffer.readOnly;
        }
        if (this._firstFragment) {
          this._firstFragment = false;
          if (rsv1 && perMessageDeflate && perMessageDeflate.params[perMessageDeflate._isServer ? "server_no_context_takeover" : "client_no_context_takeover"]) {
            rsv1 = byteLength >= perMessageDeflate._threshold;
          }
          this._compress = rsv1;
        } else {
          rsv1 = false;
          opcode = 0;
        }
        if (options.fin) this._firstFragment = true;
        const opts = {
          [kByteLength]: byteLength,
          fin: options.fin,
          generateMask: this._generateMask,
          mask: options.mask,
          maskBuffer: this._maskBuffer,
          opcode,
          readOnly,
          rsv1
        };
        if (isBlob(data)) {
          if (this._state !== DEFAULT) {
            this.enqueue([this.getBlobData, data, this._compress, opts, cb]);
          } else {
            this.getBlobData(data, this._compress, opts, cb);
          }
        } else if (this._state !== DEFAULT) {
          this.enqueue([this.dispatch, data, this._compress, opts, cb]);
        } else {
          this.dispatch(data, this._compress, opts, cb);
        }
      }
      /**
       * Gets the contents of a blob as binary data.
       *
       * @param {Blob} blob The blob
       * @param {Boolean} [compress=false] Specifies whether or not to compress
       *     the data
       * @param {Object} options Options object
       * @param {Boolean} [options.fin=false] Specifies whether or not to set the
       *     FIN bit
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
       *     key
       * @param {Number} options.opcode The opcode
       * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
       *     modified
       * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
       *     RSV1 bit
       * @param {Function} [cb] Callback
       * @private
       */
      getBlobData(blob, compress, options, cb) {
        this._bufferedBytes += options[kByteLength];
        this._state = GET_BLOB_DATA;
        blob.arrayBuffer().then((arrayBuffer) => {
          if (this._socket.destroyed) {
            const err = new Error(
              "The socket was closed while the blob was being read"
            );
            process.nextTick(callCallbacks, this, err, cb);
            return;
          }
          this._bufferedBytes -= options[kByteLength];
          const data = toBuffer(arrayBuffer);
          if (!compress) {
            this._state = DEFAULT;
            this.sendFrame(_Sender.frame(data, options), cb);
            this.dequeue();
          } else {
            this.dispatch(data, compress, options, cb);
          }
        }).catch((err) => {
          process.nextTick(onError, this, err, cb);
        });
      }
      /**
       * Dispatches a message.
       *
       * @param {(Buffer|String)} data The message to send
       * @param {Boolean} [compress=false] Specifies whether or not to compress
       *     `data`
       * @param {Object} options Options object
       * @param {Boolean} [options.fin=false] Specifies whether or not to set the
       *     FIN bit
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
       *     key
       * @param {Number} options.opcode The opcode
       * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
       *     modified
       * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
       *     RSV1 bit
       * @param {Function} [cb] Callback
       * @private
       */
      dispatch(data, compress, options, cb) {
        if (!compress) {
          this.sendFrame(_Sender.frame(data, options), cb);
          return;
        }
        const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];
        this._bufferedBytes += options[kByteLength];
        this._state = DEFLATING;
        perMessageDeflate.compress(data, options.fin, (_, buf) => {
          if (this._socket.destroyed) {
            const err = new Error(
              "The socket was closed while data was being compressed"
            );
            callCallbacks(this, err, cb);
            return;
          }
          this._bufferedBytes -= options[kByteLength];
          this._state = DEFAULT;
          options.readOnly = false;
          this.sendFrame(_Sender.frame(buf, options), cb);
          this.dequeue();
        });
      }
      /**
       * Executes queued send operations.
       *
       * @private
       */
      dequeue() {
        while (this._state === DEFAULT && this._queue.length) {
          const params = this._queue.shift();
          this._bufferedBytes -= params[3][kByteLength];
          Reflect.apply(params[0], this, params.slice(1));
        }
      }
      /**
       * Enqueues a send operation.
       *
       * @param {Array} params Send operation parameters.
       * @private
       */
      enqueue(params) {
        this._bufferedBytes += params[3][kByteLength];
        this._queue.push(params);
      }
      /**
       * Sends a frame.
       *
       * @param {(Buffer | String)[]} list The frame to send
       * @param {Function} [cb] Callback
       * @private
       */
      sendFrame(list, cb) {
        if (list.length === 2) {
          this._socket.cork();
          this._socket.write(list[0]);
          this._socket.write(list[1], cb);
          this._socket.uncork();
        } else {
          this._socket.write(list[0], cb);
        }
      }
    };
    module2.exports = Sender2;
    function callCallbacks(sender, err, cb) {
      if (typeof cb === "function") cb(err);
      for (let i = 0; i < sender._queue.length; i++) {
        const params = sender._queue[i];
        const callback = params[params.length - 1];
        if (typeof callback === "function") callback(err);
      }
    }
    function onError(sender, err, cb) {
      callCallbacks(sender, err, cb);
      sender.onerror(err);
    }
  }
});

// node_modules/ws/lib/event-target.js
var require_event_target = __commonJS({
  "node_modules/ws/lib/event-target.js"(exports2, module2) {
    "use strict";
    var { kForOnEventAttribute, kListener } = require_constants();
    var kCode = Symbol("kCode");
    var kData = Symbol("kData");
    var kError = Symbol("kError");
    var kMessage = Symbol("kMessage");
    var kReason = Symbol("kReason");
    var kTarget = Symbol("kTarget");
    var kType = Symbol("kType");
    var kWasClean = Symbol("kWasClean");
    var Event = class {
      /**
       * Create a new `Event`.
       *
       * @param {String} type The name of the event
       * @throws {TypeError} If the `type` argument is not specified
       */
      constructor(type) {
        this[kTarget] = null;
        this[kType] = type;
      }
      /**
       * @type {*}
       */
      get target() {
        return this[kTarget];
      }
      /**
       * @type {String}
       */
      get type() {
        return this[kType];
      }
    };
    Object.defineProperty(Event.prototype, "target", { enumerable: true });
    Object.defineProperty(Event.prototype, "type", { enumerable: true });
    var CloseEvent = class extends Event {
      /**
       * Create a new `CloseEvent`.
       *
       * @param {String} type The name of the event
       * @param {Object} [options] A dictionary object that allows for setting
       *     attributes via object members of the same name
       * @param {Number} [options.code=0] The status code explaining why the
       *     connection was closed
       * @param {String} [options.reason=''] A human-readable string explaining why
       *     the connection was closed
       * @param {Boolean} [options.wasClean=false] Indicates whether or not the
       *     connection was cleanly closed
       */
      constructor(type, options = {}) {
        super(type);
        this[kCode] = options.code === void 0 ? 0 : options.code;
        this[kReason] = options.reason === void 0 ? "" : options.reason;
        this[kWasClean] = options.wasClean === void 0 ? false : options.wasClean;
      }
      /**
       * @type {Number}
       */
      get code() {
        return this[kCode];
      }
      /**
       * @type {String}
       */
      get reason() {
        return this[kReason];
      }
      /**
       * @type {Boolean}
       */
      get wasClean() {
        return this[kWasClean];
      }
    };
    Object.defineProperty(CloseEvent.prototype, "code", { enumerable: true });
    Object.defineProperty(CloseEvent.prototype, "reason", { enumerable: true });
    Object.defineProperty(CloseEvent.prototype, "wasClean", { enumerable: true });
    var ErrorEvent = class extends Event {
      /**
       * Create a new `ErrorEvent`.
       *
       * @param {String} type The name of the event
       * @param {Object} [options] A dictionary object that allows for setting
       *     attributes via object members of the same name
       * @param {*} [options.error=null] The error that generated this event
       * @param {String} [options.message=''] The error message
       */
      constructor(type, options = {}) {
        super(type);
        this[kError] = options.error === void 0 ? null : options.error;
        this[kMessage] = options.message === void 0 ? "" : options.message;
      }
      /**
       * @type {*}
       */
      get error() {
        return this[kError];
      }
      /**
       * @type {String}
       */
      get message() {
        return this[kMessage];
      }
    };
    Object.defineProperty(ErrorEvent.prototype, "error", { enumerable: true });
    Object.defineProperty(ErrorEvent.prototype, "message", { enumerable: true });
    var MessageEvent = class extends Event {
      /**
       * Create a new `MessageEvent`.
       *
       * @param {String} type The name of the event
       * @param {Object} [options] A dictionary object that allows for setting
       *     attributes via object members of the same name
       * @param {*} [options.data=null] The message content
       */
      constructor(type, options = {}) {
        super(type);
        this[kData] = options.data === void 0 ? null : options.data;
      }
      /**
       * @type {*}
       */
      get data() {
        return this[kData];
      }
    };
    Object.defineProperty(MessageEvent.prototype, "data", { enumerable: true });
    var EventTarget = {
      /**
       * Register an event listener.
       *
       * @param {String} type A string representing the event type to listen for
       * @param {(Function|Object)} handler The listener to add
       * @param {Object} [options] An options object specifies characteristics about
       *     the event listener
       * @param {Boolean} [options.once=false] A `Boolean` indicating that the
       *     listener should be invoked at most once after being added. If `true`,
       *     the listener would be automatically removed when invoked.
       * @public
       */
      addEventListener(type, handler, options = {}) {
        for (const listener of this.listeners(type)) {
          if (!options[kForOnEventAttribute] && listener[kListener] === handler && !listener[kForOnEventAttribute]) {
            return;
          }
        }
        let wrapper;
        if (type === "message") {
          wrapper = function onMessage(data, isBinary) {
            const event = new MessageEvent("message", {
              data: isBinary ? data : data.toString()
            });
            event[kTarget] = this;
            callListener(handler, this, event);
          };
        } else if (type === "close") {
          wrapper = function onClose(code, message) {
            const event = new CloseEvent("close", {
              code,
              reason: message.toString(),
              wasClean: this._closeFrameReceived && this._closeFrameSent
            });
            event[kTarget] = this;
            callListener(handler, this, event);
          };
        } else if (type === "error") {
          wrapper = function onError(error) {
            const event = new ErrorEvent("error", {
              error,
              message: error.message
            });
            event[kTarget] = this;
            callListener(handler, this, event);
          };
        } else if (type === "open") {
          wrapper = function onOpen() {
            const event = new Event("open");
            event[kTarget] = this;
            callListener(handler, this, event);
          };
        } else {
          return;
        }
        wrapper[kForOnEventAttribute] = !!options[kForOnEventAttribute];
        wrapper[kListener] = handler;
        if (options.once) {
          this.once(type, wrapper);
        } else {
          this.on(type, wrapper);
        }
      },
      /**
       * Remove an event listener.
       *
       * @param {String} type A string representing the event type to remove
       * @param {(Function|Object)} handler The listener to remove
       * @public
       */
      removeEventListener(type, handler) {
        for (const listener of this.listeners(type)) {
          if (listener[kListener] === handler && !listener[kForOnEventAttribute]) {
            this.removeListener(type, listener);
            break;
          }
        }
      }
    };
    module2.exports = {
      CloseEvent,
      ErrorEvent,
      Event,
      EventTarget,
      MessageEvent
    };
    function callListener(listener, thisArg, event) {
      if (typeof listener === "object" && listener.handleEvent) {
        listener.handleEvent.call(listener, event);
      } else {
        listener.call(thisArg, event);
      }
    }
  }
});

// node_modules/ws/lib/extension.js
var require_extension = __commonJS({
  "node_modules/ws/lib/extension.js"(exports2, module2) {
    "use strict";
    var { tokenChars } = require_validation();
    function push(dest, name, elem) {
      if (dest[name] === void 0) dest[name] = [elem];
      else dest[name].push(elem);
    }
    function parse(header) {
      const offers = /* @__PURE__ */ Object.create(null);
      let params = /* @__PURE__ */ Object.create(null);
      let mustUnescape = false;
      let isEscaping = false;
      let inQuotes = false;
      let extensionName;
      let paramName;
      let start = -1;
      let code = -1;
      let end = -1;
      let i = 0;
      for (; i < header.length; i++) {
        code = header.charCodeAt(i);
        if (extensionName === void 0) {
          if (end === -1 && tokenChars[code] === 1) {
            if (start === -1) start = i;
          } else if (i !== 0 && (code === 32 || code === 9)) {
            if (end === -1 && start !== -1) end = i;
          } else if (code === 59 || code === 44) {
            if (start === -1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (end === -1) end = i;
            const name = header.slice(start, end);
            if (code === 44) {
              push(offers, name, params);
              params = /* @__PURE__ */ Object.create(null);
            } else {
              extensionName = name;
            }
            start = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        } else if (paramName === void 0) {
          if (end === -1 && tokenChars[code] === 1) {
            if (start === -1) start = i;
          } else if (code === 32 || code === 9) {
            if (end === -1 && start !== -1) end = i;
          } else if (code === 59 || code === 44) {
            if (start === -1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (end === -1) end = i;
            push(params, header.slice(start, end), true);
            if (code === 44) {
              push(offers, extensionName, params);
              params = /* @__PURE__ */ Object.create(null);
              extensionName = void 0;
            }
            start = end = -1;
          } else if (code === 61 && start !== -1 && end === -1) {
            paramName = header.slice(start, i);
            start = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        } else {
          if (isEscaping) {
            if (tokenChars[code] !== 1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (start === -1) start = i;
            else if (!mustUnescape) mustUnescape = true;
            isEscaping = false;
          } else if (inQuotes) {
            if (tokenChars[code] === 1) {
              if (start === -1) start = i;
            } else if (code === 34 && start !== -1) {
              inQuotes = false;
              end = i;
            } else if (code === 92) {
              isEscaping = true;
            } else {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
          } else if (code === 34 && header.charCodeAt(i - 1) === 61) {
            inQuotes = true;
          } else if (end === -1 && tokenChars[code] === 1) {
            if (start === -1) start = i;
          } else if (start !== -1 && (code === 32 || code === 9)) {
            if (end === -1) end = i;
          } else if (code === 59 || code === 44) {
            if (start === -1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (end === -1) end = i;
            let value = header.slice(start, end);
            if (mustUnescape) {
              value = value.replace(/\\/g, "");
              mustUnescape = false;
            }
            push(params, paramName, value);
            if (code === 44) {
              push(offers, extensionName, params);
              params = /* @__PURE__ */ Object.create(null);
              extensionName = void 0;
            }
            paramName = void 0;
            start = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        }
      }
      if (start === -1 || inQuotes || code === 32 || code === 9) {
        throw new SyntaxError("Unexpected end of input");
      }
      if (end === -1) end = i;
      const token = header.slice(start, end);
      if (extensionName === void 0) {
        push(offers, token, params);
      } else {
        if (paramName === void 0) {
          push(params, token, true);
        } else if (mustUnescape) {
          push(params, paramName, token.replace(/\\/g, ""));
        } else {
          push(params, paramName, token);
        }
        push(offers, extensionName, params);
      }
      return offers;
    }
    function format(extensions) {
      return Object.keys(extensions).map((extension) => {
        let configurations = extensions[extension];
        if (!Array.isArray(configurations)) configurations = [configurations];
        return configurations.map((params) => {
          return [extension].concat(
            Object.keys(params).map((k) => {
              let values = params[k];
              if (!Array.isArray(values)) values = [values];
              return values.map((v) => v === true ? k : `${k}=${v}`).join("; ");
            })
          ).join("; ");
        }).join(", ");
      }).join(", ");
    }
    module2.exports = { format, parse };
  }
});

// node_modules/ws/lib/websocket.js
var require_websocket = __commonJS({
  "node_modules/ws/lib/websocket.js"(exports2, module2) {
    "use strict";
    var EventEmitter = require("events");
    var https2 = require("https");
    var http2 = require("http");
    var net = require("net");
    var tls = require("tls");
    var { randomBytes, createHash } = require("crypto");
    var { Duplex, Readable } = require("stream");
    var { URL } = require("url");
    var PerMessageDeflate = require_permessage_deflate();
    var Receiver2 = require_receiver();
    var Sender2 = require_sender();
    var { isBlob } = require_validation();
    var {
      BINARY_TYPES,
      EMPTY_BUFFER,
      GUID,
      kForOnEventAttribute,
      kListener,
      kStatusCode,
      kWebSocket,
      NOOP
    } = require_constants();
    var {
      EventTarget: { addEventListener, removeEventListener }
    } = require_event_target();
    var { format, parse } = require_extension();
    var { toBuffer } = require_buffer_util();
    var closeTimeout = 30 * 1e3;
    var kAborted = Symbol("kAborted");
    var protocolVersions = [8, 13];
    var readyStates = ["CONNECTING", "OPEN", "CLOSING", "CLOSED"];
    var subprotocolRegex = /^[!#$%&'*+\-.0-9A-Z^_`|a-z~]+$/;
    var WebSocket2 = class _WebSocket extends EventEmitter {
      /**
       * Create a new `WebSocket`.
       *
       * @param {(String|URL)} address The URL to which to connect
       * @param {(String|String[])} [protocols] The subprotocols
       * @param {Object} [options] Connection options
       */
      constructor(address, protocols, options) {
        super();
        this._binaryType = BINARY_TYPES[0];
        this._closeCode = 1006;
        this._closeFrameReceived = false;
        this._closeFrameSent = false;
        this._closeMessage = EMPTY_BUFFER;
        this._closeTimer = null;
        this._errorEmitted = false;
        this._extensions = {};
        this._paused = false;
        this._protocol = "";
        this._readyState = _WebSocket.CONNECTING;
        this._receiver = null;
        this._sender = null;
        this._socket = null;
        if (address !== null) {
          this._bufferedAmount = 0;
          this._isServer = false;
          this._redirects = 0;
          if (protocols === void 0) {
            protocols = [];
          } else if (!Array.isArray(protocols)) {
            if (typeof protocols === "object" && protocols !== null) {
              options = protocols;
              protocols = [];
            } else {
              protocols = [protocols];
            }
          }
          initAsClient(this, address, protocols, options);
        } else {
          this._autoPong = options.autoPong;
          this._isServer = true;
        }
      }
      /**
       * For historical reasons, the custom "nodebuffer" type is used by the default
       * instead of "blob".
       *
       * @type {String}
       */
      get binaryType() {
        return this._binaryType;
      }
      set binaryType(type) {
        if (!BINARY_TYPES.includes(type)) return;
        this._binaryType = type;
        if (this._receiver) this._receiver._binaryType = type;
      }
      /**
       * @type {Number}
       */
      get bufferedAmount() {
        if (!this._socket) return this._bufferedAmount;
        return this._socket._writableState.length + this._sender._bufferedBytes;
      }
      /**
       * @type {String}
       */
      get extensions() {
        return Object.keys(this._extensions).join();
      }
      /**
       * @type {Boolean}
       */
      get isPaused() {
        return this._paused;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onclose() {
        return null;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onerror() {
        return null;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onopen() {
        return null;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onmessage() {
        return null;
      }
      /**
       * @type {String}
       */
      get protocol() {
        return this._protocol;
      }
      /**
       * @type {Number}
       */
      get readyState() {
        return this._readyState;
      }
      /**
       * @type {String}
       */
      get url() {
        return this._url;
      }
      /**
       * Set up the socket and the internal resources.
       *
       * @param {Duplex} socket The network socket between the server and client
       * @param {Buffer} head The first packet of the upgraded stream
       * @param {Object} options Options object
       * @param {Boolean} [options.allowSynchronousEvents=false] Specifies whether
       *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
       *     multiple times in the same tick
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Number} [options.maxPayload=0] The maximum allowed message size
       * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
       *     not to skip UTF-8 validation for text and close messages
       * @private
       */
      setSocket(socket, head, options) {
        const receiver = new Receiver2({
          allowSynchronousEvents: options.allowSynchronousEvents,
          binaryType: this.binaryType,
          extensions: this._extensions,
          isServer: this._isServer,
          maxPayload: options.maxPayload,
          skipUTF8Validation: options.skipUTF8Validation
        });
        const sender = new Sender2(socket, this._extensions, options.generateMask);
        this._receiver = receiver;
        this._sender = sender;
        this._socket = socket;
        receiver[kWebSocket] = this;
        sender[kWebSocket] = this;
        socket[kWebSocket] = this;
        receiver.on("conclude", receiverOnConclude);
        receiver.on("drain", receiverOnDrain);
        receiver.on("error", receiverOnError);
        receiver.on("message", receiverOnMessage);
        receiver.on("ping", receiverOnPing);
        receiver.on("pong", receiverOnPong);
        sender.onerror = senderOnError;
        if (socket.setTimeout) socket.setTimeout(0);
        if (socket.setNoDelay) socket.setNoDelay();
        if (head.length > 0) socket.unshift(head);
        socket.on("close", socketOnClose);
        socket.on("data", socketOnData);
        socket.on("end", socketOnEnd);
        socket.on("error", socketOnError);
        this._readyState = _WebSocket.OPEN;
        this.emit("open");
      }
      /**
       * Emit the `'close'` event.
       *
       * @private
       */
      emitClose() {
        if (!this._socket) {
          this._readyState = _WebSocket.CLOSED;
          this.emit("close", this._closeCode, this._closeMessage);
          return;
        }
        if (this._extensions[PerMessageDeflate.extensionName]) {
          this._extensions[PerMessageDeflate.extensionName].cleanup();
        }
        this._receiver.removeAllListeners();
        this._readyState = _WebSocket.CLOSED;
        this.emit("close", this._closeCode, this._closeMessage);
      }
      /**
       * Start a closing handshake.
       *
       *          +----------+   +-----------+   +----------+
       *     - - -|ws.close()|-->|close frame|-->|ws.close()|- - -
       *    |     +----------+   +-----------+   +----------+     |
       *          +----------+   +-----------+         |
       * CLOSING  |ws.close()|<--|close frame|<--+-----+       CLOSING
       *          +----------+   +-----------+   |
       *    |           |                        |   +---+        |
       *                +------------------------+-->|fin| - - - -
       *    |         +---+                      |   +---+
       *     - - - - -|fin|<---------------------+
       *              +---+
       *
       * @param {Number} [code] Status code explaining why the connection is closing
       * @param {(String|Buffer)} [data] The reason why the connection is
       *     closing
       * @public
       */
      close(code, data) {
        if (this.readyState === _WebSocket.CLOSED) return;
        if (this.readyState === _WebSocket.CONNECTING) {
          const msg = "WebSocket was closed before the connection was established";
          abortHandshake(this, this._req, msg);
          return;
        }
        if (this.readyState === _WebSocket.CLOSING) {
          if (this._closeFrameSent && (this._closeFrameReceived || this._receiver._writableState.errorEmitted)) {
            this._socket.end();
          }
          return;
        }
        this._readyState = _WebSocket.CLOSING;
        this._sender.close(code, data, !this._isServer, (err) => {
          if (err) return;
          this._closeFrameSent = true;
          if (this._closeFrameReceived || this._receiver._writableState.errorEmitted) {
            this._socket.end();
          }
        });
        setCloseTimer(this);
      }
      /**
       * Pause the socket.
       *
       * @public
       */
      pause() {
        if (this.readyState === _WebSocket.CONNECTING || this.readyState === _WebSocket.CLOSED) {
          return;
        }
        this._paused = true;
        this._socket.pause();
      }
      /**
       * Send a ping.
       *
       * @param {*} [data] The data to send
       * @param {Boolean} [mask] Indicates whether or not to mask `data`
       * @param {Function} [cb] Callback which is executed when the ping is sent
       * @public
       */
      ping(data, mask, cb) {
        if (this.readyState === _WebSocket.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof data === "function") {
          cb = data;
          data = mask = void 0;
        } else if (typeof mask === "function") {
          cb = mask;
          mask = void 0;
        }
        if (typeof data === "number") data = data.toString();
        if (this.readyState !== _WebSocket.OPEN) {
          sendAfterClose(this, data, cb);
          return;
        }
        if (mask === void 0) mask = !this._isServer;
        this._sender.ping(data || EMPTY_BUFFER, mask, cb);
      }
      /**
       * Send a pong.
       *
       * @param {*} [data] The data to send
       * @param {Boolean} [mask] Indicates whether or not to mask `data`
       * @param {Function} [cb] Callback which is executed when the pong is sent
       * @public
       */
      pong(data, mask, cb) {
        if (this.readyState === _WebSocket.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof data === "function") {
          cb = data;
          data = mask = void 0;
        } else if (typeof mask === "function") {
          cb = mask;
          mask = void 0;
        }
        if (typeof data === "number") data = data.toString();
        if (this.readyState !== _WebSocket.OPEN) {
          sendAfterClose(this, data, cb);
          return;
        }
        if (mask === void 0) mask = !this._isServer;
        this._sender.pong(data || EMPTY_BUFFER, mask, cb);
      }
      /**
       * Resume the socket.
       *
       * @public
       */
      resume() {
        if (this.readyState === _WebSocket.CONNECTING || this.readyState === _WebSocket.CLOSED) {
          return;
        }
        this._paused = false;
        if (!this._receiver._writableState.needDrain) this._socket.resume();
      }
      /**
       * Send a data message.
       *
       * @param {*} data The message to send
       * @param {Object} [options] Options object
       * @param {Boolean} [options.binary] Specifies whether `data` is binary or
       *     text
       * @param {Boolean} [options.compress] Specifies whether or not to compress
       *     `data`
       * @param {Boolean} [options.fin=true] Specifies whether the fragment is the
       *     last one
       * @param {Boolean} [options.mask] Specifies whether or not to mask `data`
       * @param {Function} [cb] Callback which is executed when data is written out
       * @public
       */
      send(data, options, cb) {
        if (this.readyState === _WebSocket.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof options === "function") {
          cb = options;
          options = {};
        }
        if (typeof data === "number") data = data.toString();
        if (this.readyState !== _WebSocket.OPEN) {
          sendAfterClose(this, data, cb);
          return;
        }
        const opts = __spreadValues({
          binary: typeof data !== "string",
          mask: !this._isServer,
          compress: true,
          fin: true
        }, options);
        if (!this._extensions[PerMessageDeflate.extensionName]) {
          opts.compress = false;
        }
        this._sender.send(data || EMPTY_BUFFER, opts, cb);
      }
      /**
       * Forcibly close the connection.
       *
       * @public
       */
      terminate() {
        if (this.readyState === _WebSocket.CLOSED) return;
        if (this.readyState === _WebSocket.CONNECTING) {
          const msg = "WebSocket was closed before the connection was established";
          abortHandshake(this, this._req, msg);
          return;
        }
        if (this._socket) {
          this._readyState = _WebSocket.CLOSING;
          this._socket.destroy();
        }
      }
    };
    Object.defineProperty(WebSocket2, "CONNECTING", {
      enumerable: true,
      value: readyStates.indexOf("CONNECTING")
    });
    Object.defineProperty(WebSocket2.prototype, "CONNECTING", {
      enumerable: true,
      value: readyStates.indexOf("CONNECTING")
    });
    Object.defineProperty(WebSocket2, "OPEN", {
      enumerable: true,
      value: readyStates.indexOf("OPEN")
    });
    Object.defineProperty(WebSocket2.prototype, "OPEN", {
      enumerable: true,
      value: readyStates.indexOf("OPEN")
    });
    Object.defineProperty(WebSocket2, "CLOSING", {
      enumerable: true,
      value: readyStates.indexOf("CLOSING")
    });
    Object.defineProperty(WebSocket2.prototype, "CLOSING", {
      enumerable: true,
      value: readyStates.indexOf("CLOSING")
    });
    Object.defineProperty(WebSocket2, "CLOSED", {
      enumerable: true,
      value: readyStates.indexOf("CLOSED")
    });
    Object.defineProperty(WebSocket2.prototype, "CLOSED", {
      enumerable: true,
      value: readyStates.indexOf("CLOSED")
    });
    [
      "binaryType",
      "bufferedAmount",
      "extensions",
      "isPaused",
      "protocol",
      "readyState",
      "url"
    ].forEach((property) => {
      Object.defineProperty(WebSocket2.prototype, property, { enumerable: true });
    });
    ["open", "error", "close", "message"].forEach((method) => {
      Object.defineProperty(WebSocket2.prototype, `on${method}`, {
        enumerable: true,
        get() {
          for (const listener of this.listeners(method)) {
            if (listener[kForOnEventAttribute]) return listener[kListener];
          }
          return null;
        },
        set(handler) {
          for (const listener of this.listeners(method)) {
            if (listener[kForOnEventAttribute]) {
              this.removeListener(method, listener);
              break;
            }
          }
          if (typeof handler !== "function") return;
          this.addEventListener(method, handler, {
            [kForOnEventAttribute]: true
          });
        }
      });
    });
    WebSocket2.prototype.addEventListener = addEventListener;
    WebSocket2.prototype.removeEventListener = removeEventListener;
    module2.exports = WebSocket2;
    function initAsClient(websocket, address, protocols, options) {
      const opts = __spreadProps(__spreadValues({
        allowSynchronousEvents: true,
        autoPong: true,
        protocolVersion: protocolVersions[1],
        maxPayload: 100 * 1024 * 1024,
        skipUTF8Validation: false,
        perMessageDeflate: true,
        followRedirects: false,
        maxRedirects: 10
      }, options), {
        socketPath: void 0,
        hostname: void 0,
        protocol: void 0,
        timeout: void 0,
        method: "GET",
        host: void 0,
        path: void 0,
        port: void 0
      });
      websocket._autoPong = opts.autoPong;
      if (!protocolVersions.includes(opts.protocolVersion)) {
        throw new RangeError(
          `Unsupported protocol version: ${opts.protocolVersion} (supported versions: ${protocolVersions.join(", ")})`
        );
      }
      let parsedUrl;
      if (address instanceof URL) {
        parsedUrl = address;
      } else {
        try {
          parsedUrl = new URL(address);
        } catch (e) {
          throw new SyntaxError(`Invalid URL: ${address}`);
        }
      }
      if (parsedUrl.protocol === "http:") {
        parsedUrl.protocol = "ws:";
      } else if (parsedUrl.protocol === "https:") {
        parsedUrl.protocol = "wss:";
      }
      websocket._url = parsedUrl.href;
      const isSecure = parsedUrl.protocol === "wss:";
      const isIpcUrl = parsedUrl.protocol === "ws+unix:";
      let invalidUrlMessage;
      if (parsedUrl.protocol !== "ws:" && !isSecure && !isIpcUrl) {
        invalidUrlMessage = `The URL's protocol must be one of "ws:", "wss:", "http:", "https:", or "ws+unix:"`;
      } else if (isIpcUrl && !parsedUrl.pathname) {
        invalidUrlMessage = "The URL's pathname is empty";
      } else if (parsedUrl.hash) {
        invalidUrlMessage = "The URL contains a fragment identifier";
      }
      if (invalidUrlMessage) {
        const err = new SyntaxError(invalidUrlMessage);
        if (websocket._redirects === 0) {
          throw err;
        } else {
          emitErrorAndClose(websocket, err);
          return;
        }
      }
      const defaultPort = isSecure ? 443 : 80;
      const key = randomBytes(16).toString("base64");
      const request = isSecure ? https2.request : http2.request;
      const protocolSet = /* @__PURE__ */ new Set();
      let perMessageDeflate;
      opts.createConnection = opts.createConnection || (isSecure ? tlsConnect : netConnect);
      opts.defaultPort = opts.defaultPort || defaultPort;
      opts.port = parsedUrl.port || defaultPort;
      opts.host = parsedUrl.hostname.startsWith("[") ? parsedUrl.hostname.slice(1, -1) : parsedUrl.hostname;
      opts.headers = __spreadProps(__spreadValues({}, opts.headers), {
        "Sec-WebSocket-Version": opts.protocolVersion,
        "Sec-WebSocket-Key": key,
        Connection: "Upgrade",
        Upgrade: "websocket"
      });
      opts.path = parsedUrl.pathname + parsedUrl.search;
      opts.timeout = opts.handshakeTimeout;
      if (opts.perMessageDeflate) {
        perMessageDeflate = new PerMessageDeflate(
          opts.perMessageDeflate !== true ? opts.perMessageDeflate : {},
          false,
          opts.maxPayload
        );
        opts.headers["Sec-WebSocket-Extensions"] = format({
          [PerMessageDeflate.extensionName]: perMessageDeflate.offer()
        });
      }
      if (protocols.length) {
        for (const protocol of protocols) {
          if (typeof protocol !== "string" || !subprotocolRegex.test(protocol) || protocolSet.has(protocol)) {
            throw new SyntaxError(
              "An invalid or duplicated subprotocol was specified"
            );
          }
          protocolSet.add(protocol);
        }
        opts.headers["Sec-WebSocket-Protocol"] = protocols.join(",");
      }
      if (opts.origin) {
        if (opts.protocolVersion < 13) {
          opts.headers["Sec-WebSocket-Origin"] = opts.origin;
        } else {
          opts.headers.Origin = opts.origin;
        }
      }
      if (parsedUrl.username || parsedUrl.password) {
        opts.auth = `${parsedUrl.username}:${parsedUrl.password}`;
      }
      if (isIpcUrl) {
        const parts = opts.path.split(":");
        opts.socketPath = parts[0];
        opts.path = parts[1];
      }
      let req;
      if (opts.followRedirects) {
        if (websocket._redirects === 0) {
          websocket._originalIpc = isIpcUrl;
          websocket._originalSecure = isSecure;
          websocket._originalHostOrSocketPath = isIpcUrl ? opts.socketPath : parsedUrl.host;
          const headers = options && options.headers;
          options = __spreadProps(__spreadValues({}, options), { headers: {} });
          if (headers) {
            for (const [key2, value] of Object.entries(headers)) {
              options.headers[key2.toLowerCase()] = value;
            }
          }
        } else if (websocket.listenerCount("redirect") === 0) {
          const isSameHost = isIpcUrl ? websocket._originalIpc ? opts.socketPath === websocket._originalHostOrSocketPath : false : websocket._originalIpc ? false : parsedUrl.host === websocket._originalHostOrSocketPath;
          if (!isSameHost || websocket._originalSecure && !isSecure) {
            delete opts.headers.authorization;
            delete opts.headers.cookie;
            if (!isSameHost) delete opts.headers.host;
            opts.auth = void 0;
          }
        }
        if (opts.auth && !options.headers.authorization) {
          options.headers.authorization = "Basic " + Buffer.from(opts.auth).toString("base64");
        }
        req = websocket._req = request(opts);
        if (websocket._redirects) {
          websocket.emit("redirect", websocket.url, req);
        }
      } else {
        req = websocket._req = request(opts);
      }
      if (opts.timeout) {
        req.on("timeout", () => {
          abortHandshake(websocket, req, "Opening handshake has timed out");
        });
      }
      req.on("error", (err) => {
        if (req === null || req[kAborted]) return;
        req = websocket._req = null;
        emitErrorAndClose(websocket, err);
      });
      req.on("response", (res) => {
        const location = res.headers.location;
        const statusCode = res.statusCode;
        if (location && opts.followRedirects && statusCode >= 300 && statusCode < 400) {
          if (++websocket._redirects > opts.maxRedirects) {
            abortHandshake(websocket, req, "Maximum redirects exceeded");
            return;
          }
          req.abort();
          let addr;
          try {
            addr = new URL(location, address);
          } catch (e) {
            const err = new SyntaxError(`Invalid URL: ${location}`);
            emitErrorAndClose(websocket, err);
            return;
          }
          initAsClient(websocket, addr, protocols, options);
        } else if (!websocket.emit("unexpected-response", req, res)) {
          abortHandshake(
            websocket,
            req,
            `Unexpected server response: ${res.statusCode}`
          );
        }
      });
      req.on("upgrade", (res, socket, head) => {
        websocket.emit("upgrade", res);
        if (websocket.readyState !== WebSocket2.CONNECTING) return;
        req = websocket._req = null;
        const upgrade = res.headers.upgrade;
        if (upgrade === void 0 || upgrade.toLowerCase() !== "websocket") {
          abortHandshake(websocket, socket, "Invalid Upgrade header");
          return;
        }
        const digest = createHash("sha1").update(key + GUID).digest("base64");
        if (res.headers["sec-websocket-accept"] !== digest) {
          abortHandshake(websocket, socket, "Invalid Sec-WebSocket-Accept header");
          return;
        }
        const serverProt = res.headers["sec-websocket-protocol"];
        let protError;
        if (serverProt !== void 0) {
          if (!protocolSet.size) {
            protError = "Server sent a subprotocol but none was requested";
          } else if (!protocolSet.has(serverProt)) {
            protError = "Server sent an invalid subprotocol";
          }
        } else if (protocolSet.size) {
          protError = "Server sent no subprotocol";
        }
        if (protError) {
          abortHandshake(websocket, socket, protError);
          return;
        }
        if (serverProt) websocket._protocol = serverProt;
        const secWebSocketExtensions = res.headers["sec-websocket-extensions"];
        if (secWebSocketExtensions !== void 0) {
          if (!perMessageDeflate) {
            const message = "Server sent a Sec-WebSocket-Extensions header but no extension was requested";
            abortHandshake(websocket, socket, message);
            return;
          }
          let extensions;
          try {
            extensions = parse(secWebSocketExtensions);
          } catch (err) {
            const message = "Invalid Sec-WebSocket-Extensions header";
            abortHandshake(websocket, socket, message);
            return;
          }
          const extensionNames = Object.keys(extensions);
          if (extensionNames.length !== 1 || extensionNames[0] !== PerMessageDeflate.extensionName) {
            const message = "Server indicated an extension that was not requested";
            abortHandshake(websocket, socket, message);
            return;
          }
          try {
            perMessageDeflate.accept(extensions[PerMessageDeflate.extensionName]);
          } catch (err) {
            const message = "Invalid Sec-WebSocket-Extensions header";
            abortHandshake(websocket, socket, message);
            return;
          }
          websocket._extensions[PerMessageDeflate.extensionName] = perMessageDeflate;
        }
        websocket.setSocket(socket, head, {
          allowSynchronousEvents: opts.allowSynchronousEvents,
          generateMask: opts.generateMask,
          maxPayload: opts.maxPayload,
          skipUTF8Validation: opts.skipUTF8Validation
        });
      });
      if (opts.finishRequest) {
        opts.finishRequest(req, websocket);
      } else {
        req.end();
      }
    }
    function emitErrorAndClose(websocket, err) {
      websocket._readyState = WebSocket2.CLOSING;
      websocket._errorEmitted = true;
      websocket.emit("error", err);
      websocket.emitClose();
    }
    function netConnect(options) {
      options.path = options.socketPath;
      return net.connect(options);
    }
    function tlsConnect(options) {
      options.path = void 0;
      if (!options.servername && options.servername !== "") {
        options.servername = net.isIP(options.host) ? "" : options.host;
      }
      return tls.connect(options);
    }
    function abortHandshake(websocket, stream, message) {
      websocket._readyState = WebSocket2.CLOSING;
      const err = new Error(message);
      Error.captureStackTrace(err, abortHandshake);
      if (stream.setHeader) {
        stream[kAborted] = true;
        stream.abort();
        if (stream.socket && !stream.socket.destroyed) {
          stream.socket.destroy();
        }
        process.nextTick(emitErrorAndClose, websocket, err);
      } else {
        stream.destroy(err);
        stream.once("error", websocket.emit.bind(websocket, "error"));
        stream.once("close", websocket.emitClose.bind(websocket));
      }
    }
    function sendAfterClose(websocket, data, cb) {
      if (data) {
        const length = isBlob(data) ? data.size : toBuffer(data).length;
        if (websocket._socket) websocket._sender._bufferedBytes += length;
        else websocket._bufferedAmount += length;
      }
      if (cb) {
        const err = new Error(
          `WebSocket is not open: readyState ${websocket.readyState} (${readyStates[websocket.readyState]})`
        );
        process.nextTick(cb, err);
      }
    }
    function receiverOnConclude(code, reason) {
      const websocket = this[kWebSocket];
      websocket._closeFrameReceived = true;
      websocket._closeMessage = reason;
      websocket._closeCode = code;
      if (websocket._socket[kWebSocket] === void 0) return;
      websocket._socket.removeListener("data", socketOnData);
      process.nextTick(resume, websocket._socket);
      if (code === 1005) websocket.close();
      else websocket.close(code, reason);
    }
    function receiverOnDrain() {
      const websocket = this[kWebSocket];
      if (!websocket.isPaused) websocket._socket.resume();
    }
    function receiverOnError(err) {
      const websocket = this[kWebSocket];
      if (websocket._socket[kWebSocket] !== void 0) {
        websocket._socket.removeListener("data", socketOnData);
        process.nextTick(resume, websocket._socket);
        websocket.close(err[kStatusCode]);
      }
      if (!websocket._errorEmitted) {
        websocket._errorEmitted = true;
        websocket.emit("error", err);
      }
    }
    function receiverOnFinish() {
      this[kWebSocket].emitClose();
    }
    function receiverOnMessage(data, isBinary) {
      this[kWebSocket].emit("message", data, isBinary);
    }
    function receiverOnPing(data) {
      const websocket = this[kWebSocket];
      if (websocket._autoPong) websocket.pong(data, !this._isServer, NOOP);
      websocket.emit("ping", data);
    }
    function receiverOnPong(data) {
      this[kWebSocket].emit("pong", data);
    }
    function resume(stream) {
      stream.resume();
    }
    function senderOnError(err) {
      const websocket = this[kWebSocket];
      if (websocket.readyState === WebSocket2.CLOSED) return;
      if (websocket.readyState === WebSocket2.OPEN) {
        websocket._readyState = WebSocket2.CLOSING;
        setCloseTimer(websocket);
      }
      this._socket.end();
      if (!websocket._errorEmitted) {
        websocket._errorEmitted = true;
        websocket.emit("error", err);
      }
    }
    function setCloseTimer(websocket) {
      websocket._closeTimer = setTimeout(
        websocket._socket.destroy.bind(websocket._socket),
        closeTimeout
      );
    }
    function socketOnClose() {
      const websocket = this[kWebSocket];
      this.removeListener("close", socketOnClose);
      this.removeListener("data", socketOnData);
      this.removeListener("end", socketOnEnd);
      websocket._readyState = WebSocket2.CLOSING;
      let chunk;
      if (!this._readableState.endEmitted && !websocket._closeFrameReceived && !websocket._receiver._writableState.errorEmitted && (chunk = websocket._socket.read()) !== null) {
        websocket._receiver.write(chunk);
      }
      websocket._receiver.end();
      this[kWebSocket] = void 0;
      clearTimeout(websocket._closeTimer);
      if (websocket._receiver._writableState.finished || websocket._receiver._writableState.errorEmitted) {
        websocket.emitClose();
      } else {
        websocket._receiver.on("error", receiverOnFinish);
        websocket._receiver.on("finish", receiverOnFinish);
      }
    }
    function socketOnData(chunk) {
      if (!this[kWebSocket]._receiver.write(chunk)) {
        this.pause();
      }
    }
    function socketOnEnd() {
      const websocket = this[kWebSocket];
      websocket._readyState = WebSocket2.CLOSING;
      websocket._receiver.end();
      this.end();
    }
    function socketOnError() {
      const websocket = this[kWebSocket];
      this.removeListener("error", socketOnError);
      this.on("error", NOOP);
      if (websocket) {
        websocket._readyState = WebSocket2.CLOSING;
        this.destroy();
      }
    }
  }
});

// node_modules/ws/lib/stream.js
var require_stream = __commonJS({
  "node_modules/ws/lib/stream.js"(exports2, module2) {
    "use strict";
    var WebSocket2 = require_websocket();
    var { Duplex } = require("stream");
    function emitClose(stream) {
      stream.emit("close");
    }
    function duplexOnEnd() {
      if (!this.destroyed && this._writableState.finished) {
        this.destroy();
      }
    }
    function duplexOnError(err) {
      this.removeListener("error", duplexOnError);
      this.destroy();
      if (this.listenerCount("error") === 0) {
        this.emit("error", err);
      }
    }
    function createWebSocketStream2(ws, options) {
      let terminateOnDestroy = true;
      const duplex = new Duplex(__spreadProps(__spreadValues({}, options), {
        autoDestroy: false,
        emitClose: false,
        objectMode: false,
        writableObjectMode: false
      }));
      ws.on("message", function message(msg, isBinary) {
        const data = !isBinary && duplex._readableState.objectMode ? msg.toString() : msg;
        if (!duplex.push(data)) ws.pause();
      });
      ws.once("error", function error(err) {
        if (duplex.destroyed) return;
        terminateOnDestroy = false;
        duplex.destroy(err);
      });
      ws.once("close", function close() {
        if (duplex.destroyed) return;
        duplex.push(null);
      });
      duplex._destroy = function(err, callback) {
        if (ws.readyState === ws.CLOSED) {
          callback(err);
          process.nextTick(emitClose, duplex);
          return;
        }
        let called = false;
        ws.once("error", function error(err2) {
          called = true;
          callback(err2);
        });
        ws.once("close", function close() {
          if (!called) callback(err);
          process.nextTick(emitClose, duplex);
        });
        if (terminateOnDestroy) ws.terminate();
      };
      duplex._final = function(callback) {
        if (ws.readyState === ws.CONNECTING) {
          ws.once("open", function open() {
            duplex._final(callback);
          });
          return;
        }
        if (ws._socket === null) return;
        if (ws._socket._writableState.finished) {
          callback();
          if (duplex._readableState.endEmitted) duplex.destroy();
        } else {
          ws._socket.once("finish", function finish() {
            callback();
          });
          ws.close();
        }
      };
      duplex._read = function() {
        if (ws.isPaused) ws.resume();
      };
      duplex._write = function(chunk, encoding, callback) {
        if (ws.readyState === ws.CONNECTING) {
          ws.once("open", function open() {
            duplex._write(chunk, encoding, callback);
          });
          return;
        }
        ws.send(chunk, callback);
      };
      duplex.on("end", duplexOnEnd);
      duplex.on("error", duplexOnError);
      return duplex;
    }
    module2.exports = createWebSocketStream2;
  }
});

// node_modules/ws/lib/subprotocol.js
var require_subprotocol = __commonJS({
  "node_modules/ws/lib/subprotocol.js"(exports2, module2) {
    "use strict";
    var { tokenChars } = require_validation();
    function parse(header) {
      const protocols = /* @__PURE__ */ new Set();
      let start = -1;
      let end = -1;
      let i = 0;
      for (i; i < header.length; i++) {
        const code = header.charCodeAt(i);
        if (end === -1 && tokenChars[code] === 1) {
          if (start === -1) start = i;
        } else if (i !== 0 && (code === 32 || code === 9)) {
          if (end === -1 && start !== -1) end = i;
        } else if (code === 44) {
          if (start === -1) {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
          if (end === -1) end = i;
          const protocol2 = header.slice(start, end);
          if (protocols.has(protocol2)) {
            throw new SyntaxError(`The "${protocol2}" subprotocol is duplicated`);
          }
          protocols.add(protocol2);
          start = end = -1;
        } else {
          throw new SyntaxError(`Unexpected character at index ${i}`);
        }
      }
      if (start === -1 || end !== -1) {
        throw new SyntaxError("Unexpected end of input");
      }
      const protocol = header.slice(start, i);
      if (protocols.has(protocol)) {
        throw new SyntaxError(`The "${protocol}" subprotocol is duplicated`);
      }
      protocols.add(protocol);
      return protocols;
    }
    module2.exports = { parse };
  }
});

// node_modules/ws/lib/websocket-server.js
var require_websocket_server = __commonJS({
  "node_modules/ws/lib/websocket-server.js"(exports2, module2) {
    "use strict";
    var EventEmitter = require("events");
    var http2 = require("http");
    var { Duplex } = require("stream");
    var { createHash } = require("crypto");
    var extension = require_extension();
    var PerMessageDeflate = require_permessage_deflate();
    var subprotocol = require_subprotocol();
    var WebSocket2 = require_websocket();
    var { GUID, kWebSocket } = require_constants();
    var keyRegex = /^[+/0-9A-Za-z]{22}==$/;
    var RUNNING = 0;
    var CLOSING = 1;
    var CLOSED = 2;
    var WebSocketServer2 = class extends EventEmitter {
      /**
       * Create a `WebSocketServer` instance.
       *
       * @param {Object} options Configuration options
       * @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether
       *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
       *     multiple times in the same tick
       * @param {Boolean} [options.autoPong=true] Specifies whether or not to
       *     automatically send a pong in response to a ping
       * @param {Number} [options.backlog=511] The maximum length of the queue of
       *     pending connections
       * @param {Boolean} [options.clientTracking=true] Specifies whether or not to
       *     track clients
       * @param {Function} [options.handleProtocols] A hook to handle protocols
       * @param {String} [options.host] The hostname where to bind the server
       * @param {Number} [options.maxPayload=104857600] The maximum allowed message
       *     size
       * @param {Boolean} [options.noServer=false] Enable no server mode
       * @param {String} [options.path] Accept only connections matching this path
       * @param {(Boolean|Object)} [options.perMessageDeflate=false] Enable/disable
       *     permessage-deflate
       * @param {Number} [options.port] The port where to bind the server
       * @param {(http.Server|https.Server)} [options.server] A pre-created HTTP/S
       *     server to use
       * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
       *     not to skip UTF-8 validation for text and close messages
       * @param {Function} [options.verifyClient] A hook to reject connections
       * @param {Function} [options.WebSocket=WebSocket] Specifies the `WebSocket`
       *     class to use. It must be the `WebSocket` class or class that extends it
       * @param {Function} [callback] A listener for the `listening` event
       */
      constructor(options, callback) {
        super();
        options = __spreadValues({
          allowSynchronousEvents: true,
          autoPong: true,
          maxPayload: 100 * 1024 * 1024,
          skipUTF8Validation: false,
          perMessageDeflate: false,
          handleProtocols: null,
          clientTracking: true,
          verifyClient: null,
          noServer: false,
          backlog: null,
          // use default (511 as implemented in net.js)
          server: null,
          host: null,
          path: null,
          port: null,
          WebSocket: WebSocket2
        }, options);
        if (options.port == null && !options.server && !options.noServer || options.port != null && (options.server || options.noServer) || options.server && options.noServer) {
          throw new TypeError(
            'One and only one of the "port", "server", or "noServer" options must be specified'
          );
        }
        if (options.port != null) {
          this._server = http2.createServer((req, res) => {
            const body = http2.STATUS_CODES[426];
            res.writeHead(426, {
              "Content-Length": body.length,
              "Content-Type": "text/plain"
            });
            res.end(body);
          });
          this._server.listen(
            options.port,
            options.host,
            options.backlog,
            callback
          );
        } else if (options.server) {
          this._server = options.server;
        }
        if (this._server) {
          const emitConnection = this.emit.bind(this, "connection");
          this._removeListeners = addListeners(this._server, {
            listening: this.emit.bind(this, "listening"),
            error: this.emit.bind(this, "error"),
            upgrade: (req, socket, head) => {
              this.handleUpgrade(req, socket, head, emitConnection);
            }
          });
        }
        if (options.perMessageDeflate === true) options.perMessageDeflate = {};
        if (options.clientTracking) {
          this.clients = /* @__PURE__ */ new Set();
          this._shouldEmitClose = false;
        }
        this.options = options;
        this._state = RUNNING;
      }
      /**
       * Returns the bound address, the address family name, and port of the server
       * as reported by the operating system if listening on an IP socket.
       * If the server is listening on a pipe or UNIX domain socket, the name is
       * returned as a string.
       *
       * @return {(Object|String|null)} The address of the server
       * @public
       */
      address() {
        if (this.options.noServer) {
          throw new Error('The server is operating in "noServer" mode');
        }
        if (!this._server) return null;
        return this._server.address();
      }
      /**
       * Stop the server from accepting new connections and emit the `'close'` event
       * when all existing connections are closed.
       *
       * @param {Function} [cb] A one-time listener for the `'close'` event
       * @public
       */
      close(cb) {
        if (this._state === CLOSED) {
          if (cb) {
            this.once("close", () => {
              cb(new Error("The server is not running"));
            });
          }
          process.nextTick(emitClose, this);
          return;
        }
        if (cb) this.once("close", cb);
        if (this._state === CLOSING) return;
        this._state = CLOSING;
        if (this.options.noServer || this.options.server) {
          if (this._server) {
            this._removeListeners();
            this._removeListeners = this._server = null;
          }
          if (this.clients) {
            if (!this.clients.size) {
              process.nextTick(emitClose, this);
            } else {
              this._shouldEmitClose = true;
            }
          } else {
            process.nextTick(emitClose, this);
          }
        } else {
          const server = this._server;
          this._removeListeners();
          this._removeListeners = this._server = null;
          server.close(() => {
            emitClose(this);
          });
        }
      }
      /**
       * See if a given request should be handled by this server instance.
       *
       * @param {http.IncomingMessage} req Request object to inspect
       * @return {Boolean} `true` if the request is valid, else `false`
       * @public
       */
      shouldHandle(req) {
        if (this.options.path) {
          const index = req.url.indexOf("?");
          const pathname = index !== -1 ? req.url.slice(0, index) : req.url;
          if (pathname !== this.options.path) return false;
        }
        return true;
      }
      /**
       * Handle a HTTP Upgrade request.
       *
       * @param {http.IncomingMessage} req The request object
       * @param {Duplex} socket The network socket between the server and client
       * @param {Buffer} head The first packet of the upgraded stream
       * @param {Function} cb Callback
       * @public
       */
      handleUpgrade(req, socket, head, cb) {
        socket.on("error", socketOnError);
        const key = req.headers["sec-websocket-key"];
        const upgrade = req.headers.upgrade;
        const version = +req.headers["sec-websocket-version"];
        if (req.method !== "GET") {
          const message = "Invalid HTTP method";
          abortHandshakeOrEmitwsClientError(this, req, socket, 405, message);
          return;
        }
        if (upgrade === void 0 || upgrade.toLowerCase() !== "websocket") {
          const message = "Invalid Upgrade header";
          abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
          return;
        }
        if (key === void 0 || !keyRegex.test(key)) {
          const message = "Missing or invalid Sec-WebSocket-Key header";
          abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
          return;
        }
        if (version !== 13 && version !== 8) {
          const message = "Missing or invalid Sec-WebSocket-Version header";
          abortHandshakeOrEmitwsClientError(this, req, socket, 400, message, {
            "Sec-WebSocket-Version": "13, 8"
          });
          return;
        }
        if (!this.shouldHandle(req)) {
          abortHandshake(socket, 400);
          return;
        }
        const secWebSocketProtocol = req.headers["sec-websocket-protocol"];
        let protocols = /* @__PURE__ */ new Set();
        if (secWebSocketProtocol !== void 0) {
          try {
            protocols = subprotocol.parse(secWebSocketProtocol);
          } catch (err) {
            const message = "Invalid Sec-WebSocket-Protocol header";
            abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
            return;
          }
        }
        const secWebSocketExtensions = req.headers["sec-websocket-extensions"];
        const extensions = {};
        if (this.options.perMessageDeflate && secWebSocketExtensions !== void 0) {
          const perMessageDeflate = new PerMessageDeflate(
            this.options.perMessageDeflate,
            true,
            this.options.maxPayload
          );
          try {
            const offers = extension.parse(secWebSocketExtensions);
            if (offers[PerMessageDeflate.extensionName]) {
              perMessageDeflate.accept(offers[PerMessageDeflate.extensionName]);
              extensions[PerMessageDeflate.extensionName] = perMessageDeflate;
            }
          } catch (err) {
            const message = "Invalid or unacceptable Sec-WebSocket-Extensions header";
            abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
            return;
          }
        }
        if (this.options.verifyClient) {
          const info = {
            origin: req.headers[`${version === 8 ? "sec-websocket-origin" : "origin"}`],
            secure: !!(req.socket.authorized || req.socket.encrypted),
            req
          };
          if (this.options.verifyClient.length === 2) {
            this.options.verifyClient(info, (verified, code, message, headers) => {
              if (!verified) {
                return abortHandshake(socket, code || 401, message, headers);
              }
              this.completeUpgrade(
                extensions,
                key,
                protocols,
                req,
                socket,
                head,
                cb
              );
            });
            return;
          }
          if (!this.options.verifyClient(info)) return abortHandshake(socket, 401);
        }
        this.completeUpgrade(extensions, key, protocols, req, socket, head, cb);
      }
      /**
       * Upgrade the connection to WebSocket.
       *
       * @param {Object} extensions The accepted extensions
       * @param {String} key The value of the `Sec-WebSocket-Key` header
       * @param {Set} protocols The subprotocols
       * @param {http.IncomingMessage} req The request object
       * @param {Duplex} socket The network socket between the server and client
       * @param {Buffer} head The first packet of the upgraded stream
       * @param {Function} cb Callback
       * @throws {Error} If called more than once with the same socket
       * @private
       */
      completeUpgrade(extensions, key, protocols, req, socket, head, cb) {
        if (!socket.readable || !socket.writable) return socket.destroy();
        if (socket[kWebSocket]) {
          throw new Error(
            "server.handleUpgrade() was called more than once with the same socket, possibly due to a misconfiguration"
          );
        }
        if (this._state > RUNNING) return abortHandshake(socket, 503);
        const digest = createHash("sha1").update(key + GUID).digest("base64");
        const headers = [
          "HTTP/1.1 101 Switching Protocols",
          "Upgrade: websocket",
          "Connection: Upgrade",
          `Sec-WebSocket-Accept: ${digest}`
        ];
        const ws = new this.options.WebSocket(null, void 0, this.options);
        if (protocols.size) {
          const protocol = this.options.handleProtocols ? this.options.handleProtocols(protocols, req) : protocols.values().next().value;
          if (protocol) {
            headers.push(`Sec-WebSocket-Protocol: ${protocol}`);
            ws._protocol = protocol;
          }
        }
        if (extensions[PerMessageDeflate.extensionName]) {
          const params = extensions[PerMessageDeflate.extensionName].params;
          const value = extension.format({
            [PerMessageDeflate.extensionName]: [params]
          });
          headers.push(`Sec-WebSocket-Extensions: ${value}`);
          ws._extensions = extensions;
        }
        this.emit("headers", headers, req);
        socket.write(headers.concat("\r\n").join("\r\n"));
        socket.removeListener("error", socketOnError);
        ws.setSocket(socket, head, {
          allowSynchronousEvents: this.options.allowSynchronousEvents,
          maxPayload: this.options.maxPayload,
          skipUTF8Validation: this.options.skipUTF8Validation
        });
        if (this.clients) {
          this.clients.add(ws);
          ws.on("close", () => {
            this.clients.delete(ws);
            if (this._shouldEmitClose && !this.clients.size) {
              process.nextTick(emitClose, this);
            }
          });
        }
        cb(ws, req);
      }
    };
    module2.exports = WebSocketServer2;
    function addListeners(server, map) {
      for (const event of Object.keys(map)) server.on(event, map[event]);
      return function removeListeners() {
        for (const event of Object.keys(map)) {
          server.removeListener(event, map[event]);
        }
      };
    }
    function emitClose(server) {
      server._state = CLOSED;
      server.emit("close");
    }
    function socketOnError() {
      this.destroy();
    }
    function abortHandshake(socket, code, message, headers) {
      message = message || http2.STATUS_CODES[code];
      headers = __spreadValues({
        Connection: "close",
        "Content-Type": "text/html",
        "Content-Length": Buffer.byteLength(message)
      }, headers);
      socket.once("finish", socket.destroy);
      socket.end(
        `HTTP/1.1 ${code} ${http2.STATUS_CODES[code]}\r
` + Object.keys(headers).map((h) => `${h}: ${headers[h]}`).join("\r\n") + "\r\n\r\n" + message
      );
    }
    function abortHandshakeOrEmitwsClientError(server, req, socket, code, message, headers) {
      if (server.listenerCount("wsClientError")) {
        const err = new Error(message);
        Error.captureStackTrace(err, abortHandshakeOrEmitwsClientError);
        server.emit("wsClientError", err, socket, req);
      } else {
        abortHandshake(socket, code, message, headers);
      }
    }
  }
});

// node_modules/ws/wrapper.mjs
var wrapper_exports = {};
__export(wrapper_exports, {
  Receiver: () => import_receiver.default,
  Sender: () => import_sender.default,
  WebSocket: () => import_websocket.default,
  WebSocketServer: () => import_websocket_server.default,
  createWebSocketStream: () => import_stream.default,
  default: () => wrapper_default
});
var import_stream, import_receiver, import_sender, import_websocket, import_websocket_server, wrapper_default;
var init_wrapper = __esm({
  "node_modules/ws/wrapper.mjs"() {
    import_stream = __toESM(require_stream(), 1);
    import_receiver = __toESM(require_receiver(), 1);
    import_sender = __toESM(require_sender(), 1);
    import_websocket = __toESM(require_websocket(), 1);
    import_websocket_server = __toESM(require_websocket_server(), 1);
    wrapper_default = import_websocket.default;
  }
});

// src/submodules/utils.ts
var Utils, utils_default;
var init_utils = __esm({
  "src/submodules/utils.ts"() {
    init_bootstrap();
    Utils = class {
      constructor() {
        this.NAME_SPACE = `submodule:utils`;
        this.VERSION_PATH = `../version`;
        this.LOGO_PATH = `../storage/logo.txt`;
        this.LOGO_LEGACY_PATH = `../storage/logo-legacy.txt`;
        this.LOGS_PATH = `../storage/logs.txt`;
        this.CONFIGURATIONS_PATH = `../configurations`;
        this.configurations();
        this.logo();
        this.log(`${this.NAME_SPACE} initialized.`);
      }
      /**
       * @function sleep
       * @description
       *     Pauses execution for the given number of milliseconds.
       * 
       * @param {number} ms
       * @returns {Promise<void>}
       */
      sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }
      /**
       * @function version
       * @description
       *     Reads and returns the current application version from VERSION_PATH, 
       *     or defaults to "v0.0.0" if the file does not exist.
       * 
       * @returns {string}
       */
      version() {
        const version = packages.fs.existsSync(this.VERSION_PATH) ? packages.fs.readFileSync(this.VERSION_PATH, `utf-8`).replace(/\n/g, ``) : `v0.0.0`;
        return version;
      }
      /**
       * @function isFancyDisplay
       * @description
       *     Checks if the fancy interface display setting is enabled in the configuration.
       * 
       * @returns {boolean}
       */
      isFancyDisplay() {
        return cache.internal.configurations.internal_settings.fancy_interface || false;
      }
      /**
       * @function logo
       * @description
       *     Returns the application logo as a string. If fancy interface is disabled,
       *     also prints the logo to the console.
       * 
       * @returns {string | void}
       */
      logo() {
        const path2 = this.isFancyDisplay() ? this.LOGO_PATH : this.LOGO_LEGACY_PATH;
        const ConfigType = cache.internal.configurations;
        const logo = packages.fs.existsSync(path2) ? packages.fs.readFileSync(path2, `utf-8`).replace(`{VERSION}`, this.version()) : `AtmosphericX {VERSION}`;
        if (ConfigType.internal_settings.fancy_interface) {
          return logo;
        }
        console.clear();
        console.log(logo);
      }
      /**
       * @function log
       * @description
       *     logs a message in the console and internal cache with options for formatting.
       * 
       * @param {string} [message]
       * @param {types.LogOptions} [options]
       * @param {string} [logType]
       * @returns {void}
       */
      log(message, options, logType = `__console__`) {
        const title = (options == null ? void 0 : options.title) || `\x1B[32m[ATMOSX-UTILS]\x1B[0m`;
        const msg = message || `No message provided.`;
        const rawConsole = (options == null ? void 0 : options.rawConsole) || false;
        const echoFile = (options == null ? void 0 : options.echoFile) || false;
        if (!rawConsole) {
          cache.internal.logs[logType].push({ title, message: msg, timestamp: (/* @__PURE__ */ new Date()).toLocaleString() });
          if (cache.internal.logs[logType].length > 25) {
            cache.internal.logs[logType].shift();
          }
        }
        if (rawConsole || !this.isFancyDisplay()) {
          console.log(`${title}\x1B[0m [${(/* @__PURE__ */ new Date()).toLocaleString()}] ${msg}`);
        }
        if (echoFile) {
          packages.fs.appendFileSync(this.LOGS_PATH, `[${title.replace(/\x1b\[[0-9;]*m/g, "")}] [${(/* @__PURE__ */ new Date()).toLocaleString()}] ${msg}
`);
        }
      }
      /**
       * @function log
       * @description
       *     Logs a message to the internal cache, console, and optionally to a log file.
       * 
       * @param {string} [message]
       * @param {types.LogOptions} [options]
       * @param {string} [logType]
       * @returns {void}
       */
      configurations() {
        var _a;
        let configurations = packages.fs.existsSync(this.CONFIGURATIONS_PATH) ? packages.fs.readdirSync(this.CONFIGURATIONS_PATH).reduce((acc, file) => {
          const filePath = `${this.CONFIGURATIONS_PATH}/${file}`;
          if (packages.fs.statSync(filePath).isFile()) {
            try {
              const fileContent = packages.jsonc.parse(packages.fs.readFileSync(filePath, "utf-8"));
              acc = __spreadValues(__spreadValues({}, acc), fileContent);
            } catch (e) {
              this.log(`Failed to parse ${file}, malfored JSONC configuration`);
              process.exit(1);
            }
          }
          return acc;
        }, {}) : {};
        cache.internal.configurations = configurations;
        cache.external.configurations = {
          alerts: (_a = configurations.filters) == null ? void 0 : _a.listening_events,
          tones: configurations.tones,
          dictionary: configurations.alert_dictionary,
          schemes: configurations.alert_schemes,
          spc_outlooks: configurations.spc_outlooks,
          third_party_services: configurations.third_party_services,
          forecasting_services: configurations.forecasting_services
        };
      }
      /**
       * @function filterWebContent
       * @description
       *     Recursively removes HTML tags from strings within a given input.
       *     If the input is a JSON string, it attempts to parse it first.
       *     Supports nested objects and arrays, sanitizing all string values.
       *
       * @param {string | unknown} content
       * @returns {unknown}
       */
      filterWebContent(content) {
        if (typeof content == "string") try {
          content = JSON.parse(content);
        } catch (e) {
          return content.replace(/<[^>]*>/g, "");
        }
        if (Array.isArray(content)) return content.map((item) => this.filterWebContent(item));
        if (typeof content == "object" && content !== null) {
          const obj = content;
          for (let key in obj) {
            let value = obj[key];
            obj[key] = typeof value == "string" ? value.replace(/<[^>]*>/g, "") : this.filterWebContent(value);
          }
        }
        return content;
      }
    };
    utils_default = Utils;
  }
});

// src/submodules/alerts.ts
var Alerts, alerts_default;
var init_alerts = __esm({
  "src/submodules/alerts.ts"() {
    init_bootstrap();
    Alerts = class {
      constructor() {
        this.NAME_SPACE = `submodule:alerts`;
        this.PACKAGE = packages.manager.AlertManager;
        submodules.utils.log(`${this.NAME_SPACE} initialized.`);
        this.instance();
      }
      /**
       * @function returnAlertText
       * @description
       *     Generates a formatted alert display string for either legacy or live-feed
       *     rendering modes. When fancy display is enabled and live feed data is present,
       *     alerts are sorted by issue time and formatted using the "fancy" template.
       *     Otherwise, a simplified "legacy" template is used. This implementation is
       *     defensive: it validates shapes, safely calls possible functions, and never
       *     throws on malformed input.
       *
       * @param {types.RegisterType} [registry]
       * @param {boolean} [isLiveFeed=false]
       * @returns {string}
       */
      returnAlertText(reg, isLive) {
        var _a, _b;
        const { utils, calculations } = submodules, { strings: strings2, cache: cache2 } = bootstrap_exports;
        if (!utils.isFancyDisplay() || !isLive) {
          const e = reg == null ? void 0 : reg.event;
          return strings2.new_event_legacy.replace("{EVENT}", (_a = e.properties.event) != null ? _a : "Unknown").replace("{STATUS}", (_b = e.properties.action_type) != null ? _b : "Unknown").replace("{TRACKING}", e.tracking.substring(0, 18)).replace("{SOURCE}", cache2.internal.getSource);
        }
        return cache2.external.events.features.sort((a, b) => new Date(a.event.properties.issued).getTime() - new Date(b.event.properties.issued).getTime()).map((r) => {
          var _a2, _b2, _c, _d;
          const p = r.event.properties, d = p.distance;
          const dist = d && Object.keys(d).length > 0 ? Object.entries(d).map(([name, val]) => {
            var _a3, _b3;
            const distance = (_a3 = val == null ? void 0 : val.distance) != null ? _a3 : "N/A";
            const unit = (_b3 = val == null ? void 0 : val.unit) != null ? _b3 : "";
            return `${name}: ${distance}${unit ? ` ${unit}` : ""}`;
          }).join(", ") : "Not Available";
          return strings2.new_event_fancy.replace("{EVENT}", p.event).replace("{ACTION_TYPE}", p.action_type).replace("{TRACKING}", r.event.tracking.substring(0, 18)).replace("{SENDER}", p.sender_name).replace("{ISSUED}", p.issued).replace("{EXPIRES}", calculations.timeRemaining(p.expires)).replace("{TAGS}", (_b2 = (_a2 = p.tags) == null ? void 0 : _a2.join(", ")) != null ? _b2 : "N/A").replace("{LOCATIONS}", (_d = (_c = p.locations) == null ? void 0 : _c.substring(0, 100)) != null ? _d : "N/A").replace("{DISTANCE}", dist);
        }).join("\n");
      }
      /**
       * @function randomize
       * @description
       *     Selects the next available alert from the combined list of manual and
       *     active event sources. The method cycles sequentially through alerts and
       *     wraps back to the beginning once all have been iterated. Invalid or empty
       *     alert entries are ignored, and the RNG state is automatically reset if
       *     corrupted or out of bounds.
       *
       * @public
       * @returns {types.EventType | null}
       */
      randomize() {
        var _a, _b, _c, _d, _e, _f;
        const ext = cache.external;
        const m = Array.isArray((_a = ext.manual) == null ? void 0 : _a.features) ? ext.manual.features.filter(Boolean) : [];
        const a = Array.isArray((_b = ext.events) == null ? void 0 : _b.features) ? ext.events.features.filter(Boolean) : [];
        const alerts = [...m, ...a].filter((x) => x && typeof x === "object" && Object.keys(x).length > 0);
        if (!alerts.length) return ext.rng = { alert: null, index: null }, null;
        const i = ((_d = (_c = ext.rng) == null ? void 0 : _c.index) != null ? _d : -1) + 1 >= alerts.length ? 0 : ((_f = (_e = ext.rng) == null ? void 0 : _e.index) != null ? _f : -1) + 1;
        const alert = alerts[i];
        ext.rng = { alert, index: i };
        return alert;
      }
      /**
       * @function handle
       * @description
       *     Processes an incoming batch of event objects and updates the external
       *     event cache accordingly. Each event is registered, validated, and merged
       *     into the loader's existing structure. Handles issued, updated, and
       *     cancelled alerts with full state synchronization between internal and
       *     external caches.
       *
       *     - **Issued events** are appended when not already tracked.
       *     - **Updated events** merge histories, locations, and property fields.
       *     - **Cancelled events** remove matching entries from the cache.
       *
       *     This function also updates internal processing metrics and triggers a
       *     network cache refresh to ensure consistent downstream state.
       *
       * @private
       * @param {types.EventType[]} events
       * @returns {void}
       */
      handle(events2) {
        var _a, _b;
        const features = cache.external.events.features;
        for (const event of events2) {
          const registeredEvent = submodules.structure.register(event);
          const { tracking, properties, history = [] } = registeredEvent.event;
          const index = features.findIndex((feature) => feature && feature.event.tracking === tracking);
          if (properties.is_cancelled && index !== -1) {
            features[index] = void 0;
            continue;
          }
          if (properties.is_issued && index === -1) {
            features.push(registeredEvent);
            continue;
          }
          if (properties.is_updated) {
            if (index !== -1 && features[index]) {
              const existing = features[index];
              const existingLocations = (_a = existing.event.properties.locations) != null ? _a : "";
              const mergedHistory = [
                ...(_b = existing.event.history) != null ? _b : [],
                ...history
              ].sort((a, b) => new Date(b.issued).getTime() - new Date(a.issued).getTime());
              const uniqueHistory = mergedHistory.filter(
                (item, pos, arr) => arr.findIndex((i) => i.issued === item.issued && i.description === item.description) === pos
              );
              existing.event.properties.event = properties.event;
              existing.event.history = uniqueHistory;
              existing.event.properties = registeredEvent.event.properties;
              const combinedLocations = [
                ...new Set((existingLocations + "; " + registeredEvent.event.properties.locations).split(";").map((loc) => loc.trim()).filter(Boolean))
              ].join("; ");
              existing.event.properties.locations = combinedLocations;
            } else {
              features.push(registeredEvent);
            }
          }
        }
        cache.internal.metrics.events_processed += events2.length;
        submodules.networking.updateCache(true);
      }
      /**
       * @function instance
       * @description
       *     Initializes or refreshes the parser manager instance with current
       *     configurations and settings. Sets up event handlers for alert reception,
       *     messages, connection, reconnection, and logging. Supports refreshing
       *     an existing manager instance without recreating it.
       *
       * @public
       * @param {boolean} [isRefreshing=false]
       * @returns {void}
       */
      instance(isRefreshing = false) {
        if (isRefreshing && !this.MANAGER) return;
        const configurations = cache.internal.configurations;
        const alerts = configurations.sources.atmosx_parser_settings;
        const nwws = alerts.weather_wire_settings;
        const nws = alerts.national_weather_service_settings;
        const filter = configurations.filters;
        const now = /* @__PURE__ */ new Date();
        const displayName = nwws.client_credentials.nickname.replace(`AtmosphericX`, ``).trim();
        const displayTimestamp = `${String(now.getUTCMonth() + 1).padStart(2, "0")}/${String(now.getUTCDate()).padStart(2, "0")} ${String(now.getUTCHours()).padStart(2, "0")}:${String(now.getUTCMinutes()).padStart(2, "0")}`;
        if (alerts.noaa_weather_wire_service) cache.internal.getSource = `NWWS`;
        const settings = {
          database: nwws.database,
          is_wire: alerts.noaa_weather_wire_service,
          journal: alerts.journal,
          noaa_weather_wire_service_settings: {
            reconnection_settings: { enabled: nwws.client_reconnections.attempt_reconnections, interval: nwws.client_reconnections.reconnection_attempt_interval },
            credentials: { username: nwws.client_credentials.username, password: nwws.client_credentials.password, nickname: `AtmosphericX v${submodules.utils.version()} -> ${displayName} (${displayTimestamp})` },
            cache: { enabled: nwws.client_cache.read_cache, max_file_size: nwws.client_cache.max_size_mb, max_db_history: nwws.client_cache.max_db_history, directory: nwws.client_cache.directory },
            preferences: { cap_only: nwws.alert_preferences.cap_only, shapefile_coordinates: nwws.alert_preferences.implement_db_ugc }
          },
          national_weather_service_settings: { interval: nws.interval, endpoint: nws.endpoint },
          global_settings: {
            parent_events_only: alerts.global_settings.parent_events,
            better_event_parsing: alerts.global_settings.better_parsing,
            filtering: {
              location: { unit: filter.location_settings.unit },
              ignore_text_products: filter.ignore_tests,
              events: filter.all_events ? [] : filter.listening_events,
              ignored_events: filter.ignored_events,
              filtered_icoa: filter.listening_icoa,
              ignored_icoa: filter.ignored_icoa,
              ugc_filter: filter.listening_ugcs,
              state_filter: filter.listening_states,
              check_expired: false
            },
            eas_settings: { festival_tts_voice: filter.festival_voice, directory: filter.eas_settings.eas_directory, intro_wav: filter.eas_settings.eas_intro }
          }
        };
        if (isRefreshing) {
          this.MANAGER.setSettings(settings);
          return;
        }
        this.MANAGER = new this.PACKAGE(settings);
        this.MANAGER.on(`onAlerts`, (alerts2) => {
          this.handle(alerts2);
        });
        this.MANAGER.on(`onMessage`, (message) => __async(this, null, function* () {
          const webhooks = configurations.webhook_settings;
          yield submodules.networking.sendWebhook(`New Stanza - ${message.awipsType.type}`, `\`\`\`${message.message}\`\`\``, webhooks.misc_alerts);
        }));
        this.MANAGER.on(`onConnection`, (displayName2) => __async(this, null, function* () {
          submodules.utils.log(`Connected to NOAA Weather Wire Service as ${displayName2}.`);
        }));
        this.MANAGER.on(`onReconnection`, (service) => {
          const now2 = /* @__PURE__ */ new Date();
          const displayTimestamp2 = `${String(now2.getUTCMonth() + 1).padStart(2, "0")}/${String(now2.getUTCDate()).padStart(2, "0")} ${String(now2.getUTCHours()).padStart(2, "0")}:${String(now2.getUTCMinutes()).padStart(2, "0")}`;
          this.MANAGER.setDisplayName(`AtmosphericX v${submodules.utils.version()} -> ${displayName} (${displayTimestamp2}) (x${service.reconnects})`);
        });
        this.MANAGER.on(`log`, (message) => {
          submodules.utils.log(message, { title: `\x1B[33m[ATMOSX-PARSER]\x1B[0m` });
        });
        cache.internal.manager = this.MANAGER;
      }
    };
    alerts_default = Alerts;
  }
});

// src/submodules/calculations.ts
var Calculations, calculations_default;
var init_calculations = __esm({
  "src/submodules/calculations.ts"() {
    init_bootstrap();
    Calculations = class {
      constructor() {
        this.NAME_SPACE = `submodule:calculations`;
        submodules.utils.log(`${this.NAME_SPACE} initialized.`);
      }
      /**
       * @function convertDegreesToCardinal
       * @description
       *     Converts a numeric heading in degrees (0–360) to its corresponding
       *     cardinal or intercardinal direction (N, NE, E, SE, S, SW, W, NW).
       *
       * @param {number} degrees
       * @returns {string}
       */
      convertDegreesToCardinal(degrees) {
        if (!Number.isFinite(degrees) || degrees < 0 || degrees > 360) return "Invalid";
        const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
        return directions[Math.round((degrees % 360 + 360) % 360 / 45) % 8];
      }
      /**
       * @function calculateDistance
       * @description
       *     Calculates the great-circle distance between two geographic coordinates
       *     using the Haversine formula. Supports output in miles or kilometers.
       *
       * @param {types.Coordinates} coord1
       * @param {types.Coordinates} coord2
       * @param {'miles' | 'kilometers'} [unit='miles']
       * @returns {number}
       */
      calculateDistance(c1, c2, u = "miles") {
        if (!c1 || !c2) return 0;
        const { lat: a, lon: b } = c1, { lat: x, lon: y } = c2;
        if (![a, b, x, y].every(Number.isFinite)) return 0;
        const r = u === "miles" ? 3958.8 : 6371, d = Math.PI / 180;
        const dA = (x - a) * d, dB = (y - b) * d;
        const h = __pow(Math.sin(dA / 2), 2) + Math.cos(a * d) * Math.cos(x * d) * __pow(Math.sin(dB / 2), 2);
        return +(r * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))).toFixed(2);
      }
      /**
       * @function timeRemaining
       * @description
       *     Returns a human-readable string representing the time remaining until
       *     the specified future date. Returns "Expired" if the date has passed or
       *     the original input if the date is invalid.
       *
       * @param {string} futureDate
       * @returns {string | Date}
       */
      timeRemaining(future) {
        const t = Date.parse(future);
        if (isNaN(t)) return future;
        let s = Math.floor((t - Date.now()) / 1e3);
        if (s <= 0) return "Expired";
        const d = Math.floor(s / 86400);
        s %= 86400;
        const h = Math.floor(s / 3600);
        s %= 3600;
        const m = Math.floor(s / 60);
        s %= 60;
        return [d && `${d}d`, h && `${h}h`, m && `${m}m`, `${s}s`].filter(Boolean).join(" ");
      }
      /**
       * @function formatDuration
       * @description
       *     Converts a duration in milliseconds to a human-readable string
       *     formatted as days, hours, minutes, and seconds.
       *
       * @param {number} uptimeMs
       * @returns {string}
       */
      formatDuration(ms) {
        if (!Number.isFinite(ms) || ms < 0) return "0s";
        let s = Math.floor(ms / 1e3);
        const d = Math.floor(s / 86400);
        s %= 86400;
        const h = Math.floor(s / 3600);
        s %= 3600;
        const m = Math.floor(s / 60);
        s %= 60;
        return [d && `${d}d`, h && `${h}h`, m && `${m}m`, `${s}s`].filter(Boolean).join(" ");
      }
    };
    calculations_default = Calculations;
  }
});

// src/submodules/networking.ts
var Alerts2, networking_default;
var init_networking = __esm({
  "src/submodules/networking.ts"() {
    init_bootstrap();
    Alerts2 = class {
      constructor() {
        this.NAME_SPACE = `submodule:networking`;
        submodules.utils.log(`${this.NAME_SPACE} initialized.`);
        this.getUpdates();
      }
      /**
       * @function buildSourceStructure
       * @description
       *     Converts a raw sources object into a typed array of CacheStructure objects.
       * 
       * @param {any} sources
       * @returns {types.CacheStructure[]}
       */
      buildSourceStructure(sources) {
        var _a;
        const structure = [];
        for (const source in sources) {
          for (const [key, value] of Object.entries(sources[source])) {
            const source2 = value;
            structure.push({
              name: key,
              url: source2.endpoint,
              enabled: source2.enabled,
              cache: source2.cache_time,
              contradictions: (_a = source2.contradictions) != null ? _a : []
            });
          }
        }
        return structure;
      }
      /**
       * @function resolveContradictions
       * @description
       *     Processes a CacheStructure array and disables sources based on contradictions.
       * 
       * @param {types.CacheStructure[]} structure
       * @returns {void}
       */
      resolveContradictions(structure) {
        for (const source of structure.filter((s) => s.enabled)) {
          for (const contradiction of source.contradictions) {
            const index = structure.findIndex((s) => s.name === contradiction);
            if (index !== -1 && structure[index].enabled) {
              submodules.utils.log(`Evoking contradiction: ${source.name} disables ${structure[index].name}`, { echoFile: true });
              structure[index].enabled = false;
            }
          }
        }
      }
      /**
       * @function getDataFromSource
       * @description
       *     Fetches data from a given URL and returns an object indicating success or error.
       * 
       * @param {string} url
       * @returns {Promise<{ error: boolean; message: any }>}
       */
      getDataFromSource(url) {
        return __async(this, null, function* () {
          var _a, _b;
          try {
            const response = yield this.httpRequest(url);
            if (response == null ? void 0 : response.error) {
              return { error: true, message: `Error fetching data from ${url}` };
            }
            return { error: false, message: (_a = response == null ? void 0 : response.message) != null ? _a : response };
          } catch (error) {
            return { error: true, message: `Exception fetching data from ${url}: ${(_b = error.message) != null ? _b : error}` };
          }
        });
      }
      /**
       * @function httpRequest
       * @description
       *     Performs an HTTP GET request to the specified URL with optional custom options.
       * 
       * @param {string} url
       * @param {types.HTTPOptions} [options]
       * @returns {Promise<any>}
       */
      httpRequest(url, options) {
        return new Promise((resolve) => __async(null, null, function* () {
          try {
            const config = cache.internal.configurations;
            const isOptionsProvided = options !== void 0;
            if (!isOptionsProvided) {
              options = {
                timeout: config.internal_settings.request_timeout * 1e3,
                headers: {
                  "User-Agent": `AtmosphericX/${submodules.utils.version()}`,
                  "Accept": "application/geo+json, text/plain, */*; q=0.",
                  "Accept-Language": "en-US,en;q=0.9"
                },
                method: "GET",
                body: null
              };
            }
            const response = yield packages.axios.get(url, {
              headers: options.headers,
              maxRedirects: 0,
              timeout: options.timeout,
              httpsAgent: new packages.https.Agent({ rejectUnauthorized: false }),
              validateStatus: (status) => status == 200 || status == 500
            });
            const { data: responseMessage } = response;
            return resolve({ message: responseMessage, error: false });
          } catch (error) {
            return resolve({ message: error, error: true });
          }
        }));
      }
      /**
       * @function getUpdates
       * @description
       *     Checks the online repository for the latest version and changelogs.
       *     Updates cache and logs messages if a newer version is discovered.
       * 
       * @returns {Promise<{error: boolean, message: string}>}
       */
      getUpdates() {
        return new Promise((resolve) => __async(this, null, function* () {
          const onlineVersion = yield this.httpRequest(`https://raw.githubusercontent.com/k3yomi/AtmosphericX/main/version`, void 0);
          const onlineChangelogs = yield this.httpRequest(`https://raw.githubusercontent.com/k3yomi/AtmosphericX/main/changelogs-history.json`, void 0);
          const offlineVersion = submodules.utils.version();
          if (onlineVersion.error == true || onlineChangelogs.error == true) {
            submodules.utils.log(strings.updated_required_failed, { echoFile: true });
            return resolve({ error: true, message: `Failed to check for updates.` });
          }
          const onlineVersionParsed = onlineVersion.message.replace(/\n/g, ``);
          const onlineChangelogsParsed = onlineChangelogs.message[onlineVersion] ? onlineChangelogs.message[onlineVersionParsed].changelogs.join(`
	`) : `No changelogs available.`;
          cache.external.version = offlineVersion;
          cache.external.changelogs = onlineChangelogsParsed;
          const isNewerVersionDiscovered = (a, b) => {
            const [ma, mi, pa] = a.split(".").map(Number);
            const [mb, mi2, pb] = b.split(".").map(Number);
            return ma > mb || ma === mb && mi > mi2 || ma === mb && mi === mi2 && pa > pb;
          };
          if (isNewerVersionDiscovered(onlineVersionParsed, offlineVersion)) {
            submodules.utils.log(strings.updated_requied.replace(`{ONLINE_PARSED}`, onlineVersionParsed).replace(`{OFFLINE_VERSION}`, offlineVersion).replace(`{ONLINE_CHANGELOGS}`, onlineChangelogsParsed), { echoFile: true });
          }
          return { error: false, message: `Update check completed.` };
        }));
      }
      /**
       * @function sendWebhook
       * @description
       *     Sends a Discord webhook message with a title and body, respecting cooldowns
       *     and truncating messages that are too long.
       * 
       * @param {string} title
       * @param {string} body
       * @param {types.WebhookSettings} settings
       * @returns {Promise<void>}
       */
      sendWebhook(title, body, settings) {
        return __async(this, null, function* () {
          if (!settings.enabled) {
            return;
          }
          const time = Date.now();
          cache.internal.webhooks = cache.internal.webhooks.filter((ts) => ts.time > time - settings.webhook_cooldown * 1e3);
          if (cache.internal.webhooks.filter((ts) => ts.type == title).length >= 3) {
            return;
          }
          if (body.length > 1900) {
            body = body.substring(0, 1900) + "\n\n[Message truncated due to length]";
            if (body.split("```").length % 2 == 0) {
              body += "```";
            }
          }
          const embed = { title, description: body, color: 16711680, timestamp: (/* @__PURE__ */ new Date()).toISOString(), footer: { text: title } };
          try {
            yield packages.axios.post(settings.discord_webhook || ``, {
              username: settings.webhook_display || `AtmosphericX Alerts`,
              content: settings.content || ``,
              embeds: [embed]
            });
            cache.internal.webhooks.push({ type: title, timestamp: time });
            return;
          } catch (error) {
          }
        });
      }
      /**
       * @function updateCache
       * @description
       *     Updates internal and external cache, fetching data from sources, resolving contradictions,
       *     and optionally updating alerts. Logs fetch results and updates the structured cache.
       * 
       * @param {boolean} [isAlertUpdate]
       * @returns {Promise<void>}
       */
      updateCache(isAlertUpdate) {
        return __async(this, null, function* () {
          var _a, _c;
          submodules.utils.configurations();
          const ConfigType = cache.internal.configurations;
          const ExternalType = cache.external;
          ExternalType.hashes = ExternalType.hashes.filter((e) => e !== void 0 && new Date(e.expires).getTime() > (/* @__PURE__ */ new Date()).getTime());
          ExternalType.events = {
            features: (_a = ExternalType.events) == null ? void 0 : _a.features.filter((f) => f !== void 0 && new Date(f.event.properties.expires).getTime() > (/* @__PURE__ */ new Date()).getTime()).filter((f) => {
              if (ConfigType.filters.all_events) return true;
              return ConfigType.filters.listening_events.includes(f.event.properties.event);
            })
          };
          submodules.alerts.instance(true);
          yield submodules.utils.sleep(200);
          let data = {};
          let stringText = ``;
          const setTime = Date.now();
          const _b = ConfigType.sources, { atmosx_parser_settings } = _b, sources = __objRest(_b, ["atmosx_parser_settings"]);
          if (!isAlertUpdate) {
            const structure = this.buildSourceStructure(sources);
            this.resolveContradictions(structure);
            const activeSources = structure.filter((s) => s.enabled && s.url != null);
            yield Promise.all(
              activeSources.map((source) => __async(this, null, function* () {
                var _a2;
                const lastFetched = (_a2 = cache.internal.http_timers[source.name]) != null ? _a2 : 0;
                if (setTime - lastFetched <= source.cache * 1e3) return;
                cache.internal.http_timers[source.name] = setTime;
                for (let attempt = 0; attempt < 3; attempt++) {
                  const response = yield this.getDataFromSource(source.url);
                  if (!response.error) {
                    data[source.name] = response.message;
                    stringText += `(OK) ${source.name.toUpperCase()}, `;
                    break;
                  } else {
                    submodules.utils.log(`Error fetching data from ${source.name.toUpperCase()} (${attempt + 1}/3)`, { echoFile: true });
                    if (attempt === 2) {
                      data[source.name] = void 0;
                      stringText += `(ERR) ${source.name.toUpperCase()}, `;
                    }
                  }
                }
              }))
            );
          }
          if (isAlertUpdate) {
            if (!atmosx_parser_settings.noaa_weather_wire_service) {
              const lastFetched = (_c = cache.internal.http_timers[`NWS`]) != null ? _c : 0;
              if (setTime - lastFetched <= atmosx_parser_settings.national_weather_service_settings.interval * 1e3) return;
              cache.internal.http_timers[`NWS`] = setTime;
              stringText += `(OK) NWS, `;
            }
          }
          data["events"] = cache.external.events.features;
          if (stringText.length > 0) {
            submodules.utils.log(`Cache Updated: - Taken: ${Date.now() - setTime}ms - ${stringText.slice(0, -2)}`, { echoFile: true });
          }
          submodules.structure.create(data);
        });
      }
    };
    networking_default = Alerts2;
  }
});

// src/submodules/structure.ts
var Structure, structure_default;
var init_structure = __esm({
  "src/submodules/structure.ts"() {
    init_bootstrap();
    Structure = class {
      constructor() {
        this.NAME_SPACE = `submodule:structure`;
        submodules.utils.log(`${this.NAME_SPACE} initialized.`);
      }
      /**
       * @function parsing
       * @description
       *     Routes raw input data to the appropriate parser based on the specified type.
       * 
       * @param {unknown} [body]
       * @param {string} [type]
       * @returns {Promise<any[]>}
       */
      parsing(body, type) {
        return __async(this, null, function* () {
          switch (type) {
            case "spotter_network_feed":
              return submodules.parsing.getSpotterFeed(body);
            case "storm_prediction_center_mesoscale":
              return submodules.parsing.getSPCDiscussions(body);
            case "spotter_reports":
              return submodules.parsing.getSpotterReportStructure(body);
            case "grlevelx_reports":
              return submodules.parsing.getGibsonReportStructure(body);
            case "tropical_storm_tracks":
              return submodules.parsing.getTropicalStormStructure(body);
            case "tornado":
              return submodules.parsing.getProbabilityStructure(body, "tornado");
            case "severe":
              return submodules.parsing.getProbabilityStructure(body, "severe");
            case "sonde_project_weather_eye":
              return submodules.parsing.getWxEyeSondeStructure(body);
            case "wx_radio":
              return submodules.parsing.getWxRadioStructure(body);
            default:
              return [];
          }
        });
      }
      /**
       * @function metadata
       * @description
       *     Retrieves the alert scheme, dictionary, and corresponding sound effect for a given event.
       * 
       * @param {types.EventType} event
       * @returns {{ sfx: string; scheme: any; metadata: any }}
       */
      metadata(event) {
        const ConfigType = cache.internal.configurations;
        const schemes = ConfigType.alert_schemes[event.properties.event] || ConfigType.alert_schemes[event.properties.parent] || ConfigType.alert_schemes["Default"];
        const dictionary = ConfigType.alert_dictionary[event.properties.event] || ConfigType.alert_dictionary[event.properties.parent] || ConfigType.alert_dictionary["Special Event"];
        let sfx = dictionary.sfx_cancel;
        if (event.properties.is_issued) sfx = dictionary.sfx_issued;
        else if (event.properties.is_updated) sfx = dictionary.sfx_update;
        else if (event.properties.is_cancelled) sfx = dictionary.sfx_cancel;
        return { sfx, scheme: schemes, metadata: dictionary.metadata };
      }
      /**
       * @function register
       * @description
       *    Registers an event, determining its metadata, sound scheme, and whether it should be ignored or beeped.
       * 	
       * @param {types.EventType} event
       * @returns {object}
       */
      register(event) {
        const ConfigType = cache.internal.configurations;
        const eventName = event.properties.event;
        const isPriorityEvent = ConfigType.filters.priority_events.includes(eventName);
        const isBeepAuthorizedOnly = ConfigType.filters.sfx_beep_only;
        const isShowingUpdatesAllowed = ConfigType.filters.show_updates;
        const eventMetadata = this.metadata(event);
        const isBeepOnly = isBeepAuthorizedOnly && isPriorityEvent;
        const isIgnored = !isShowingUpdatesAllowed && !isPriorityEvent;
        return {
          event,
          metadata: eventMetadata.metadata,
          scheme: eventMetadata.scheme,
          sfx: isBeepOnly ? ConfigType.tones.sfx_beep : eventMetadata.sfx,
          ignored: isIgnored,
          beep: isBeepOnly
        };
      }
      /**
       * @function distance
       * @description
       *    Calculates the distance of an event from predefined locations and determines if it's within range.
       * 	
       * @param {types.EventType} event
       * @returns {object}
       */
      distance(event) {
        var _a, _b;
        const ConfigType = cache.internal.configurations;
        const cache2 = cache.external.locations;
        const coords = (_b = (_a = event.properties) == null ? void 0 : _a.geometry) == null ? void 0 : _b.coordinates;
        let range = [];
        let inRange = ConfigType.filters.location_settings.enabled == true && cache2 && Object.keys(cache2).length > 0 ? false : true;
        if (coords != null) {
          for (const key in cache2) {
            const name = key;
            const lat = cache2[key].lat;
            const lon = cache2[key].lon;
            const unit = ConfigType.filters.location_settings.unit || "miles";
            const singleCoord = coords;
            const center = singleCoord.reduce((acc, [lat2, lon2]) => [acc[0] + lat2, acc[1] + lon2], [0, 0]).map((sum) => sum / singleCoord.length);
            const distance = submodules.calculations.calculateDistance(
              { lat: center[0], lon: center[1] },
              { lat, lon },
              unit
            );
            if (ConfigType.filters.location_settings.enabled) {
              if (distance < ConfigType.filters.location_settings.max_distance) {
                inRange = true;
              }
            }
            range.push({ [name]: { distance, unit } });
          }
        }
        return { inRange, range: __spreadValues(__spreadValues({}, event.properties.distance), Object.assign({}, ...range)) };
      }
      /**
       * @function create
       * @description
       *     Processes raw data, parses it into structured types, updates caches, logs events,
       *     and triggers webhooks for new alerts.
       * 
       * @param {unknown} data
       * @param {boolean} [isAlertupdate]
       * @returns {Promise<void>}
       */
      create(data, isAlertupdate) {
        return __async(this, null, function* () {
          var _a;
          const clean = submodules.utils.filterWebContent(data);
          const ConfigType = cache.internal.configurations;
          const dataTypes = [
            { key: "spotter_network_feed", cache: "spotter_network_feed" },
            { key: "spotter_reports", cache: "storm_reports" },
            { key: "grlevelx_reports", cache: "storm_reports" },
            { key: "storm_prediction_center_mesoscale", cache: "storm_prediction_center_mesoscale" },
            { key: "tropical_storm_tracks", cache: "tropical_storm_tracks" },
            { key: "tornado", cache: "tornado" },
            { key: "severe", cache: "severe" },
            { key: "sonde_project_weather_eye", cache: "sonde_project_weather_eye" },
            { key: "wx_radio", cache: "wx_radio" }
          ];
          for (const { key, cache: cache2 } of dataTypes) {
            if (clean[key]) {
              cache.external[cache2] = yield this.parsing(clean[key], key);
            }
          }
          if ((_a = clean.events) == null ? void 0 : _a.length) {
            for (const ev of clean.events) {
              const isAlreadyLogged = cache.external.hashes.some((log) => log.id === ev.event.hash);
              const eventDistance = this.distance(ev.event);
              ev.event.properties.distance = eventDistance.range;
              ev.ignored = this.distance(ev.event).inRange === false;
              if (isAlreadyLogged) continue;
              if (ev.ignored) continue;
              cache.external.hashes.push({ id: ev.event.hash, expires: ev.event.properties.expires });
              if (!submodules.utils.isFancyDisplay()) {
                submodules.utils.log(submodules.alerts.returnAlertText(ev));
              } else {
                submodules.utils.log(submodules.alerts.returnAlertText(ev), {}, `__events__`);
              }
              const webhooks = ConfigType.webhook_settings;
              const pSet = new Set((ConfigType.filters.priority_events || []).map((p) => String(p).toLowerCase()));
              const title = `${ev.event.properties.event} (${ev.event.properties.action_type})`;
              const body = [
                `**Locations:** ${ev.event.properties.locations.slice(0, 259)}`,
                `**Issued:** ${ev.event.properties.issued}`,
                `**Expires:** ${ev.event.properties.expires}`,
                `**Wind Gusts:** ${ev.event.properties.parameters.max_wind_gust}`,
                `**Hail Size:** ${ev.event.properties.parameters.max_hail_size}`,
                `**Damage Threat:** ${ev.event.properties.parameters.damage_threat}`,
                `**Tornado Threat:** ${ev.event.properties.parameters.tornado_detection}`,
                `**Flood Threat:** ${ev.event.properties.parameters.flood_detection}`,
                `**Tags:** ${ev.event.properties.tags ? ev.event.properties.tags.join(", ") : "N/A"}`,
                `**Sender:** ${ev.event.properties.sender_name}`,
                `**Tracking ID:** ${ev.event.tracking}`,
                "```",
                ev.event.properties.description.split("\n").map((line) => line.trim()).filter((line) => line.length > 0).join("\n"),
                "```"
              ].join("\n");
              yield submodules.networking.sendWebhook(title, body, webhooks.general_alerts);
              if (pSet.has(ev.event.properties.event.toLowerCase())) {
                yield submodules.networking.sendWebhook(title, body, webhooks.critical_alerts);
              }
            }
          }
          cache.external.events.features = clean.events.filter((ev) => !ev.ignored) || [];
          submodules.routes.onUpdateRequest();
        });
      }
    };
    structure_default = Structure;
  }
});

// src/submodules/display.ts
var Display, display_default;
var init_display = __esm({
  "src/submodules/display.ts"() {
    init_bootstrap();
    Display = class {
      constructor() {
        this.NAME_SPACE = `submodule:display`;
        this.elements = {};
        (() => __async(this, null, function* () {
          submodules.utils.log(`${this.NAME_SPACE} initialized.`);
          if (!submodules.utils.isFancyDisplay()) {
            return;
          }
          this.PACKAGE = packages.gui;
          this.MANAGER = this.PACKAGE.screen({
            smartCSR: true,
            title: `AtmosphericX v${submodules.utils.version()}`
          });
          this.MANAGER.key(["escape", "C-c"], (ch, key) => {
            return process.exit(0);
          });
          yield this.intro(1e3);
          this.create();
          this.update();
          setInterval(() => {
            this.update();
          }, 1e3);
        }))();
      }
      /**
       * @function intro
       * @description
       *     Displays an introductory screen with logo and console logs
       *     for a specified duration before transitioning to the main display.
       *
       * @param {number} delay
       * @returns {Promise<void>}
       */
      intro(delay) {
        const ConfigType = cache.internal.configurations;
        return new Promise((resolve) => __async(this, null, function* () {
          const tempLogo = this.PACKAGE.box(__spreadProps(__spreadValues({}, ConfigType.display_settings.intro_screen), {
            content: submodules.utils.logo()
          }));
          const tempConsole = this.PACKAGE.box(__spreadProps(__spreadValues({}, ConfigType.display_settings.intro_console), {
            label: ` Preparing AtmosphericX v${submodules.utils.version()} `,
            content: cache.internal.logs.__console__.map((log) => {
              return `${log.title} [${log.timestamp}] ${log.message}`;
            }).join("\n")
          }));
          this.MANAGER.append(tempLogo);
          this.MANAGER.append(tempConsole);
          this.MANAGER.render();
          yield submodules.utils.sleep(delay);
          tempLogo.destroy();
          tempConsole.destroy();
          resolve();
        }));
      }
      /**
       * @function create
       * @description
       *     Creates and appends the main display elements (logs, system info, and events)
       *     to the Blessed screen manager.
       *
       * @returns {void}
       */
      create() {
        const ConfigType = cache.internal.configurations;
        const dS = ConfigType.display_settings;
        this.elements = {
          logs: this.PACKAGE.box(__spreadProps(__spreadValues({}, dS.logging_window), { label: ` AtmosphericX v${submodules.utils.version()} ` })),
          system: this.PACKAGE.box(__spreadValues({}, dS.system_info_window)),
          sessions: this.PACKAGE.box(__spreadValues({}, dS.sessions_window)),
          events: this.PACKAGE.box(__spreadValues({}, dS.events_window))
        };
        for (const key in this.elements) {
          this.MANAGER.append(this.elements[key]);
        }
        this.MANAGER.render();
      }
      /**
       * @function update
       * @description
       *     Updates the main display elements on the Blessed screen, including events,
       *     system information, and console logs. Handles both legacy and fancy interface feeds.
       *
       * @returns {void}
       */
      update() {
        if (!submodules.utils.isFancyDisplay()) {
          return;
        }
        const ConfigType = cache.internal.configurations;
        this.modifyElement(
          `events`,
          !ConfigType.internal_settings.fancy_interface_feed ? cache.internal.logs.__events__.map((log) => {
            return `[${log.timestamp}] ${log.message}`;
          }).join("\n") : submodules.alerts.returnAlertText({}, true),
          ` Active Events (X${cache.external.events.features.length}) - ${cache.internal.getSource} `
        );
        this.elements.system.setContent(
          strings.system_info.replace(`{UPTIME}`, submodules.calculations.formatDuration(Date.now() - cache.internal.metrics.start_uptime)).replace(`{MEMORY}`, ((packages.os.totalmem() - packages.os.freemem()) / (1024 * 1024)).toFixed(2)).replace(`{HEAP}`, (process.memoryUsage().heapUsed / (1024 * 1024)).toFixed(2)).replace(`{EVENTS_PROCESSED}`, cache.internal.metrics.events_processed.toString()),
          ` System Info `
        );
        this.modifyElement(
          `logs`,
          cache.internal.logs.__console__.map((log) => {
            return `${log.title} [${log.timestamp}] ${log.message}`;
          }).join("\n"),
          ` AtmosphericX v${submodules.utils.version()} `
        );
        this.modifyElement(
          `sessions`,
          cache.internal.accounts.map((session) => {
            return `${session.username} - ${session.address}`;
          }).join("\n") || `No active sessions.`,
          ` Active Sessions (X${cache.internal.accounts.length}) `
        );
        this.MANAGER.render();
      }
      /**
       * @function modifyElement
       * @description
       *     Updates the content and optionally the label of a specific display element.
       *     Scrolls the element to the bottom and re-renders the screen.
       *
       * @param {string} key
       * @param {string} content
       * @param {string} [title]
       * @returns {void}
       */
      modifyElement(key, content, title) {
        if (this.elements[key]) {
          this.elements[key].setContent(content);
          if (title) this.elements[key].setLabel(` ${title} `);
          this.elements[key].setScrollPerc(100);
          this.MANAGER.render();
        }
      }
    };
    display_default = Display;
  }
});

// src/submodules/parsing.ts
var Parsing, parsing_default;
var init_parsing = __esm({
  "src/submodules/parsing.ts"() {
    init_bootstrap();
    Parsing = class {
      constructor() {
        this.NAME_SPACE = `submodule:parsing`;
        submodules.utils.log(`${this.NAME_SPACE} initialized.`);
      }
      /**
       * @function getGibsonReportStructure
       * @description
       *     Parses a Gibson Ridge Placefile body and converts it into a GeoJSON FeatureCollection.
       * 
       * @param {string} body
       * @returns {Promise<types.GeoJSONFeatureCollection>}
       */
      getGibsonReportStructure(body) {
        return __async(this, null, function* () {
          var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n;
          const structure = { type: "FeatureCollection", features: [] };
          const parsed = yield packages.placefile.PlacefileManager.parseTable(body);
          for (const feature of parsed) {
            const lon = parseFloat(feature.lon);
            const lat = parseFloat(feature.lat);
            if (isNaN(lon) || isNaN(lat)) continue;
            structure.features.push({
              type: "Feature",
              geometry: { type: "Point", coordinates: [lon, lat] },
              properties: {
                location: `${(_a = feature.city) != null ? _a : "N/A"}, ${(_b = feature.county) != null ? _b : "N/A"}, ${(_c = feature.state) != null ? _c : "N/A"}`,
                event: (_d = feature.event) != null ? _d : "N/A",
                sender: (_e = feature.source) != null ? _e : "N/A",
                description: `${(_f = feature.event) != null ? _f : "Event"} reported at ${(_g = feature.city) != null ? _g : "Unknown"}, ${(_h = feature.county) != null ? _h : "Unknown"}, ${(_i = feature.state) != null ? _i : "Unknown"}. ${(_j = feature.comment) != null ? _j : "No additional details."}`,
                magnitude: (_k = feature.mag) != null ? _k : 0,
                office: (_l = feature.office) != null ? _l : "N/A",
                date: (_m = feature.date) != null ? _m : "N/A",
                time: (_n = feature.time) != null ? _n : "N/A"
              }
            });
          }
          return structure;
        });
      }
      /**
       * @function getSpotterReportStructure
       * @description
       *     Parses a Spotter Network Placefile body and converts it into a GeoJSON FeatureCollection.
       * 
       * @param {string} body
       * @returns {Promise<types.GeoJSONFeatureCollection>}
       */
      getSpotterReportStructure(body) {
        return __async(this, null, function* () {
          var _a, _b, _c, _d, _e, _f, _g, _h;
          const structure = { type: "FeatureCollection", features: [] };
          const parsed = yield packages.placefile.PlacefileManager.parsePlacefile(body);
          for (const feature of parsed) {
            const lon = parseFloat(feature.icon.x);
            const lat = parseFloat(feature.icon.y);
            if (isNaN(lon) || isNaN(lat)) continue;
            const lines = feature.icon.label.split("\n").map((l) => l.trim());
            structure.features.push({
              type: "Feature",
              geometry: { type: "Point", coordinates: [lon, lat] },
              properties: {
                event: (_a = lines[1]) != null ? _a : "N/A",
                reporter: (_c = (_b = lines[0]) == null ? void 0 : _b.replace("Reported By:", "").trim()) != null ? _c : "N/A",
                size: (_e = (_d = lines[2]) == null ? void 0 : _d.replace("Size:", "").trim()) != null ? _e : "N/A",
                notes: (_g = (_f = lines[3]) == null ? void 0 : _f.replace("Notes:", "").trim()) != null ? _g : "N/A",
                sender: "Spotter Network",
                description: (_h = feature.icon.label.replace(/\n/g, "<br>").trim()) != null ? _h : "N/A"
              }
            });
          }
          return structure;
        });
      }
      /**
       * @function getSPCDiscussions
       * @description
       *     Parses SPC GeoJSON discussion data and converts it into a GeoJSON FeatureCollection.
       *     Filters out expired discussions and extracts relevant probabilities and metadata.
       * 
       * @param {string} body
       * @returns {Promise<types.GeoJSONFeatureCollection>}
       */
      getSPCDiscussions(body) {
        return __async(this, null, function* () {
          var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o;
          const structure = { type: "FeatureCollection", features: [] };
          const parsed = yield packages.placefile.PlacefileManager.parseGeoJSON(body);
          for (const feature of parsed) {
            if (!feature.properties || !feature.coordinates) continue;
            if (feature.properties.expires_at_ms < Date.now()) continue;
            const torProb = packages.manager.TextParser.textProductToString(feature.properties.text, "MOST PROBABLE PEAK TORNADO INTENSITY...", []);
            const winProb = packages.manager.TextParser.textProductToString(feature.properties.text, "MOST PROBABLE PEAK WIND GUST...", []);
            const hagProb = packages.manager.TextParser.textProductToString(feature.properties.text, "MOST PROBABLE PEAK HAIL SIZE...", []);
            structure.features.push({
              type: "Feature",
              geometry: { type: "Polygon", coordinates: feature.coordinates },
              properties: {
                mesoscale_id: (_a = feature.properties.number) != null ? _a : "N/A",
                expires: feature.properties.expires_at_ms ? new Date(feature.properties.expires_at_ms).toLocaleString() : "N/A",
                issued: feature.properties.issued_at_ms ? new Date(feature.properties.issued_at_ms).toLocaleString() : "N/A",
                description: (_c = (_b = packages.manager.TextParser.textProductToDescription(feature.properties.text)) == null ? void 0 : _b.replace(/\n/g, "<br>")) != null ? _c : "N/A",
                locations: (_f = (_e = (_d = feature.properties.tags) == null ? void 0 : _d.AREAS_AFFECTED) == null ? void 0 : _e.join(", ")) != null ? _f : "N/A",
                outlook: (_i = (_h = (_g = feature.properties.tags) == null ? void 0 : _g.CONCERNING) == null ? void 0 : _h.join(", ")) != null ? _i : "N/A",
                population: (_l = (_k = (_j = feature.properties.population) == null ? void 0 : _j.people) == null ? void 0 : _k.toLocaleString()) != null ? _l : "0",
                homes: (_o = (_n = (_m = feature.properties.population) == null ? void 0 : _m.homes) == null ? void 0 : _n.toLocaleString()) != null ? _o : "0",
                parameters: {
                  tornado_probability: torProb,
                  wind_probability: winProb,
                  hail_probability: hagProb
                }
              }
            });
          }
          return structure;
        });
      }
      /**
       * @function getSpotterFeed
       * @description
       *     Parses a Spotter Network Placefile feed, filters pins based on configuration,
       *     updates current locations, calculates distances, and converts to a GeoJSON FeatureCollection.
       * 
       * @param {string} body
       * @returns {Promise<types.GeoJSONFeatureCollection>}
       */
      getSpotterFeed(body) {
        return __async(this, null, function* () {
          var _a, _b, _c, _d;
          const ConfigType = cache.internal.configurations;
          const feedConfig = (_b = (_a = ConfigType.sources) == null ? void 0 : _a.location_settings) == null ? void 0 : _b.spotter_network_feed;
          const structure = { type: "FeatureCollection", features: [] };
          const parsed = yield packages.placefile.PlacefileManager.parsePlacefile(body);
          const locations = Object.keys(cache.external.locations);
          for (const feature of parsed) {
            const lon = parseFloat(feature.object.coordinates[1]);
            const lat = parseFloat(feature.object.coordinates[0]);
            if (isNaN(lon) || isNaN(lat)) continue;
            const isActive = feature.icon.scale === 6 && feature.icon.type === "2" && feedConfig.pins.active;
            const isStreaming = feature.icon.scale === 1 && feature.icon.type === "19" && feedConfig.pins.streaming;
            const isIdle = feature.icon.scale === 6 && feature.icon.type === "6" && feedConfig.pins.idle;
            if (!isActive && !isStreaming && (!isIdle || !feedConfig.pins.offline)) continue;
            if (feedConfig.pin_by_name.length > 0) {
              const idx = feedConfig.pin_by_name.findIndex((name) => feature.icon.label.includes(name));
              if (idx !== -1) {
                const name = feedConfig.pin_by_name[idx];
                submodules.gps.setCurrentCoordinates(name, { lat, lon }, `spotter_network`);
              }
            }
            let distance = 0;
            if (locations.length > 0) {
              const index = locations[0];
              distance = submodules.calculations.calculateDistance(
                { lat, lon },
                { lat: cache.external.locations[index].lat, lon: cache.external.locations[index].lon }
              );
            }
            structure.features.push({
              type: "Feature",
              geometry: { type: "Point", coordinates: [lon, lat] },
              properties: {
                description: (_d = (_c = feature.icon.label) == null ? void 0 : _c.replace(/\n/g, "<br>")) != null ? _d : "N/A",
                distance,
                status: isActive ? "Active" : isStreaming ? "Streaming" : isIdle ? "Idle" : "Unknown"
              }
            });
          }
          return structure;
        });
      }
      /**
       * @function getProbabilityStructure
       * @description
       *     Parses a Placefile feed for probability data (tornado or severe) and returns
       *     entries that exceed the configured threshold.
       * 
       * @param {string} body
       * @param {'tornado' | 'severe'} type
       * @returns {Promise<types.ProbabilityTypes[]>}
       */
      getProbabilityStructure(body, type) {
        return __async(this, null, function* () {
          var _a, _b, _c, _d;
          const structure = [];
          const ConfigType = cache.internal.configurations;
          const threshold = (_b = (_a = ConfigType.sources.probability_settings[type]) == null ? void 0 : _a.percentage_threshold) != null ? _b : 50;
          const typeRegexp = type === "tornado" ? /ProbTor: (\d+)%\// : /PSv3: (\d+)%\//;
          const parsed = yield packages.placefile.PlacefileManager.parsePlacefile(body);
          for (const feature of parsed) {
            if (!((_c = feature.line) == null ? void 0 : _c.text)) continue;
            const probMatch = feature.line.text.match(typeRegexp);
            const probability = probMatch ? parseInt(probMatch[1]) : 0;
            const shearMatch = feature.line.text.match(/Max LLAzShear: ([\d.]+)/);
            const shear = shearMatch ? parseFloat(shearMatch[1]) : 0;
            if (probability >= threshold) {
              structure.push({
                type,
                probability,
                shear,
                description: (_d = feature.line.text.replace(/\n/g, "<br>")) != null ? _d : "N/A"
              });
            }
          }
          return structure;
        });
      }
      /**
       * @function getWxRadioStructure
       * @description
       *     Converts WX Radio source data into a GeoJSON FeatureCollection.
       * 
       * @param {types.WxRadioTypes} body
       * @returns {types.GeoJSONFeatureCollection}
       */
      getWxRadioStructure(body) {
        var _a, _b, _c, _d;
        let structure = { type: "FeatureCollection", features: [] };
        for (const feature of body.sources) {
          const lon = parseFloat(feature.lon);
          const lat = parseFloat(feature.lat);
          if (isNaN(lon) || isNaN(lat)) continue;
          structure.features.push({
            type: "Feature",
            geometry: { type: "Point", coordinates: [lon, lat] },
            properties: {
              location: (_a = feature == null ? void 0 : feature.location) != null ? _a : "N/A",
              callsign: (_b = feature == null ? void 0 : feature.callsign) != null ? _b : "N/A",
              frequency: (_c = feature == null ? void 0 : feature.frequency) != null ? _c : "N/A",
              stream: (_d = feature == null ? void 0 : feature.listen_url) != null ? _d : "N/A"
            }
          });
        }
        return structure;
      }
      /**
       * @function getTropicalStormStructure
       * @description
       *     Converts tropical storm data into a GeoJSON FeatureCollection.
       * 
       * @param {types.TropicalStormTypes[]} body
       * @returns {types.GeoJSONFeatureCollection}
       */
      getTropicalStormStructure(body) {
        var _a, _b, _c, _d, _e;
        const structure = { type: "FeatureCollection", features: [] };
        for (const feature of body) {
          structure.features.push({
            type: "Feature",
            properties: {
              name: (_a = feature.name) != null ? _a : "N/A",
              discussion: (_b = feature.forecast_discussion) != null ? _b : "N/A",
              classification: (_c = feature.classification) != null ? _c : "N/A",
              pressure: (_d = feature.pressure) != null ? _d : 0,
              wind_speed: (_e = feature.wind_speed_mph) != null ? _e : 0,
              last_updated: feature.last_update_at ? new Date(feature.last_update_at).toLocaleString() : "N/A"
            }
          });
        }
        return structure;
      }
      /**
       * @function getWxEyeSondeStructure
       * @description
       *     Converts raw WxEyeSonde data into an array of string-based records.
       * 
       * @param {unknown[]} body
       * @returns {Record<string, string>[]}
       */
      getWxEyeSondeStructure(body) {
        return body.map((feature) => feature);
      }
    };
    parsing_default = Parsing;
  }
});

// src/submodules/express/@middleware/authority.ts
var authority_exports = {};
__export(authority_exports, {
  Init: () => Init,
  default: () => authority_default
});
var Init, authority_default;
var init_authority = __esm({
  "src/submodules/express/@middleware/authority.ts"() {
    init_bootstrap();
    Init = class {
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
    authority_default = Init;
  }
});

// src/submodules/express/@websockets/general.ts
var general_exports = {};
__export(general_exports, {
  Init: () => Init2,
  default: () => general_default
});
var Init2, general_default;
var init_general = __esm({
  "src/submodules/express/@websockets/general.ts"() {
    init_bootstrap();
    Init2 = class {
      constructor() {
        this.NAME_SPACE = `submodule:@websockets:general`;
        this.clients = [];
        this.SESSION_CONNECTION_ESTABLISHED_MESSAGE = `WebSocket connection established.`;
        this.SESSION_CONNECTION_CLOSED_MESSAGE = `Connection limited reached - Closing connection.`;
        this.SESSION_INITIAL_DATA_SENT_MESSAGE = `Initial data already sent - Closing connection.`;
        this.SESSION_INVALID_IP_MESSAGE = `Invalid IP address - Closing connection.`;
        this.SESSION_INVALID_REQUEST_MESSAGE = `Invalid request payload - Closing connection.`;
        this.SESSION_MALFORMED_MESSAGE = `Malformed data - Closing connection.`;
        this.SESSION_UNKNOWN_TYPE_MESSAGE = `Unknown data type - Closing connection.`;
        this.SESSION_UPDATE_SUCCESS_MESSAGE = `Requested data update successful.`;
        var _a;
        submodules.utils.log(`${this.NAME_SPACE} initialized.`);
        const cfg = cache.internal.configurations;
        const max = (_a = cfg.websocket_settings.maximum_connections_per_ip) != null ? _a : 3;
        const wss = cache.internal.socket = new packages.ws.WebSocketServer({
          server: cache.internal.websocket,
          path: "/stream"
        });
        wss.on("connection", (client, req) => {
          var _a2, _b;
          const ip = (_b = (_a2 = req == null ? void 0 : req.socket) == null ? void 0 : _a2.remoteAddress) != null ? _b : "unknown";
          if (ip === "unknown") return client.close(4e3, this.SESSION_INVALID_IP_MESSAGE);
          const count = this.clients.filter((c) => c.address === ip).length;
          if (count >= max) {
            try {
              if (client.readyState === packages.ws.OPEN) client.send(JSON.stringify({ type: "eventConnection", message: `${this.SESSION_CONNECTION_CLOSED_MESSAGE} (${max}).` }));
            } catch (e) {
            }
            return client.close(4001, this.SESSION_CONNECTION_CLOSED_MESSAGE);
          }
          this.clients.push({ client, unix: Date.now() - 1e3, address: ip, requests: {}, hasSentInitialData: false });
          try {
            if (client.readyState === packages.ws.OPEN) client.send(JSON.stringify({ type: "eventConnection", message: this.SESSION_CONNECTION_ESTABLISHED_MESSAGE }));
          } catch (e) {
          }
          client.on("message", (msg) => this.onWebsocketClientMessage(client, msg));
          client.on("close", () => {
            this.clients = this.clients.filter((c) => c.client !== client);
          });
        });
        submodules.utils.log(`WebSocket server listening on /stream`);
      }
      /**
       * @function onWebsocketClientMessage
       * @description
       *      Handles incoming messages from WebSocket clients.
       *      Processes requests for data updates and manages client state.
       *      
       * @param {any} socket - The WebSocket client socket.
       * @param {string} message - The incoming message from the client.
       * @returns {void}
       */
      onWebsocketClientMessage(socket, message) {
        const index = this.clients.findIndex((c) => c.client === socket);
        if (index === -1) return;
        const clientData = this.clients[index];
        if (!clientData) return;
        if (clientData.hasSentInitialData) {
          socket.send(JSON.stringify({ type: "eventMessage", message: this.SESSION_INITIAL_DATA_SENT_MESSAGE }));
          return socket.close(4002, "Initial data already sent");
        }
        clientData.hasSentInitialData = true;
        const data = (() => {
          try {
            return JSON.parse(message);
          } catch (e) {
            return null;
          }
        })();
        if (!data) {
          socket.send(JSON.stringify({ type: "eventMessage", message: this.SESSION_INVALID_REQUEST_MESSAGE }));
          return socket.close(4002, this.SESSION_INVALID_REQUEST_MESSAGE);
        }
        if (!(data == null ? void 0 : data.type) || !(data == null ? void 0 : data.message)) {
          socket.send(JSON.stringify({ type: "eventMessage", message: this.SESSION_MALFORMED_MESSAGE }));
          return socket.close(4002, this.SESSION_MALFORMED_MESSAGE);
        }
        if (data.type === "eventRequest") {
          let requestData;
          try {
            requestData = typeof data.message === "string" ? JSON.parse(data.message) : data.message;
          } catch (e) {
            requestData = null;
          }
          if (!requestData) {
            socket.send(JSON.stringify({ type: "eventMessage", message: this.SESSION_MALFORMED_MESSAGE }));
            return socket.close(4002, this.SESSION_MALFORMED_MESSAGE);
          }
          return this.onWebsocketClientUpdate(socket, clientData, requestData);
        }
        socket.send(JSON.stringify({ type: "eventMessage", message: this.SESSION_UNKNOWN_TYPE_MESSAGE }));
        socket.close(4002, this.SESSION_UNKNOWN_TYPE_MESSAGE);
      }
      /**
       * @function onWebsocketClientUpdate
       * @description
       *      Handles update requests from WebSocket clients.
       *      Sends updated data based on the client's registered requests.
       * 
       * @param {any} socket - The WebSocket client socket.
       * @param {types.WebSocketClient} clientData - The client's data object.
       * @param {string[]} data - The list of requested data types.
       * @returns {void}
       */
      onWebsocketClientUpdate(socket, clientData, data) {
        const InternalConfig = cache.internal.configurations;
        if (!Array.isArray(data)) return;
        const now = Date.now();
        let isQueued = false;
        if (data[0] === "*") {
          data = Object.keys(cache.external);
        }
        data.forEach((request) => {
          if (!clientData.requests[request]) clientData.requests[request] = { unix: 0 };
          const isPriority = InternalConfig.websocket_settings.priority_sockets.sockets.includes(request);
          const isSecondary = InternalConfig.websocket_settings.secondary_sockets.sockets.includes(request);
          const timeout = isPriority ? InternalConfig.websocket_settings.priority_sockets.timeout : isSecondary ? InternalConfig.websocket_settings.secondary_sockets.timeout : 0;
          const timeoutMs = timeout < 1e3 ? timeout * 1e3 : timeout;
          if (now - clientData.requests[request].unix < timeoutMs) {
            return;
          }
          clientData.requests[request].unix = now;
          const cache2 = cache.external[request] || null;
          try {
            socket.send(JSON.stringify({ type: "eventUpdate", message: cache2, value: request }));
          } catch (e) {
          }
          isQueued = true;
        });
        if (isQueued) {
          socket.send(JSON.stringify({ type: "eventUpdateFinished", message: this.SESSION_UPDATE_SUCCESS_MESSAGE }));
        }
      }
    };
    general_default = Init2;
  }
});

// src/submodules/express/@routes/login.ts
var login_exports = {};
__export(login_exports, {
  Init: () => Init3,
  default: () => login_default
});
var Init3, login_default;
var init_login = __esm({
  "src/submodules/express/@routes/login.ts"() {
    init_bootstrap();
    Init3 = class {
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
    login_default = Init3;
  }
});

// src/submodules/express/@routes/logout.ts
var logout_exports = {};
__export(logout_exports, {
  Init: () => Init4,
  default: () => logout_default
});
var Init4, logout_default;
var init_logout = __esm({
  "src/submodules/express/@routes/logout.ts"() {
    init_bootstrap();
    Init4 = class {
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
    logout_default = Init4;
  }
});

// src/submodules/express/@routes/signup.ts
var signup_exports = {};
__export(signup_exports, {
  Init: () => Init5,
  default: () => signup_default
});
var Init5, signup_default;
var init_signup = __esm({
  "src/submodules/express/@routes/signup.ts"() {
    init_bootstrap();
    Init5 = class {
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
    signup_default = Init5;
  }
});

// src/submodules/express/@routes/core.ts
var core_exports = {};
__export(core_exports, {
  Init: () => Init6,
  default: () => core_default
});
var Init6, core_default;
var init_core = __esm({
  "src/submodules/express/@routes/core.ts"() {
    init_bootstrap();
    Init6 = class {
      constructor() {
        this.NAME_SPACE = `submodule:@routes:core`;
        this.PORTAL_DIRECT = `/www/__pages/__portal/index.html`;
        this.DASHBOARD_DIRECT = `/www/__pages/__dashboard/index.html`;
        submodules.utils.log(`${this.NAME_SPACE} initialized.`);
        const parentDirectory = packages.path.resolve(`..`, `storage`);
        cache.internal.express.get(`/`, (request, response) => {
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
    core_default = Init6;
  }
});

// src/submodules/express/@routes/data.ts
var data_exports = {};
__export(data_exports, {
  Init: () => Init7,
  default: () => data_default
});
var Init7, data_default;
var init_data = __esm({
  "src/submodules/express/@routes/data.ts"() {
    init_bootstrap();
    Init7 = class {
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
    data_default = Init7;
  }
});

// src/submodules/express/routing.ts
var Routes, routing_default;
var init_routing = __esm({
  "src/submodules/express/routing.ts"() {
    init_bootstrap();
    Routes = class {
      constructor() {
        this.NAME_SPACE = `submodule:routing`;
        this.CLIENTS = [];
        this.initialize();
      }
      initialize() {
        return __async(this, null, function* () {
          submodules.utils.log(`${this.NAME_SPACE} initialized.`);
          const ConfigType = cache.internal.configurations;
          const isHttps = ConfigType.web_hosting_settings.settings.is_https;
          const isPortal = ConfigType.web_hosting_settings.is_login_required;
          const getPort = ConfigType.web_hosting_settings.settings.port_number;
          const getCertificates = isHttps ? this.getCertificates() : null;
          this.PACKAGE = cache.internal.express = packages.express();
          if (isHttps) {
            cache.internal.websocket = packages.https.createServer(getCertificates, this.PACKAGE).listen(getPort, () => {
            });
          } else {
            cache.internal.websocket = packages.http.createServer(this.PACKAGE).listen(getPort, () => {
            });
          }
          if (!isPortal) {
            submodules.utils.log(`${strings.portal_disabled_warning}`, { echoFile: true });
          }
          submodules.middleware = new (yield Promise.resolve().then(() => (init_authority(), authority_exports))).Init();
          submodules.websockets = new (yield Promise.resolve().then(() => (init_general(), general_exports))).Init();
          new (yield Promise.resolve().then(() => (init_login(), login_exports))).Init();
          new (yield Promise.resolve().then(() => (init_logout(), logout_exports))).Init();
          new (yield Promise.resolve().then(() => (init_signup(), signup_exports))).Init();
          new (yield Promise.resolve().then(() => (init_core(), core_exports))).Init();
          new (yield Promise.resolve().then(() => (init_data(), data_exports))).Init();
        });
      }
      /**
       * @function getCertificates
       * @description
       *      Retrieves SSL certificates for HTTPS configuration.
       *  
       *  @returns {void}
       */
      getCertificates() {
        const ConfigType = cache.internal.configurations;
        if (!ConfigType.web_hosting_settings.settings.is_https) {
          submodules.utils.log(`${this.NAME_SPACE} ERROR: Tried to get SSL certificates while HTTPS is disabled in the configuration file.`);
        }
        const keyPath = ConfigType.web_hosting_settings.settings.certification_paths.private_key_path;
        const certPath = ConfigType.web_hosting_settings.settings.certification_paths.certificate_path;
        if (!packages.fs.existsSync(keyPath)) {
          submodules.utils.log(`${this.NAME_SPACE} ERROR: SSL key file not found at: ${keyPath}`);
        }
        if (!packages.fs.existsSync(certPath)) {
          submodules.utils.log(`${this.NAME_SPACE} ERROR: SSL certificate file not found at: ${certPath}`);
        }
        return {
          key: packages.fs.readFileSync(keyPath),
          certificate: packages.fs.readFileSync(certPath)
        };
      }
      /**
       * @function onUpdateRequest
       * @description
       *      Handles periodic update requests for all connected WebSocket clients.
       *      Sends updated data based on each client's registered requests.
       * 
       *  @returns {void}
       */
      onUpdateRequest() {
        for (const clientData of this.CLIENTS) {
          submodules.websockets.onWebsocketClientUpdate(clientData.client, clientData, Object.keys(clientData.requests));
        }
      }
    };
    routing_default = Routes;
  }
});

// src/submodules/gps.ts
var GlobalPositioningSystem, gps_default;
var init_gps = __esm({
  "src/submodules/gps.ts"() {
    init_bootstrap();
    GlobalPositioningSystem = class {
      constructor() {
        this.NAME_SPACE = `submodule:gps`;
        submodules.utils.log(`${this.NAME_SPACE} initialized.`);
      }
      setCurrentCoordinates(name, coords) {
        cache.external.locations[name] = coords;
        cache.internal.manager.setCurrentLocation(name, coords);
        submodules.utils.log(`Updated current coordinates for ${name} [LAT: ${coords.lat}, LON: ${coords.lon}]`);
      }
    };
    gps_default = GlobalPositioningSystem;
  }
});

// src/submodules/database.ts
var Database, database_default;
var init_database = __esm({
  "src/submodules/database.ts"() {
    init_bootstrap();
    Database = class {
      constructor() {
        this.NAME_SPACE = `submodule:database`;
        submodules.utils.log(`${this.NAME_SPACE} initialized.`);
        const dbPath = packages.path.resolve(`..`, `storage`, `Accounts.db`);
        if (packages.fs.existsSync(dbPath)) {
          this.DATABASE = new packages.sqlite3(dbPath);
          submodules.utils.log(`Account Database Loaded @ ${dbPath}`);
        } else {
          this.create();
        }
      }
      create() {
        const dbPath = packages.path.resolve(`..`, `storage`, `Accounts.db`);
        this.DATABASE = new packages.sqlite3(dbPath);
        try {
          this.DATABASE.prepare(`CREATE TABLE IF NOT EXISTS accounts (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL, hash TEXT NOT NULL, activated INTEGER NOT NULL DEFAULT 0, role INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`).run();
          let rootExists = this.DATABASE.prepare(`SELECT 1 FROM accounts WHERE username = ?`).get("root");
          if (!rootExists) {
            this.DATABASE.prepare(`INSERT INTO accounts (username, hash, role, activated) VALUES (?, ?, ?, ?)`).run("root", "hzf+LiRTX1pP+v335+TaeLSAWu136Ltqs26gebv7jBw=", 1, 1);
            submodules.utils.log(`Root account created with default credentials. (Username: root | Password: root)`);
          }
          submodules.utils.log(`Account Database Created @ ${dbPath}`);
        } catch (error) {
          submodules.utils.log(`Error creating account database: ${error}`);
        }
      }
      query(sql, params = []) {
        try {
          params = Array.isArray(params) ? params : [];
          let stmt = this.DATABASE.prepare(sql);
          return /^\s*select/i.test(sql) ? stmt.all(...params) : stmt.run(...params);
        } catch (err) {
          submodules.utils.log(`Database query error: ${err}`);
          return [];
        }
      }
    };
    database_default = Database;
  }
});

// src/bootstrap.ts
var bootstrap_exports = {};
__export(bootstrap_exports, {
  cache: () => cache,
  packages: () => packages,
  strings: () => strings,
  submodules: () => submodules
});
var manager, tempest, placefile, import_better_sqlite3, import_express, import_express_rate_limit, import_cookie_parser, import_axios, gui, events, path, fs, crypto, http, https, xmpp, os, xml2js, shapefile, firebaseApp, firebaseDatabase, streamerBot, jobs, jsonc, cache, strings, packages, submoduleClasses, submodules;
var init_bootstrap = __esm({
  "src/bootstrap.ts"() {
    manager = __toESM(require("atmosx-nwws-parser"));
    tempest = __toESM(require("atmosx-tempest-pulling"));
    placefile = __toESM(require("atmosx-placefile-parser"));
    import_better_sqlite3 = __toESM(require("better-sqlite3"));
    import_express = __toESM(require("express"));
    import_express_rate_limit = __toESM(require("express-rate-limit"));
    import_cookie_parser = __toESM(require("cookie-parser"));
    import_axios = __toESM(require("axios"));
    gui = __toESM(require("blessed"));
    events = __toESM(require("events"));
    path = __toESM(require("path"));
    fs = __toESM(require("fs"));
    crypto = __toESM(require("crypto"));
    http = __toESM(require("http"));
    https = __toESM(require("https"));
    xmpp = __toESM(require("@xmpp/client"));
    os = __toESM(require("os"));
    xml2js = __toESM(require("xml2js"));
    shapefile = __toESM(require("shapefile"));
    init_wrapper();
    firebaseApp = __toESM(require("firebase/app"));
    firebaseDatabase = __toESM(require("firebase/database"));
    streamerBot = __toESM(require("@streamerbot/client"));
    jobs = __toESM(require("croner"));
    jsonc = __toESM(require("jsonc-parser"));
    init_utils();
    init_alerts();
    init_calculations();
    init_networking();
    init_structure();
    init_display();
    init_parsing();
    init_routing();
    init_gps();
    init_database();
    cache = {
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
        manual: { features: [] },
        events: { features: [] },
        rng: { index: 0, alert: null },
        hashes: [],
        placefiles: {},
        locations: {}
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
          events_processed: 0
        }
      }
    };
    strings = {
      updated_requied: `New version available: {ONLINE_PARSED} (Current version: {OFFLINE_VERSION})
${"	".repeat(5)} Update by running update.sh or download the latest version from GitHub.
${"	".repeat(5)} =================== CHANGE LOGS ======================= 
${"	".repeat(5)} {ONLINE_CHANGELOGS}

`,
      updated_required_failed: `Failed to check for updates. Please check your internet connection. This may also be due to an endpoint configuration change.`,
      new_event_legacy: `{SOURCE} | Alert {STATUS} >> {EVENT} [{TRACKING}]`,
      new_event_fancy: `\u251C\u2500 {bold}{EVENT} ({ACTION_TYPE}) [{TRACKING}]{/bold}
\u2502  \u251C\u2500 Issued: {ISSUED} ({EXPIRES})
\u2502  \u251C\u2500 Sender {SENDER}
\u2502  \u251C\u2500 Tags: {TAGS}
\u2502  \u251C\u2500 Locations: {LOCATIONS}
\u2502  \u2514\u2500 Distance: {DISTANCE}`,
      system_info: `{bold}Uptime:{/bold} {UPTIME}
{bold}Memory Usage:{/bold} {MEMORY} MB
{bold}Heap Usage:{/bold} {HEAP} MB
{bold}Events Processed:{/bold} {EVENTS_PROCESSED}
`,
      portal_disabled_warning: `

[SECURITY] THE PORTAL LOGIN PAGE IS DISABLED,
	   THIS IS NOT RECOMMENDED FOR PRODUCTION USE AS EVERYONE CAN ACCESS THE DASHBOARD WITHOUT AUTHENTICATION.
	   YOU CAN SIMPLY DO IP WHITELISTING THROUGH A WEB SERVER OR FIREWALL IF YOU WISH TO KEEP THIS OFF.
	   IF YOU WISH TO ENABLE THE PORTAL LOGIN PAGE, PLEASE SET THE PORTAL CONFIG TO TRUE IN THE CONFIGURATION FILE.

`
    };
    packages = {
      events,
      path,
      fs,
      sqlite3: import_better_sqlite3.default,
      express: import_express.default,
      cookieParser: import_cookie_parser.default,
      crypto,
      http,
      https,
      axios: import_axios.default,
      xmpp,
      os,
      jsonc,
      xml2js,
      manager,
      tempest,
      placefile,
      shapefile,
      ws: wrapper_exports,
      firebaseApp,
      firebaseDatabase,
      streamerBot,
      jobs,
      gui,
      rateLimit: import_express_rate_limit.default
    };
    submoduleClasses = {
      utils: utils_default,
      alerts: alerts_default,
      calculations: calculations_default,
      networking: networking_default,
      structure: structure_default,
      display: display_default,
      parsing: parsing_default,
      routes: routing_default,
      gps: gps_default,
      database: database_default
    };
    submodules = {};
    Object.entries(submoduleClasses).forEach(([key, Class]) => {
      submodules[key] = new Class();
    });
  }
});

// src/index.ts
init_bootstrap();
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
