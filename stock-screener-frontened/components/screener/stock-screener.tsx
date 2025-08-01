"use client"

import { useState, useEffect } from "react"
import axios from "axios"
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

const BASE_URL = "http://127.0.0.1:8000" // FastAPI backend URL

const filterTemplates = [
  { id: 1, name: "Value Investing", description: "Low P/E, High Dividend Yield" },
  { id: 2, name: "Growth Stocks", description: "High Earnings Growth, Positive Sentiment" },
  { id: 3, name: "Momentum Setup", description: "RSI > 70, Volume Surge" },
]

export function StockScreener() {
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(true)
  const [activeFilterTab, setActiveFilterTab] = useState("fundamental")
  const [bookmarkedStocks, setBookmarkedStocks] = useState<string[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null)
  const [results, setResults] = useState<any[]>([])
  const [isFiltersApplied, setIsFiltersApplied] = useState(false)
  const [loading, setLoading] = useState(true)

  // Current filters state
  const [currentFilters, setCurrentFilters] = useState({
    peGt: 0,
    peLt: 30,
    roeGt: 10,
    marketCapGt: 1000,
  })

  // Initial load - fetch all stocks
  useEffect(() => {
    axios.get(`${BASE_URL}/stocks`)
      .then(response => {
        setResults(response.data)
        setLoading(false)
      })
      .catch(error => {
        console.error("Error fetching stocks:", error)
        setLoading(false)
      })
  }, [])

  // Toggle bookmark
  const toggleBookmark = (ticker: string) => {
    if (bookmarkedStocks.includes(ticker)) {
      setBookmarkedStocks(bookmarkedStocks.filter((stock) => stock !== ticker))
    } else {
      setBookmarkedStocks([...bookmarkedStocks, ticker])
    }
  }

  // Apply Filters -> Fetch from backend /screener
  const applyFilters = async () => {
    setLoading(true)
    try {
      const params = {
        pe_lt: currentFilters.peLt,
        pe_gt: currentFilters.peGt,
        roe_gt: currentFilters.roeGt / 100,          // convert % to decimal
        market_cap_gt: currentFilters.marketCapGt * 1e7 // convert Cr to approx USD
      }
      const response = await axios.get(`${BASE_URL}/screener`, { params })
      setResults(response.data)
      setIsFiltersApplied(true)
    } catch (error) {
      console.error("Error fetching filtered stocks:", error)
    } finally {
      setLoading(false)
    }
  }

  const exportResults = () => {
    const csvContent = [
      ["Symbol", "Name", "PE Ratio", "ROE", "Market Cap"],
      ...results.map(stock => [
        stock.symbol,
        stock.name,
        stock.pe_ratio ?? "",
        stock.roe ?? "",
        stock.market_cap ?? ""
      ])
    ].map(row => row.join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "stock_screener_results.csv")
    link.click()
  }

  const selectFilterTemplate = (templateId: number) => {
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
        {/* Filter Panel */}
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

              <FilterPanel
                activeTab={activeFilterTab}
                onFiltersChange={(filters) => setCurrentFilters(filters)}
              />

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
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="text-gray-400 text-center py-10">Loading stocks...</div>
            ) : (
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
