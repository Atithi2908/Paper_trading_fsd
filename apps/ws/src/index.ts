import { WebSocketServer } from "ws";

import { initializeLimitOrderSubscriptions, setupClientConnection } from "./connectionManager";
import { setupPriceFeed } from "./priceFeed";

const PORT =  4000;

const wss = new WebSocketServer({ port: PORT });
initializeLimitOrderSubscriptions();
setupPriceFeed();
wss.on("connection", (ws) => {
  setupClientConnection(ws);
});

console.log(`🚀 WebSocket server running on ws://localhost:${PORT}`);
