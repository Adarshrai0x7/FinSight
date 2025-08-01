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
  return (
    <div className="rounded-lg border border-gray-700/50 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700/50 hover:bg-gray-700/20">
              <TableHead className="text-gray-300 font-semibold w-10"></TableHead>
              <TableHead className="text-gray-300 font-semibold">Symbol</TableHead>
              <TableHead className="text-gray-300 font-semibold">Company Name</TableHead>
              <TableHead className="text-gray-300 font-semibold">Market Cap</TableHead>
              <TableHead className="text-gray-300 font-semibold">P/E Ratio</TableHead>
              <TableHead className="text-gray-300 font-semibold">ROE (%)</TableHead>
              <TableHead className="text-gray-300 font-semibold w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((stock, index) => (
              <TableRow
                key={stock.symbol}
                className={`border-gray-700/50 hover:bg-gray-700/20 transition-colors ${
                  index % 2 === 0 ? "bg-gray-800/20" : "bg-gray-800/10"
                }`}
              >
                {/* Bookmark */}
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-cyan-400"
                    onClick={() => onToggleBookmark(stock.symbol)}
                  >
                    {bookmarkedStocks.includes(stock.symbol) ? (
                      <BookmarkCheck className="h-5 w-5 text-cyan-400" />
                    ) : (
                      <Bookmark className="h-5 w-5" />
                    )}
                  </Button>
                </TableCell>

                {/* Symbol */}
                <TableCell>
                  <Button variant="link" className="p-0 h-auto text-cyan-400 hover:text-cyan-300 font-semibold">
                    {stock.symbol}
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </TableCell>

                {/* Company Name */}
                <TableCell className="text-gray-300">{stock.name || "—"}</TableCell>

                {/* Market Cap */}
                <TableCell className="font-mono text-gray-200">
                  {stock.market_cap ? `$${(stock.market_cap / 1e9).toFixed(2)}B` : "—"}
                </TableCell>

                {/* P/E Ratio */}
                <TableCell className="text-gray-300 font-mono">
                  {stock.pe_ratio ? stock.pe_ratio.toFixed(2) : "—"}
                </TableCell>

                {/* ROE */}
                <TableCell className="text-gray-300 font-mono">
                  {stock.roe ? (stock.roe * 100).toFixed(2) + "%" : "—"}
                </TableCell>

                {/* Actions */}
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
