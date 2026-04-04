import { PrismaClient, Order } from "@prisma/client";
import { prisma } from "./prisma";

export async function executeLimitOrderTrade(order: Order, price: number) {
  const totalCost = order.quantity * price;

  if (order.side === "BUY") {
    await prisma.$transaction([
      
      prisma.wallet.update({
        where: { userId: order.userId },
        data: { balance: { decrement: totalCost } },
      }),
      // Create a holding
      prisma.position.upsert({
        where: {
          userId_stockId: {
            userId: order.userId,
            stockId: order.stockId,
          },
        },
        update: {
          quantity: { increment: order.quantity },
          avgBuyPrice: { set: price }, // This should be a weighted average
        },
        create: {
          userId: order.userId,
          stockId: order.stockId,
          quantity: order.quantity,
          avgBuyPrice: price,
        },
      }),
      prisma.order.update({
        where: { id: order.id },
        data: { status: "EXECUTED", executionPrice: price },
      }),
    ]);
  } else { // SELL
    await prisma.$transaction([
      // Credit user's wallet
      prisma.wallet.update({
        where: { userId: order.userId },
        data: { balance: { increment: totalCost } },
      }),
      // Decrease holding
      prisma.position.update({
        where: {
          userId_stockId: {
            userId: order.userId,
            stockId: order.stockId,
          },
        },
        data: {
          quantity: { decrement: order.quantity },
        },
      }),
      
      prisma.order.update({
        where: { id: order.id },
        data: { status: "EXECUTED", executionPrice: price },
      }),
    ]);
  }
}

export async function processLimitOrders(symbol: string, price: number) {
    const orders = await prisma.order.findMany({
        where: {
            status: "PENDING",
            type: "LIMIT",
            stock: {
                symbol: symbol
            },
            OR: [
                {
                    side: "BUY",
                    limitPrice: { gte: price }
                },
                {
                    side: "SELL",
                    limitPrice: { lte: price }
                }
            ]
        }
    });

    for (const order of orders) {
        const claimedOrder = await prisma.order.updateMany({
            where: {
                id: order.id,
                status: "PENDING"
            },
            data: {
                status: "EXECUTING"
            }
        });

        if (claimedOrder.count > 0) {
            console.log(`🚀 Executing Limit Order #${order.id} on ${symbol} @ ${price}`);
            await executeLimitOrderTrade(order, price);
        }
    }
}
