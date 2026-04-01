import { useState } from "react";
import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

interface QuickTradeProps {
  symbol: string;
  livePrice?: number | null;
}

export function QuickTradePanel({ symbol, livePrice }: QuickTradeProps) {
  const [side, setSide] = useState<"BUY" | "SELL">("BUY");
  const [type, setType] = useState<"MARKET" | "LIMIT">("MARKET");
  const [quantity, setQuantity] = useState<number>(1);
  const [limitPrice, setLimitPrice] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submitOrder = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("Token");
      if (!token) {
        setError("Please login again.");
        setLoading(false);
        return;
      }

      await axios.post(
        `${baseUrl}/order/buy`,
        {
          symbol,
          side,
          type,
          quantity,
          limitPrice: type === "LIMIT" ? Number(limitPrice) : null
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSuccess(`${side} order placed successfully`);
      setLimitPrice("");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Order failed");
    }

    setLoading(false);
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-panel text-ink rounded-lg border border-accent w-full max-w-2xl mx-auto">

      <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
        Quick Trade {symbol}
      </h3>

      {/* BUY / SELL Toggle */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4">
        <button
          onClick={() => setSide("BUY")}
          className={`py-2 sm:py-2.5 font-bold text-xs sm:text-sm md:text-base rounded-lg transition-all duration-300 ${
            side === "BUY"
              ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white border border-green-400"
              : "bg-panel-soft text-secondary border border-neutral hover:bg-panel"
          }`}
        >
          BUY
        </button>
        <button
          onClick={() => setSide("SELL")}
          className={`py-2 sm:py-2.5 font-bold text-xs sm:text-sm md:text-base rounded-lg transition-all duration-300 ${
            side === "SELL"
              ? "bg-gradient-to-r from-red-700 to-red-600 text-white border border-red-400"
              : "bg-panel-soft text-secondary border border-neutral hover:bg-panel"
          }`}
        >
          SELL
        </button>
      </div>

      {/* MARKET / LIMIT Toggle */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4">
        <button
          onClick={() => setType("MARKET")}
          className={`py-2 sm:py-2.5 font-bold text-xs sm:text-sm md:text-base rounded-lg transition-all duration-300 ${
            type === "MARKET"
              ? "bg-primary text-ink border border-primary"
              : "bg-panel-soft text-secondary border border-neutral hover:bg-panel"
          }`}
        >
          MARKET
        </button>
        <button
          onClick={() => setType("LIMIT")}
          className={`py-2 sm:py-2.5 font-bold text-xs sm:text-sm md:text-base rounded-lg transition-all duration-300 ${
            type === "LIMIT"
              ? "bg-primary text-ink border border-primary"
              : "bg-panel-soft text-secondary border border-neutral hover:bg-panel"
          }`}
        >
          LIMIT
        </button>
      </div>

      {/* Quantity */}
      <div className="mb-4">
        <label className="block text-xs sm:text-sm font-semibold text-primary uppercase tracking-wide mb-1.5">Quantity</label>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg theme-input bg-panel text-ink text-sm"
        />
      </div>

      {/* Limit Price */}
      {type === "LIMIT" && (
        <div className="mb-4">
          <label className="block text-xs sm:text-sm font-semibold text-primary uppercase tracking-wide mb-1.5">Limit Price</label>
          <input
            type="number"
            value={limitPrice}
            onChange={(e) => setLimitPrice(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg theme-input bg-panel text-ink text-sm"
            placeholder="Enter limit price"
          />
        </div>
      )}

      {/* Live Price */}
      {livePrice && (
        <div className="p-2.5 sm:p-3 bg-green-500/10 border border-green-500/30 rounded-lg mb-4">
          <div className="text-xs text-green-400 font-semibold uppercase tracking-wide">Live Price</div>
          <div className="text-lg sm:text-xl font-bold text-green-400 mt-1">${livePrice.toFixed(2)}</div>
        </div>
      )}

      {/* Submit */}
      <button
        onClick={submitOrder}
        disabled={loading}
        className={`w-full py-2 sm:py-2.5 rounded-lg font-bold text-xs sm:text-sm md:text-base transition-all duration-300 ${
          side === "BUY"
            ? "bg-gradient-to-r from-green-500 to-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white hover:opacity-90"
            : "bg-gradient-to-r from-red-700 to-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white hover:opacity-90"
        }`}
      >
        {loading ? "Placing Order..." : `${side} ${type} ${symbol}`}
      </button>

      {/* Messages */}
      {success && (
        <div className="mt-3 p-2.5 sm:p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
          <p className="text-green-400 text-xs font-semibold">{success}</p>
        </div>
      )}
      {error && (
        <div className="mt-3 p-2.5 sm:p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-red-400 text-xs font-semibold">{error}</p>
        </div>
      )}
    </div>
  );
}

export default QuickTradePanel;