import cron from "node-cron";
import { PrismaClient } from "@prisma/client";
import redis from "../redis";
import { executeLimitOrderTrade } from "../controller/orderController";
import { prisma } from "../lib/prisma";


export function startLimitOrderCron() {
  console.log("⏱️ Limit Order Cron Started");

  cron.schedule("*/2 * * * * *", async () => {
    try {
      const orders = await prisma.order.findMany({
        where: { status: "PENDING", type: "LIMIT" },
      });

      for (const order of orders) {
        const stock = await prisma.stock.findUnique({
          where: { id: order.stockId }
        });
        if (!stock) continue;
//console.log("getting price from redis for the stock ")
//console.log(stock.symbol);
        const symbol = stock.symbol.toUpperCase();

        const tick = await redis.get(`price:${symbol}`);
       
        if (!tick) continue;

        const { price } = JSON.parse(tick);
         //console.log("price from redis is");
        // console.log(price);
        const shouldExecute =
          (order.side === "BUY" && price <= order.limitPrice!) ||
          (order.side === "SELL" && price >= order.limitPrice!);

        if (!shouldExecute) continue;
const claimedOrder = await prisma.order.updateMany({
  where: {
    id: order.id,
    status: "PENDING"
  },
  data: {
    status: "EXECUTING"
  }
});
if (claimedOrder.count === 0) return;


        console.log(`🚀 Executing Limit Order #${order.id} on ${symbol} @ ${price}`);

        await executeLimitOrderTrade(order, price);
      }

    } catch (err) {
      console.error("Cron error:", err);
    }
  });
}