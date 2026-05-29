"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Bookmark, BookmarkCheck, ExternalLink, RefreshCw } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { API_CONFIG } from "@/lib/api-config"

// ── News article type ────────────────────────────────────────────────────────
type NewsArticle = {
  id: number
  headline: string
  summary: string
  source: string
  category: string
  timestamp: string
  image: string
  url: string
  isTrending: boolean
  viewCount: number
  trendingRank: number | null
  datetime?: number
}

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

// ── Loading skeleton ─────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <Card className="bg-gray-800/30 border-gray-700/50 overflow-hidden animate-pulse">
    <div className="h-40 bg-gray-700/40" />
    <CardContent className="p-5 space-y-3">
      <div className="flex items-center gap-2">
        <div className="h-3 w-20 bg-gray-700 rounded" />
        <div className="h-3 w-16 bg-gray-700/60 rounded" />
      </div>
      <div className="h-5 w-full bg-gray-700 rounded" />
      <div className="h-4 w-3/4 bg-gray-700/60 rounded" />
    </CardContent>
  </Card>
)

export function TopStories() {
  const [savedArticles, setSavedArticles] = useState<number[]>([])
  const [activeTab, setActiveTab] = useState("latest")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [expandedArticle, setExpandedArticle] = useState<number | null>(null)
  const [newsData, setNewsData] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ── Fetch news from backend ─────────────────────────────────────────────
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true)
      setError(null)
      try {
        const endpoint =
          activeTab === "trending" ? "/api/news/trending" : "/api/news/latest"
        const res = await fetch(`${API_CONFIG.STOCK_API}${endpoint}`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()

        // Normalize backend response to our NewsArticle shape
        const articles: NewsArticle[] = (Array.isArray(data) ? data : []).map(
          (item: any, index: number) => ({
            id: item.id ?? index,
            headline: item.headline ?? "Untitled",
            summary: item.summary ?? "",
            source: item.source ?? "Unknown",
            category: item.category ?? "general",
            timestamp: item.datetime
              ? new Date(item.datetime * 1000).toLocaleString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })
              : item.timestamp ?? "",
            image: item.image || "/placeholder.svg?height=100&width=200",
            url: item.url ?? "#",
            isTrending: item.isTrending ?? activeTab === "trending",
            viewCount: item.viewCount ?? 0,
            trendingRank: item.trendingRank ?? (activeTab === "trending" ? index + 1 : null),
          })
        )

        setNewsData(articles)
      } catch (err: any) {
        console.error("Error fetching news:", err)
        setError("Could not load news. Make sure the backend is running.")
        setNewsData([])
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [activeTab])

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
        {/* Loading state */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-gray-100 mb-2">Failed to load news</h3>
            <p className="text-gray-400">{error}</p>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
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
                    {activeTab === "trending" && article.viewCount > 0 && (
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
        )}
      </div>
    </div>
  )
}
