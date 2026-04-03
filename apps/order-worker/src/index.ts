import Redis from "ioredis";
import { processLimitOrders } from "./orderExecutor";

const redis = new Redis();

async function main() {
    console.log("🚀 Order worker started");
    await redis.subscribe("price-updates", (err) => {
        if (err) {
            console.error("Failed to subscribe to price-updates channel", err);
            process.exit(1);
        }
    });

    redis.on("message", (channel, message) => {
        if (channel === "price-updates") {
            const { symbol, price } = JSON.parse(message);
            // Don't await this, let it run in the background
            processLimitOrders(symbol, price);
        }
    });
}

main();
