"use client"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface TopNavigationProps {
  activePage?: string
  onPageChange?: (page: string) => void
}

const navTabs = [
  { name: "Charting Tools", id: "charting" },
  { name: "Portfolio", id: "portfolio" },
  { name: "Stock Screener", id: "screener" },
  { name: "Technical Analysis", id: "analysis" },
  { name: "Top Stories", id: "news" },
]

export function TopNavigation({ activePage = "charting", onPageChange }: TopNavigationProps) {
  return (
    <nav className="bg-gray-900/95 backdrop-blur-sm border-b border-cyan-500/20 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="text-2xl font-bold text-cyan-400 tracking-wider">FinSight</div>
          <div className="flex items-center space-x-2">
            {navTabs.map((tab) => (
              <Button
                key={tab.name}
                variant="ghost"
                className={`px-4 py-2 rounded-full transition-all duration-200 ${
                  activePage === tab.id
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-lg shadow-cyan-500/20 animate-pulse-neon"
                    : "bg-gray-800/50 hover:bg-cyan-500/20 text-gray-300 hover:text-cyan-400 border border-gray-700/50 hover:border-cyan-500/50"
                }`}
                onClick={() => onPageChange?.(tab.id)}
              >
                {tab.name}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search markets..."
              className="pl-10 bg-gray-800/50 border-gray-700/50 text-gray-300 placeholder-gray-500 focus:border-cyan-500/50 focus:ring-cyan-500/20"
            />
          </div>
        </div>
      </div>
    </nav>
  )
}
