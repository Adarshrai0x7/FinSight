import { TopNavigation } from "./components/top-navigation"
import { LeftSidebar } from "./components/left-sidebar"
import { ChartArea } from "./components/chart-area"

export default function TradingDashboard() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <TopNavigation />
      <div className="flex h-[calc(100vh-73px)]">
        <LeftSidebar />
        <ChartArea />
      </div>
    </div>
  )
}
