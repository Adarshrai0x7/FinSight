"use client"

import { useState } from "react"
import {
  Download,
  Filter,
  Save,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  BarChart3,
  LineChart,
  DollarSign,
  Users,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { FilterPanel } from "./filter-panel"
import { ResultsTable } from "./results-table"

// Sample filter templates
const filterTemplates = [
  { id: 1, name: "Oversold Stocks", description: "RSI < 30, High Volume" },
  { id: 2, name: "Bullish Crossover", description: "MACD Bullish, SMA 50/200 Cross" },
  { id: 3, name: "Value Investing", description: "Low P/E, High Dividend Yield" },
  { id: 4, name: "Growth Stocks", description: "High Earnings Growth, Positive Sentiment" },
  { id: 5, name: "Momentum Setup", description: "RSI > 70, Volume Surge, Positive News" },
]

// Sample results data
const sampleResults = [
  {
    ticker: "AAPL",
    name: "Apple Inc.",
    sector: "Technology",
    price: 187.42,
    change: 1.24,
    rsi: 62,
    pe: 28.5,
    sentiment: 78,
    recommendation: "Buy",
  },
  {
    ticker: "MSFT",
    name: "Microsoft Corporation",
    sector: "Technology",
    price: 415.32,
    change: 2.56,
    rsi: 65,
    pe: 32.1,
    sentiment: 82,
    recommendation: "Strong Buy",
  },
  {
    ticker: "GOOGL",
    name: "Alphabet Inc.",
    sector: "Technology",
    price: 142.89,
    change: -0.75,
    rsi: 48,
    pe: 24.3,
    sentiment: 65,
    recommendation: "Hold",
  },
  {
    ticker: "AMZN",
    name: "Amazon.com Inc.",
    sector: "Consumer Cyclical",
    price: 178.23,
    change: 1.05,
    rsi: 58,
    pe: 41.2,
    sentiment: 71,
    recommendation: "Buy",
  },
  {
    ticker: "TSLA",
    name: "Tesla, Inc.",
    sector: "Automotive",
    price: 248.42,
    change: -2.34,
    rsi: 42,
    pe: 68.5,
    sentiment: 62,
    recommendation: "Hold",
  },
  {
    ticker: "META",
    name: "Meta Platforms, Inc.",
    sector: "Technology",
    price: 472.18,
    change: 3.45,
    rsi: 72,
    pe: 26.8,
    sentiment: 74,
    recommendation: "Buy",
  },
  {
    ticker: "NVDA",
    name: "NVIDIA Corporation",
    sector: "Technology",
    price: 924.73,
    change: 5.67,
    rsi: 78,
    pe: 62.4,
    sentiment: 88,
    recommendation: "Strong Buy",
  },
  {
    ticker: "JPM",
    name: "JPMorgan Chase & Co.",
    sector: "Financial Services",
    price: 198.35,
    change: 0.87,
    rsi: 56,
    pe: 12.1,
    sentiment: 68,
    recommendation: "Buy",
  },
  {
    ticker: "JNJ",
    name: "Johnson & Johnson",
    sector: "Healthcare",
    price: 152.64,
    change: -0.32,
    rsi: 45,
    pe: 18.7,
    sentiment: 52,
    recommendation: "Hold",
  },
  {
    ticker: "V",
    name: "Visa Inc.",
    sector: "Financial Services",
    price: 275.89,
    change: 1.12,
    rsi: 61,
    pe: 30.2,
    sentiment: 73,
    recommendation: "Buy",
  },
]

export function StockScreener() {
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(true)
  const [activeFilterTab, setActiveFilterTab] = useState("technical")
  const [bookmarkedStocks, setBookmarkedStocks] = useState<string[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null)
  const [results, setResults] = useState(sampleResults)
  const [isFiltersApplied, setIsFiltersApplied] = useState(false)

  const toggleBookmark = (ticker: string) => {
    if (bookmarkedStocks.includes(ticker)) {
      setBookmarkedStocks(bookmarkedStocks.filter((stock) => stock !== ticker))
    } else {
      setBookmarkedStocks([...bookmarkedStocks, ticker])
    }
  }

  const applyFilters = () => {
    // In a real app, this would apply the actual filters
    // For now, we'll just set a flag to indicate filters were applied
    setIsFiltersApplied(true)
  }

  const exportResults = () => {
    // In a real app, this would export the results to CSV
    console.log("Exporting results...")
  }

  const selectFilterTemplate = (templateId: number) => {
    // In a real app, this would load the template's filters
    setSelectedTemplate(templateId === selectedTemplate ? null : templateId)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-700/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-100">Stock Screener</h1>
            <p className="text-gray-400 mt-1">Find stocks matching your custom criteria</p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="border-gray-700/50 text-gray-300 hover:border-cyan-500/50 hover:text-cyan-400"
              onClick={exportResults}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              variant="outline"
              className="border-gray-700/50 text-gray-300 hover:border-cyan-500/50 hover:text-cyan-400"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Filters
            </Button>
          </div>
        </div>

        {/* Filter Templates */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-cyan-400">Filter Templates</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-cyan-400">
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-gray-800 border-gray-700 text-gray-200">
                  <p className="text-sm">Click to apply a pre-configured filter set</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {filterTemplates.map((template) => (
              <Card
                key={template.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/10 ${
                  selectedTemplate === template.id
                    ? "bg-cyan-500/20 border-cyan-500/50"
                    : "bg-gray-800/30 border-gray-700/50 hover:border-cyan-500/30"
                }`}
                onClick={() => selectFilterTemplate(template.id)}
              >
                <CardContent className="p-4">
                  <div className="font-medium text-gray-100">{template.name}</div>
                  <p className="text-xs text-gray-400 mt-1">{template.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Filter Configuration Panel */}
        <Collapsible
          open={isFilterPanelOpen}
          onOpenChange={setIsFilterPanelOpen}
          className="border-r border-gray-700/50 bg-gray-900/50 w-80 flex-shrink-0 transition-all duration-300"
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
            <h3 className="font-semibold text-cyan-400">Filter Configuration</h3>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-cyan-400">
                {isFilterPanelOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent className="h-[calc(100%-53px)] overflow-y-auto">
            <div className="p-4">
              <Tabs value={activeFilterTab} onValueChange={setActiveFilterTab} className="w-full">
                <TabsList className="bg-gray-800/50 border border-gray-700/50 w-full grid grid-cols-3">
                  <TabsTrigger
                    value="technical"
                    className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 flex items-center gap-2"
                  >
                    <LineChart className="h-4 w-4" />
                    Technical
                  </TabsTrigger>
                  <TabsTrigger
                    value="fundamental"
                    className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 flex items-center gap-2"
                  >
                    <DollarSign className="h-4 w-4" />
                    Fundamental
                  </TabsTrigger>
                  <TabsTrigger
                    value="sentiment"
                    className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 flex items-center gap-2"
                  >
                    <Users className="h-4 w-4" />
                    Sentiment
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <FilterPanel activeTab={activeFilterTab} />

              <Button
                className="w-full mt-6 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/50"
                onClick={applyFilters}
              >
                <Filter className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Results Table */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-700/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-100">Results</h3>
              <Badge className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/50">{results.length} stocks</Badge>
              {isFiltersApplied && (
                <Badge className="bg-green-500/20 text-green-400 border border-green-500/50">Filters Applied</Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-cyan-400">
                <SlidersHorizontal className="h-4 w-4 mr-1" />
                Columns
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-cyan-400">
                <BarChart3 className="h-4 w-4 mr-1" />
                Sort
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <ResultsTable results={results} bookmarkedStocks={bookmarkedStocks} onToggleBookmark={toggleBookmark} />
          </div>
        </div>
      </div>
    </div>
  )
}
