import {
  cache,
  packages,
  submodules
} from "./chunk-V4INPCA6.mjs";

// src/submodules/express/@websockets/general.ts
var Init = class {
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
var general_default = Init;
export {
  Init,
  general_default as default
};
