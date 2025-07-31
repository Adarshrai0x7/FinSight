"use client"
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase" // ✅ make sure path matches your project structure
import {
  TrendingUp,
  TrendingDown,
  ExternalLink,
  Filter,
  Download
} from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"

type PortfolioItem = {
  id: string
  symbol: string
  name: string
  orderType: "buy" | "sell"
  orderMode: "delivery" | "intraday"
  quantity: number
  transactionPrice: number
  livePrice: number
  profitLoss: number
  dateTime: string
}

export default function PortfolioMain() {
  const [portfolioData, setPortfolioData] = useState<PortfolioItem[]>([])
  const [totalBalance, setTotalBalance] = useState<number>(986000.0)

  useEffect(() => {
  const fetchUserHoldings = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        console.error("User not logged in.");
        return;
      }

      const holdingsRef = collection(db, "users", user.uid, "holdings");
      const snapshot = await getDocs(holdingsRef);

      const data: PortfolioItem[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as PortfolioItem[];

      setPortfolioData(data);
    } catch (error) {
      console.error("Failed to fetch user holdings:", error);
    }
  };

  fetchUserHoldings();
}, []);

  const totalProfitLoss = portfolioData.reduce(
    (sum, item) => sum + item.profitLoss,
    0
  )
  const totalProfitLossPercent = (
    (totalProfitLoss / (totalBalance - totalProfitLoss)) *
    100
  ).toFixed(2)

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2
    }).format(amount)

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime)
    return {
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit"
      })
    }
  }

  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Portfolio Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">
            Your Portfolio
          </h1>
          <p className="text-gray-400 mt-1">
            Track your investments and performance
          </p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-800/30 border-gray-700/50 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-cyan-400 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Total Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-100">
              {formatCurrency(totalBalance)}
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Portfolio value as of today
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/30 border-gray-700/50 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle
              className={`flex items-center gap-2 ${
                totalProfitLoss >= 0
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {totalProfitLoss >= 0 ? (
                <TrendingUp className="h-5 w-5" />
              ) : (
                <TrendingDown className="h-5 w-5" />
              )}
              Total Profit/Loss
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-3xl font-bold ${
                totalProfitLoss >= 0
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {totalProfitLoss >= 0 ? "+" : ""}
              {formatCurrency(totalProfitLoss)}
            </div>
            <p
              className={`text-sm mt-1 ${
                totalProfitLoss >= 0
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {totalProfitLoss >= 0 ? "+" : ""}
              {totalProfitLossPercent}% overall return
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Holdings Table */}
      <Card className="bg-gray-800/30 border-gray-700/50 shadow-lg">
        <CardHeader>
          <CardTitle className="text-cyan-400">Holdings</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700/50 hover:bg-gray-700/20">
                  <TableHead className="text-gray-300 font-semibold">
                    ID
                  </TableHead>
                  <TableHead className="text-gray-300 font-semibold">
                    Symbol
                  </TableHead>
                  <TableHead className="text-gray-300 font-semibold">
                    Stock Name
                  </TableHead>
                  <TableHead className="text-gray-300 font-semibold">
                    Order Type
                  </TableHead>
                  <TableHead className="text-gray-300 font-semibold">
                    Order Mode
                  </TableHead>
                  <TableHead className="text-gray-300 font-semibold">
                    Quantity
                  </TableHead>
                  <TableHead className="text-gray-300 font-semibold">
                    Transaction Price
                  </TableHead>
                  <TableHead className="text-gray-300 font-semibold">
                    Live Price
                  </TableHead>
                  <TableHead className="text-gray-300 font-semibold">
                    Profit/Loss
                  </TableHead>
                  <TableHead className="text-gray-300 font-semibold">
                    Date & Time
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {portfolioData.map((item, index) => {
                  const priceChange =
                    item.livePrice - item.transactionPrice
                  const priceChangePercent = (
                    (priceChange / item.transactionPrice) *
                    100
                  ).toFixed(2)
                  const dateTime = formatDateTime(item.dateTime)

                  return (
                    <TableRow
                      key={item.id}
                      className={`border-gray-700/50 hover:bg-gray-700/20 transition-colors ${
                        index % 2 === 0
                          ? "bg-gray-800/20"
                          : "bg-gray-800/10"
                      }`}
                    >
                      <TableCell className="text-gray-300 font-mono">
                        {item.id}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="link"
                          className="p-0 h-auto text-cyan-400 hover:text-cyan-300 font-semibold"
                        >
                          {item.symbol}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Button>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {item.name}
                      </TableCell>
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
                      <TableCell className="text-gray-300 font-mono">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-gray-300 font-mono">
                        {formatCurrency(item.transactionPrice)}
                      </TableCell>
                      <TableCell
                        className={`font-mono ${
                          priceChange >= 0
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {formatCurrency(item.livePrice)}
                        <div className="text-xs">
                          {priceChange >= 0 ? "+" : ""}
                          {priceChangePercent}%
                        </div>
                      </TableCell>
                      <TableCell
                        className={`font-mono font-semibold ${
                          item.profitLoss >= 0
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {item.profitLoss >= 0 ? "+" : ""}
                        {formatCurrency(item.profitLoss)}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        <div className="text-sm">{dateTime.date}</div>
                        <div className="text-xs text-gray-400">
                          {dateTime.time}
                        </div>
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
  )
}
