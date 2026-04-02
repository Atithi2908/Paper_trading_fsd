import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  percent: number;
} 

interface ChartDataPoint {
  time: string;
  value: number;
}

interface AuthFormData {
  name?: string;
  email: string;
  password: string;
}

export default function TradingLanding() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState<number>(0);
  const [visibleElements, setVisibleElements] = useState<number[]>([]);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [isSignup, setIsSignup] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState<AuthFormData>({
    name: '',
    email: '',
    password: ''
  });
  const [currentStockIndex, setCurrentStockIndex] = useState<number>(0);
  
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isSignup ? '/signup' : '/login';
      const payload = isSignup 
        ? { name: formData.name, email: formData.email, password: formData.password }
        : { email: formData.email, password: formData.password };

      const response = await axios.post(`${BASE_URL}/user${endpoint}`, payload);

      // Store token in localStorage
    console.log("response from login and signup");
      console.log(response);
      if (response.data.token) {
        
        localStorage.setItem('Token', response.data.token);
        const token = localStorage.getItem('Token');
console.log("token from localStorage:", token);
        navigate('/home');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', password: '' });
    setError('');
  };

  const toggleAuthMode = () => {
    setIsSignup(!isSignup);
    resetForm();
  };

  const stocks: Stock[] = [
    { symbol: 'BTC', name: 'Bitcoin', price: 42150.20, change: 1250.50, percent: 2.95 },
    { symbol: 'ETH', name: 'Ethereum', price: 2250.80, change: 45.20, percent: 1.85 },
    { symbol: 'SOL', name: 'Solana', price: 98.45, change: -2.30, percent: -2.15 },
    { symbol: 'AAPL', name: 'Apple Inc.', price: 178.45, change: 2.34, percent: 1.33 },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 495.22, change: 12.45, percent: 2.58 },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 242.68, change: -5.12, percent: -2.07 },
  ];

  const chartData: ChartDataPoint[] = [
    { time: '09:00', value: 420 },
    { time: '10:00', value: 435 },
    { time: '11:00', value: 428 },
    { time: '12:00', value: 445 },
    { time: '13:00', value: 438 },
    { time: '14:00', value: 455 },
    { time: '15:00', value: 470 },
    { time: '16:00', value: 465 },
  ];

  useEffect(() => {
    const stockInterval = setInterval(() => {
      setCurrentStockIndex((prev) => (prev + 1) % stocks.length);
    }, 3000);

    return () => clearInterval(stockInterval);
  }, [stocks.length]);

  useEffect(() => {
    const handleScroll = (): void => {
      setScrollY(window.scrollY);
      
      const elements = document.querySelectorAll('.scroll-fade');
      const newVisible: number[] = [];
      
      elements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (rect.top < windowHeight * 0.85) {
          newVisible.push(index);
        }
      });
      
      setVisibleElements(newVisible);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentStock = stocks[currentStockIndex];
  const maxValue = Math.max(...chartData.map(d => d.value));
  const minValue = Math.min(...chartData.map(d => d.value));

  return (
    <div className="min-h-screen bg-page overflow-x-hidden">
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(5deg);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.1);
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
        
        @keyframes rotateIn {
          from {
            opacity: 0;
            transform: scale(0.8) rotateY(90deg);
          }
          to {
            opacity: 1;
            transform: scale(1) rotateY(0deg);
          }
        }

        @keyframes drawLine {
          to {
            stroke-dashoffset: 0;
          }
        }
        
        .scroll-fade {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .scroll-fade.visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        .fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .delay-100 {
          animation-delay: 0.1s;
          opacity: 0;
        }
        
        .delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }
        
        .delay-300 {
          animation-delay: 0.3s;
          opacity: 0;
        }
        
        .delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
        }
        
        .float-slow {
          animation: float 8s ease-in-out infinite;
        }
        
        .pulse-glow {
          animation: pulse 3s ease-in-out infinite;
        }

        .rotate-in {
          animation: rotateIn 0.6s ease-out forwards;
        }
        
        .hover-lift {
          transition: transform 0.4s ease, box-shadow 0.4s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 25px 50px color-mix(in srgb, var(--color-accent) 30%, transparent);
        }
        
        .btn-glow {
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .btn-glow:hover {
          box-shadow: 0 0 40px color-mix(in srgb, var(--color-accent) 45%, transparent);
          transform: scale(1.05);
        }
        
        .btn-glow::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s;
        }
        
        .btn-glow:hover::before {
          left: 100%;
        }
        
        .gradient-text {
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-contrast) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .shimmer-border {
          position: relative;
          background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--color-accent) 20%, transparent), transparent);
          background-size: 200% 100%;
          animation: shimmer 3s linear infinite;
        }
        
        .card-hover {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .card-hover:hover {
          transform: translateY(-10px) rotate(-1deg);
          box-shadow: 0 30px 60px color-mix(in srgb, var(--color-accent) 25%, transparent);
        }

        .chart-line {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: drawLine 2s ease-out forwards;
        }
      `}</style>
      
      {/* NAVIGATION */}
      <nav className="px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between border-b border-accent backdrop-blur-sm bg-page/50 sticky top-0 z-50 fade-in-up">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-lg sm:text-2xl font-bold text-ink">TradeInCase</span>
        </div>
        <div className="flex items-center gap-3 sm:gap-8">
          <Link to="/exchange" className="hidden md:block text-secondary hover:text-ink transition-all hover:scale-110">Exchange</Link>
          <Link to="/derivatives" className="hidden md:block text-secondary hover:text-ink transition-all hover:scale-110">Derivatives</Link>
          <Link to="/learn" className="hidden md:block text-secondary hover:text-ink transition-all hover:scale-110">Learn</Link>
          <Link to="/faq" className="hidden md:block text-secondary hover:text-ink transition-all hover:scale-110">FAQ</Link>
          <Link to="/snapshots" className="hidden md:block text-secondary hover:text-ink transition-all hover:scale-110">Snapshots</Link>
          <button onClick={() => { setIsSignup(false); setShowAuthModal(true); }} className="px-3 sm:px-5 py-1.5 sm:py-2 border border-primary hover:border-accent text-ink rounded-lg transition-all hover:scale-105 text-sm sm:text-base">
            Log In
          </button>
          <button onClick={() => { setIsSignup(true); setShowAuthModal(true); }} className="px-3 sm:px-5 py-1.5 sm:py-2 btn-primary text-sm sm:text-base">
            Register
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="px-8 py-20 max-w-7xl mx-auto relative">
        <div 
          className="absolute top-20 right-10 w-96 h-96 bg-primary rounded-full filter blur-3xl opacity-10 pulse-glow"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        ></div>
        <div 
          className="absolute bottom-40 left-10 w-80 h-80 bg-secondary rounded-full filter blur-3xl opacity-10 pulse-glow"
          style={{ transform: `translateY(${scrollY * -0.2}px)`, animationDelay: '1.5s' }}
        ></div>

        <div className="text-center mb-24 relative z-10">
          <div className="inline-block mb-4 px-4 py-2 bg-panel border border-accent rounded-full text-sm text-secondary fade-in-up shimmer-border">
            Join the fastest growing trading network
          </div>
          <h1 className="text-7xl font-bold text-ink mb-6 fade-in-up delay-100">
            Master the Markets
            <br />
            <span className="gradient-text">With Precision</span>
          </h1>
          <p className="text-xl text-secondary mb-12 max-w-2xl mx-auto fade-in-up delay-200">
            Leverage AI-driven insights and institutional-grade tools to stay ahead.
            Trade crypto, forex, and equities on one unified platform.
          </p>
          <div className="fade-in-up delay-300">
            <p className="text-sm text-ink">Built for fast paper trading and real-time insights.</p>
          </div>
        </div>

        {/* LIVE TICKER */}
        <div className="mb-16 fade-in-up delay-400">
          <div className="bg-gradient-to-r from-page to-panel rounded-2xl border border-accent p-8 overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="rotate-in">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl font-bold text-ink">{currentStock.symbol}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${currentStock.change > 0 ? 'bg-contrast/20 text-contrast' : 'bg-red-500/20 text-red-400'}`}>
                    {currentStock.change > 0 ? '↑' : '↓'} {Math.abs(currentStock.percent)}%
                  </span>
                </div>
                <p className="text-secondary text-sm mb-3">{currentStock.name}</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-ink">${currentStock.price.toLocaleString()}</span>
                  <span className={`text-lg font-semibold ${currentStock.change > 0 ? 'text-contrast' : 'text-red-400'}`}>
                    {currentStock.change > 0 ? '+' : ''}{currentStock.change}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                {stocks.map((stock, idx) => (
                  <div 
                    key={stock.symbol}
                    className={`w-2 h-2 rounded-full transition-all ${idx === currentStockIndex ? 'bg-primary w-8' : 'bg-accent'}`}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CHART SECTION */}
        <div className={`scroll-fade ${visibleElements.includes(0) ? 'visible' : ''} mb-24 theme-card p-10`}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-ink mb-2">Portfolio Performance</h3>
              <p className="text-secondary">Track your asset growth in real-time</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-primary/10 text-primary rounded-lg font-semibold">24H</button>
              <button className="px-4 py-2 text-secondary hover:text-ink rounded-lg">7D</button>
              <button className="px-4 py-2 text-secondary hover:text-ink rounded-lg">30D</button>
              <button className="px-4 py-2 text-secondary hover:text-ink rounded-lg">ALL</button>
            </div>
          </div>
          <div className="relative h-64">
            <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              
              {[0, 50, 100, 150, 200].map((y) => (
                <line key={y} x1="0" y1={y} x2="800" y2={y} stroke="#2a2a2a" strokeWidth="1" />
              ))}
              
              <path
                d={`M 0 200 ${chartData.map((d, i) => {
                  const x = (i / (chartData.length - 1)) * 800;
                  const y = 200 - ((d.value - minValue) / (maxValue - minValue)) * 180;
                  return `L ${x} ${y}`;
                }).join(' ')} L 800 200 Z`}
                fill="url(#chartGradient)"
              />
              
              <path
                className="chart-line"
                d={`M ${chartData.map((d, i) => {
                  const x = (i / (chartData.length - 1)) * 800;
                  const y = 200 - ((d.value - minValue) / (maxValue - minValue)) * 180;
                  return `${x} ${y}`;
                }).join(' L ')}`}
                fill="none"
                stroke="#06b6d4"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {chartData.map((d, i) => {
                const x = (i / (chartData.length - 1)) * 800;
                const y = 200 - ((d.value - minValue) / (maxValue - minValue)) * 180;
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="#06b6d4"
                  />
                );
              })}
            </svg>
            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 text-xs text-accent">
              {chartData.map((d) => (
                <span key={d.time}>{d.time}</span>
              ))}
            </div>
          </div>
        </div>

        {/* FEATURE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          <div className={`scroll-fade ${visibleElements.includes(1) ? 'visible' : ''} theme-card p-8 card-hover`}>
            <div className="text-primary text-5xl font-bold mb-2">99.9%</div>
            <h3 className="text-xl font-bold text-ink mb-2">Uptime Guarantee</h3>
            <p className="text-secondary">
              Reliable infrastructure that never sleeps, just like the markets
            </p>
          </div>

          <div className={`scroll-fade ${visibleElements.includes(2) ? 'visible' : ''} theme-card p-8 card-hover`} style={{transitionDelay: '0.1s'}}>
            <div className="text-primary text-5xl font-bold mb-2">500+</div>
            <h3 className="text-xl font-bold text-ink mb-2">Global Assets</h3>
            <p className="text-secondary">
              Diverse portfolio options ranging from Crypto to Indices
            </p>
          </div>

          <div className={`scroll-fade ${visibleElements.includes(3) ? 'visible' : ''} theme-card p-8 card-hover`} style={{transitionDelay: '0.2s'}}>
            <div className="text-primary text-5xl font-bold mb-2">10x</div>
            <h3 className="text-xl font-bold text-ink mb-2">Leverage</h3>
            <p className="text-secondary">
              Maximize your potential with competitive margin rates
            </p>
          </div>
        </div>

        {/* DETAILED FEATURES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          <div className={`scroll-fade ${visibleElements.includes(4) ? 'visible' : ''} theme-card p-10 hover-lift`}>
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 float-slow">
              <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-ink mb-4">Smart Order Routing</h3>
            <p className="text-secondary text-lg leading-relaxed">
              Our algorithm automatically finds the best prices across multiple liquidity providers, ensuring you get the best entry and exit points every time.
            </p>
          </div>

          <div className={`scroll-fade ${visibleElements.includes(5) ? 'visible' : ''} theme-card p-10 hover-lift`} style={{transitionDelay: '0.15s'}}>
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 float-slow" style={{animationDelay: '1s'}}>
              <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.131A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.2-2.858.567-4.166" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-ink mb-4">Biometric Verification</h3>
            <p className="text-secondary text-lg leading-relaxed">
              Secure your account with next-gen FaceID and fingerprint integration. Withdrawals are locked to your unique biological signature.
            </p>
          </div>
        </div>

        {/* CTA SECTION */}
        <div className={`scroll-fade ${visibleElements.includes(6) ? 'visible' : ''} relative theme-card p-16 text-center overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full filter blur-3xl opacity-5 float-slow"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary rounded-full filter blur-3xl opacity-5 float-slow" style={{animationDelay: '2s'}}></div>
          <div className="relative z-10">
            <h2 className="text-5xl font-bold text-ink mb-4">The Future is Open</h2>
            <p className="text-secondary text-xl mb-10 max-w-2xl mx-auto">
              Join the revolution of decentralized finance with the security of a centralized exchange.
            </p>
            <button onClick={() => { setIsSignup(true); setShowAuthModal(true); }} className="btn-primary text-xl px-12 py-5 flex items-center gap-2 mx-auto">
              Create Free Account
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            <p className="text-sm text-accent mt-4">No credit card required</p>
          </div>
        </div>
      </main>

      <div className="absolute top-40 left-20 w-2 h-2 bg-primary rounded-full opacity-60 pulse-glow"></div>
      <div className="absolute top-60 right-40 w-2 h-2 bg-primary rounded-full opacity-40 pulse-glow" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-40 left-1/4 w-2 h-2 bg-primary rounded-full opacity-50 pulse-glow" style={{animationDelay: '2s'}}></div>

      {/* AUTH MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="theme-card w-full max-w-lg overflow-hidden relative">
            <button 
              onClick={() => { setShowAuthModal(false); resetForm(); }}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-panel-soft text-secondary hover:text-ink text-2xl transition"
            >
              ×
            </button>

            <div className="p-6 border-b border-accent bg-panel-soft/60">
              <h2 className="text-3xl font-bold text-ink mb-2">
                {isSignup ? 'Create Account' : 'Log In'}
              </h2>
              <p className="text-secondary mb-5">
                {isSignup ? 'Join TradeInCase today' : 'Welcome back'}
              </p>
              <div className="grid grid-cols-2 gap-2 bg-page p-1 rounded-lg border border-accent">
                <button
                  type="button"
                  onClick={() => { setIsSignup(false); resetForm(); }}
                  className={`py-2 rounded-md text-sm font-semibold transition ${!isSignup ? 'btn-primary' : 'text-secondary hover:text-ink'}`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => { setIsSignup(true); resetForm(); }}
                  className={`py-2 rounded-md text-sm font-semibold transition ${isSignup ? 'btn-primary' : 'text-secondary hover:text-ink'}`}
                >
                  Sign Up
                </button>
              </div>
            </div>

            {error && (
              <div className="mx-6 mt-5 p-3 bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              {isSignup && (
                <div>
                  <label className="block text-sm font-medium text-accent mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    required
                    className="theme-input w-full px-4 py-3"
                    placeholder="John Doe"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-accent mb-2">
                  Email Address
                </label>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="theme-input w-full px-4 py-3"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-accent mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="theme-input w-full px-4 py-3"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 mt-6 disabled:opacity-50"
              >
                {loading ? 'Processing...' : (isSignup ? 'Create Account' : 'Log In')}
              </button>
              <p className="mt-4 text-center text-secondary">
                {isSignup ? 'Already have an account?' : 'Don\'t have an account?'}{' '}
                <button
                  type="button"
                  onClick={toggleAuthMode}
                  className="text-primary hover:text-accent font-semibold transition"
                >
                  {isSignup ? 'Log In' : 'Sign Up'}
                </button>
              </p>
            </form>

            <div className="px-6 pb-6">
              <p className="text-xs text-secondary text-center">
                By continuing, you agree to TradeInCase terms and security guidelines.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}