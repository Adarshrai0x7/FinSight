import { TopNavigation } from "../navigation/top-navigation"
import { LeftSidebar } from "../shared/left-sidebar"
import { PageTransition } from "./page-transition"
import type { ReactNode } from "react"

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <TopNavigation />
      <div className="flex h-[calc(100vh-73px)]">
        <LeftSidebar />
        <PageTransition>{children}</PageTransition>
      </div>
    </div>
  )
}
