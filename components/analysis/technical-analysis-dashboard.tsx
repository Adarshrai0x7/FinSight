"use client"

import { useState } from "react"
import { Maximize2, Save, Download, Settings, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { TechnicalChart } from "./technical-chart"
import { IndicatorSettings } from "./indicator-settings"
import { AnalysisSummary } from "./analysis-summary"

const presetConfigurations = [
  { name: "Day Trading", description: "Short-term indicators optimized for intraday trading" },
  { name: "Swing Trading", description: "Medium-term indicators for multi-day positions" },
  { name: "Long-Term Investing", description: "Long-term trend and fundamental indicators" },
  { name: "Momentum Trading", description: "Indicators focused on price momentum and volume" },
  { name: "Reversal Strategy", description: "Indicators to identify potential trend reversals" },
]

const stockSymbols = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "MSFT", name: "Microsoft Corporation" },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "AMZN", name: "Amazon.com Inc." },
  { symbol: "TSLA", name: "Tesla Inc." },
]

export function TechnicalAnalysisDashboard() {
  const [selectedPreset, setSelectedPreset] = useState("Day Trading")
  const [isIndicatorPanelOpen, setIsIndicatorPanelOpen] = useState(true)
  const [selectedStock, setSelectedStock] = useState("AAPL")
  const [compareStock, setCompareStock] = useState("")
  const [timeframe, setTimeframe] = useState("1D")

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-700/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-100">Technical Analysis Dashboard</h1>
            <p className="text-gray-400 mt-1">Advanced technical indicators and pattern recognition</p>
          </div>

          <div className="flex items-center gap-3">
            <Select value={selectedStock} onValueChange={setSelectedStock}>
              <SelectTrigger className="w-[180px] bg-gray-800/50 border-gray-700/50 text-gray-200">
                <SelectValue placeholder="Select Stock" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                {stockSymbols.map((stock) => (
                  <SelectItem key={stock.symbol} value={stock.symbol}>
                    {stock.symbol} - {stock.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              className="border-gray-700/50 text-gray-300 hover:border-cyan-500/50 hover:text-cyan-400"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>

            <Button
              variant="outline"
              className="border-gray-700/50 text-gray-300 hover:border-cyan-500/50 hover:text-cyan-400"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Preset Configurations */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-cyan-400">Preset Configurations</h3>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-cyan-400">
              <Settings className="h-4 w-4 mr-2" />
              Manage Presets
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {presetConfigurations.map((preset) => (
              <Card
                key={preset.name}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/10 ${
                  selectedPreset === preset.name
                    ? "bg-cyan-500/20 border-cyan-500/50"
                    : "bg-gray-800/30 border-gray-700/50 hover:border-cyan-500/30"
                }`}
                onClick={() => setSelectedPreset(preset.name)}
              >
                <CardContent className="p-4">
                  <div className="font-medium text-gray-100">{preset.name}</div>
                  <p className="text-xs text-gray-400 mt-1">{preset.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Timeframe Selection */}
        <div className="flex items-center space-x-2 mt-4">
          <div className="flex items-center space-x-1 bg-gray-800/50 rounded-lg p-1">
            {["1H", "4H", "1D", "1W", "1M"].map((tf) => (
              <Button
                key={tf}
                size="sm"
                variant={timeframe === tf ? "default" : "ghost"}
                className={`px-3 py-1 text-xs ${
                  timeframe === tf
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/50"
                    : "text-gray-400 hover:text-gray-200"
                }`}
                onClick={() => setTimeframe(tf)}
              >
                {tf}
              </Button>
            ))}
          </div>

          <Select value={compareStock} onValueChange={setCompareStock}>
            <SelectTrigger className="w-[200px] bg-gray-800/50 border-gray-700/50 text-gray-300">
              <SelectValue placeholder="Compare with..." />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
              <SelectItem value="none">None</SelectItem>
              {stockSymbols
                .filter((stock) => stock.symbol !== selectedStock)
                .map((stock) => (
                  <SelectItem key={stock.symbol} value={stock.symbol}>
                    {stock.symbol} - {stock.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Indicator Settings Panel */}
        <Collapsible
          open={isIndicatorPanelOpen}
          onOpenChange={setIsIndicatorPanelOpen}
          className="border-r border-gray-700/50 bg-gray-900/50 w-80 flex-shrink-0 transition-all duration-300"
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
            <h3 className="font-semibold text-cyan-400">Indicator Settings</h3>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-cyan-400">
                {isIndicatorPanelOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent className="h-[calc(100%-53px)] overflow-y-auto">
            <IndicatorSettings preset={selectedPreset} />
          </CollapsibleContent>
        </Collapsible>

        {/* Chart and Analysis Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Chart Area */}
          <div className="flex-1 p-4 min-h-[500px]">
            <Card className="bg-gray-800/30 border-gray-700/50 h-full">
              <CardHeader className="p-4 pb-0 flex items-center justify-between">
                <div className="flex items-center">
                  <CardTitle className="text-xl text-gray-100">
                    {selectedStock} {compareStock && `vs ${compareStock}`}
                  </CardTitle>
                  <Badge className="ml-3 bg-cyan-500/20 text-cyan-400 border border-cyan-500/50">{timeframe}</Badge>
                </div>
                <Button size="sm" variant="ghost" className="text-gray-400">
                  <Maximize2 className="h-4 w-4 mr-1" />
                  Fullscreen
                </Button>
              </CardHeader>
              <CardContent className="p-4 h-[calc(100%-60px)]">
                <TechnicalChart symbol={selectedStock} compareSymbol={compareStock} timeframe={timeframe} />
              </CardContent>
            </Card>
          </div>

          {/* Analysis Summary */}
          <div className="p-4 border-t border-gray-700/50">
            <AnalysisSummary symbol={selectedStock} />
          </div>
        </div>
      </div>
    </div>
  )
}
