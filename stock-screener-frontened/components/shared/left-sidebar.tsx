"use client";

import { Search, X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useAuthStore } from "@/hooks/useAuth";

export function LeftSidebar({ onSelectSymbol }: { onSelectSymbol?: (symbol: string) => void }) {
  const { items, add, remove, load } = useWatchlist();
  const { user } = useAuthStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Load watchlist when user logs in
  useEffect(() => {
    if (user) load();
  }, [user, load]);

  // Search stocks
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/stocks/search?query=${query}`);
      const data = await res.json();
      setSearchResults(data || []);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full w-80 bg-gray-900/95 backdrop-blur-sm border-r border-cyan-500/20 p-4 space-y-6 overflow-y-auto">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search US Stocks"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 pr-4 py-1.5 rounded-full bg-gray-800/50 border-gray-700/50 text-gray-300 placeholder-gray-500 focus:border-cyan-500/50 focus:ring-cyan-500/20 text-sm"
        />
        {/* Search Dropdown */}
        {searchResults.length > 0 && (
          <div className="absolute mt-1 bg-gray-800 border border-gray-700 rounded-lg w-full max-h-40 overflow-y-auto z-10">
            {searchResults.map((stock) => (
              <div
                key={stock.symbol}
                onClick={() => {
                  add(stock.symbol);
                  setSearchQuery("");
                  setSearchResults([]);
                }}
                className="px-3 py-2 hover:bg-gray-700 cursor-pointer text-sm text-gray-200 flex justify-between"
              >
                <span>{stock.symbol} - {stock.name}</span>
                <Plus className="w-4 h-4 text-gray-400" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Watchlist */}
      <div>
        <h3 className="text-base font-bold text-cyan-400 mb-3">My Watchlist</h3>
        <div className="space-y-2">
          {items.length > 0 ? (
            items.map((stock) => (
              <div
                key={stock.symbol}
                onClick={() => onSelectSymbol?.(stock.symbol)}
                className="p-3 bg-gray-800/30 rounded-lg border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-200 hover:shadow-md hover:shadow-cyan-500/10 flex justify-between items-center cursor-pointer"
              >
                <div>
                  <div className="font-semibold text-gray-200 text-sm">{stock.symbol}</div>
                  <div className="text-xs text-gray-400">{stock.name}</div>
                  <div className="font-semibold text-gray-200 text-sm mt-1">{stock.price}</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`text-xs ${stock.change.startsWith("+") ? "text-green-400" : "text-red-400"}`}>
                    {stock.change}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(stock.symbol);
                    }}
                    className="p-1 rounded bg-gray-700/50 hover:bg-red-600"
                  >
                    <X className="w-4 h-4 text-gray-300" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm">No stocks in your watchlist</p>
          )}
        </div>
      </div>
    </div>
  );
}
