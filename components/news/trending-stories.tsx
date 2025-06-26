"use client"

import { useState } from "react"
import { Search, ExternalLink, TrendingUp, Clock, Flame, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample trending stories data
const trendingData = [
  {
    id: 1,
    title: "Fed Signals Potential Rate Cut as Inflation Shows Signs of Cooling",
    summary:
      "Federal Reserve officials hint at September rate reduction following latest CPI data showing continued moderation in price pressures.",
    source: "Bloomberg",
    timestamp: "2 hours ago",
    companyLogo: "🏛️",
    category: "macro",
    isBreaking: true,
    isTrending: true,
    trendScore: 95,
    url: "#",
  },
  {
    id: 2,
    title: "NVIDIA Shares Surge 12% on Strong AI Chip Demand Outlook",
    summary:
      "Semiconductor giant beats Q3 expectations with record data center revenue, forecasts continued AI infrastructure growth.",
    source: "Reuters",
    timestamp: "3 hours ago",
    companyLogo: "🟢",
    category: "technology",
    isBreaking: false,
    isTrending: true,
    trendScore: 89,
    url: "#",
  },
  {
    id: 3,
    title: "Apple Unveils Revolutionary M4 Chip with Enhanced AI Capabilities",
    summary:
      "New processor promises 40% performance boost for MacBooks while maintaining industry-leading energy efficiency.",
    source: "TechCrunch",
    timestamp: "4 hours ago",
    companyLogo: "🍎",
    category: "technology",
    isBreaking: false,
    isTrending: true,
    trendScore: 82,
    url: "#",
  },
  {
    id: 4,
    title: "Tesla Reports Record Q3 Deliveries Despite Global Supply Challenges",
    summary: "Electric vehicle maker delivers 463,000 vehicles in third quarter, beating analyst estimates by 8%.",
    source: "CNBC",
    timestamp: "5 hours ago",
    companyLogo: "⚡",
    category: "automotive",
    isBreaking: false,
    isTrending: true,
    trendScore: 76,
    url: "#",
  },
  {
    id: 5,
    title: "Oil Prices Jump 6% on Middle East Tensions and Supply Concerns",
    summary: "Brent crude surpasses $95/barrel as geopolitical risks threaten global energy security.",
    source: "Financial Times",
    timestamp: "6 hours ago",
    companyLogo: "🛢️",
    category: "energy",
    isBreaking: true,
    isTrending: true,
    trendScore: 88,
    url: "#",
  },
  {
    id: 6,
    title: "Microsoft Azure Revenue Grows 33% as Cloud War Intensifies",
    summary:
      "Tech giant's cloud division outpaces AWS growth rate, driven by enterprise AI adoption and hybrid solutions.",
    source: "Wall Street Journal",
    timestamp: "7 hours ago",
    companyLogo: "🔷",
    category: "technology",
    isBreaking: false,
    isTrending: false,
    trendScore: 0,
    url: "#",
  },
  {
    id: 7,
    title: "Bitcoin Breaks $65,000 as Institutional Adoption Accelerates",
    summary: "Cryptocurrency rallies on news of major pension fund allocations and potential ETF approvals.",
    source: "CoinDesk",
    timestamp: "8 hours ago",
    companyLogo: "₿",
    category: "crypto",
    isBreaking: false,
    isTrending: false,
    trendScore: 0,
    url: "#",
  },
  {
    id: 8,
    title: "Amazon Web Services Launches New AI Infrastructure Platform",
    summary: "Cloud computing leader introduces specialized chips and services to compete in the enterprise AI market.",
    source: "The Verge",
    timestamp: "9 hours ago",
    companyLogo: "📦",
    category: "technology",
    isBreaking: false,
    isTrending: false,
    trendScore: 0,
    url: "#",
  },
  {
    id: 9,
    title: "JPMorgan Reports Better-Than-Expected Q3 Earnings",
    summary: "Banking giant posts $13.2B profit, driven by strong trading revenue and resilient credit quality.",
    source: "MarketWatch",
    timestamp: "10 hours ago",
    companyLogo: "🏦",
    category: "banking",
    isBreaking: false,
    isTrending: false,
    trendScore: 0,
    url: "#",
  },
  {
    id: 10,
    title: "Gold Hits New All-Time High Amid Dollar Weakness",
    summary: "Precious metal reaches $2,180/oz as investors seek safe-haven assets amid economic uncertainty.",
    source: "Kitco",
    timestamp: "12 hours ago",
    companyLogo: "🥇",
    category: "commodities",
    isBreaking: false,
    isTrending: false,
    trendScore: 0,
    url: "#",
  },
]

export function TrendingStories() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("latest")

  const filteredStories = trendingData.filter((story) => {
    const matchesSearch =
      story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.source.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "trending") {
      return matchesSearch && story.isTrending
    }

    return matchesSearch
  })

  const sortedStories =
    activeTab === "trending" ? filteredStories.sort((a, b) => b.trendScore - a.trendScore) : filteredStories

  const openStory = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-gray-700/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-100">Trending Stories</h1>
            <p className="text-gray-400 mt-1">Latest market news and trending financial stories</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search stories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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

        {/* Tabs */}
        <div className="mt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-gray-800/50 border border-gray-700/50">
              <TabsTrigger
                value="latest"
                className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 flex items-center gap-2"
              >
                <Clock className="h-4 w-4" />
                Latest
              </TabsTrigger>
              <TabsTrigger
                value="trending"
                className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 flex items-center gap-2"
              >
                <TrendingUp className="h-4 w-4" />
                Trending
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Stories List */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4 max-w-4xl">
          {sortedStories.length > 0 ? (
            sortedStories.map((story) => (
              <Card
                key={story.id}
                className="bg-gray-800/30 border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 cursor-pointer group"
                onClick={() => openStory(story.url)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Company Logo */}
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-700/30 rounded-lg flex items-center justify-center text-2xl border border-gray-600/30">
                      {story.companyLogo}
                    </div>

                    {/* Story Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          {/* Title with badges */}
                          <div className="flex items-start gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-100 group-hover:text-cyan-400 transition-colors line-clamp-2 flex-1">
                              {story.title}
                            </h3>
                            <div className="flex flex-col gap-1 flex-shrink-0">
                              {story.isBreaking && (
                                <Badge className="bg-red-500/20 text-red-400 border border-red-500/50 text-xs animate-pulse">
                                  Breaking
                                </Badge>
                              )}
                              {story.isTrending && activeTab === "latest" && (
                                <Badge className="bg-orange-500/20 text-orange-400 border border-orange-500/50 text-xs">
                                  <Flame className="h-3 w-3 mr-1" />
                                  Trending
                                </Badge>
                              )}
                              {activeTab === "trending" && story.trendScore > 0 && (
                                <Badge className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 text-xs">
                                  {story.trendScore}% Hot
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Summary */}
                          <p className="text-gray-400 text-sm line-clamp-2 mb-3 leading-relaxed">{story.summary}</p>

                          {/* Source and timestamp */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-cyan-400 font-medium">{story.source}</span>
                              <span className="text-gray-500">•</span>
                              <span className="text-gray-400">{story.timestamp}</span>
                            </div>

                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <ExternalLink className="h-4 w-4 text-gray-400" />
                              <span className="text-xs text-gray-400">Read full story</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-cyan-400 text-6xl mb-4">{activeTab === "trending" ? "📈" : "📰"}</div>
              <h3 className="text-xl font-bold text-gray-100 mb-2">
                {searchTerm
                  ? "No stories found"
                  : activeTab === "trending"
                    ? "No trending stories"
                    : "No stories available"}
              </h3>
              <p className="text-gray-400">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : activeTab === "trending"
                    ? "No stories are trending right now"
                    : "Check back later for the latest market news"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
