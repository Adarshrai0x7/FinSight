"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

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
          <span
            className={cn(
              "text-sm font-medium relative px-2 py-1 transition-colors duration-200",
              mobile ? "block text-left w-full py-2" : "hover:text-cyan-400 text-gray-300",
              isActive(tab.href) ? "text-cyan-400" : "",
              !mobile &&
                "after:absolute after:left-0 after:-bottom-0.5 after:h-[2px] after:w-full after:bg-cyan-400 after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition-transform after:duration-300"
            )}
          >
            {mobile && <span className="mr-2">{tab.icon}</span>}
            {tab.name}
          </span>
        </Link>
      ))}
    </>
  )

  return (
    <nav className="sticky top-0 z-50 bg-gray-950 border-b border-gray-800 px-6 py-2">
      <div className="flex items-center justify-between">
        {/* Logo + Navigation */}
        <div className="flex items-center space-x-6">
          <Link
            href="/"
            className="text-xl font-bold text-cyan-400 tracking-tight hover:text-cyan-300 transition-colors"
          >
            FinSight
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-4">
            <NavItems />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Desktop Search Bar (Google style) */}
          <div className="relative hidden md:block w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
            <Input
              placeholder="Search stocks, indices..."
              className="pl-10 pr-4 py-2 text-sm bg-white/5 text-gray-200 placeholder-gray-400 border border-gray-600 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 shadow-sm focus:shadow-md"
            />
          </div>

          {/* Mobile Menu Toggle */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-cyan-400">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            {/* Mobile Sheet Content */}
            <SheetContent side="right" className="w-80 bg-gray-900/95 border-l border-gray-700">
              <div className="flex flex-col space-y-6 mt-8">
                {/* Mobile Search Bar */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                  <Input
                    placeholder="Search stocks, indices..."
                    className="pl-10 pr-4 py-2 text-sm bg-white/5 text-gray-200 placeholder-gray-400 border border-gray-600 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 shadow-sm focus:shadow-md"
                  />
                </div>

                {/* Mobile Nav Links */}
                <NavItems mobile onItemClick={() => setIsMobileMenuOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
