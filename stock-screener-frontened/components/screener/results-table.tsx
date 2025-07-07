"use client"

import { ExternalLink, Bookmark, BookmarkCheck, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface ResultsTableProps {
  results: any[]
  bookmarkedStocks: string[]
  onToggleBookmark: (ticker: string) => void
}

export function ResultsTable({ results, bookmarkedStocks, onToggleBookmark }: ResultsTableProps) {
  const getRecommendationBadge = (recommendation: string) => {
    switch (recommendation) {
      case "Strong Buy":
        return <Badge className="bg-green-500/20 text-green-400 border border-green-500/50">Strong Buy</Badge>
      case "Buy":
        return <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/50">Buy</Badge>
      case "Hold":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/50">Hold</Badge>
      case "Sell":
        return <Badge className="bg-orange-500/20 text-orange-400 border border-orange-500/50">Sell</Badge>
      case "Strong Sell":
        return <Badge className="bg-red-500/20 text-red-400 border border-red-500/50">Strong Sell</Badge>
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border border-gray-500/50">{recommendation}</Badge>
    }
  }

  const getRSIBadge = (rsi: number) => {
    if (rsi >= 70) {
      return <Badge className="bg-red-500/20 text-red-400 border border-red-500/50">{rsi} (Overbought)</Badge>
    } else if (rsi <= 30) {
      return <Badge className="bg-green-500/20 text-green-400 border border-green-500/50">{rsi} (Oversold)</Badge>
    } else {
      return <span className="text-gray-300">{rsi}</span>
    }
  }

  const getSentimentBadge = (sentiment: number) => {
    if (sentiment >= 75) {
      return <Badge className="bg-green-500/20 text-green-400 border border-green-500/50">{sentiment} (Bullish)</Badge>
    } else if (sentiment <= 40) {
      return <Badge className="bg-red-500/20 text-red-400 border border-red-500/50">{sentiment} (Bearish)</Badge>
    } else {
      return (
        <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/50">{sentiment} (Neutral)</Badge>
      )
    }
  }

  return (
    <div className="rounded-lg border border-gray-700/50 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700/50 hover:bg-gray-700/20">
              <TableHead className="text-gray-300 font-semibold w-10"></TableHead>
              <TableHead className="text-gray-300 font-semibold">Ticker</TableHead>
              <TableHead className="text-gray-300 font-semibold">Company Name</TableHead>
              <TableHead className="text-gray-300 font-semibold">Sector</TableHead>
              <TableHead className="text-gray-300 font-semibold">Price</TableHead>
              <TableHead className="text-gray-300 font-semibold">RSI</TableHead>
              <TableHead className="text-gray-300 font-semibold">P/E Ratio</TableHead>
              <TableHead className="text-gray-300 font-semibold">Sentiment</TableHead>
              <TableHead className="text-gray-300 font-semibold">Recommendation</TableHead>
              <TableHead className="text-gray-300 font-semibold w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((stock, index) => (
              <TableRow
                key={stock.ticker}
                className={`border-gray-700/50 hover:bg-gray-700/20 transition-colors ${
                  index % 2 === 0 ? "bg-gray-800/20" : "bg-gray-800/10"
                }`}
              >
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-cyan-400"
                    onClick={() => onToggleBookmark(stock.ticker)}
                  >
                    {bookmarkedStocks.includes(stock.ticker) ? (
                      <BookmarkCheck className="h-5 w-5 text-cyan-400" />
                    ) : (
                      <Bookmark className="h-5 w-5" />
                    )}
                  </Button>
                </TableCell>
                <TableCell>
                  <Button variant="link" className="p-0 h-auto text-cyan-400 hover:text-cyan-300 font-semibold">
                    {stock.ticker}
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </TableCell>
                <TableCell className="text-gray-300">{stock.name}</TableCell>
                <TableCell className="text-gray-300">{stock.sector}</TableCell>
                <TableCell className="font-mono">
                  <div className="text-gray-200">${stock.price.toFixed(2)}</div>
                  <div className={`text-xs ${stock.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {stock.change >= 0 ? "+" : ""}
                    {stock.change.toFixed(2)}%
                  </div>
                </TableCell>
                <TableCell>{getRSIBadge(stock.rsi)}</TableCell>
                <TableCell className="text-gray-300 font-mono">{stock.pe.toFixed(1)}</TableCell>
                <TableCell>{getSentimentBadge(stock.sentiment)}</TableCell>
                <TableCell>{getRecommendationBadge(stock.recommendation)}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/50"
                  >
                    View Analysis
                    <ArrowUpRight className="h-3 w-3 ml-1" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
