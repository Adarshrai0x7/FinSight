import { TopNavigation } from "./components/top-navigation"
import { LeftSidebar } from "./components/left-sidebar"
import { PortfolioMain } from "./components/portfolio-main"

export default function PortfolioDashboard() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <TopNavigation />
      <div className="flex h-[calc(100vh-73px)]">
        <LeftSidebar />
        <PortfolioMain />
      </div>
    </div>
  )
}
