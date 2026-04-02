
import { useState,useEffect } from 'react';
import { Search, Bell, User, ChevronDown, TrendingUp } from 'lucide-react';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
import axios from "axios";
import { StockSearch } from '../components/StockSearch';
import { useNavigate } from "react-router-dom";

export interface User {
  id: number;
  name: string;
}
export interface Post {
  id: number; 
  user: User,
  userId: number;
  content: string;
  tags: string[];
  createdAt: string;
  likesCount: number;
  commentsCount: number;
}

export default function TradingDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showPortfolio, setShowPortfolio] = useState(false);
 const [posts, setPosts] = useState<Post[]>([]);
 const[Loading,setLoading] = useState(false);
  const [isPostOpen, setisPostOpen] = useState(false);
  const [userData, setUserData] = useState<{ username: string } | null>(null);
  const [walletData, setWalletData] = useState<{ balance: number } | null>(null);
   const Navigate = useNavigate();
const [formData, setFormData] = useState<{ content: string; tags: string[] }>({
  content: '',
  tags: [],
});

 useEffect(() => {
  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("Token");
      console.log("Fetching user details with token:", token);
      const res = await axios.get(`${BASE_URL}/user/getDetails`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("User details response:", res.data);
      console.log("User object:", res.data.user);
      console.log("Username:", res.data.user?.username);
      setUserData(res.data.user);
      setWalletData(res.data.wallet);
    } catch (err) {
      console.error("Error fetching user details:", err);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("Token"); 
      console.log("token is");
      console.log(token);
      console.log(`${BASE_URL}/post/fetchPost`);
      const res = await axios.get( `${BASE_URL}/post/fetchPost`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPosts(res.data.posts);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false); 
    }
  };

  fetchUserDetails();
  fetchPosts();
}, []);

 const createPost = async () => {
    setLoading(true); 
    try {
      const token = localStorage.getItem("Token"); 
      console.log("token is");
      console.log(token);
      console.log(`${BASE_URL}/post/create`);
      await axios.post( `${BASE_URL}/post/create`, 
        {
         content: formData.content,
          tags:formData.tags
        },
        {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } 
     catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false); // stop loading
      
    }
  };

  const trendingStocks = [
    { symbol: 'TSLA', change: '+5.2%', positive: true, price: 245.67 },
    { symbol: 'BTC', change: '+3.8%', positive: true, price: 43250.50 },
    { symbol: 'AAPL', change: '+2.1%', positive: true, price: 178.32 }
  ];

  const portfolioHoldings = [
    { symbol: 'AAPL', shares: 50, avgPrice: 170.50, currentPrice: 178.32, totalValue: 8916.00 },
    { symbol: 'TSLA', shares: 25, avgPrice: 235.00, currentPrice: 245.67, totalValue: 6141.75 },
    { symbol: 'MSFT', shares: 30, avgPrice: 380.00, currentPrice: 395.20, totalValue: 11856.00 },
    { symbol: 'GOOGL', shares: 15, avgPrice: 140.50, currentPrice: 145.80, totalValue: 2187.00 }
  ];

  const handleBuyStock = (symbol:any) => {
    alert(`Buy ${symbol} - This would open a trade modal`);
  };

  const calculateProfitLoss = (holding:any) => {
    const profitLoss = (holding.currentPrice - holding.avgPrice) * holding.shares;
    return profitLoss;
  };

  const walletBalance = walletData?.balance ?? 0;
  const holdingsMarketValue = portfolioHoldings.reduce((sum, holding) => sum + holding.totalValue, 0);
  const totalProfitLoss = portfolioHoldings.reduce((sum, holding) => sum + calculateProfitLoss(holding), 0);
  const totalPortfolioValue = walletBalance + holdingsMarketValue;
  const costBasis = holdingsMarketValue - totalProfitLoss;
  const totalReturnPercent = costBasis > 0 ? (totalProfitLoss / costBasis) * 100 : 0;
  const unreadNotifications = Math.min(posts.length, 9);
  const lastUpdated = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const formatCurrency = (value: number) =>
    `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="h-screen flex flex-col bg-page overflow-hidden">
      <header className="bg-page border-b border-accent sticky top-0 z-50 backdrop-blur-sm bg-page/60 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between gap-2 md:gap-4">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <TrendingUp className="text-primary" size={24} />
              <span className="text-base sm:text-lg md:text-xl font-bold text-ink">Paper Trades</span>
            </div>

            <div className="flex-1 max-w-xl mx-2 sm:mx-4 md:mx-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search stocks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full theme-input pr-10 text-base md:text-lg placeholder-secondary py-2.5 sm:py-3 md:py-3.5 px-4 sm:px-5"
                />
                <StockSearch query={searchQuery}/>
                <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-secondary hover:text-primary cursor-pointer transition">
                  <Search size={20} className="md:w-5 md:h-5" />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-6">
                <button className="hidden sm:flex relative h-10 w-10 items-center justify-center rounded-xl border border-accent bg-panel text-secondary hover:text-primary hover:border-primary transition">
                <Bell size={20} className="md:w-6 md:h-6" />
                <span className="absolute -top-1.5 -right-1.5 bg-primary text-page text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center shadow-accent">
                  {unreadNotifications}
                </span>
              </button>

        
              <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3">
                <button className="flex items-center space-x-1 sm:space-x-2 text-ink hover:text-primary cursor-pointer transition">
                  <div className="w-7 h-7 md:w-8 md:h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                    <User size={16} className="md:w-[18px] md:h-[18px] text-ink" />
                  </div>
                  <span className="hidden sm:inline font-medium text-sm md:text-base">{userData?.username || 'User'}</span>
                  <ChevronDown size={14} className="hidden sm:block md:w-4 md:h-4" />
                </button>
                <span className="text-green-400 font-bold text-sm md:text-lg">{formatCurrency(walletBalance)}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-8 h-full overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 h-full">
   
            <div className="lg:col-span-3 order-2 lg:order-1 overflow-y-auto space-y-4 md:space-y-6">
              <div className="theme-card p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-ink mb-3 md:mb-4">Create a Post</h2>
              <p className="text-secondary text-xs md:text-sm mb-4 md:mb-6">
                Share your trade insights or questions with the community.
              </p>
              <button className="w-full py-2.5 md:py-3 btn-primary text-sm md:text-base"
               onClick={() => setisPostOpen(true)}
              >
                Make a Post
              </button>
            </div>

            <div className="theme-card p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-ink mb-3 md:mb-4">Top Trending Today</h2>
              <div className="space-y-3 md:space-y-4">
                {trendingStocks.map((stock, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <span className="text-primary font-medium block text-sm md:text-base">{stock.symbol}</span>
                      <span className="text-neutral text-xs md:text-sm">${stock.price}</span>
                    </div>
                    <span className={`font-bold text-sm md:text-base ${stock.positive ? 'text-green-400' : 'text-red-400'}`}>
                      {stock.change}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
{isPostOpen && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-panel border border-accent rounded-2xl p-4 sm:p-6 md:p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
      <h2 className="text-base sm:text-lg font-semibold mb-3 text-ink">Create Post</h2>

      <textarea
        className="w-full border border-accent rounded-lg p-2 mb-4 text-sm md:text-base min-h-[100px] bg-panel-soft text-ink placeholder-secondary focus:outline-none focus:border-primary"
        placeholder="What's on your mind?"
        value={formData.content}
        onChange={(e) =>
          setFormData({ ...formData, content: e.target.value })
        }
      />

      {/* Tags Filter */}
      <div className="mb-4">
        <p className="text-xs sm:text-sm font-medium mb-2 text-primary">Select Tags:</p>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {["Stocks", "Crypto", "Options", "Trading Tips", "Investing"].map(
            (tag) => (
              <label
                key={tag}
                className="flex items-center space-x-1 bg-panel-soft border border-accent px-2 py-1 rounded-full cursor-pointer hover:border-primary transition"
              >
                <input
                  type="checkbox"
                  value={tag}
                  checked={formData.tags?.includes(tag)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setFormData((prev) => {
                      const newTags = checked
                        ? [...(prev.tags || []), tag]
                        : prev.tags?.filter((t) => t !== tag);
                      return { ...prev, tags: newTags };
                    });
                  }}
                  className="accent-primary"
                />
                <span className="text-xs sm:text-sm text-ink">{tag}</span>
              </label>
            )
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => setisPostOpen(false)}
          disabled={Loading}
          className="px-3 sm:px-4 py-2 bg-neutral text-ink rounded-md disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            console.log("Post content:", formData.content);
            console.log("Selected tags:", formData.tags);
         createPost();
            setisPostOpen(false);
          }}
          disabled={Loading}
          className="px-3 sm:px-4 py-2 btn-primary rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm md:text-base font-bold"
        >
          {Loading && <span className="inline-block animate-spin h-4 w-4 border-2 border-ink border-t-transparent rounded-full"></span>}
          {Loading ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  </div>
)}

       
          <div className="lg:col-span-6 order-1 lg:order-2 overflow-y-auto pr-2">
            <div className="space-y-3 md:space-y-4">
              {Loading ? (
                <div className="theme-card p-8 md:p-12 flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-t-2 border-b-2 border-primary mb-4"></div>
                  <p className="text-secondary text-center text-sm md:text-base">Loading posts...</p>
                </div>
              ) : posts.length > 0 ? (
                posts.map((post) => (
                  <div
                    key={post.id}
                    className="theme-card p-4 md:p-6 hover:border-accent transition cursor-pointer"
                  >
                    <h3 className="text-ink font-bold mb-2 text-sm md:text-base">{post.user.name}</h3>
                    <p className="text-primary text-sm md:text-base">{post.content}</p>
                  </div>
                ))
              ) : (
                <div className="theme-card p-8 md:p-12 text-center">
                  <p className="text-secondary text-sm md:text-base">No posts yet. Be the first to share!</p>
                </div>
              )}
            </div>
          </div>

          
          <div className="lg:col-span-3 order-3 overflow-y-auto space-y-4 md:space-y-6">
            <div 
              className="theme-card p-4 md:p-6 hover:border-accent transition cursor-pointer"
              onClick={() => Navigate("/portfolio")}
            >
              <h2 className="text-lg md:text-xl font-bold text-ink mb-3 md:mb-4">Portfolio Snapshot</h2>
              <div className="space-y-2 md:space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-secondary text-sm md:text-base">Wallet Balance:</span>
                  <span className="text-ink font-bold text-sm md:text-base">{formatCurrency(walletBalance)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-secondary text-sm md:text-base">Last Updated:</span>
                  <span className="font-bold text-sm md:text-base text-primary">{lastUpdated}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  Navigate("/portfolio");
                }}
                className="mt-3 md:mt-4 w-full text-center text-primary text-xs md:text-sm font-semibold hover:text-secondary"
              >
                Show full portfolio →
              </button>
            </div>

            <div className="theme-card p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-ink mb-3 md:mb-4">Trading Activity</h2>
              <p className="text-secondary text-xs md:text-sm mb-4">
                View your complete order and trade history
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => Navigate("/orders")}
                  className="w-full py-2.5 btn-primary text-sm md:text-base flex items-center justify-between"
                >
                  <span>Order History</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <button
                  onClick={() => Navigate("/trades")}
                  className="w-full py-2.5 btn-primary text-sm md:text-base flex items-center justify-between"
                >
                  <span>Trade History</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showPortfolio && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-panel rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-accent">
            {/* Header */}
            <div className="sticky top-0 bg-panel border-b border-accent p-4 md:p-6 flex justify-between items-center">
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-ink">My Portfolio</h2>
                <p className="text-secondary mt-1 text-xs sm:text-sm md:text-base">Complete overview of your holdings</p>
              </div>
              <button 
                onClick={() => setShowPortfolio(false)}
                className="text-secondary hover:text-ink text-2xl md:text-3xl transition"
              >
                ×
              </button>
            </div>

            {/* Portfolio Summary */}
            <div className="p-4 md:p-6 border-b border-accent">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                <div className="bg-panel-soft rounded-lg p-3 md:p-4">
                  <p className="text-secondary text-xs md:text-sm mb-1 md:mb-2">Total Value</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-ink">{formatCurrency(totalPortfolioValue)}</p>
                </div>
                <div className="bg-panel-soft rounded-lg p-3 md:p-4">
                  <p className="text-secondary text-xs md:text-sm mb-1 md:mb-2">Cash Balance</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-ink">{formatCurrency(walletBalance)}</p>
                </div>
                <div className="bg-panel-soft rounded-lg p-3 md:p-4">
                  <p className="text-secondary text-xs md:text-sm mb-1 md:mb-2">Total P/L</p>
                  <p className={`text-lg sm:text-xl md:text-2xl font-bold ${totalProfitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {totalProfitLoss >= 0 ? '+' : '-'}{formatCurrency(Math.abs(totalProfitLoss))}
                  </p>
                </div>
                <div className="bg-panel-soft rounded-lg p-3 md:p-4">
                  <p className="text-secondary text-xs md:text-sm mb-1 md:mb-2">Return</p>
                  <p className={`text-lg sm:text-xl md:text-2xl font-bold ${totalReturnPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {totalReturnPercent >= 0 ? '+' : ''}{totalReturnPercent.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>

            {/* Holdings Table */}
            <div className="p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-bold text-ink mb-3 md:mb-4">Your Holdings</h3>
              <div className="overflow-x-auto -mx-4 md:mx-0">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-accent">
                      <th className="text-left py-2 md:py-3 px-2 md:px-4 text-secondary font-medium text-xs md:text-sm">Symbol</th>
                      <th className="text-right py-2 md:py-3 px-2 md:px-4 text-secondary font-medium text-xs md:text-sm">Shares</th>
                      <th className="text-right py-2 md:py-3 px-2 md:px-4 text-secondary font-medium text-xs md:text-sm">Avg Price</th>
                      <th className="text-right py-2 md:py-3 px-2 md:px-4 text-secondary font-medium text-xs md:text-sm">Current</th>
                      <th className="text-right py-2 md:py-3 px-2 md:px-4 text-secondary font-medium text-xs md:text-sm">Value</th>
                      <th className="text-right py-2 md:py-3 px-2 md:px-4 text-secondary font-medium text-xs md:text-sm">P/L</th>
                      <th className="text-right py-2 md:py-3 px-2 md:px-4 text-secondary font-medium text-xs md:text-sm">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolioHoldings.map((holding, index) => {
                      const profitLoss = calculateProfitLoss(holding);
                      const profitLossPercent = ((holding.currentPrice - holding.avgPrice) / holding.avgPrice * 100).toFixed(2);
                      return (
                        <tr key={index} className="border-b border-accent hover:bg-panel-soft transition">
                          <td className="py-3 md:py-4 px-2 md:px-4">
                            <span className="text-ink font-bold text-sm md:text-base">{holding.symbol}</span>
                          </td>
                          <td className="py-3 md:py-4 px-2 md:px-4 text-right text-primary text-xs md:text-sm">{holding.shares}</td>
                          <td className="py-3 md:py-4 px-2 md:px-4 text-right text-primary text-xs md:text-sm">${holding.avgPrice.toFixed(2)}</td>
                          <td className="py-3 md:py-4 px-2 md:px-4 text-right text-ink font-medium text-xs md:text-sm">${holding.currentPrice.toFixed(2)}</td>
                          <td className="py-3 md:py-4 px-2 md:px-4 text-right text-ink font-bold text-xs md:text-sm">${holding.totalValue.toFixed(2)}</td>
                          <td className="py-3 md:py-4 px-2 md:px-4 text-right">
                            <div className={profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}>
                              <div className="font-bold text-xs md:text-sm">{profitLoss >= 0 ? '+' : ''}${profitLoss.toFixed(2)}</div>
                              <div className="text-[10px] md:text-xs">({profitLoss >= 0 ? '+' : ''}{profitLossPercent}%)</div>
                            </div>
                          </td>
                          <td className="py-3 md:py-4 px-2 md:px-4 text-right">
                            <button 
                              onClick={() => handleBuyStock(holding.symbol)}
                              className="px-2 md:px-4 py-1.5 md:py-2 btn-primary text-xs md:text-sm font-bold rounded-lg transition"
                            >
                              Trade
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
