"use client"

import { useState, useEffect, useCallback } from "react"
import { Camera, TrendingUp, TrendingDown, BarChart3, Settings, Maximize2, RefreshCw, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"
import { API_CONFIG } from "@/lib/api-config"

const timeframes = ["1m", "30m", "1h", "1D", "1W", "1M"]

type StockDataPoint = {
  time: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

// ── Generate mock data as fallback when backend is unavailable ───────────────
const generateMockData = (symbol: string): StockDataPoint[] => {
  const basePrice = 100 + (symbol.charCodeAt(0) * 3) // deterministic from symbol
  const data: StockDataPoint[] = []
  let price = basePrice

  for (let i = 0; i < 12; i++) {
    const hour = 9 + Math.floor(i / 2)
    const minute = (i % 2) * 30
    const change = (Math.random() - 0.45) * 3
    const open = price
    const close = Math.max(price + change, 1)
    const high = Math.max(open, close) + Math.random() * 2
    const low = Math.min(open, close) - Math.random() * 2
    const volume = Math.floor(Math.random() * 1_000_000) + 1_000_000

    data.push({
      time: `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume,
    })
    price = close
  }
  return data
}

export function ChartArea({ symbol: propSymbol = "AAPL" }: { symbol?: string }) {
  const [symbol, setSymbol] = useState(propSymbol)
  const [selectedTimeframe, setSelectedTimeframe] = useState("1h")
  const [showVolume, setShowVolume] = useState(true)
  const [showIndicators, setShowIndicators] = useState(false)
  const [stockData, setStockData] = useState<StockDataPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLiveData, setIsLiveData] = useState(false)
  const [companyName, setCompanyName] = useState("")

  // ── Fetch chart data from backend, fall back to mock ────────────────────
  const fetchChartData = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_CONFIG.STOCK_API}/api/stocks/chart/${symbol}`)
      const data = await response.json()

      if (Array.isArray(data) && data.length > 1) {
        const formatted = data.map((d: any) => ({
          time: d.time ?? d.date ?? "",
          open: d.open,
          high: d.high,
          low: d.low,
          close: d.close,
          volume: d.volume,
        }))
        setStockData(formatted)
        setIsLiveData(true)
      } else {
        throw new Error(data?.error ?? "Empty response")
      }
    } catch (err) {
      console.warn("Live data unavailable, using demo data:", err)
      setStockData(generateMockData(symbol))
      setIsLiveData(false)
    } finally {
      setIsLoading(false)
    }
  }, [symbol])

  // Fetch company info
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await fetch(`${API_CONFIG.STOCK_API}/api/stocks/quote/${symbol}`)
        const data = await res.json()
        if (data?.name) setCompanyName(data.name)
        else setCompanyName(symbol)
      } catch {
        setCompanyName(symbol)
      }
    }
    fetchInfo()
    fetchChartData()
  }, [symbol, selectedTimeframe, fetchChartData])

  // Sync with prop changes
  useEffect(() => {
    if (propSymbol !== symbol) setSymbol(propSymbol)
  }, [propSymbol])

  const currentPrice = stockData.length > 0 ? stockData[stockData.length - 1] : null
  const firstPrice = stockData.length > 0 ? stockData[0] : null
  const priceChange = currentPrice && firstPrice ? currentPrice.close - firstPrice.open : 0
  const priceChangePercent = firstPrice && firstPrice.open !== 0
    ? ((priceChange / firstPrice.open) * 100).toFixed(2)
    : "0.00"

  const volumeData = stockData.map((item) => ({
    time: item.time,
    volume: item.volume / 1_000_000,
  }))

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Stock Header - Fixed */}
      <div className="flex-shrink-0 p-4 border-b border-gray-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-100">{symbol}</h1>
              <p className="text-gray-400">{companyName || symbol}</p>
            </div>
            <div className="flex items-center space-x-4">
              {isLoading ? (
                <div className="h-8 w-24 bg-gray-700 rounded animate-pulse" />
              ) : currentPrice ? (
                <>
                  <div className="text-2xl font-bold text-gray-100">${currentPrice.close.toFixed(2)}</div>
                  <div className={`flex items-center space-x-1 ${priceChange >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {priceChange >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    <span className="font-semibold">
                      {priceChange >= 0 ? "+" : ""}
                      {priceChange.toFixed(2)} ({priceChangePercent}%)
                    </span>
                  </div>
                </>
              ) : (
                <span className="text-gray-500">—</span>
              )}
            </div>

            {/* LIVE / DEMO Badge */}
            {!isLoading && (
              <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                isLiveData
                  ? "bg-green-500/10 border-green-500/40 text-green-400"
                  : "bg-yellow-500/10 border-yellow-500/40 text-yellow-400"
              }`}>
                {isLiveData ? "LIVE" : "DEMO"}
              </span>
            )}
          </div>

          <Button size="icon" className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/50">
            <Camera className="h-4 w-4" />
          </Button>
        </div>

        {/* Chart Controls */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 bg-gray-800/50 rounded-lg p-1">
              {timeframes.map((tf) => (
                <Button
                  key={tf}
                  size="sm"
                  variant={selectedTimeframe === tf ? "default" : "ghost"}
                  className={`px-3 py-1 text-xs ${
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

        {/* Price Stats */}
        {currentPrice && (
          <div className="grid grid-cols-4 gap-4 mt-4">
            {[
              { label: "Open", value: currentPrice.open, color: "text-gray-300" },
              { label: "High", value: currentPrice.high, color: "text-green-400" },
              { label: "Low", value: currentPrice.low, color: "text-red-400" },
              { label: "Close", value: currentPrice.close, color: "text-cyan-400" },
            ].map((stat) => (
              <Card key={stat.label} className="bg-gray-800/30 border-gray-700/50">
                <CardContent className="p-3">
                  <div className="text-sm text-gray-400">{stat.label}</div>
                  <div className={`text-lg font-semibold ${stat.color}`}>${stat.value.toFixed(2)}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Demo mode notice */}
        {!isLiveData && !isLoading && (
          <div className="flex items-center gap-2 mt-3 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-300 text-xs">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            Demo mode — showing simulated prices for {symbol}. Live data will load automatically when available.
          </div>
        )}
      </div>

      {/* Charts Container - Flexible */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Loading */}
        {isLoading && (
          <Card className="bg-gray-800/30 border-gray-700/50">
            <CardContent className="p-6">
              <div className="h-[60vh] min-h-[400px] w-full flex items-center justify-center text-gray-500">
                <RefreshCw className="w-6 h-6 animate-spin mr-2" />
                Loading chart data…
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Chart */}
        {!isLoading && stockData.length > 0 && (
          <Card className="bg-gray-800/30 border-gray-700/50">
            <CardContent className="p-6">
              <div className="h-[60vh] min-h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={stockData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
                    <YAxis stroke="#9CA3AF" fontSize={12} domain={["dataMin - 2", "dataMax + 2"]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#F3F4F6",
                      }}
                    />
                    <Line type="monotone" dataKey="close" stroke="#06B6D4" strokeWidth={2} dot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Volume Chart */}
        {!isLoading && showVolume && stockData.length > 0 && (
          <Card className="bg-gray-800/30 border-gray-700/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-cyan-400 text-lg">Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-32 w-full">
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
    </div>
  )
}
