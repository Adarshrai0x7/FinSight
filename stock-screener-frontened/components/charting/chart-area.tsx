"use client";

import { useEffect, useRef, useState } from "react";
import {
  Camera,
  TrendingUp,
  BarChart3,
  Settings,
  Maximize2,
} from "lucide-react";
import {
  createChart,
  CrosshairMode,
  IChartApi,
  ISeriesApi,
  Time,
} from "lightweight-charts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface RawStockData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  [key: string]: any;
}

interface CandlestickData {
  time: Time;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface VolumeData {
  time: Time;
  value: number;
  color: string;
}

export function ChartArea() {
  const [symbol, setSymbol] = useState("MSFT");
  const [stockData, setStockData] = useState<CandlestickData[]>([]);
  const [volumeData, setVolumeData] = useState<VolumeData[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState("1h");
  const [showVolume, setShowVolume] = useState(true);
  const [showIndicators, setShowIndicators] = useState(false);

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);

  const timeframes = ["1m", "30m", "1h", "1D", "1W", "1M"];

  const fetchChartData = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/stocks/chart/index/${symbol}`
      );
      const raw: RawStockData[] = await response.json();

      const candlesticks: CandlestickData[] = [];
      const volumes: VolumeData[] = [];
      const upColor = "#16a34a";
      const downColor = "#dc2626";

      raw.forEach((d) => {
        const time = (new Date(d.time).getTime() / 1000) as Time;
        candlesticks.push({
          time,
          open: d.open,
          high: d.high,
          low: d.low,
          close: d.close,
        });
        volumes.push({
          time,
          value: Math.floor(Math.random() * (2000000 - 1000000 + 1)) + 1000000,
          color: d.close >= d.open ? upColor : downColor,
        });
      });

      setStockData(candlesticks);
      setVolumeData(volumes);
    } catch (error) {
      console.error("Chart fetch error:", (error as Error).message);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, [symbol]);

  useEffect(() => {
    if (!chartContainerRef.current || stockData.length === 0) return;

   chartRef.current = createChart(chartContainerRef.current, {
  layout: {
    background: { color: "#0e0e0e" },
    textColor: "#d1d5db", // light gray
    fontSize: 12,
  },
  grid: {
    vertLines: { color: "#2d2d2d" },
    horzLines: { color: "#2d2d2d" },
  },
  crosshair: {
    mode: CrosshairMode.Normal,
  },
  timeScale: {
    borderColor: "#2d2d2d",
    timeVisible: true,
    secondsVisible: false,
  },
  rightPriceScale: {
    borderColor: "#2d2d2d",
    scaleMargins: {
      top: 0.1,
      bottom: 0.1,
    },
  },
  width: chartContainerRef.current.clientWidth,
  height: 500,
});

    const chart = chartRef.current;

    candleSeriesRef.current = chart.addCandlestickSeries({
      upColor: "#16a34a",
      downColor: "#dc2626",
      borderVisible: false,
      wickUpColor: "#16a34a",
      wickDownColor: "#dc2626",
    });
    candleSeriesRef.current.setData(stockData);

    if (showVolume) {
      volumeSeriesRef.current = chart.addHistogramSeries({
        priceFormat: { type: "volume" },
        priceScaleId: "volume_scale",
      });
      volumeSeriesRef.current.setData(volumeData);

      chart.priceScale("volume_scale").applyOptions({
        scaleMargins: { top: 0.7, bottom: 0 },
      });
    }

    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      chart.applyOptions({ width, height });
    });
    resizeObserver.observe(chartContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
      volumeSeriesRef.current = null;
    };
  }, [stockData, volumeData, showVolume]);

  const currentPrice = stockData[stockData.length - 1] || {};
  const priceChange =
    stockData.length > 1
      ? currentPrice.close - stockData[stockData.length - 2].close
      : 0;
  const priceChangePercent =
    stockData.length > 1
      ? ((priceChange / stockData[stockData.length - 2].close) * 100).toFixed(2)
      : "0.00";

  return (
    <div className="flex-1 p-4 space-y-4">
      {/* Symbol Input */}
      <div className="flex items-center gap-2 mb-2">
        <input
          type="text"
          placeholder="Enter Stock Symbol (e.g., MSFT)"
          defaultValue={symbol}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setSymbol(e.currentTarget.value.toUpperCase());
            }
          }}
          className="bg-gray-900 border border-gray-700 text-white text-sm px-3 py-2 rounded w-64"
        />
        <Button
          onClick={() => {
            const input = document.querySelector<HTMLInputElement>('input[type="text"]');
            if (input) setSymbol(input.value.toUpperCase());
          }}
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
            <div className={`flex items-center space-x-1 ${priceChange >= 0 ? "text-green-400" : "text-red-400"}`}>
              <TrendingUp className="h-4 w-4" />
              <span className="font-semibold text-sm">
                {priceChange >= 0 ? "+" : ""}
                {priceChange.toFixed(2)} ({priceChangePercent}%)
              </span>
            </div>
          </div>
        </div>
        <Button size="icon" className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/50">
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
                className={`px-2 py-1 text-xs ${selectedTimeframe === tf ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/50" : "text-gray-400 hover:text-gray-200"}`}
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
              className={`text-xs ${showVolume ? "text-cyan-400" : "text-gray-400"}`}
              onClick={() => setShowVolume(!showVolume)}
            >
              <BarChart3 className="h-4 w-4 mr-1" />
              Volume
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className={`text-xs ${showIndicators ? "text-cyan-400" : "text-gray-400"}`}
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

      {currentPrice.open && (
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Open", value: currentPrice.open, color: "text-gray-300" },
            { label: "High", value: currentPrice.high, color: "text-green-400" },
            { label: "Low", value: currentPrice.low, color: "text-red-400" },
            { label: "Close", value: currentPrice.close, color: "text-cyan-400" },
          ].map(
            (stat) =>
              stat.value && (
                <Card key={stat.label} className="bg-gray-800/30 border-gray-700/50">
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
        <CardContent className="p-0">
          <div ref={chartContainerRef} className="w-full h-[500px] rounded-md" />
        </CardContent>
      </Card>
    </div>
  );
}
