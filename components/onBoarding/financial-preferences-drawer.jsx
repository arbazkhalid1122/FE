"use client"

import * as React from "react"
import { Check, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, useSidebar } from "@/components/ui/sidebar"
import { Sheet, SheetContent, SheetHeader, SheetFooter } from "@/components/ui/sheet"
import { useRouter } from "next/navigation"
import api from "@/lib/axios"

// Hook to detect mobile screen
function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkIsMobile()
    window.addEventListener("resize", checkIsMobile)
    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  return isMobile
}

const FinancialPreferencesDrawer = React.memo(function FinancialPreferencesDrawer({ onComplete, onCancel, open = true, onOpenChange }) {
  const { setOpen } = useSidebar()
  const isMobile = useIsMobile()
  const router = useRouter()

  // Financial Preferences Data
  const [financialData, setFinancialData] = React.useState({
    minimumDeployAmount: "",
    monthlyInvoiceCount: "",
  })

  // Loading state
  const [isLoading, setIsLoading] = React.useState(false)

  // Refs to maintain focus
  const minimumDeployRef = React.useRef(null)
  const monthlyInvoiceRef = React.useRef(null)

  const handleFinancialInputChange = React.useCallback((field, value) => {
    setFinancialData((prev) => ({ ...prev, [field]: value }))
  }, [])

  // Create stable event handlers for inputs
  const handleMinimumDeployChange = React.useCallback((e) => {
    const value = e.target.value
    handleFinancialInputChange("minimumDeployAmount", value)
    // Maintain focus after state update
    setTimeout(() => {
      if (minimumDeployRef.current) {
        minimumDeployRef.current.focus()
      }
    }, 0)
  }, [handleFinancialInputChange])

  const handleMonthlyInvoiceChange = React.useCallback((e) => {
    const value = e.target.value
    handleFinancialInputChange("monthlyInvoiceCount", value)
    // Maintain focus after state update
    setTimeout(() => {
      if (monthlyInvoiceRef.current) {
        monthlyInvoiceRef.current.focus()
      }
    }, 0)
  }, [handleFinancialInputChange])

  const handleSave = React.useCallback(async () => {
    try {
      // Validate required fields
      const requiredFields = ['minimumDeployAmount', 'monthlyInvoiceCount']
      const missingFields = requiredFields.filter(field => !financialData[field]?.trim())
      
      if (missingFields.length > 0) {
        alert(`Please fill in all required fields: ${missingFields.join(', ')}`)
        return
      }

      // Validate numeric values
      const minimumAmount = parseFloat(financialData.minimumDeployAmount)
      const invoiceCount = parseInt(financialData.monthlyInvoiceCount)

      if (isNaN(minimumAmount) || minimumAmount <= 0) {
        alert("Please enter a valid minimum deploy amount")
        return
      }

      if (isNaN(invoiceCount) || invoiceCount <= 0) {
        alert("Please enter a valid number of invoices")
        return
      }

      setIsLoading(true)
      console.log("Saving financial preferences:", financialData)
      
      // Call API to save financial preferences
      const response = await api.post('/financial-preferences', {
        minimumDeployAmount: minimumAmount,
        monthlyInvoiceCount: invoiceCount
      })
      console.log("Financial preferences saved:", response.data)
      
      // Call completion callback with saved data
      onComplete?.({ financialData: response.data })
      onCancel()
    } catch (error) {
      console.error("Error saving financial preferences:", error)
      // Show user-friendly error message
      const errorMessage = error.response?.data?.message || "Failed to save financial preferences. Please try again."
      alert(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [financialData, onComplete, onCancel])

  const handleCancel = React.useCallback(() => {
    onCancel?.()
    onOpenChange?.(false)
    setOpen(false)
  }, [onCancel, onOpenChange, setOpen])

  const handleBack = React.useCallback(() => {
    handleCancel()
  }, [handleCancel])

  // Financial Preferences Form Content
  const FinancialPreferencesContent = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="minimumDeployAmount" className="text-sm font-normal text-[#081F24]">
          What's the minimum amount you want to deploy?
        </Label>
        <Input
          ref={minimumDeployRef}
          id="minimumDeployAmount"
          type="number"
          value={financialData.minimumDeployAmount}
          onChange={handleMinimumDeployChange}
          placeholder="Enter amount in XOF"
          className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-all"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="monthlyInvoiceCount" className="text-sm font-normal text-[#081F24]">
          How many invoices can you finance monthly with an average of 150,000XOF
        </Label>
        <Input
          ref={monthlyInvoiceRef}
          id="monthlyInvoiceCount"
          type="number"
          value={financialData.monthlyInvoiceCount}
          onChange={handleMonthlyInvoiceChange}
          placeholder="Enter number of invoices"
          className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-all"
        />
      </div>
    </div>
  )

  // Get title
  const getStepTitle = () => {
    return "Financial Preferences"
  }

  // Get content
  const getCurrentContent = () => {
    return <FinancialPreferencesContent />
  }

  // Get buttons
  const getCurrentButtons = () => {
    return (
      <>
        <Button
          variant="outline"
          onClick={handleCancel}
          className="h-11 border-gray-200 text-[#081F24] hover:bg-gray-50 bg-transparent rounded-lg transition-all flex-1 sm:flex-none"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="h-11 bg-gray-900 text-white hover:bg-gray-800 rounded-lg transition-all flex-1 sm:flex-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </>
    )
  }

  // Header component
  const HeaderContent = () => (
    <div className="flex items-center gap-3 px-4 sm:px-6 py-4">
      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg border border-gray-100/80" onClick={handleBack}>
        <ChevronLeft className="h-5 w-5 text-[#03A84E]" />
      </Button>
      <h1 className="text-base sm:text-lg font-semibold text-gray-900">{getStepTitle()}</h1>
    </div>
  )

  // Footer component
  const FooterContent = () => (
    <div className="px-4 sm:px-6 py-4">
      <div className="flex gap-3 justify-between">{getCurrentButtons()}</div>
    </div>
  )

  // Mobile drawer
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full p-0 flex flex-col bg-white">
          <SheetHeader className="border-b border-gray-100/80 p-0 bg-white shrink-0">
            <HeaderContent />
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">{getCurrentContent()}</div>
          <SheetFooter className="border-t border-gray-100/80 p-0 bg-white/90 shrink-0">
            <FooterContent />
          </SheetFooter>
        </SheetContent>
      </Sheet>
    )
  }

  // Desktop sidebar
  return (
    <Sidebar
      side="right"
      collapsible="none"
      className="w-full max-w-md mr-2 rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden bg-white"
      style={{
        position: "fixed",
        top: "16px",
        right: "16px",
        bottom: "16px",
        width: "calc(100% - 32px)",
        maxWidth: "448px",
        height: "calc(100vh - 32px)",
        zIndex: 10000,
      }}
    >
      <SidebarHeader className="border-b border-gray-100/80 p-0 bg-white">
        <HeaderContent />
      </SidebarHeader>
      <SidebarContent className="px-4 sm:px-6 py-6 overflow-y-auto bg-white rounded-2xl">
        {getCurrentContent()}
      </SidebarContent>
      <SidebarFooter className="border-t border-gray-100/80 p-0 rounded-b-2xl bg-white/90">
        <FooterContent />
      </SidebarFooter>
    </Sidebar>
  )
})

export { FinancialPreferencesDrawer }