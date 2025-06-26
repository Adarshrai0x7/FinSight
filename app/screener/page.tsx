import { DashboardLayout } from "../../components/layout/dashboard-layout"
import { StockScreener } from "../../components/screener/stock-screener"

export default function ScreenerPage() {
  return (
    <DashboardLayout>
      <StockScreener />
    </DashboardLayout>
  )
}
