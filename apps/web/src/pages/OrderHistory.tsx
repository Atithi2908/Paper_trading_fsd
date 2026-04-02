import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

type Order = {
  orderId: number;
  stockSymbol: string;
  stockName: string;
  side: "BUY" | "SELL";
  type: "MARKET" | "LIMIT";
  quantity: number;
  filledQuantity: number;
  limitPrice: number | null;
  status: string;
  avgExecutedPrice: number | null;
  createdAt: string;
};

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("Token"); // starts with T

        const res = await axios.get(`${API_BASE}/user/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(res.data);
      } catch (err: any) {
        setError("Failed to fetch order history");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'FILLED':
      case 'COMPLETED':
        return 'text-green-400 bg-green-500/20 border-green-500/50';
      case 'PENDING':
      case 'PARTIAL':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50';
      case 'CANCELLED':
      case 'REJECTED':
        return 'text-red-400 bg-red-500/20 border-red-500/50';
      default:
        return 'text-secondary bg-contrast/10 border-contrast/50';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center p-6">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-secondary text-base">Loading orders...</p>
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

  return (
    <div className="min-h-screen bg-page p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Order History
          </h1>
          <p className="text-secondary text-sm sm:text-base">View all your trading orders and their status</p>
        </div>

        {orders.length === 0 ? (
          <div className="theme-card p-12 text-center">
            <div className="w-20 h-20 bg-panel-soft rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-secondary text-3xl">📋</span>
            </div>
            <p className="text-ink text-lg">No orders found</p>
            <p className="text-neutral text-sm mt-2">Your order history will appear here once you start trading</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <div 
                key={o.orderId} 
                className="theme-card p-4 sm:p-6 hover:border-accent transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  {/* Left Side - Stock Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="font-bold text-ink text-lg sm:text-xl">
                        {o.stockSymbol}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                        o.side === 'BUY' ? 'bg-green-500/20 border border-green-500/50 text-green-400' : 'bg-red-500/20 border border-red-500/50 text-red-400'
                      }`}>
                        {o.side}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold border ${getStatusColor(o.status)}`}>
                        {o.status}
                      </span>
                    </div>
                    <div className="text-sm text-secondary mb-3">
                      {o.stockName}
                    </div>

                    {/* Order Details Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                      <div>
                        <p className="text-xs text-neutral uppercase tracking-wide mb-1">Type</p>
                        <p className="text-sm font-semibold text-primary">{o.type}</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral uppercase tracking-wide mb-1">Quantity</p>
                        <p className="text-sm font-semibold text-ink">{o.quantity}</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral uppercase tracking-wide mb-1">Filled</p>
                        <p className="text-sm font-semibold text-ink">{o.filledQuantity}/{o.quantity}</p>
                      </div>
                      {o.limitPrice && (
                        <div>
                          <p className="text-xs text-neutral uppercase tracking-wide mb-1">Limit Price</p>
                          <p className="text-sm font-semibold text-ink">₹{o.limitPrice.toFixed(2)}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-neutral uppercase tracking-wide mb-1">Avg Price</p>
                        <p className="text-sm font-semibold text-ink">
                          {o.avgExecutedPrice ? `₹${o.avgExecutedPrice.toFixed(2)}` : '-'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Timestamp */}
                  <div className="sm:text-right">
                    <div className="text-xs text-neutral uppercase tracking-wide mb-1">Order Time</div>
                    <div className="text-sm text-secondary">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-neutral">
                      {new Date(o.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}