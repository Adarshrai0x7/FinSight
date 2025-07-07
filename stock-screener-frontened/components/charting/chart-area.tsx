"use client";

import { useState, useEffect } from "react";
import {
  Camera,
  TrendingUp,
  BarChart3,
  Settings,
  Maximize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const timeframes = ["1m", "30m", "1h", "1D", "1W", "1M"];

export function ChartArea() {
  const [symbol, setSymbol] = useState("MSFT");
  const [stockData, setStockData] = useState([]);
  const [volumeData, setVolumeData] = useState([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState("1h");
  const [showVolume, setShowVolume] = useState(true);
  const [showIndicators, setShowIndicators] = useState(false);

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/stocks/chart/index/${symbol}`
      );
      const raw = await response.json();

      const formatted = raw.map((d) => ({
        time: new Date(d.date).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        }),
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
        volume:
          Math.floor(Math.random() * (2000000 - 1000000 + 1)) + 1000000,
      }));

      setStockData(formatted);
      setVolumeData(
        formatted.map((item) => ({
          time: item.time,
          volume: item.volume / 1000000,
        }))
      );
    } catch (error) {
      console.error("Chart fetch error:", error.message);
    }
  };

  const currentPrice = stockData[stockData.length - 1] || {};
  const priceChange =
    stockData.length > 0
      ? currentPrice.close - stockData[0].open
      : 0;
  const priceChangePercent =
    stockData.length > 0
      ? ((priceChange / stockData[0].open) * 100).toFixed(2)
      : "0.00";

  return (
    <div className="flex-1 p-4 space-y-4">
      {/* Symbol Input */}
      <div className="flex items-center gap-2 mb-2">
        <input
          type="text"
          placeholder="Enter Stock Symbol (e.g., MSFT)"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          className="bg-gray-900 border border-gray-700 text-white text-sm px-3 py-2 rounded w-64"
        />
        <Button
          onClick={fetchChartData}
          className="bg-cyan-600 text-white hover:bg-cyan-700 text-sm px-4 py-2 rounded"
        >
          Search
        </Button>
      </div>

      {/* Stock Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-100">{symbol}</h1>
            <p className="text-gray-400 text-sm">Stock Chart</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-xl font-bold text-gray-100">
              ${currentPrice.close?.toFixed(2)}
            </div>
            <div
              className={`flex items-center space-x-1 ${
                priceChange >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              <span className="font-semibold text-sm">
                {priceChange >= 0 ? "+" : ""}
                {priceChange.toFixed(2)} ({priceChangePercent}%)
              </span>
            </div>
          </div>
        </div>

        <Button
          size="icon"
          className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/50"
        >
          <Camera className="h-4 w-4" />
        </Button>
      </div>

      {/* Chart Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-gray-800/50 rounded-lg p-1">
            {timeframes.map((tf) => (
              <Button
                key={tf}
                size="sm"
                variant={selectedTimeframe === tf ? "default" : "ghost"}
                className={`px-2 py-1 text-xs ${
                  selectedTimeframe === tf
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/50"
                    : "text-gray-400 hover:text-gray-200"
                }`}
                onClick={() => setSelectedTimeframe(tf)}
              >
                {tf}
              </Button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="ghost"
              className={`text-xs ${
                showVolume ? "text-cyan-400" : "text-gray-400"
              }`}
              onClick={() => setShowVolume(!showVolume)}
            >
              <BarChart3 className="h-4 w-4 mr-1" />
              Volume
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className={`text-xs ${
                showIndicators ? "text-cyan-400" : "text-gray-400"
              }`}
              onClick={() => setShowIndicators(!showIndicators)}
            >
              <Settings className="h-4 w-4 mr-1" />
              Indicators
            </Button>
          </div>
        </div>

        <Button size="sm" variant="ghost" className="text-gray-400">
          <Maximize2 className="h-4 w-4 mr-1" />
          Fullscreen
        </Button>
      </div>

      {/* Price Stats */}
      {currentPrice && (
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Open", value: currentPrice.open, color: "text-gray-300" },
            { label: "High", value: currentPrice.high, color: "text-green-400" },
            { label: "Low", value: currentPrice.low, color: "text-red-400" },
            { label: "Close", value: currentPrice.close, color: "text-cyan-400" },
          ].map(
            (stat) =>
              stat.value && (
                <Card
                  key={stat.label}
                  className="bg-gray-800/30 border-gray-700/50"
                >
                  <CardContent className="p-2">
                    <div className="text-xs text-gray-400">{stat.label}</div>
                    <div className={`text-sm font-semibold ${stat.color}`}>
                      ${stat.value.toFixed(2)}
                    </div>
                  </CardContent>
                </Card>
              )
          )}
        </div>
      )}

      {/* Main Chart */}
      <Card className="bg-gray-800/30 border-gray-700/50">
        <CardContent className="p-4">
          <div className="h-[500px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={stockData}>
                <defs>
                  <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
                <YAxis
                  stroke="#9CA3AF"
                  fontSize={12}
                  domain={["dataMin - 2", "dataMax + 2"]}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  cursor={{ stroke: "#64748b", strokeDasharray: "3 3" }}
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #334155",
                    borderRadius: "10px",
                    padding: "10px",
                  }}
                  labelStyle={{ color: "#94a3b8" }}
                  itemStyle={{ color: "#f1f5f9" }}
                />
                <Line
                  type="monotone"
                  dataKey="close"
                  stroke="#06B6D4"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={true}
                  animationDuration={800}
                  fillOpacity={1}
                  fill="url(#colorClose)"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Volume Chart */}
      {showVolume && (
        <Card className="bg-gray-800/30 border-gray-700/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-cyan-400 text-base">Volume</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={volumeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#F3F4F6",
                    }}
                    formatter={(value) => [`${value}M`, "Volume"]}
                  />
                  <Bar dataKey="volume" fill="#06B6D4" opacity={0.7} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
