"use client"
import { useState, useRef } from "react"
import InvoiceHistoryTabs from "@/components/invoices/invoice-history-tabs"
import MetricsCards from "@/components/invoices/metrics-cards"
import Header from "@/components/layout/header"

export default function InvoiceDashboard() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleUploadSuccess = () => {
    // Trigger refresh of invoice data
    setRefreshTrigger(prev => prev + 1)
  }

  return (
     <div className="w-full min-h-screen bg-[#f7f7f7] overflow-x-hidden">
      <Header onUploadSuccess={handleUploadSuccess} />
      <div className="w-full p-4 lg:p-8 overflow-x-hidden">
          <MetricsCards refreshTrigger={refreshTrigger} />
          <InvoiceHistoryTabs refreshTrigger={refreshTrigger} />
      </div>
    </div>
  )
}
