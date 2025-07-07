"use client"

import { useState } from "react"
import { TopNavigation } from "./components/top-navigation"
import { LeftSidebar } from "./components/left-sidebar"
import { ChartArea } from "./components/chart-area"
import { PortfolioMain } from "./components/portfolio-main"

export default function UnifiedDashboard() {
  const [activePage, setActivePage] = useState("charting")

  const renderMainContent = () => {
    switch (activePage) {
      case "portfolio":
        return <PortfolioMain />
      case "charting":
      default:
        return <ChartArea />
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <TopNavigation activePage={activePage} onPageChange={setActivePage} />
      <div className="flex flex-1 h-[calc(100vh-73px)]">
        <LeftSidebar />
        {renderMainContent()}
      </div>
    </div>
  )
}
