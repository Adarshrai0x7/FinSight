"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const navTabs = [
  { name: "Charting Tools", href: "/charting", icon: "📈" },
  { name: "Portfolio", href: "/portfolio", icon: "💼" },
  { name: "Stock Screener", href: "/screener", icon: "🔍" },
  { name: "Technical Analysis", href: "/analysis", icon: "📊" },
  { name: "Trending Stories", href: "/trending", icon: "📰" },
]

export function TopNavigation() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (href: string) => {
    if (href === "/charting" && pathname === "/") return true
    return pathname === href
  }

  const NavItems = ({ mobile = false, onItemClick = () => {} }) => (
    <>
      {navTabs.map((tab) => (
        <Link key={tab.name} href={tab.href} onClick={onItemClick}>
          <Button
            variant="ghost"
            className={`px-4 py-2 rounded-full transition-all duration-300 ${mobile ? "w-full justify-start" : ""} ${
              isActive(tab.href)
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-lg shadow-cyan-500/20 animate-pulse-neon"
                : "bg-gray-800/50 hover:bg-cyan-500/20 text-gray-300 hover:text-cyan-400 border border-gray-700/50 hover:border-cyan-500/50"
            }`}
          >
            {mobile && <span className="mr-2">{tab.icon}</span>}
            {tab.name}
          </Button>
        </Link>
      ))}
    </>
  )

  return (
    <nav className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-cyan-500/20 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link
            href="/"
            className="text-2xl font-bold text-cyan-400 tracking-wider hover:text-cyan-300 transition-colors"
          >
            FinSight
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            <NavItems />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search markets..."
              className="pl-10 bg-gray-800/50 border-gray-700/50 text-gray-300 placeholder-gray-500 focus:border-cyan-500/50 focus:ring-cyan-500/20 w-64"
            />
          </div>

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-cyan-400">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-gray-900/95 border-gray-700/50">
              <div className="flex flex-col space-y-4 mt-8">
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search markets..."
                    className="pl-10 bg-gray-800/50 border-gray-700/50 text-gray-300 placeholder-gray-500 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                  />
                </div>
                <NavItems mobile onItemClick={() => setIsMobileMenuOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
