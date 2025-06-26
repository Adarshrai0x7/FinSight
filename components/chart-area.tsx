"use client"

import { useState } from "react"
import { Camera, TrendingUp, BarChart3, Settings, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"

const timeframes = ["1m", "30m", "1h", "1D", "1W", "1M"]

const stockData = [
  { time: "09:30", open: 415, high: 418, low: 414, close: 417, volume: 1200000 },
  { time: "10:00", open: 417, high: 422, low: 416, close: 420, volume: 1500000 },
  { time: "10:30", open: 420, high: 425, low: 419, close: 423, volume: 1800000 },
  { time: "11:00", open: 423, high: 426, low: 421, close: 424, volume: 1300000 },
  { time: "11:30", open: 424, high: 427, low: 422, close: 425, volume: 1600000 },
  { time: "12:00", open: 425, high: 428, low: 423, close: 426, volume: 1400000 },
  { time: "12:30", open: 426, high: 429, low: 424, close: 427, volume: 1700000 },
  { time: "13:00", open: 427, high: 430, low: 425, close: 428, volume: 1900000 },
  { time: "13:30", open: 428, high: 431, low: 426, close: 429, volume: 1550000 },
  { time: "14:00", open: 429, high: 432, low: 427, close: 430, volume: 1650000 },
  { time: "14:30", open: 430, high: 433, low: 428, close: 431, volume: 1750000 },
  { time: "15:00", open: 431, high: 434, low: 429, close: 432, volume: 1850000 },
]

const volumeData = stockData.map((item) => ({
  time: item.time,
  volume: item.volume / 1000000,
}))

export function ChartArea() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("1h")
  const [showVolume, setShowVolume] = useState(true)
  const [showIndicators, setShowIndicators] = useState(false)

  const currentPrice = stockData[stockData.length - 1]
  const priceChange = currentPrice.close - stockData[0].open
  const priceChangePercent = ((priceChange / stockData[0].open) * 100).toFixed(2)

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Stock Header - Fixed */}
      <div className="flex-shrink-0 p-4 border-b border-gray-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-100">MSFT</h1>
              <p className="text-gray-400">Microsoft Corporation</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold text-gray-100">${currentPrice.close.toFixed(2)}</div>
              <div className={`flex items-center space-x-1 ${priceChange >= 0 ? "text-green-400" : "text-red-400"}`}>
                <TrendingUp className="h-4 w-4" />
                <span className="font-semibold">
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
      </div>

      {/* Charts Container - Flexible */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Main Chart */}
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

        {/* Volume Chart */}
        {showVolume && (
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
