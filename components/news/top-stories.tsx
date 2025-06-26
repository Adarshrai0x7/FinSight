"use client"

import { useState } from "react"
import { Search, Filter, Bookmark, BookmarkCheck, ExternalLink } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample news data with trending indicators
const newsData = [
  {
    id: 1,
    headline: "Fed Signals Potential Rate Cut in September Meeting",
    summary:
      "Federal Reserve officials indicated they are prepared to cut interest rates at their next meeting in September, citing progress in their fight against inflation.",
    source: "Bloomberg",
    category: "macroeconomics",
    timestamp: "2 hours ago",
    image: "/placeholder.svg?height=100&width=200",
    url: "#",
    isTrending: true,
    viewCount: 15420,
    trendingRank: 1,
  },
  {
    id: 2,
    headline: "NVIDIA Surpasses $3 Trillion Market Cap on AI Boom",
    summary:
      "NVIDIA's stock surged to new heights as demand for AI chips continues to outpace supply, making it the most valuable company in the world.",
    source: "Reuters",
    category: "technology",
    timestamp: "4 hours ago",
    image: "/placeholder.svg?height=100&width=200",
    url: "#",
    isTrending: true,
    viewCount: 12850,
    trendingRank: 2,
  },
  {
    id: 3,
    headline: "Treasury Yields Fall as Inflation Data Shows Cooling Trend",
    summary:
      "U.S. Treasury yields declined after the latest CPI report showed inflation continuing to moderate, reinforcing expectations for monetary policy easing.",
    source: "Financial Times",
    category: "bonds",
    timestamp: "6 hours ago",
    image: "/placeholder.svg?height=100&width=200",
    url: "#",
    isTrending: false,
    viewCount: 8920,
    trendingRank: null,
  },
  {
    id: 4,
    headline: "Apple Unveils New AI Features for iPhone 16 Series",
    summary:
      "Apple announced a suite of AI-powered features for its upcoming iPhone 16, positioning the company to compete in the growing AI smartphone market.",
    source: "TechCrunch",
    category: "technology",
    timestamp: "8 hours ago",
    image: "/placeholder.svg?height=100&width=200",
    url: "#",
    isTrending: true,
    viewCount: 11200,
    trendingRank: 3,
  },
  {
    id: 5,
    headline: "Oil Prices Surge Amid Middle East Tensions",
    summary:
      "Crude oil prices jumped 5% as geopolitical tensions in the Middle East raised concerns about potential supply disruptions in the region.",
    source: "CNBC",
    category: "commodities",
    timestamp: "10 hours ago",
    image: "/placeholder.svg?height=100&width=200",
    url: "#",
    isTrending: true,
    viewCount: 9750,
    trendingRank: 4,
  },
  {
    id: 6,
    headline: "Amazon Acquires Cybersecurity Firm for $3.5 Billion",
    summary:
      "Amazon announced the acquisition of a leading cybersecurity company to bolster its cloud security offerings amid rising cyber threats.",
    source: "Wall Street Journal",
    category: "technology",
    timestamp: "12 hours ago",
    image: "/placeholder.svg?height=100&width=200",
    url: "#",
    isTrending: false,
    viewCount: 7340,
    trendingRank: null,
  },
  {
    id: 7,
    headline: "European Markets Rally as ECB Cuts Interest Rates",
    summary:
      "European stocks climbed after the European Central Bank cut interest rates for the first time in four years, signaling confidence in the region's economic recovery.",
    source: "Bloomberg",
    category: "global markets",
    timestamp: "14 hours ago",
    image: "/placeholder.svg?height=100&width=200",
    url: "#",
    isTrending: true,
    viewCount: 6890,
    trendingRank: 5,
  },
  {
    id: 8,
    headline: "Bitcoin Surpasses $80,000 as Institutional Adoption Grows",
    summary:
      "Bitcoin reached a new all-time high above $80,000 as more institutional investors add the cryptocurrency to their portfolios.",
    source: "CoinDesk",
    category: "cryptocurrency",
    timestamp: "16 hours ago",
    image: "/placeholder.svg?height=100&width=200",
    url: "#",
    isTrending: true,
    viewCount: 14200,
    trendingRank: 6,
  },
  {
    id: 9,
    headline: "Tesla Announces New Battery Technology with 30% More Range",
    summary:
      "Tesla unveiled a breakthrough in battery technology that promises to increase vehicle range by 30% while reducing production costs.",
    source: "Electrek",
    category: "technology",
    timestamp: "18 hours ago",
    image: "/placeholder.svg?height=100&width=200",
    url: "#",
    isTrending: false,
    viewCount: 5620,
    trendingRank: null,
  },
  {
    id: 10,
    headline: "Housing Market Shows Signs of Cooling as Mortgage Rates Rise",
    summary:
      "The U.S. housing market is showing signs of slowing down as mortgage rates climb above 7%, reducing affordability for potential homebuyers.",
    source: "Moneycontrol",
    category: "real estate",
    timestamp: "20 hours ago",
    image: "/placeholder.svg?height=100&width=200",
    url: "#",
    isTrending: false,
    viewCount: 4850,
    trendingRank: null,
  },
  {
    id: 11,
    headline: "JPMorgan Chase Reports Record Quarterly Profit",
    summary:
      "JPMorgan Chase posted better-than-expected earnings, with record quarterly profits driven by strong performance in investment banking and trading.",
    source: "Reuters",
    category: "finance",
    timestamp: "22 hours ago",
    image: "/placeholder.svg?height=100&width=200",
    url: "#",
    isTrending: false,
    viewCount: 3920,
    trendingRank: null,
  },
  {
    id: 12,
    headline: "Gold Hits New Record High Amid Global Uncertainty",
    summary:
      "Gold prices reached a new all-time high as investors seek safe-haven assets amid economic uncertainty and geopolitical tensions.",
    source: "MarketWatch",
    category: "commodities",
    timestamp: "1 day ago",
    image: "/placeholder.svg?height=100&width=200",
    url: "#",
    isTrending: false,
    viewCount: 6120,
    trendingRank: null,
  },
]

const categories = [
  { value: "all", label: "All Categories" },
  { value: "technology", label: "Technology" },
  { value: "finance", label: "Finance" },
  { value: "macroeconomics", label: "Macroeconomics" },
  { value: "commodities", label: "Commodities" },
  { value: "cryptocurrency", label: "Cryptocurrency" },
  { value: "bonds", label: "Bonds" },
  { value: "global markets", label: "Global Markets" },
  { value: "real estate", label: "Real Estate" },
]

export function TopStories() {
  const [savedArticles, setSavedArticles] = useState<number[]>([])
  const [activeTab, setActiveTab] = useState("latest")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [expandedArticle, setExpandedArticle] = useState<number | null>(null)

  const toggleSave = (id: number) => {
    if (savedArticles.includes(id)) {
      setSavedArticles(savedArticles.filter((articleId) => articleId !== id))
    } else {
      setSavedArticles([...savedArticles, id])
    }
  }

  const toggleExpand = (id: number) => {
    if (expandedArticle === id) {
      setExpandedArticle(null)
    } else {
      setExpandedArticle(id)
    }
  }

  const filteredNews = newsData
    .filter((article) => {
      if (activeTab === "saved") {
        return savedArticles.includes(article.id)
      }
      if (activeTab === "trending") {
        return article.isTrending
      }
      if (selectedCategory !== "all") {
        return article.category === selectedCategory
      }
      return true
    })
    .sort((a, b) => {
      if (activeTab === "trending") {
        return (a.trendingRank || 999) - (b.trendingRank || 999)
      }
      return 0 // Keep original order for other tabs
    })

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-700/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-100">Top Market Stories</h1>
            <p className="text-gray-400 mt-1">Latest news and updates from the financial world</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search news..."
                className="pl-10 bg-gray-800/50 border-gray-700/50 text-gray-300 placeholder-gray-500 focus:border-cyan-500/50 focus:ring-cyan-500/20 w-full md:w-64"
              />
            </div>

            <Button
              variant="outline"
              className="border-gray-700/50 text-gray-300 hover:border-cyan-500/50 hover:text-cyan-400"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Tabs and Category Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mt-6 gap-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
            <TabsList className="bg-gray-800/50 border border-gray-700/50">
              <TabsTrigger
                value="latest"
                className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
              >
                Latest
              </TabsTrigger>
              <TabsTrigger
                value="trending"
                className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
              >
                Trending
              </TabsTrigger>
              <TabsTrigger
                value="saved"
                className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
              >
                Saved
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[200px] bg-gray-800/50 border-gray-700/50 text-gray-300">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* News Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.length > 0 ? (
            filteredNews.map((article) => (
              <Card
                key={article.id}
                className="bg-gray-800/30 border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 overflow-hidden"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={article.image || "/placeholder.svg"}
                    alt={article.headline}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className="bg-cyan-500/80 text-gray-100 border-none">{article.category}</Badge>
                    {article.isTrending && (
                      <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-none animate-pulse">
                        🔥 Trending #{article.trendingRank}
                      </Badge>
                    )}
                  </div>
                  {activeTab === "trending" && article.viewCount && (
                    <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                      {article.viewCount.toLocaleString()} views
                    </div>
                  )}
                </div>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="text-sm text-cyan-400">{article.source}</span>
                      <span className="mx-2 text-gray-500">•</span>
                      <span className="text-xs text-gray-400">{article.timestamp}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-cyan-400"
                      onClick={() => toggleSave(article.id)}
                    >
                      {savedArticles.includes(article.id) ? (
                        <BookmarkCheck className="h-5 w-5 text-cyan-400" />
                      ) : (
                        <Bookmark className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                  <h3 className="text-xl font-bold text-gray-100 mb-2 line-clamp-2 flex items-start gap-2">
                    {article.isTrending && activeTab !== "trending" && (
                      <span className="text-orange-400 text-sm mt-1">🔥</span>
                    )}
                    {article.headline}
                  </h3>
                  <p className={`text-sm text-gray-400 ${expandedArticle === article.id ? "" : "line-clamp-2"}`}>
                    {article.summary}
                  </p>
                </CardContent>
                <CardFooter className="px-5 py-4 border-t border-gray-700/50 flex justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-cyan-400 hover:text-cyan-300 p-0"
                    onClick={() => toggleExpand(article.id)}
                  >
                    {expandedArticle === article.id ? "Show Less" : "Read More"}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-cyan-400" asChild>
                    <a href={article.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Full Article
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
              <div className="text-cyan-400 text-6xl mb-4">
                {activeTab === "trending" ? "🔥" : activeTab === "saved" ? "🔖" : "📰"}
              </div>
              <h3 className="text-xl font-bold text-gray-100 mb-2">
                {activeTab === "trending" ? "No trending stories" : "No articles found"}
              </h3>
              <p className="text-gray-400">
                {activeTab === "saved"
                  ? "You haven't saved any articles yet."
                  : activeTab === "trending"
                    ? "No stories are trending right now."
                    : "No articles match your current filter."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
