import { TopNavigation } from "../navigation/top-navigation"
import { LeftSidebar } from "../shared/left-sidebar"
import { PageTransition } from "./page-transition"
import type { ReactNode } from "react"

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 overflow-hidden">
      <TopNavigation />
      <div className="flex h-[calc(100vh-73px)] overflow-hidden">
        <div className="w-80 shrink-0">
          <LeftSidebar />
        </div>
        <div className="flex-1 overflow-auto">
          <PageTransition>{children}</PageTransition>
        </div>
      </div>
    </div>
  )
}
