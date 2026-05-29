"use client";
import dynamic from "next/dynamic";
import { API_CONFIG } from "@/lib/api-config";
import TradeModal from "@/components/TradeModal";
import ForecastPanel from "@/components/ForecastPanel";
import { useWatchlist } from "@/hooks/useWatchlist";

const TradingViewChart = dynamic(() => import('@/components/TradingViewChart'), { ssr: false });

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Camera,
  TrendingUp,
  TrendingDown,
  Settings,
  Maximize2,
  Activity,
  Target,
  RotateCcw,
  Play,
  Pause,
  RefreshCw,
  Wifi,
  WifiOff,
  AlertCircle
} from 'lucide-react';

// ── Symbol metadata: exchange + approximate base prices (DEMO FALLBACK ONLY) ─
// These are used ONLY when the live backend is unavailable, to generate
// realistic-looking simulated chart data.  When the backend is running,
// real prices are fetched from the API and this map is not consulted.
const SYMBOL_META: Record<string, { exchange: string; basePrice: number }> = {
  AAPL:  { exchange: "NASDAQ", basePrice: 213 },
  MSFT:  { exchange: "NASDAQ", basePrice: 430 },
  GOOGL: { exchange: "NASDAQ", basePrice: 178 },
  AMZN:  { exchange: "NASDAQ", basePrice: 195 },
  TSLA:  { exchange: "NASDAQ", basePrice: 245 },
  NVDA:  { exchange: "NASDAQ", basePrice: 120 },
  META:  { exchange: "NASDAQ", basePrice: 575 },
  NFLX:  { exchange: "NASDAQ", basePrice: 1130 },
  AMD:   { exchange: "NASDAQ", basePrice: 160 },
  INTC:  { exchange: "NASDAQ", basePrice: 22 },
  PYPL:  { exchange: "NASDAQ", basePrice: 73 },
  ADBE:  { exchange: "NASDAQ", basePrice: 370 },
  JPM:   { exchange: "NYSE",   basePrice: 240 },
  BAC:   { exchange: "NYSE",   basePrice: 43 },
  WMT:   { exchange: "NYSE",   basePrice: 97 },
  DIS:   { exchange: "NYSE",   basePrice: 105 },
  KO:    { exchange: "NYSE",   basePrice: 63 },
  V:     { exchange: "NYSE",   basePrice: 350 },
  MA:    { exchange: "NYSE",   basePrice: 520 },
  XOM:   { exchange: "NYSE",   basePrice: 110 },
};

const getSymbolMeta = (sym: string) =>
  SYMBOL_META[sym.toUpperCase()] ?? { exchange: "NYSE", basePrice: 100 };

// ── Realistic mock data using symbol's base price ──────────────────────────
const generateMockData = (symbol: string) => {
  const { basePrice } = getSymbolMeta(symbol);
  const data = [];
  let price = basePrice;
  const volatility = basePrice * 0.015; // 1.5% daily volatility

  for (let i = 0; i < 100; i++) {
    const change = (Math.random() - 0.5) * volatility * 2;
    const open = price;
    const close = Math.max(price + change, 1);
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low  = Math.min(open, close) - Math.random() * volatility * 0.5;
    const volume = Math.floor(Math.random() * 5_000_000) + 1_000_000;

    data.push({
      time: new Date(Date.now() - (100 - i) * 24 * 60 * 60 * 1000)
        .toISOString().split('T')[0],
      open:   parseFloat(open.toFixed(2)),
      high:   parseFloat(high.toFixed(2)),
      low:    parseFloat(low.toFixed(2)),
      close:  parseFloat(close.toFixed(2)),
      volume,
    });
    price = close;
  }
  return data;
};

type StockDataPoint = {
  time: string; open: number; high: number; low: number; close: number; volume: number;
};
type IndicatorKey = 'sma' | 'ema' | 'rsi' | 'macd' | 'bollinger' | 'volume';

const ChartArea = () => {
  const { add, has } = useWatchlist();
  const [symbol, setSymbol] = useState('AAPL');
  const [inputValue, setInputValue] = useState('AAPL');
  const [stockData, setStockData] = useState<StockDataPoint[]>([]);
  const [forecastData, setForecastData] = useState(null);
  const [isLiveData, setIsLiveData] = useState(false); // track data source
  const [isForecastLoading, setIsForecastLoading] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  // Prevent hydration mismatch from Math.random() in mock data
  useEffect(() => { setHasMounted(true); }, []);

  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  // ── Debounced symbol search ──────────────────────────────────────────────
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase();
    setInputValue(val);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      if (val.trim().length > 0) setSymbol(val.trim());
    }, 500);
  };

  const handleSearchClick = () => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (inputValue.trim().length > 0) setSymbol(inputValue.trim());
  };

  // ── Forecast fetch ────────────────────────────────────────────────────────
  const fetchForecastData = async () => {
    setIsForecastLoading(true);
    setForecastData(null);
    try {
      const res = await fetch(`${API_CONFIG.FORECAST_API}/api/forecast`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticker: symbol,
          start:  oneYearAgo.toISOString().split("T")[0],
          end:    new Date().toISOString().split("T")[0],
        }),
      });
      const data = await res.json();
      if (!data.error) setForecastData(data);
    } catch (err) {
      console.error("Forecast fetch error:", err);
    } finally {
      setIsForecastLoading(false);
    }
  };

  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [chartType, setChartType] = useState('candlestick');
  const [indicators, setIndicators] = useState<Record<IndicatorKey, boolean>>({
    sma: false, ema: false, rsi: false, macd: false, bollinger: false, volume: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState(0);
  const [priceChangePercent, setPriceChangePercent] = useState(0);
  const [isRealTime, setIsRealTime] = useState(false);
  const [showDrawingTools, setShowDrawingTools] = useState(false);
  const [alertPrice, setAlertPrice] = useState('');
  const [showAlerts, setShowAlerts] = useState(false);
  const [tradeType, setTradeType] = useState<"BUY" | "SELL" | null>(null);

  const chartRef = useRef(null);
  const timeframes = ['1D', '1W', '1M', '3M', '6M', '1Y'];
  const chartTypes = ['candlestick', 'line', 'area'];

  // ── Chart data fetch with live/mock detection ────────────────────────────
  const fetchChartData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_CONFIG.STOCK_API}/api/stocks/chart/${symbol}`);
      const data = await response.json();

      if (Array.isArray(data) && data.length > 1) {
        setStockData(data);
        setIsLiveData(true);
        const latest   = data[data.length - 1];
        const previous = data[data.length - 2];
        setCurrentPrice(latest.close);
        const change = latest.close - previous.close;
        setPriceChange(change);
        setPriceChangePercent((change / previous.close) * 100);
      } else {
        throw new Error(data?.error ?? "Empty response");
      }
    } catch (error) {
      console.warn('Live data unavailable, using demo data:', error);
      const mockData = generateMockData(symbol);
      setStockData(mockData);
      setIsLiveData(false);
      const latest   = mockData[mockData.length - 1];
      const previous = mockData[mockData.length - 2];
      setCurrentPrice(latest.close);
      const change = latest.close - previous.close;
      setPriceChange(change);
      setPriceChangePercent((change / previous.close) * 100);
    } finally {
      setIsLoading(false);
    }
  }, [symbol]);

  const toggleIndicator = (indicator: IndicatorKey) => {
    setIndicators(prev => ({ ...prev, [indicator]: !prev[indicator] }));
  };

  const toggleRealTime = () => setIsRealTime(r => !r);

  const resetChart = () => {
    setIndicators({ sma: false, ema: false, rsi: false, macd: false, bollinger: false, volume: true });
    setSelectedTimeframe('1D');
    setChartType('candlestick');
  };

  useEffect(() => {
    fetchChartData();
    fetchForecastData();
  }, [symbol, selectedTimeframe]);

  // ── Real-time simulation (only when toggled on) ──────────────────────────
  useEffect(() => {
    if (!isRealTime) return;
    const interval = setInterval(() => {
      if (currentPrice) {
        const { basePrice } = getSymbolMeta(symbol);
        const volatility = basePrice * 0.0008;
        const change = (Math.random() - 0.5) * volatility * 2;
        setCurrentPrice(p => p! + change);
        setPriceChange(prev => prev + change);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isRealTime, currentPrice, symbol]);

  const { exchange } = getSymbolMeta(symbol);

  // ── Candlestick SVG chart ─────────────────────────────────────────────────
  const CandlestickChart = ({ data }: { data: StockDataPoint[] }) => {
    const maxPrice   = Math.max(...data.map(d => d.high));
    const minPrice   = Math.min(...data.map(d => d.low));
    const priceRange = maxPrice - minPrice || 1;
    const chartHeight = 300;
    const chartWidth  = 800;
    const visible     = data.slice(-60);
    const candleWidth = (chartWidth / visible.length) * 0.75;

    return (
      <svg width="100%" height={chartHeight} className="bg-gray-900 rounded" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
        {[...Array(8)].map((_, i) => (
          <line key={i}
            x1="0" y1={i * (chartHeight / 8)}
            x2={chartWidth} y2={i * (chartHeight / 8)}
            stroke="#1f2937" strokeWidth="1" strokeDasharray="4,4"
          />
        ))}
        {visible.map((candle, i) => {
          const x       = i * (chartWidth / visible.length) + (chartWidth / visible.length) * 0.1;
          const highY   = ((maxPrice - candle.high)  / priceRange) * chartHeight;
          const lowY    = ((maxPrice - candle.low)   / priceRange) * chartHeight;
          const openY   = ((maxPrice - candle.open)  / priceRange) * chartHeight;
          const closeY  = ((maxPrice - candle.close) / priceRange) * chartHeight;
          const isGreen = candle.close >= candle.open;
          const bodyTop = Math.min(openY, closeY);
          const bodyH   = Math.max(Math.abs(closeY - openY), 1);
          const color   = isGreen ? "#22c55e" : "#ef4444";

          return (
            <g key={i}>
              <line x1={x + candleWidth / 2} y1={highY} x2={x + candleWidth / 2} y2={lowY} stroke={color} strokeWidth="1" />
              <rect x={x} y={bodyTop} width={candleWidth} height={bodyH}
                fill={color} stroke={color} strokeWidth="0.5" opacity={0.9} />
            </g>
          );
        })}
        {currentPrice && (
          <line
            x1="0" y1={((maxPrice - currentPrice) / priceRange) * chartHeight}
            x2={chartWidth} y2={((maxPrice - currentPrice) / priceRange) * chartHeight}
            stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="6,4"
          />
        )}
      </svg>
    );
  };

  const VolumeChart = ({ data }: { data: StockDataPoint[] }) => {
    const visible   = data.slice(-60);
    const maxVol    = Math.max(...visible.map(d => d.volume));
    const chartH    = 80;
    const chartW    = 800;
    const barW      = (chartW / visible.length) * 0.75;

    return (
      <svg width="100%" height={chartH} className="bg-gray-800 rounded mt-1" viewBox={`0 0 ${chartW} ${chartH}`}>
        {visible.map((bar, i) => {
          const x    = i * (chartW / visible.length) + (chartW / visible.length) * 0.1;
          const barH = (bar.volume / maxVol) * chartH;
          const isGreen = bar.close >= bar.open;
          return (
            <rect key={i} x={x} y={chartH - barH} width={barW} height={barH}
              fill={isGreen ? "#22c55e" : "#ef4444"} opacity="0.5" />
          );
        })}
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* ── Header: Search + Controls ───────────────────────────────────── */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          {/* Search */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Symbol (e.g. AAPL)"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}
              className="bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg w-36 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm uppercase"
            />
            <button
              onClick={handleSearchClick}
              disabled={isLoading}
              className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
            >
              {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Search'}
            </button>

            {/* LIVE / DEMO Badge */}
            <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
              isLiveData
                ? 'bg-green-500/10 border-green-500/40 text-green-400'
                : 'bg-yellow-500/10 border-yellow-500/40 text-yellow-400'
            }`}>
              {isLiveData ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              {isLiveData ? 'LIVE' : 'DEMO'}
            </span>
          </div>

          {/* Timeframe buttons */}
          <div className="flex items-center gap-1">
            {timeframes.map(tf => (
              <button
                key={tf}
                onClick={() => setSelectedTimeframe(tf)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  selectedTimeframe === tf
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleRealTime}
              className={`px-3 py-1.5 rounded-lg text-sm flex items-center space-x-1 transition-colors ${
                isRealTime ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              {isRealTime ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isRealTime ? 'Live' : 'Paused'}</span>
            </button>
            <button onClick={() => setShowAlerts(!showAlerts)} className="p-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors">
              <Target className="w-4 h-4" />
            </button>
            <button onClick={resetChart} className="p-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors">
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Stock Info Bar ───────────────────────────────────────────────── */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-xl font-bold">{symbol}</h1>
              <p className="text-gray-400 text-xs">{exchange}</p>
            </div>

            {/* Trade + Watchlist buttons */}
            <div className="flex gap-2">
              <button onClick={() => setTradeType("BUY")}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-3 py-1.5 rounded-lg text-sm transition-colors">
                Buy
              </button>
              <button onClick={() => setTradeType("SELL")}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-3 py-1.5 rounded-lg text-sm transition-colors">
                Sell
              </button>
              <button
                onClick={() => add(symbol)}
                disabled={has(symbol)}
                className={`px-3 py-1.5 rounded-lg font-semibold text-sm transition-colors ${
                  has(symbol)
                    ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                    : "bg-cyan-600 hover:bg-cyan-700 text-white"
                }`}
              >
                {has(symbol) ? "★ Watchlist" : "+ Watchlist"}
              </button>
            </div>

            {/* Price display */}
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold font-mono">
                ${currentPrice?.toFixed(2) ?? '—'}
              </span>
              <span className={`flex items-center gap-1 text-sm font-semibold ${
                priceChange >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {priceChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}
                ({priceChangePercent.toFixed(2)}%)
              </span>
            </div>
          </div>

          {/* Chart type selector + screenshot */}
          <div className="flex items-center gap-2">
            {chartTypes.map(t => (
              <button
                key={t}
                onClick={() => setChartType(t)}
                className={`px-2.5 py-1 rounded text-xs font-medium capitalize transition-colors ${
                  chartType === t ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {t}
              </button>
            ))}
            <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
              <Camera className="w-4 h-4" />
            </button>
            <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Indicators bar ──────────────────────────────────────────────── */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex gap-2 flex-wrap">
        {(Object.keys(indicators) as IndicatorKey[]).map(ind => (
          <button
            key={ind}
            onClick={() => toggleIndicator(ind)}
            className={`px-2.5 py-0.5 rounded text-xs font-medium uppercase tracking-wide transition-colors ${
              indicators[ind]
                ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300'
                : 'bg-gray-700 text-gray-400 hover:text-gray-200 border border-transparent'
            }`}
          >
            {ind}
          </button>
        ))}
      </div>

      {/* ── Main chart ─────────────────────────────────────────────────── */}
      <div className="p-4">
        <div className="bg-gray-800 rounded-xl p-3 border border-gray-700">

          {/* Demo mode notice */}
          {!isLiveData && (
            <div className="flex items-center gap-2 mb-2 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-300 text-xs">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              Demo mode — showing simulated prices for {symbol}. Live data will load automatically when available.
            </div>
          )}

          {/* TradingView chart (primary) or SVG fallback */}
          <div className="bg-gray-900 rounded-lg overflow-hidden">
            {stockData.length > 0 ? (
              <TradingViewChart symbol={`${exchange}:${symbol}`} />
            ) : isLoading || !hasMounted ? (
              <div className="h-72 flex items-center justify-center text-gray-500">
                <RefreshCw className="w-6 h-6 animate-spin mr-2" />
                Loading chart data…
              </div>
            ) : (
              <CandlestickChart data={generateMockData(symbol)} />
            )}
          </div>

          {/* Volume sub-chart */}
          {indicators.volume && stockData.length > 0 && (
            <VolumeChart data={stockData} />
          )}

          {/* Forecast Panel */}
          <ForecastPanel forecast={forecastData} isLoading={isForecastLoading} />
        </div>
      </div>

      {/* ── Trade Modal ──────────────────────────────────────────────────── */}
      {tradeType && (
        <TradeModal
          open={!!tradeType}
          onClose={() => setTradeType(null)}
          type={tradeType}
          symbol={symbol}
          currentPrice={currentPrice}
        />
      )}
    </div>
  );
};

export default ChartArea;