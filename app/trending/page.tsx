import { DashboardLayout } from "../../components/layout/dashboard-layout"
import { TrendingStories } from "../../components/news/trending-stories"

export default function TrendingPage() {
  return (
    <DashboardLayout>
      <TrendingStories />
    </DashboardLayout>
  )
}
