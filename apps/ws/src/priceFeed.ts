import { finnhubSocket } from "./finnhubClient";
import redis from "./redis";

export function setupPriceFeed() {
  finnhubSocket.on("message", async (msg) => {
    try {
      const data = JSON.parse(msg.toString());
      if (data.type !== "trade") return;

      for (const trade of data.data) {
        const symbol = trade.s;
        const price = trade.p;
        const timestamp = trade.t;
        await redis.publish("price-updates", JSON.stringify({ symbol, price, timestamp }));        
        await redis.set(`price:${symbol}`, JSON.stringify({ price, timestamp }));
      }
    } catch (err) {
      console.error("Error processing message from Finnhub:", err);
    }
  });
}
