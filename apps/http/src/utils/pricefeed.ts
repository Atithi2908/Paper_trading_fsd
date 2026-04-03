import axios from "axios";
import redisClient from "../redis";

const FINNHUB_KEY = process.env.FINNHUB_API_KEY;
const PRICE_FRESH_MS = 1500;

export const getLivePrice = async (symbol: string) => {
  try {
    
    const raw = await redisClient.get(`price:${symbol}`);
    if (raw) {
      const parsed = JSON.parse(raw); 
      const age = Date.now() - parsed.ts;

      if (age <= PRICE_FRESH_MS) {
        return parsed.price;
      }
    }

    
    const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_KEY}`;
    const resp = await axios.get(url);
    const price = resp.data?.c;

    if (!price) throw new Error("Invalid price from API");


    await redisClient.setex(
      `price:${symbol}`,
      2,
      JSON.stringify({ price, ts: Date.now() })
    );

    return price;

  } catch (err) {
    console.error("Error fetching live price:", err);
    throw new Error("Unable to fetch live price");
  }
};