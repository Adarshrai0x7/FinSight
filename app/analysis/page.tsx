import { DashboardLayout } from "../../components/layout/dashboard-layout"
import { TechnicalAnalysisDashboard } from "../../components/analysis/technical-analysis-dashboard"

export default function AnalysisPage() {
  return (
    <DashboardLayout>
      <TechnicalAnalysisDashboard />
    </DashboardLayout>
  )
}
