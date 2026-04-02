import { useState, useRef, useEffect } from 'react';
import { FaBell, FaUser, FaCaretDown, FaSearch } from 'react-icons/fa';

interface TopbarProps {
  siteName?: string;
  balance?: number;
  notificationCount?: number;
}

export default function Topbar({ siteName = 'TradeInCase', balance = 0, notificationCount = 0 }: TopbarProps) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    

    return (
      <header className="w-full bg-page border-b border-accent shadow-sm backdrop-blur-sm bg-page/80 sticky top-0 z-50">
  <div className="flex items-center justify-between h-16 px-0">

    {/* Left: Site Name */}
    <div className="text-xl font-semibold text-primary ml-2 font-bold">
      {siteName}
    </div>

    {/* Center: Search Box */}
    <div className="flex-1 flex justify-center">
      <div className="hidden md:flex items-center border border-accent rounded-lg px-2 py-1 gap-2 w-96 bg-panel">
        <input
          type="text"
          placeholder="Search stocks, crypto..."
          className="outline-none bg-transparent text-base text-ink placeholder:text-secondary w-full focus:outline-none"
        />
        <FaSearch className="text-neutral hover:text-primary transition" />
      </div>
    </div>

    
    <div className="flex items-center gap-4 mr-2">
      <button className="relative p-2 h-10 w-10 flex items-center justify-center rounded-xl border border-accent bg-panel text-secondary hover:text-primary hover:border-primary transition">
        <FaBell size={18} className="text-secondary hover:text-primary transition" />
        <span className="absolute -top-1 -right-1 inline-flex h-5 w-5 items-center justify-center text-xs font-semibold leading-none text-page bg-primary rounded-full shadow-accent">
          {Math.min(notificationCount, 99)}
        </span>
      </button>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-panel transition text-ink"
        >
          <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
            <FaUser size={16} className="text-page" />
          </div>
          <span className="hidden sm:inline text-sm font-medium">Account</span>
          <FaCaretDown size={14} className={`transition ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-panel border border-accent rounded-lg shadow-lg py-2 z-10">
            <a href="/portfolio" className="block px-4 py-2 text-secondary hover:text-ink hover:bg-panel-soft transition">
              Portfolio
            </a>
            <a href="/order-history" className="block px-4 py-2 text-secondary hover:text-ink hover:bg-panel-soft transition">
              Order History
            </a>
            <a href="/trade-history" className="block px-4 py-2 text-secondary hover:text-ink hover:bg-panel-soft transition">
              Trade History
            </a>
            <hr className="my-2 border-accent" />
            <a href="/settings" className="block px-4 py-2 text-secondary hover:text-ink hover:bg-panel-soft transition">
              Settings
            </a>
            <a href="/" className="block px-4 py-2 text-secondary hover:text-red-400 hover:bg-panel-soft transition">
              Logout
            </a>
          </div>
        )}
      </div>
    </div>

    {/* Right: Balance */}
    <div className="text-lg font-bold text-primary mr-4">
      ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </div>
  </div>
</header>
    );
}