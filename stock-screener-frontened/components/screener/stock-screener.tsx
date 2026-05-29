"use client"

import { useState, useEffect } from "react"
import {
  Download, Filter, Save, ChevronLeft, ChevronRight,
  DollarSign, LineChart, Users, Info, RefreshCw, Search, AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { API_CONFIG } from "@/lib/api-config"
import { FilterPanel } from "./filter-panel"
import { ResultsTable } from "./results-table"

// ── Backend URL from centralized config ──────────────────────────────────────
const BASE_URL = `${API_CONFIG.STOCK_API}/api/stocks`

// ── Filter templates (from project1/screener/screener.py PREBUILT_SCREENS) ──
const filterTemplates = [
  {
    id: "value",
    name: "Value Investing",
    description: "Low P/E, low P/B, high ROE",
    icon: "💰",
    filters: { peGt: 0, peLt: 20, roeGt: 12, marketCapGt: 1000 },
    technical: { rsi: { enabled: false }, macd: { enabled: false }, movingAverages: { enabled: false }, volumeSurge: { enabled: false } },
    fundamental: {
      peRatio: { enabled: true, min: 1, max: 20 },
      marketCap: { enabled: true, size: "large" },
      debtEquity: { enabled: true, max: 1.0 },
    },
  },
  {
    id: "momentum",
    name: "Momentum Setup",
    description: "RSI 50–70, above SMA50, bullish MACD",
    icon: "🚀",
    filters: { peGt: 0, peLt: 60, roeGt: 0, marketCapGt: 500 },
    technical: {
      rsi: { enabled: true, condition: "above", value: 50 },
      macd: { enabled: true, crossover: "bullish" },
      movingAverages: { enabled: true, condition: "golden-cross" },
      volumeSurge: { enabled: true, percentage: 20 },
    },
    fundamental: { peRatio: { enabled: false }, marketCap: { enabled: false }, debtEquity: { enabled: false } },
  },
  {
    id: "growth",
    name: "Growth Stocks",
    description: "High earnings growth, strong margins",
    icon: "📈",
    filters: { peGt: 10, peLt: 50, roeGt: 15, marketCapGt: 2000 },
    technical: { rsi: { enabled: false }, macd: { enabled: false }, movingAverages: { enabled: false }, volumeSurge: { enabled: false } },
    fundamental: {
      peRatio: { enabled: true, min: 10, max: 50 },
      marketCap: { enabled: true, size: "large" },
      debtEquity: { enabled: true, max: 2.0 },
    },
  },
  {
    id: "dividend",
    name: "High Dividend",
    description: "Stable dividend payers, reasonable P/E",
    icon: "💵",
    filters: { peGt: 5, peLt: 25, roeGt: 8, marketCapGt: 1000 },
    technical: { rsi: { enabled: false }, macd: { enabled: false }, movingAverages: { enabled: false }, volumeSurge: { enabled: false } },
    fundamental: {
      peRatio: { enabled: true, min: 5, max: 25 },
      marketCap: { enabled: true, size: "large" },
      debtEquity: { enabled: false },
    },
  },
  {
    id: "deepvalue",
    name: "Deep Value",
    description: "Very low P/E, strong balance sheet",
    icon: "💎",
    filters: { peGt: 0, peLt: 12, roeGt: 10, marketCapGt: 2000 },
    technical: { rsi: { enabled: false }, macd: { enabled: false }, movingAverages: { enabled: false }, volumeSurge: { enabled: false } },
    fundamental: {
      peRatio: { enabled: true, min: 1, max: 12 },
      marketCap: { enabled: true, size: "large" },
      debtEquity: { enabled: true, max: 0.5 },
    },
  },
]

// ── Loading skeleton row ─────────────────────────────────────────────────────
const SkeletonRow = () => (
  <div className="flex gap-4 animate-pulse px-4 py-3 border-b border-gray-700/30">
    <div className="h-4 w-16 bg-gray-700 rounded" />
    <div className="h-4 w-32 bg-gray-700 rounded" />
    <div className="h-4 w-16 bg-gray-700 rounded ml-auto" />
    <div className="h-4 w-16 bg-gray-700 rounded" />
    <div className="h-4 w-16 bg-gray-700 rounded" />
    <div className="h-4 w-20 bg-gray-700 rounded" />
  </div>
)

export function StockScreener() {
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(true)
  const [activeFilterTab, setActiveFilterTab] = useState("fundamental")
  const [bookmarkedStocks, setBookmarkedStocks] = useState<string[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [results, setResults] = useState<any[]>([])
  const [isFiltersApplied, setIsFiltersApplied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Filter state that matches the Node.js API body format
  const [currentFilters, setCurrentFilters] = useState({
    peGt: 0, peLt: 30, roeGt: 10, marketCapGt: 1000,
  })
  const [technicalFilters, setTechnicalFilters] = useState({
    rsi: { enabled: false, condition: "above", value: 50 },
    macd: { enabled: false, crossover: "bullish" },
    movingAverages: { enabled: false, condition: "golden-cross" },
    volumeSurge: { enabled: false, percentage: 20 },
  })
  const [fundamentalFilters, setFundamentalFilters] = useState({
    peRatio: { enabled: true, min: 0, max: 30 },
    marketCap: { enabled: false, size: "large" },
    debtEquity: { enabled: false, max: 2.0 },
  })

  // Run screener against Node.js backend
  const runScreener = async () => {
    setLoading(true)
    setError(null)
    try {
      const body = {
        technical: {
          rsi: technicalFilters.rsi,
          macd: technicalFilters.macd,
          movingAverages: technicalFilters.movingAverages,
          volumeSurge: technicalFilters.volumeSurge,
        },
        fundamental: {
          peRatio: fundamentalFilters.peRatio,
          marketCap: fundamentalFilters.marketCap,
          debtEquity: fundamentalFilters.debtEquity,
        },
      }
      const response = await fetch(`${BASE_URL}/screen`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error ?? "Screener failed")
      setResults(data.results ?? [])
      setIsFiltersApplied(true)
    } catch (err: any) {
      setError(err.message ?? "Could not connect to screener. Make sure the backend is running.")
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  // Apply filter template
  const selectFilterTemplate = (templateId: string) => {
    const tmpl = filterTemplates.find(t => t.id === templateId)
    if (!tmpl) return
    if (selectedTemplate === templateId) {
      setSelectedTemplate(null)
      return
    }
    setSelectedTemplate(templateId)
    setCurrentFilters(tmpl.filters)

    setTechnicalFilters(prev => ({
      rsi: { ...prev.rsi, ...(tmpl.technical.rsi as any) },
      macd: { ...prev.macd, ...(tmpl.technical.macd as any) },
      movingAverages: { ...prev.movingAverages, ...(tmpl.technical.movingAverages as any) },
      volumeSurge: { ...prev.volumeSurge, ...(tmpl.technical.volumeSurge as any) },
    }))
    setFundamentalFilters(prev => ({
      peRatio: { ...prev.peRatio, ...(tmpl.fundamental.peRatio as any) },
      marketCap: { ...prev.marketCap, ...(tmpl.fundamental.marketCap as any) },
      debtEquity: { ...prev.debtEquity, ...(tmpl.fundamental.debtEquity as any) },
    }))
  }

  // CSV export using correct field names from Node.js API
  const exportResults = () => {
    if (results.length === 0) return
    const csvContent = [
      ["Symbol", "Price", "Change (%)", "RSI", "P/E Ratio", "Market Cap", "Debt/Equity"],
      ...results.map(s => [
        s.ticker ?? s.symbol ?? "",
        s.price ?? "",
        s.change ?? "",
        s.rsi ?? "",
        s.pe ?? "",
        s.marketCap ?? "",
        s.debtToEquity ?? "",
      ]),
    ].map(row => row.join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `finsight_screener_${new Date().toISOString().split("T")[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const toggleBookmark = (ticker: string) => {
    setBookmarkedStocks(prev =>
      prev.includes(ticker) ? prev.filter(s => s !== ticker) : [...prev, ticker]
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="p-6 border-b border-gray-700/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-100">Stock Screener</h1>
            <p className="text-gray-400 mt-1">Filter US stocks by technical & fundamental criteria</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline"
              className="border-gray-700/50 text-gray-300 hover:border-cyan-500/50 hover:text-cyan-400"
              onClick={exportResults} disabled={results.length === 0}>
              <Download className="h-4 w-4 mr-2" /> Export CSV
            </Button>
          </div>
        </div>

        {/* ── Filter Templates ──────────────────────────────────────────── */}
        <div className="mt-5">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wide">Quick Templates</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-gray-500 cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent className="bg-gray-800 border-gray-700 text-gray-200">
                  <p className="text-xs">Click to auto-populate filters</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex flex-wrap gap-2">
            {filterTemplates.map(template => (
              <button
                key={template.id}
                onClick={() => selectFilterTemplate(template.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${selectedTemplate === template.id
                    ? "bg-cyan-500/20 border-cyan-500/60 text-cyan-300 shadow-sm shadow-cyan-500/20"
                    : "bg-gray-800/40 border-gray-700/50 text-gray-300 hover:border-cyan-500/30 hover:text-cyan-400"
                  }`}
              >
                <span>{template.icon}</span>
                <span>{template.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Content ──────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Filter Panel */}
        <Collapsible
          open={isFilterPanelOpen} onOpenChange={setIsFilterPanelOpen}
          className="border-r border-gray-700/50 bg-gray-900/50 w-72 flex-shrink-0 transition-all duration-300"
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
            <h3 className="font-semibold text-cyan-400 text-sm">Filter Configuration</h3>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-cyan-400 p-1">
                {isFilterPanelOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent className="h-[calc(100%-53px)] overflow-y-auto">
            <div className="p-4">
              <Tabs value={activeFilterTab} onValueChange={setActiveFilterTab} className="w-full">
                <TabsList className="bg-gray-800/50 border border-gray-700/50 w-full grid grid-cols-3 mb-4">
                  <TabsTrigger value="technical" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 flex items-center gap-1 text-xs">
                    <LineChart className="h-3 w-3" /> Tech
                  </TabsTrigger>
                  <TabsTrigger value="fundamental" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 flex items-center gap-1 text-xs">
                    <DollarSign className="h-3 w-3" /> Fund
                  </TabsTrigger>
                  <TabsTrigger value="sentiment" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 flex items-center gap-1 text-xs">
                    <Users className="h-3 w-3" /> Sent
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <FilterPanel
                activeTab={activeFilterTab}
                onFiltersChange={(filters) => setCurrentFilters(filters)}
              />

              <Button
                className="w-full mt-6 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold"
                onClick={runScreener}
                disabled={loading}
              >
                {loading
                  ? <><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Scanning…</>
                  : <><Filter className="h-4 w-4 mr-2" /> Run Screener</>
                }
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Results Table */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-700/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-100">Results</h3>
              <Badge className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/50">
                {results.length} stocks
              </Badge>
              {isFiltersApplied && (
                <Badge className="bg-green-500/20 text-green-400 border border-green-500/50">
                  Filters Applied
                </Badge>
              )}
              {selectedTemplate && (
                <Badge className="bg-purple-500/20 text-purple-400 border border-purple-500/50">
                  {filterTemplates.find(t => t.id === selectedTemplate)?.name}
                </Badge>
              )}
            </div>
            <button onClick={runScreener} disabled={loading}
              className="text-xs text-gray-400 hover:text-cyan-400 flex items-center gap-1 transition-colors">
              <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} /> Refresh
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {/* Error state */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm mb-4">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                {error}
              </div>
            )}

            {/* Loading skeleton */}
            {loading && (
              <div className="space-y-1">
                {[...Array(6)].map((_, i) => <SkeletonRow key={i} />)}
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && isFiltersApplied && results.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                <Search className="h-10 w-10 mb-3 opacity-40" />
                <p className="font-medium text-gray-400">No stocks matched your criteria</p>
                <p className="text-sm mt-1">Try relaxing your filters or using a different template</p>
              </div>
            )}

            {/* Initial state — not yet run */}
            {!loading && !error && !isFiltersApplied && (
              <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                <Filter className="h-10 w-10 mb-3 opacity-40" />
                <p className="font-medium text-gray-400">Select a template or configure filters</p>
                <p className="text-sm mt-1">Then click <span className="text-cyan-400 font-medium">Run Screener</span> to scan stocks</p>
              </div>
            )}

            {/* Results */}
            {!loading && results.length > 0 && (
              <ResultsTable
                results={results}
                bookmarkedStocks={bookmarkedStocks}
                onToggleBookmark={toggleBookmark}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
