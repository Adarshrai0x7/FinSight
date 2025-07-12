"use client";
import dynamic from "next/dynamic";


const TradingViewChart = dynamic(() => import('@/components/TradingViewChart'), { ssr: false });


import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Settings,
  Maximize2,
  Volume2,
  Activity,
  Target,
  Layers,
  Eye,
  EyeOff,
  Plus,
  Minus,
  RotateCcw,
  Play,
  Pause,
  RefreshCw
} from 'lucide-react';

const ChartArea = () => {
  const [symbol, setSymbol] = useState('AAPL');
  type StockDataPoint = {
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  };
  const [stockData, setStockData] = useState<StockDataPoint[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [chartType, setChartType] = useState('candlestick');
  type IndicatorKey = 'sma' | 'ema' | 'rsi' | 'macd' | 'bollinger' | 'volume';
  const [indicators, setIndicators] = useState<{
    sma: boolean;
    ema: boolean;
    rsi: boolean;
    macd: boolean;
    bollinger: boolean;
    volume: boolean;
  }>({
    sma: false,
    ema: false,
    rsi: false,
    macd: false,
    bollinger: false,
    volume: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState(0);
  const [priceChangePercent, setPriceChangePercent] = useState(0);
  const [isRealTime, setIsRealTime] = useState(false);
  const [showDrawingTools, setShowDrawingTools] = useState(false);
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [alertPrice, setAlertPrice] = useState('');
  const [showAlerts, setShowAlerts] = useState(false);

  const chartRef = useRef(null);
  const timeframes = ['1m', '5m', '15m', '30m', '1h', '4h', '1D', '1W', '1M'];
  const chartTypes = ['candlestick', 'line', 'area', 'bars'];

  // Mock data generation for demo
  const generateMockData = () => {
    const data = [];
    const basePrice = 150;
    let price = basePrice;
    
    for (let i = 0; i < 100; i++) {
      const change = (Math.random() - 0.5) * 4;
      const open = price;
      const close = price + change;
      const high = Math.max(open, close) + Math.random() * 2;
      const low = Math.min(open, close) - Math.random() * 2;
      const volume = Math.floor(Math.random() * 1000000) + 500000;
      
      data.push({
        time: new Date(Date.now() - (100 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
        volume
      });
      
      price = close;
    }
    
    return data;
  };

 const fetchChartData = async () => {
  setIsLoading(true);
  try {
    const response = await fetch('http://localhost:5000/api/stocks/chart/AAPL');
    const data = await response.json();
    setStockData(data);

    if (data.length > 1) {
      const latest = data[data.length - 1];
      const previous = data[data.length - 2];
      setCurrentPrice(latest.close);
      const change = latest.close - previous.close;
      setPriceChange(change);
      setPriceChangePercent(((change / previous.close) * 100));
    }
  } catch (error) {
    console.error('Chart fetch error:', error);
  } finally {
    setIsLoading(false);
  }
};


  const toggleIndicator = (indicator: IndicatorKey) => {
    setIndicators(prev => ({
      ...prev,
      [indicator]: !prev[indicator]
    }));
  };

  const toggleRealTime = () => {
    setIsRealTime(!isRealTime);
  };

  const resetChart = () => {
    setIndicators({
      sma: false,
      ema: false,
      rsi: false,
      macd: false,
      bollinger: false,
      volume: true
    });
    setSelectedTimeframe('1D');
    setChartType('candlestick');
  };

  useEffect(() => {
    fetchChartData();
  }, [symbol, selectedTimeframe]);

  // Real-time price simulation
  useEffect(() => {
    if (!isRealTime) return;
    
    const interval = setInterval(() => {
      if (currentPrice) {
        const change = (Math.random() - 0.5) * 0.5;
        const newPrice = currentPrice + change;
        setCurrentPrice(newPrice);
        setPriceChange(prev => prev + change);
        setPriceChangePercent(((priceChange + change) / (currentPrice - priceChange)) * 100);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRealTime, currentPrice, priceChange]);

  const CandlestickChart = ({ data }: { data: StockDataPoint[] }) => {
    const maxPrice = Math.max(...data.map(d => d.high));
    const minPrice = Math.min(...data.map(d => d.low));
    const priceRange = maxPrice - minPrice;
    const chartHeight = 300;
    const chartWidth = 800;
    const candleWidth = chartWidth / data.length * 0.8;

    return (
      <svg width="100%" height={chartHeight} className="bg-gray-900">
        <defs>
          <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00ff88" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="#00ff88" stopOpacity="0.1"/>
          </linearGradient>
        </defs>
        
        {/* Grid lines */}
        {[...Array(10)].map((_, i) => (
          <line
            key={i}
            x1="0"
            y1={i * (chartHeight / 10)}
            x2="100%"
            y2={i * (chartHeight / 10)}
            stroke="#374151"
            strokeWidth="0.5"
            strokeDasharray="2,2"
          />
        ))}
        
        {/* Candlesticks */}
        {data.slice(-50).map((candle, i) => {
          const x = (i * chartWidth / 50) + (chartWidth / 50) * 0.1;
          const highY = ((maxPrice - candle.high) / priceRange) * chartHeight;
          const lowY = ((maxPrice - candle.low) / priceRange) * chartHeight;
          const openY = ((maxPrice - candle.open) / priceRange) * chartHeight;
          const closeY = ((maxPrice - candle.close) / priceRange) * chartHeight;
          
          const isGreen = candle.close > candle.open;
          const bodyTop = Math.min(openY, closeY);
          const bodyHeight = Math.abs(closeY - openY);
          
          return (
            <g key={i}>
              {/* Wick */}
              <line
                x1={x + candleWidth / 2}
                y1={highY}
                x2={x + candleWidth / 2}
                y2={lowY}
                stroke={isGreen ? "#00ff88" : "#ff4444"}
                strokeWidth="1"
              />
              
              {/* Body */}
              <rect
                x={x}
                y={bodyTop}
                width={candleWidth}
                height={Math.max(bodyHeight, 1)}
                fill={isGreen ? "#00ff88" : "#ff4444"}
                stroke={isGreen ? "#00ff88" : "#ff4444"}
                strokeWidth="1"
              />
            </g>
          );
        })}
        
        {/* Current price line */}
        {currentPrice && (
          <line
            x1="0"
            y1={((maxPrice - currentPrice) / priceRange) * chartHeight}
            x2="100%"
            y2={((maxPrice - currentPrice) / priceRange) * chartHeight}
            stroke="#fbbf24"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
        )}
      </svg>
    );
  };

  const VolumeChart = ({ data }: { data: StockDataPoint[] }) => {
    const maxVolume = Math.max(...data.map(d => d.volume));
    const chartHeight = 100;
    const chartWidth = 800;
    const barWidth = chartWidth / data.length * 0.8;

    return (
      <svg width="100%" height={chartHeight} className="bg-gray-800">
        {data.slice(-50).map((bar, i) => {
          const x = (i * chartWidth / 50) + (chartWidth / 50) * 0.1;
          const height = (bar.volume / maxVolume) * chartHeight;
          const y = chartHeight - height;
          
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={barWidth}
              height={height}
              fill="#06b6d4"
              opacity="0.7"
            />
          );
        })}
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search symbol..."
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              className="bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={fetchChartData}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Search'}
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleRealTime}
              className={`px-3 py-1 rounded-lg text-sm flex items-center space-x-1 ${
                isRealTime 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              {isRealTime ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isRealTime ? 'Live' : 'Paused'}</span>
            </button>
            
            <button
              onClick={() => setShowDrawingTools(!showDrawingTools)}
              className="p-2 bg-gray-600 hover:bg-gray-700 rounded-lg"
            >
              <Activity className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => setShowAlerts(!showAlerts)}
              className="p-2 bg-gray-600 hover:bg-gray-700 rounded-lg"
            >
              <Target className="w-4 h-4" />
            </button>
            
            <button
              onClick={resetChart}
              className="p-2 bg-gray-600 hover:bg-gray-700 rounded-lg"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stock Info */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div>
              <h1 className="text-2xl font-bold">{symbol}</h1>
              <p className="text-gray-400">NASDAQ</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold">
                ${currentPrice?.toFixed(2) || '0.00'}
              </div>
              <div className={`flex items-center space-x-2 ${
                priceChange >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {priceChange >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                <span className="font-semibold">
                  {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)} 
                  ({priceChangePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg">
              <Camera className="w-4 h-4" />
            </button>
            <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg">
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 border-r border-gray-700 p-4">
          {/* Timeframes */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-2 text-gray-400">TIMEFRAME</h3>
            <div className="grid grid-cols-3 gap-1">
              {timeframes.map((tf) => (
                <button
                  key={tf}
                  onClick={() => setSelectedTimeframe(tf)}
                  className={`px-2 py-1 text-xs rounded ${
                    selectedTimeframe === tf
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Chart Types */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-2 text-gray-400">CHART TYPE</h3>
            <div className="space-y-1">
              {chartTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setChartType(type)}
                  className={`w-full px-3 py-2 text-left text-sm rounded ${
                    chartType === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Indicators */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-2 text-gray-400">INDICATORS</h3>
            <div className="space-y-2">
              {Object.entries(indicators).map(([key, enabled]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">
                    {key.toUpperCase()}
                  </span>
                  <button
                    onClick={() => toggleIndicator(key as IndicatorKey)}
                    className={`p-1 rounded ${
                      enabled ? 'text-green-400' : 'text-gray-500'
                    }`}
                  >
                    {enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts */}
          {showAlerts && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-2 text-gray-400">PRICE ALERTS</h3>
              <div className="space-y-2">
                <input
                  type="number"
                  placeholder="Alert price"
                  value={alertPrice}
                  onChange={(e) => setAlertPrice(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 text-white px-2 py-1 rounded text-sm"
                />
                <button className="w-full bg-yellow-600 hover:bg-yellow-700 px-2 py-1 rounded text-sm">
                  Set Alert
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Main Chart Area */}
        <div className="flex-1 p-4">
          <div className="bg-gray-800 rounded-lg p-4">
            {/* Chart Controls */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <button className="p-1 bg-gray-700 hover:bg-gray-600 rounded">
                  <Plus className="w-4 h-4" />
                </button>
                <button className="p-1 bg-gray-700 hover:bg-gray-600 rounded">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-400">Zoom</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">
                  {stockData.length} bars
                </span>
                {isRealTime && (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-400">LIVE</span>
                  </div>
                )}
              </div>
            </div>

            {/* Main Chart */}
            <div className="bg-gray-900 rounded-lg p-4 mb-4">
              {stockData.length > 0 ? (
                <TradingViewChart symbol={`NASDAQ:${symbol}`} />


              ) : (
                <div className="h-80 flex items-center justify-center text-gray-500">
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <RefreshCw className="w-6 h-6 animate-spin" />
                      <span>Loading chart data...</span>
                    </div>
                  ) : (
                    <span>No data available</span>
                  )}
                </div>
              )}
            </div>

            {/* Volume Chart */}
            {indicators.volume && stockData.length > 0 && (
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-400">VOLUME</span>
                  <button
                    onClick={() => toggleIndicator('volume')}
                    className="text-gray-500 hover:text-gray-300"
                  >
                    <EyeOff className="w-4 h-4" />
                  </button>
                </div>
                <VolumeChart data={stockData} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartArea;