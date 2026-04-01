import { WebSocketServer } from "ws";

import { initializeLimitOrderSubscriptions, setupClientConnection } from "./connectionManager";

const PORT =  4000;

const wss = new WebSocketServer({ port: PORT });
initializeLimitOrderSubscriptions();
wss.on("connection", (ws) => {
  setupClientConnection(ws);
});

console.log(`🚀 WebSocket server running on ws://localhost:${PORT}`);