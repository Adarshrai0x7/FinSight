"use client"

import { TrendingUp, TrendingDown, AlertTriangle, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AnalysisSummaryProps {
  symbol: string
}

export function AnalysisSummary({ symbol }: AnalysisSummaryProps) {
  // This would be calculated based on actual indicator values in a real app
  const signalStrength = {
    buy: 65,
    sell: 20,
    neutral: 15,
  }

  const indicatorSignals = [
    { name: "Moving Average", signal: "buy", message: "Price above 20-day SMA" },
    { name: "RSI", signal: "overbought", message: "RSI is above 70 – Overbought" },
    { name: "MACD", signal: "buy", message: "MACD line crossed above signal line" },
    { name: "Bollinger Bands", signal: "neutral", message: "Price within bands" },
    { name: "Stochastic", signal: "sell", message: "Stochastic %K crossed below %D" },
  ]

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case "buy":
        return "text-green-400"
      case "sell":
        return "text-red-400"
      case "overbought":
        return "text-yellow-400"
      case "oversold":
        return "text-yellow-400"
      default:
        return "text-gray-400"
    }
  }

  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case "buy":
        return <TrendingUp className="h-4 w-4 text-green-400" />
      case "sell":
        return <TrendingDown className="h-4 w-4 text-red-400" />
      case "overbought":
      case "oversold":
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />
      default:
        return <Info className="h-4 w-4 text-gray-400" />
    }
  }

  const getSignalBadge = (signal: string) => {
    switch (signal) {
      case "buy":
        return <Badge className="bg-green-500/20 text-green-400 border border-green-500/50">Buy</Badge>
      case "sell":
        return <Badge className="bg-red-500/20 text-red-400 border border-red-500/50">Sell</Badge>
      case "overbought":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/50">Overbought</Badge>
      case "oversold":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/50">Oversold</Badge>
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border border-gray-500/50">Neutral</Badge>
    }
  }

  return (
    <Card className="bg-gray-800/30 border-gray-700/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-cyan-400">Analysis Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="signals">
          <TabsList className="bg-gray-800/50 border border-gray-700/50">
            <TabsTrigger
              value="signals"
              className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
            >
              Signals
            </TabsTrigger>
            <TabsTrigger
              value="strength"
              className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
            >
              Signal Strength
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signals" className="mt-4">
            <div className="space-y-3">
              {indicatorSignals.map((indicator, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-700/30 border border-gray-600/30"
                >
                  <div className="flex items-center gap-3">
                    {getSignalIcon(indicator.signal)}
                    <div>
                      <div className="text-sm text-gray-200 font-medium">{indicator.name}</div>
                      <div className="text-xs text-gray-400">{indicator.message}</div>
                    </div>
                  </div>
                  {getSignalBadge(indicator.signal)}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="strength" className="mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-400">Buy</span>
                  <span className="text-sm text-green-400">{signalStrength.buy}%</span>
                </div>
                <Progress value={signalStrength.buy} className="h-2 bg-gray-700/50">
                  <div className="h-full bg-green-500 rounded-full" />
                </Progress>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Neutral</span>
                  <span className="text-sm text-gray-400">{signalStrength.neutral}%</span>
                </div>
                <Progress value={signalStrength.neutral} className="h-2 bg-gray-700/50">
                  <div className="h-full bg-gray-500 rounded-full" />
                </Progress>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-red-400">Sell</span>
                  <span className="text-sm text-red-400">{signalStrength.sell}%</span>
                </div>
                <Progress value={signalStrength.sell} className="h-2 bg-gray-700/50">
                  <div className="h-full bg-red-500 rounded-full" />
                </Progress>
              </div>

              <div className="mt-6 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  <span className="font-medium text-green-400">Overall Signal: Buy</span>
                </div>
                <p className="text-sm text-gray-300 mt-2">
                  Technical indicators suggest a bullish trend for {symbol}. Consider reviewing fundamentals before
                  making investment decisions.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
