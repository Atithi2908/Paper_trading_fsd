import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

type Trade = {
  tradeId: number;
  stockSymbol: string;
  stockName: string;
  side: "BUY" | "SELL";
  orderType: "MARKET" | "LIMIT";
  quantity: number;
  price: number;
  amount: number;
  executedAt: string;
};

export default function TradeHistory() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const token = localStorage.getItem("Token"); // starts with T

        const res = await axios.get(`${API_BASE}/user/trades`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTrades(res.data);
      } catch (err: any) {
        setError("Failed to fetch trade history");
      } finally {
        setLoading(false);
      }
    };

    fetchTrades();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center p-6">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-secondary text-base">Loading trades...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center p-6">
        <div className="bg-panel border border-red-500/50 rounded-xl p-8 max-w-md">
          <p className="text-red-400 text-center text-lg font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  const totalBuyAmount = trades.filter(t => t.side === 'BUY').reduce((sum, t) => sum + t.amount, 0);
  const totalSellAmount = trades.filter(t => t.side === 'SELL').reduce((sum, t) => sum + t.amount, 0);
  const totalTrades = trades.length;

  return (
    <div className="min-h-screen bg-page p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Trade History
          </h1>
          <p className="text-secondary text-sm sm:text-base">Complete record of all executed trades</p>
        </div>

        {/* Trade Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-panel border border-accent rounded-xl p-5 shadow-accent">
            <p className="text-secondary text-sm mb-2">Total Trades</p>
            <p className="text-2xl font-bold text-ink">{totalTrades}</p>
          </div>
          <div className="bg-panel border border-accent rounded-xl p-5 shadow-accent">
            <p className="text-secondary text-sm mb-2">Total Buy Amount</p>
            <p className="text-2xl font-bold text-green-400">₹{totalBuyAmount.toFixed(2)}</p>
          </div>
          <div className="bg-panel border border-accent rounded-xl p-5 shadow-accent">
            <p className="text-secondary text-sm mb-2">Total Sell Amount</p>
            <p className="text-2xl font-bold text-red-400">₹{totalSellAmount.toFixed(2)}</p>
          </div>
        </div>

        {/* Trades Table */}
        <div className="bg-panel border border-accent rounded-2xl p-4 sm:p-6 md:p-8 shadow-accent">
          <h2 className="text-xl sm:text-2xl font-bold text-ink mb-6">All Trades</h2>

          {trades.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-panel-soft rounded-full flex items-center justify-center mb-4">
                <span className="text-secondary text-2xl">📋</span>
              </div>
              <p className="text-secondary text-center">No trades found</p>
              <p className="text-neutral text-sm text-center mt-2">Your executed trades will appear here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-accent">
                    <th className="text-left py-3 px-2 sm:px-4 text-secondary font-medium text-xs sm:text-sm uppercase tracking-wider">Stock</th>
                    <th className="text-center py-3 px-2 sm:px-4 text-secondary font-medium text-xs sm:text-sm uppercase tracking-wider">Side</th>
                    <th className="text-center py-3 px-2 sm:px-4 text-secondary font-medium text-xs sm:text-sm uppercase tracking-wider">Type</th>
                    <th className="text-center py-3 px-2 sm:px-4 text-secondary font-medium text-xs sm:text-sm uppercase tracking-wider">Qty</th>
                    <th className="text-right py-3 px-2 sm:px-4 text-secondary font-medium text-xs sm:text-sm uppercase tracking-wider">Price</th>
                    <th className="text-right py-3 px-2 sm:px-4 text-secondary font-medium text-xs sm:text-sm uppercase tracking-wider">Amount</th>
                    <th className="text-right py-3 px-2 sm:px-4 text-secondary font-medium text-xs sm:text-sm uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {trades.map((t, idx) => (
                    <tr 
                      key={t.tradeId} 
                      className={`border-b border-accent hover:bg-panel transition-colors ${
                        idx === trades.length - 1 ? 'border-b-0' : ''
                      }`}
                    >
                      <td className="py-4 px-2 sm:px-4">
                        <div className="font-bold text-ink text-sm sm:text-base">{t.stockSymbol}</div>
                        <div className="text-xs sm:text-sm text-secondary mt-1">{t.stockName}</div>
                      </td>
                      <td className="py-4 px-2 sm:px-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                          t.side === 'BUY' 
                            ? 'bg-green-500/20 border border-green-500/50 text-green-400' 
                            : 'bg-red-500/20 border border-red-500/50 text-red-400'
                        }`}>
                          {t.side}
                        </span>
                      </td>
                      <td className="py-4 px-2 sm:px-4 text-center">
                        <span className="text-primary text-xs sm:text-sm font-medium">
                          {t.orderType}
                        </span>
                      </td>
                      <td className="py-4 px-2 sm:px-4 text-center text-ink font-medium text-sm sm:text-base">
                        {t.quantity}
                      </td>
                      <td className="py-4 px-2 sm:px-4 text-right text-ink font-medium text-sm sm:text-base">
                        ₹{t.price.toFixed(2)}
                      </td>
                      <td className="py-4 px-2 sm:px-4 text-right text-primary font-bold text-sm sm:text-base">
                        ₹{t.amount.toFixed(2)}
                      </td>
                      <td className="py-4 px-2 sm:px-4 text-right text-secondary text-xs sm:text-sm">
                        <div>{new Date(t.executedAt).toLocaleDateString()}</div>
                        <div className="text-xs text-neutral">{new Date(t.executedAt).toLocaleTimeString()}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}