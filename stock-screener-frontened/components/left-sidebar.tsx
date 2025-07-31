import { Search, Calendar, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

const economicEvents = [
  { date: "Dec 12", time: "09:30", event: "Market Open", flag: "🇺🇸", impact: "high" },
  { date: "Dec 12", time: "10:00", event: "CPI Data Release", flag: "🇺🇸", impact: "high" },
  { date: "Dec 12", time: "14:00", event: "Fed Speech", flag: "🇺🇸", impact: "medium" },
  { date: "Dec 13", time: "08:30", event: "GDP Report", flag: "🇪🇺", impact: "high" },
  { date: "Dec 13", time: "15:30", event: "Retail Sales", flag: "🇺🇸", impact: "medium" },
  { date: "Dec 14", time: "10:00", event: "Inflation Data", flag: "🇬🇧", impact: "high" },
  { date: "Dec 14", time: "13:00", event: "ECB Meeting", flag: "🇪🇺", impact: "high" },
  { date: "Dec 15", time: "09:00", event: "Employment Data", flag: "🇺🇸", impact: "medium" },
  { date: "Dec 15", time: "11:30", event: "Manufacturing PMI", flag: "🇺🇸", impact: "low" },
]

export function LeftSidebar() {
  const [watchlist, setWatchlist] = useState([
    { symbol: "AAPL", name: "Apple Inc", price: "$195.89", change: "-0.87%" },
    { symbol: "MSFT", name: "Microsoft Corp", price: "$420.45", change: "+2.34%" },
    { symbol: "GOOGL", name: "Alphabet Inc", price: "$142.56", change: "+1.23%" },
    { symbol: "TSLA", name: "Tesla Inc", price: "$248.42", change: "+3.45%" },
  ])

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist((prev) => prev.filter((stock) => stock.symbol !== symbol))
  }

  return (
    <div className="w-80 bg-gray-900/95 backdrop-blur-sm border-r border-cyan-500/20 flex flex-col h-full">
      {/* Search Section - Fixed at top */}
      <div className="flex-shrink-0 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search US Stocks"
            className="pl-10 bg-gray-800/50 border-gray-700/50 text-gray-300 placeholder-gray-500 focus:border-cyan-500/50 focus:ring-cyan-500/20"
          />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 pt-0 space-y-6">
        {/* Watchlist Section */}
        <Card className="bg-gray-800/30 border-gray-700/50 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-cyan-400 flex items-center gap-2">
              <Search className="h-5 w-5" />
              My Watchlist
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {watchlist.length > 0 ? (
              watchlist.map((stock) => (
                <div
                  key={stock.symbol}
                  className="p-3 bg-gray-700/30 rounded-lg border border-gray-600/30 hover:border-cyan-500/50 cursor-pointer transition-all duration-200 flex justify-between items-center"
                >
                  <div>
                    <div className="font-semibold text-gray-200">{stock.symbol}</div>
                    <div className="text-sm text-gray-400">{stock.name}</div>
                    <div className="text-sm font-medium mt-1">{stock.price}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-sm ${stock.change.startsWith("+") ? "text-green-400" : "text-red-400"}`}>
                      {stock.change}
                    </span>
                    <button
                      onClick={() => removeFromWatchlist(stock.symbol)}
                      className="p-1 bg-gray-800 hover:bg-red-600 rounded-md transition-all"
                    >
                      <X className="w-4 h-4 text-gray-400 hover:text-white" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No stocks in your watchlist</p>
            )}
          </CardContent>
        </Card>

        {/* Economic Events */}
        <Card className="bg-gray-800/30 border-gray-700/50 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-cyan-400 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Economic Events
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {economicEvents.map((event, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-700/30 border border-gray-600/30"
              >
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <div className="text-xs text-gray-400">{event.date}</div>
                    <div className="text-cyan-400 font-mono text-sm">{event.time}</div>
                  </div>
                  <span className="text-lg">{event.flag}</span>
                  <div>
                    <div className="text-sm text-gray-200 font-medium">{event.event}</div>
                    <Badge
                      variant="outline"
                      className={`text-xs mt-1 ${
                        event.impact === "high"
                          ? "border-red-500/50 text-red-400 bg-red-500/10"
                          : event.impact === "medium"
                            ? "border-yellow-500/50 text-yellow-400 bg-yellow-500/10"
                            : "border-gray-500/50 text-gray-400 bg-gray-500/10"
                      }`}
                    >
                      {event.impact}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
