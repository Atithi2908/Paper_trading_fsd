import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Stock {
  symbol: string;
  description: string;
}

interface StockSearchProps {
  query: string;
}

export const StockSearch: React.FC<StockSearchProps> = ({ query }) => {
  const [results, setResults] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      fetchResults(query);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const fetchResults = async (searchTerm: string) => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/stock/search`, {
        params: { q: searchTerm },
      });

      setResults(res.data.result || []);
    } catch (err) {
      console.error("Error fetching stocks", err);
    }
    setLoading(false);
  };

  if (!query) return null;

  return (
    <div className="absolute top-full left-0 w-full mt-2 bg-panel border border-accent rounded-lg shadow-lg max-h-60 sm:max-h-72 overflow-y-auto z-50">
      {loading && (
        <p className="text-secondary text-center p-3 sm:p-4 text-sm">Loading...</p>
      )}

      {!loading && results.length === 0 && (
        <p className="text-secondary text-center p-3 sm:p-4 text-sm">No results found.</p>
      )}

      {!loading &&
        results.map((stock) => (
          <div
            key={stock.symbol}
            onClick={() => navigate(`/stocks/${stock.symbol}`)}
            className="p-3 sm:p-4 hover:bg-panel-soft cursor-pointer transition border-b border-accent last:border-b-0"
          >
            <p className="text-ink font-semibold text-base sm:text-lg">{stock.symbol}</p>
            <p className="text-secondary text-sm truncate mt-0.5">{stock.description}</p>
          </div>
        ))}
    </div>
  );
};