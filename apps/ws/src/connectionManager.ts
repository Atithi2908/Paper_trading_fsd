import WebSocket from "ws";
import { finnhubSocket } from "./finnhubClient";
import redis from "./redis";

const clientSubscriptions = new Map<WebSocket, Set<string>>();
const symbolSubscribers = new Map<string, Set<WebSocket>>();
const finnhubSubscriptions = new Set<string>();

export async function initializeLimitOrderSubscriptions() {
  setInterval(async () => {
    const symbols = await redis.smembers("subscribed:stocks");
    for (const symbol of symbols) {
        if (!finnhubSubscriptions.has(symbol)) {
            finnhubSocket.send(JSON.stringify({ type: "subscribe", symbol }));
            console.log("subscribed to from redis ");
            console.log(symbol);
            finnhubSubscriptions.add(symbol);
        }
    }
}, 5000);
}

export function setupClientConnection(ws: WebSocket) {
  clientSubscriptions.set(ws, new Set());
  console.log("🧍 Client connected. Total:", clientSubscriptions.size);
  ws.on("message", (msg) => {
    try {
      const data = JSON.parse(msg.toString());

      if (data.type === "subscribe" && data.symbol) {
        const symbol = String(data.symbol).toUpperCase();
          console.log("📥 FRONTEND SUBSCRIBE SYMBOL =", symbol);
        subscribeClientToSymbol(ws, symbol);
        return;
      }

      if (data.type === "unsubscribe" && data.symbol) {
        const symbol = String(data.symbol).toUpperCase();
        unsubscribeClientFromSymbol(ws, symbol);
        return;
      }

    } catch (e) {
      console.error("Invalid message from client:", msg);
    }
  });

  ws.on("close", () => {
    const subs = clientSubscriptions.get(ws);
    if (subs) {
      for (const symbol of subs) {
        const set = symbolSubscribers.get(symbol);
        if (set) {
          set.delete(ws);

          if (set.size === 0) {
            symbolSubscribers.delete(symbol);

            if (finnhubSubscriptions.has(symbol)) {
              finnhubSocket.send(JSON.stringify({ type: "unsubscribe", symbol }));
              finnhubSubscriptions.delete(symbol);
            }
          }
        }
      }
    }
    clientSubscriptions.delete(ws);
    console.log("👋 Client disconnected. Total:", clientSubscriptions.size);
  });
}

function subscribeClientToSymbol(ws: WebSocket, symbol: string) {
  let clientSet = clientSubscriptions.get(ws);
  if (!clientSet) {
    clientSet = new Set();
    clientSubscriptions.set(ws, clientSet);
  }
  if (clientSet.has(symbol)) return;

  clientSet.add(symbol);

  let subs = symbolSubscribers.get(symbol);
  if (!subs) {
    subs = new Set();
    symbolSubscribers.set(symbol, subs);
  }
  subs.add(ws);

  if (!finnhubSubscriptions.has(symbol)) {
    finnhubSocket.send(JSON.stringify({ type: "subscribe", symbol }));
    
    finnhubSubscriptions.add(symbol);
  }

  console.log(`🔔 Client subscribed to ${symbol}`);
}

function unsubscribeClientFromSymbol(ws: WebSocket, symbol: string) {
  const clientSet = clientSubscriptions.get(ws);
  if (clientSet) {
    clientSet.delete(symbol);
  }

  const subs = symbolSubscribers.get(symbol);
  if (subs) {
    subs.delete(ws);

    if (subs.size === 0) {
      symbolSubscribers.delete(symbol);

      if (finnhubSubscriptions.has(symbol)) {
        finnhubSocket.send(JSON.stringify({ type: "unsubscribe", symbol }));
        finnhubSubscriptions.delete(symbol);
      }
    }
  }

  console.log(`🔕 Client unsubscribed from ${symbol}`);
}
