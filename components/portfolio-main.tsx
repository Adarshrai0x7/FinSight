"use client"

import { useState } from "react"
import { TrendingUp, TrendingDown, ExternalLink, Filter, Download } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const portfolioData = [
  {
    id: "001",
    symbol: "AAPL",
    name: "Apple Inc",
    orderType: "buy",
    orderMode: "delivery",
    quantity: 150,
    transactionPrice: 185.5,
    livePrice: 195.89,
    profitLoss: 1558.5,
    dateTime: "2024-12-10 09:30:00",
  },
  {
    id: "002",
    symbol: "MSFT",
    name: "Microsoft Corporation",
    orderType: "buy",
    orderMode: "delivery",
    quantity: 100,
    transactionPrice: 410.25,
    livePrice: 420.45,
    profitLoss: 1020.0,
    dateTime: "2024-12-09 14:15:00",
  },
  {
    id: "003",
    symbol: "GOOGL",
    name: "Alphabet Inc",
    orderType: "buy",
    orderMode: "intraday",
    quantity: 75,
    transactionPrice: 145.8,
    livePrice: 142.56,
    profitLoss: -243.0,
    dateTime: "2024-12-11 11:45:00",
  },
  {
    id: "004",
    symbol: "TSLA",
    name: "Tesla Inc",
    orderType: "buy",
    orderMode: "delivery",
    quantity: 200,
    transactionPrice: 235.6,
    livePrice: 248.42,
    profitLoss: 2564.0,
    dateTime: "2024-12-08 10:20:00",
  },
  {
    id: "005",
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    orderType: "buy",
    orderMode: "delivery",
    quantity: 50,
    transactionPrice: 465.3,
    livePrice: 495.22,
    profitLoss: 1496.0,
    dateTime: "2024-12-07 15:30:00",
  },
  {
    id: "006",
    symbol: "AMZN",
    name: "Amazon.com Inc",
    orderType: "sell",
    orderMode: "intraday",
    quantity: 80,
    transactionPrice: 155.75,
    livePrice: 152.3,
    profitLoss: 276.0,
    dateTime: "2024-12-11 13:10:00",
  },
  {
    id: "007",
    symbol: "META",
    name: "Meta Platforms Inc",
    orderType: "buy",
    orderMode: "delivery",
    quantity: 120,
    transactionPrice: 325.8,
    livePrice: 334.88,
    profitLoss: 1089.6,
    dateTime: "2024-12-06 10:45:00",
  },
  {
    id: "008",
    symbol: "NFLX",
    name: "Netflix Inc",
    orderType: "buy",
    orderMode: "intraday",
    quantity: 60,
    transactionPrice: 445.2,
    livePrice: 438.75,
    profitLoss: -387.0,
    dateTime: "2024-12-05 14:20:00",
  },
  {
    id: "009",
    symbol: "AMD",
    name: "Advanced Micro Devices",
    orderType: "buy",
    orderMode: "delivery",
    quantity: 180,
    transactionPrice: 142.3,
    livePrice: 148.95,
    profitLoss: 1197.0,
    dateTime: "2024-12-04 11:30:00",
  },
  {
    id: "010",
    symbol: "CRM",
    name: "Salesforce Inc",
    orderType: "sell",
    orderMode: "intraday",
    quantity: 90,
    transactionPrice: 285.6,
    livePrice: 278.45,
    profitLoss: 643.5,
    dateTime: "2024-12-03 16:15:00",
  },
]

export function PortfolioMain() {
  const [sortBy, setSortBy] = useState("dateTime")

  const totalBalance = 1250000.0
  const totalProfitLoss = portfolioData.reduce((sum, item) => sum + item.profitLoss, 0)
  const totalProfitLossPercent = ((totalProfitLoss / (totalBalance - totalProfitLoss)) * 100).toFixed(2)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime)
    return {
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      time: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Portfolio Header - Fixed */}
      <div className="flex-shrink-0 p-6 border-b border-gray-700/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-100">Your Portfolio</h1>
            <p className="text-gray-400 mt-1">Track your investments and performance</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              className="border-gray-700/50 text-gray-300 hover:border-cyan-500/50 hover:text-cyan-400"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-700/50 text-gray-300 hover:border-cyan-500/50 hover:text-cyan-400"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card className="bg-gray-800/30 border-gray-700/50 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-cyan-400 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Total Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-100">{formatCurrency(totalBalance)}</div>
              <p className="text-sm text-gray-400 mt-1">Portfolio value as of today</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/30 border-gray-700/50 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle
                className={`flex items-center gap-2 ${totalProfitLoss >= 0 ? "text-green-400" : "text-red-400"}`}
              >
                {totalProfitLoss >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                Total Profit/Loss
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${totalProfitLoss >= 0 ? "text-green-400" : "text-red-400"}`}>
                {totalProfitLoss >= 0 ? "+" : ""}
                {formatCurrency(totalProfitLoss)}
              </div>
              <p className={`text-sm mt-1 ${totalProfitLoss >= 0 ? "text-green-400" : "text-red-400"}`}>
                {totalProfitLoss >= 0 ? "+" : ""}
                {totalProfitLossPercent}% overall return
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Portfolio Table - Scrollable */}
      <div className="flex-1 overflow-y-auto p-6">
        <Card className="bg-gray-800/30 border-gray-700/50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-cyan-400">Holdings</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700/50 hover:bg-gray-700/20">
                    <TableHead className="text-gray-300 font-semibold">ID</TableHead>
                    <TableHead className="text-gray-300 font-semibold">Symbol</TableHead>
                    <TableHead className="text-gray-300 font-semibold">Stock Name</TableHead>
                    <TableHead className="text-gray-300 font-semibold">Order Type</TableHead>
                    <TableHead className="text-gray-300 font-semibold">Order Mode</TableHead>
                    <TableHead className="text-gray-300 font-semibold">Quantity</TableHead>
                    <TableHead className="text-gray-300 font-semibold">Transaction Price</TableHead>
                    <TableHead className="text-gray-300 font-semibold">Live Price</TableHead>
                    <TableHead className="text-gray-300 font-semibold">Profit/Loss</TableHead>
                    <TableHead className="text-gray-300 font-semibold">Date & Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {portfolioData.map((item, index) => {
                    const priceChange = item.livePrice - item.transactionPrice
                    const priceChangePercent = ((priceChange / item.transactionPrice) * 100).toFixed(2)
                    const dateTime = formatDateTime(item.dateTime)

                    return (
                      <TableRow
                        key={item.id}
                        className={`border-gray-700/50 hover:bg-gray-700/20 transition-colors ${
                          index % 2 === 0 ? "bg-gray-800/20" : "bg-gray-800/10"
                        }`}
                      >
                        <TableCell className="text-gray-300 font-mono">{item.id}</TableCell>
                        <TableCell>
                          <Button variant="link" className="p-0 h-auto text-cyan-400 hover:text-cyan-300 font-semibold">
                            {item.symbol}
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </Button>
                        </TableCell>
                        <TableCell className="text-gray-300">{item.name}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`${
                              item.orderType === "buy"
                                ? "border-green-500/50 text-green-400 bg-green-500/10"
                                : "border-red-500/50 text-red-400 bg-red-500/10"
                            }`}
                          >
                            {item.orderType.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`${
                              item.orderMode === "delivery"
                                ? "border-blue-500/50 text-blue-400 bg-blue-500/10"
                                : "border-orange-500/50 text-orange-400 bg-orange-500/10"
                            }`}
                          >
                            {item.orderMode}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-300 font-mono">{item.quantity}</TableCell>
                        <TableCell className="text-gray-300 font-mono">
                          {formatCurrency(item.transactionPrice)}
                        </TableCell>
                        <TableCell className={`font-mono ${priceChange >= 0 ? "text-green-400" : "text-red-400"}`}>
                          {formatCurrency(item.livePrice)}
                          <div className="text-xs">
                            {priceChange >= 0 ? "+" : ""}
                            {priceChangePercent}%
                          </div>
                        </TableCell>
                        <TableCell
                          className={`font-mono font-semibold ${item.profitLoss >= 0 ? "text-green-400" : "text-red-400"}`}
                        >
                          {item.profitLoss >= 0 ? "+" : ""}
                          {formatCurrency(item.profitLoss)}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          <div className="text-sm">{dateTime.date}</div>
                          <div className="text-xs text-gray-400">{dateTime.time}</div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
