import { prisma } from "../lib/prisma";
export async function getOrCreateStockBySymbol(symbol: string) {
  return prisma.stock.upsert({
    where: { symbol },
    update: {},
    create: {
      symbol,
      name: symbol,
      exchange: null,
      currency: null,
      type: null,
    },
  });
}