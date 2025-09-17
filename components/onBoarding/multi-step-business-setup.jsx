"use client"

import * as React from "react"
import { Check, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

const MultiStepBusinessSetup = React.memo(function MultiStepBusinessSetup({ onComplete, onCancel, open = true, onOpenChange }) {
  const { setOpen } = useSidebar()
  const isMobile = useIsMobile()
  const router = useRouter()

  // Business Profile Data
  const [businessData, setBusinessData] = React.useState({
    businessName: "",
    industry: "",
    businessType: "",
    businessAddress: "",
    city: "",
    country: "",
    multipleBranches: "yes",
  })

  // Loading state
  const [isLoading, setIsLoading] = React.useState(false)

  // Refs to maintain focus
  const businessNameRef = React.useRef(null)
  const businessAddressRef = React.useRef(null)
  const cityRef = React.useRef(null)

  const handleBusinessInputChange = React.useCallback((field, value) => {
    setBusinessData((prev) => ({ ...prev, [field]: value }))
  }, [])

  // Create stable event handlers for inputs
  const handleBusinessNameChange = React.useCallback((e) => {
    const value = e.target.value
    handleBusinessInputChange("businessName", value)
    // Maintain focus after state update
    setTimeout(() => {
      if (businessNameRef.current) {
        businessNameRef.current.focus()
      }
    }, 0)
  }, [handleBusinessInputChange])

  const handleBusinessAddressChange = React.useCallback((e) => {
    const value = e.target.value
    handleBusinessInputChange("businessAddress", value)
    // Maintain focus after state update
    setTimeout(() => {
      if (businessAddressRef.current) {
        businessAddressRef.current.focus()
      }
    }, 0)
  }, [handleBusinessInputChange])

  const handleCityChange = React.useCallback((e) => {
    const value = e.target.value
    handleBusinessInputChange("city", value)
    // Maintain focus after state update
    setTimeout(() => {
      if (cityRef.current) {
        cityRef.current.focus()
      }
    }, 0)
  }, [handleBusinessInputChange])

  // Create stable handlers for Select components
  const handleIndustryChange = React.useCallback((value) => {
    handleBusinessInputChange("industry", value)
  }, [handleBusinessInputChange])

  const handleBusinessTypeChange = React.useCallback((value) => {
    handleBusinessInputChange("businessType", value)
  }, [handleBusinessInputChange])

  const handleCountryChange = React.useCallback((value) => {
    handleBusinessInputChange("country", value)
  }, [handleBusinessInputChange])

  // Handle multiple branches selection
  const handleMultipleBranchesChange = React.useCallback((value) => {
    handleBusinessInputChange("multipleBranches", value)
  }, [handleBusinessInputChange])

  const handleSave = React.useCallback(async () => {
    try {
      // Validate required fields
      const requiredFields = ['businessName', 'industry', 'businessType', 'businessAddress', 'city', 'country']
      const missingFields = requiredFields.filter(field => !businessData[field]?.trim())
      
      if (missingFields.length > 0) {
        alert(`Please fill in all required fields: ${missingFields.join(', ')}`)
        return
      }

      setIsLoading(true)
      console.log("Saving business profile:", businessData)
      
      // Call API to save business profile
      const response = await api.post('/business-profile', businessData)
      console.log("Business profile saved:", response.data)
      
      // Update user's business profile completion status
      await api.put('/auth/user', { 
        hasBusinessProfile: true 
      })
      console.log("Business profile status updated in backend")
      
      // Call completion callback with saved data
      onComplete?.({ businessData: response.data })
      onCancel()
    } catch (error) {
      console.error("Error saving business profile:", error)
      // Show user-friendly error message
      const errorMessage = error.response?.data?.message || "Failed to save business profile. Please try again."
      alert(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [businessData, onComplete, onCancel])

  const handleCancel = React.useCallback(() => {
    onCancel?.()
    onOpenChange?.(false)
    setOpen(false)
  }, [onCancel, onOpenChange, setOpen])

  const handleBack = React.useCallback(() => {
    handleCancel()
  }, [handleCancel])

  // Step 1: Business Profile Form
  const BusinessProfileContent = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="space-y-2">
        <Label htmlFor="businessName" className="text-sm font-normal text-[#081F24]">
          Name of your business
        </Label>
        <Input
          ref={businessNameRef}
          id="businessName"
          value={businessData.businessName}
          onChange={handleBusinessNameChange}
          className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-all"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2 w-full">
          <Label className="text-sm font-normal text-[#081F24]">Industry</Label>
          <Select value={businessData.industry} onValueChange={handleIndustryChange}>
            <SelectTrigger className="!h-12 !min-h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg w-full">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent className='z-[10001]'>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="manufacturing">Manufacturing</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 w-full">
          <Label className="text-sm font-normal text-[#081F24]">Type of business</Label>
          <Select
            value={businessData.businessType}
            onValueChange={handleBusinessTypeChange}
          >
            <SelectTrigger className="!h-12 !min-h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg w-full">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent className='z-[10001]'>
              <SelectItem value="llc">LLC</SelectItem>
              <SelectItem value="corporation">Corporation</SelectItem>
              <SelectItem value="partnership">Partnership</SelectItem>
              <SelectItem value="sole-proprietorship">Sole Proprietorship</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="businessAddress" className="text-sm font-normal text-[#081F24]">
          Specify your business address
        </Label>
        <Input
          ref={businessAddressRef}
          id="businessAddress"
          value={businessData.businessAddress}
          onChange={handleBusinessAddressChange}
          className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-all"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="city" className="text-sm font-normal text-[#081F24]">
            City
          </Label>
          <Input
            ref={cityRef}
            id="city"
            value={businessData.city}
            onChange={handleCityChange}
            className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-all"
          />
        </div>

        <div className="space-y-2 w-full">
          <Label className="text-sm font-normal text-[#081F24]">Country of Location</Label>
          <Select value={businessData.country} onValueChange={handleCountryChange}>
            <SelectTrigger className="h-12 min-h-12 w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent className='z-[10001]'>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="ca">Canada</SelectItem>
              <SelectItem value="uk">United Kingdom</SelectItem>
              <SelectItem value="au">Australia</SelectItem>
              <SelectItem value="de">Germany</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="multipleBranches" className="text-sm font-normal text-[#081F24]">
          Do you have multiple branches?
        </Label>
        <div
          className="flex bg-white rounded-lg mt-1 border border-gray-200 overflow-hidden shadow-sm"
          id="multipleBranches"
        >
          <button
            onClick={() => handleMultipleBranchesChange("yes")}
            className={`
              relative flex-1 p-3 sm:p-4 flex items-center justify-center transition-colors text-sm sm:text-base
              ${businessData.multipleBranches === "yes" ? "bg-[#FAFAFA]" : "bg-white text-[#081F24] hover:bg-gray-50"}
            `}
          >
            <span>Yes</span>
            {businessData.multipleBranches === "yes" && (
              <div className="absolute top-1 right-1 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-2 h-2 text-white" />
              </div>
            )}
          </button>
          <div className="w-px bg-gray-200"></div>
          <button
            onClick={() => handleMultipleBranchesChange("no")}
            className={`
              relative flex-1 p-3 sm:p-4 flex items-center justify-center transition-colors text-sm sm:text-base
              ${businessData.multipleBranches === "no" ? "bg-[#FAFAFA]" : "bg-white text-[#081F24] hover:bg-gray-50"}
            `}
          >
            <span>No</span>
            {businessData.multipleBranches === "no" && (
              <div className="absolute top-1 right-1 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-2 h-2 text-white" />
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  )

  // Get title
  const getStepTitle = () => {
    return "Setup business profile"
  }

  // Get content
  const getCurrentContent = () => {
    return <BusinessProfileContent />
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

export { MultiStepBusinessSetup }
