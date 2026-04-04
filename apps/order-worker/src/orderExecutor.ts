import { PrismaClient, Order } from "@prisma/client";
import { prisma } from "./prisma";

export async function executeLimitOrderTrade(order: Order, price: number) {
  const totalCost = order.quantity * price;

  return await prisma.$transaction(async (tx: any) => {
    if (order.side === "BUY") {
      // Check wallet balance
      const wallet = await tx.wallet.findUnique({
        where: { userId: order.userId },
      });

      if (!wallet || wallet.balance < totalCost) {
        await tx.order.update({
          where: { id: order.id },
          data: { status: "CANCELLED" },
        });
        throw new Error("INSUFFICIENT_BALANCE_AT_EXECUTION");
      }

      // Deduct from wallet
      await tx.wallet.update({
        where: { userId: order.userId },
        data: { balance: wallet.balance - totalCost },
      });

      // Get existing position
      const pos = await tx.position.findFirst({
        where: { userId: order.userId, stockId: order.stockId },
      });

      // Update or create position with weighted average
      if (!pos) {
        await tx.position.create({
          data: {
            userId: order.userId,
            stockId: order.stockId,
            quantity: order.quantity,
            avgBuyPrice: price,
          },
        });
      } else {
        const newQty = pos.quantity + order.quantity;
        const newAvg =
          (pos.avgBuyPrice * pos.quantity + price * order.quantity) / newQty;

        await tx.position.update({
          where: { id: pos.id },
          data: {
            quantity: newQty,
            avgBuyPrice: newAvg,
          },
        });
      }
    } else { // SELL
      // Check if position exists and has sufficient shares
      const pos = await tx.position.findFirst({
        where: { userId: order.userId, stockId: order.stockId },
      });

      if (!pos || pos.quantity < order.quantity) {
        await tx.order.update({
          where: { id: order.id },
          data: { status: "CANCELLED" },
        });
        throw new Error("INSUFFICIENT_SHARES_AT_EXECUTION");
      }

      // Decrease holding
      await tx.position.update({
        where: { id: pos.id },
        data: { quantity: pos.quantity - order.quantity },
      });

      // Credit user's wallet
      const wallet = await tx.wallet.findUnique({
        where: { userId: order.userId },
      });

      await tx.wallet.update({
        where: { userId: order.userId },
        data: { balance: wallet!.balance + totalCost },
      });
    }

    // Create trade record
    const trade = await tx.trade.create({
      data: {
        orderId: order.id,
        userId: order.userId,
        stockId: order.stockId,
        side: order.side,
        quantity: order.quantity,
        price,
        amount: totalCost,
      },
    });

    // Mark order as executed
    await tx.order.update({
      where: { id: order.id },
      data: { status: "EXECUTED", executionPrice: price },
    });

    return trade;
  }, {
    isolationLevel: "Serializable",
  });
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
