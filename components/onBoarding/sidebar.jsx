"use client"

import * as React from "react"
import { Check, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, useSidebar } from "@/components/ui/sidebar"
import { Sheet, SheetContent, SheetHeader, SheetFooter } from "@/components/ui/sheet"
import axios from "axios"
import api from "@/lib/axios"
import { getSession, useSession } from "next-auth/react"
import { onboardingBusinessProfileSchema } from "@/lib/validations"
import { toast } from "react-hot-toast"

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

// Error message component
const ErrorMessage = ({ error, show }) => {
  if (!show || !error) return null
  return <p className="text-red-500 text-xs mt-1">{error}</p>
}

// Move components outside to prevent recreation on every render
const HeaderContent = React.memo(({ onCancel }) => (
  <div className="flex items-center gap-3 px-4 sm:px-6 py-4">
    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg border border-gray-100/80" onClick={onCancel}>
      <ChevronLeft className="h-5 w-5 text-[#03A84E]" />
    </Button>
    <h1 className="sm:text-lg text-gray-900 font-semibold">Setup business profile</h1>
  </div>
))

const FooterContent = React.memo(({ onCancel, onSave, isSubmitting, hasErrors }) => (
  <div className="px-4 sm:px-6 py-4">
    <div className="flex gap-3 justify-between">
      <Button
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
        className="h-11 border-gray-200 text-[#081F24] hover:bg-gray-50 bg-transparent rounded-lg transition-all flex-1 sm:flex-none"
      >
        Cancel
      </Button>
      <Button
        onClick={onSave}
        disabled={isSubmitting || hasErrors}
        className="h-11 bg-gray-900 text-white hover:bg-gray-800 rounded-lg transition-all flex-1 sm:flex-none disabled:bg-gray-400"
      >
        {isSubmitting ? "Saving..." : "Save"}
      </Button>
    </div>
  </div>
))

const FormContent = React.memo(
  ({
    formData,
    selected,
    onInputChange,
    onSelectedChange,
    onFieldBlur,
    errors,
    touchedFields,
  }) => (
    <div className="space-y-4 sm:space-y-6">
      {/* Business Name */}
      <div className="space-y-2">
        <Label htmlFor="businessName" className="text-sm font-normal text-[#081F24]">
          Name of your business <span className="text-red-500">*</span>
        </Label>
        <Input
          id="businessName"
          value={formData.businessName}
          onChange={(e) => onInputChange("businessName", e.target.value)}
          onBlur={() => onFieldBlur("businessName")}
          className={`
            h-11 rounded-lg transition-all
            ${touchedFields.businessName && errors.businessName 
              ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" 
              : "border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            }
          `}
        />
        <ErrorMessage error={errors.businessName} show={touchedFields.businessName} />
      </div>

      {/* Industry and Business Type Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2 w-full">
          <Label className="text-sm font-normal text-[#081F24]">Industry <span className="text-red-500">*</span></Label>
          <Select 
            value={formData.industry} 
            onValueChange={(value) => {
              onInputChange("industry", value)
              // Pass the value directly to ensure validation uses the new value
              onFieldBlur("industry", value)
            }}
          >
            <SelectTrigger 
              className={`
                !h-12 !min-h-12 rounded-lg w-full
                ${touchedFields.industry && errors.industry 
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" 
                  : "border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                }
              `}
            >
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent className='z-100'>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="manufacturing">Manufacturing</SelectItem>
            </SelectContent>
          </Select>
          <ErrorMessage error={errors.industry} show={touchedFields.industry} />
        </div>
        <div className="space-y-2 w-full">
          <Label className="text-sm font-normal text-[#081F24]">Type of business <span className="text-red-500">*</span></Label>
          <Select 
            value={formData.businessType} 
            onValueChange={(value) => {
              onInputChange("businessType", value)
              // Pass the value directly to ensure validation uses the new value
              onFieldBlur("businessType", value)
            }}
          >
            <SelectTrigger 
              className={`
                !h-12 !min-h-12 rounded-lg w-full
                ${touchedFields.businessType && errors.businessType 
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" 
                  : "border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                }
              `}
            >
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent className='z-100'>
              <SelectItem value="llc">LLC</SelectItem>
              <SelectItem value="corporation">Corporation</SelectItem>
              <SelectItem value="partnership">Partnership</SelectItem>
              <SelectItem value="sole-proprietorship">Sole Proprietorship</SelectItem>
            </SelectContent>
          </Select>
          <ErrorMessage error={errors.businessType} show={touchedFields.businessType} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="businessAddress" className="text-sm font-normal text-[#081F24]">
          Specify your business address <span className="text-red-500">*</span>
        </Label>
        <Input
          id="businessAddress"
          value={formData.businessAddress}
          onChange={(e) => onInputChange("businessAddress", e.target.value)}
          onBlur={() => onFieldBlur("businessAddress")}
          className={`
            h-11 rounded-lg transition-all
            ${touchedFields.businessAddress && errors.businessAddress 
              ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" 
              : "border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            }
          `}
        />
        <ErrorMessage error={errors.businessAddress} show={touchedFields.businessAddress} />
      </div>

      {/* City and Country Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="city" className="text-sm font-normal text-[#081F24]">
            City <span className="text-red-500">*</span>
          </Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => onInputChange("city", e.target.value)}
            onBlur={() => onFieldBlur("city")}
            className={`
              h-12 rounded-lg transition-all
              ${touchedFields.city && errors.city 
                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" 
                : "border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              }
            `}
          />
          <ErrorMessage error={errors.city} show={touchedFields.city} />
        </div>
        <div className="space-y-2 w-full">
          <Label className="text-sm font-normal text-[#081F24]">Country of Location <span className="text-red-500">*</span></Label>
          <Select 
            value={formData.country} 
            onValueChange={(value) => {
              onInputChange("country", value)
              // Pass the value directly to ensure validation uses the new value
              onFieldBlur("country", value)
            }}
          >
            <SelectTrigger 
              className={`
                h-12 min-h-12 w-full rounded-lg
                ${touchedFields.country && errors.country 
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" 
                  : "border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                }
              `}
            >
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent className='z-100'>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="ca">Canada</SelectItem>
              <SelectItem value="uk">United Kingdom</SelectItem>
              <SelectItem value="au">Australia</SelectItem>
              <SelectItem value="de">Germany</SelectItem>
            </SelectContent>
          </Select>
          <ErrorMessage error={errors.country} show={touchedFields.country} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="multipleBranches" className="text-sm font-normal text-[#081F24]">
          Do you have multiple branches? <span className="text-red-500">*</span>
        </Label>
        <div
          className={`
            flex bg-white rounded-lg mt-1 border overflow-hidden shadow-sm
            ${touchedFields.multipleBranches && errors.multipleBranches 
              ? "border-red-300" 
              : "border-gray-200"
            }
          `}
          id="multipleBranches"
        >
          {/* Yes Option */}
          <button
            type="button"
            onClick={() => {
              onSelectedChange("yes")
              onFieldBlur("multipleBranches", "yes")
            }}
            className={`
            relative flex-1 p-3 sm:p-4 flex items-center justify-center transition-colors text-sm sm:text-base
            ${selected === "yes" ? "bg-[#FAFAFA]" : "bg-white text-[#081F24] hover:bg-gray-50"}
          `}
          >
            <span className="">Yes</span>
            {selected === "yes" && (
              <div className="absolute top-1 right-1 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-2 h-2 text-white" />
              </div>
            )}
          </button>
          {/* Divider */}
          <div className="w-px bg-gray-200"></div>
          {/* No Option */}
          <button
            type="button"
            onClick={() => {
              onSelectedChange("no")
              onFieldBlur("multipleBranches", "no")
            }}
            className={`
            relative flex-1 p-3 sm:p-4 flex items-center justify-center transition-colors text-sm sm:text-base
            ${selected === "no" ? "bg-[#FAFAFA]" : "bg-white text-[#081F24] hover:bg-gray-50"}
          `}
          >
            <span className="">No</span>
            {selected === "no" && (
              <div className="absolute top-1 right-1 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-2 h-2 text-white" />
              </div>
            )}
          </button>
        </div>
        <ErrorMessage error={errors.multipleBranches} show={touchedFields.multipleBranches} />
      </div>
    </div>
  ),
)

function BusinessProfileForm({ onSave, onCancel, open = true, onOpenChange }) {
  const { setOpen } = useSidebar()  
  const isMobile = useIsMobile()
  const [selected, setSelected] = React.useState("yes")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [errors, setErrors] = React.useState({})
  const [touchedFields, setTouchedFields] = React.useState({})
  const [formData, setFormData] = React.useState({
    businessName: "",
    industry: "",
    businessType: "",
    businessAddress: "",
    city: "",
    country: "",
    multipleBranches: "yes",
  })

  // Validate a single field
  const validateField = React.useCallback((field, value) => {
    try {
      // Handle empty values for required fields
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        const errorMessage = field === 'businessName' ? 'Business name is required' :
                            field === 'industry' ? 'Industry is required' :
                            field === 'businessType' ? 'Business type is required' :
                            field === 'businessAddress' ? 'Business address is required' :
                            field === 'city' ? 'City is required' :
                            field === 'country' ? 'Country is required' :
                            field === 'multipleBranches' ? 'Please specify if you have multiple branches' :
                            'This field is required'
        setErrors(prev => ({ ...prev, [field]: errorMessage }))
        return errorMessage
      }

      // Create a partial object for validation
      const dataToValidate = { [field]: value }
      const fieldSchema = onboardingBusinessProfileSchema.pick({ [field]: true })
      
      fieldSchema.parse(dataToValidate)
      
      // Clear error if validation passes
      setErrors(prev => {
        const { [field]: removed, ...rest } = prev
        return rest
      })
      return null
    } catch (error) {
      const errorMessage = error.errors?.[0]?.message || "Invalid input"
      setErrors(prev => ({ ...prev, [field]: errorMessage }))
      return errorMessage
    }
  }, [])

  // Validate entire form
  const validateForm = React.useCallback(() => {
    try {
      const formDataWithBranches = {
        ...formData,
        multipleBranches: selected
      }
      onboardingBusinessProfileSchema.parse(formDataWithBranches)
      setErrors({})
      return true
    } catch (error) {
      const newErrors = {}
      error.errors?.forEach(err => {
        newErrors[err.path[0]] = err.message
      })
      setErrors(newErrors)
      return false
    }
  }, [formData, selected])

  // Memoize the input change handler to prevent recreation
  const handleInputChange = React.useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    
    // If field was previously touched, validate immediately with the new value
    if (touchedFields[field]) {
      validateField(field, value)
    }
  }, [touchedFields, validateField])

  // Handle field blur for validation
  const handleFieldBlur = React.useCallback((field, specificValue = null) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }))
    
    // Get the current value - use specificValue if provided, otherwise get from state
    let currentValue
    if (specificValue !== null) {
      currentValue = specificValue
    } else if (field === "multipleBranches") {
      currentValue = selected
    } else {
      currentValue = formData[field]
    }
    
    // Validate immediately with the current value
    validateField(field, currentValue)
  }, [formData, selected, validateField])

  // Memoize the selected change handler
  const handleSelectedChange = React.useCallback((value) => {
    setSelected(value)
  }, [])

  const handleSave = React.useCallback(async () => {
    // Mark all fields as touched to show validation errors
    const allFields = {
      businessName: true,
      industry: true,
      businessType: true,
      businessAddress: true,
      city: true,
      country: true,
      multipleBranches: true
    }
    setTouchedFields(allFields)

    // Create the complete form data for validation
    const completeFormData = {
      ...formData,
      multipleBranches: selected,
    }

    // Validate form and collect all errors
    try {
      onboardingBusinessProfileSchema.parse(completeFormData)
    } catch (error) {
      // Set all validation errors in state
      const newErrors = {}
      error.errors?.forEach(err => {
        newErrors[err.path[0]] = err.message
      })
      setErrors(newErrors)
      
      // Show toast with first error or generic message
      const firstError = error.errors?.[0]?.message || "Please fill in all required fields"
      toast.error(firstError)
      return
    }

    setIsSubmitting(true)
    try {
      const res = await api.post("/business-profile", completeFormData)
      toast.success("Business profile saved successfully!")
      console.log("Business profile saved:", res.data)
      onSave?.(completeFormData)
      // Redirect to dashboard after successful save
      window.location.href = "/dashboard"
    } catch (err) {
      console.error("Failed to save business profile:", err)
      toast.error(err.response?.data?.message || "Failed to save business profile. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, selected, onSave])


  const handleCancel = React.useCallback(() => {
    onCancel?.()
    onOpenChange?.(false)
    setOpen(false)
  }, [onCancel, onOpenChange, setOpen])

  // Mobile drawer
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full p-0 flex flex-col bg-white">
          <SheetHeader className="border-b border-gray-100/80 p-0 bg-white shrink-0">
            <HeaderContent onCancel={handleCancel} />
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
            <FormContent
              formData={formData}
              selected={selected}
              onInputChange={handleInputChange}
              onSelectedChange={handleSelectedChange}
              onFieldBlur={handleFieldBlur}
              errors={errors}
              touchedFields={touchedFields}
            />
          </div>
          <SheetFooter className="border-t border-gray-100/80 p-0 bg-white/90 shrink-0">
            <FooterContent 
              onCancel={handleCancel} 
              onSave={handleSave} 
              isSubmitting={isSubmitting}
              hasErrors={Object.keys(errors).length > 0}
            />
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
        zIndex: 500,
      }}
    >
      <SidebarHeader className="border-b border-gray-100/80 p-0 bg-white">
        <HeaderContent onCancel={handleCancel} />
      </SidebarHeader>
      <SidebarContent className="px-4 sm:px-6 py-6 overflow-y-auto bg-white rounded-2xl">
        <FormContent
          formData={formData}
          selected={selected}
          onInputChange={handleInputChange}
          onSelectedChange={handleSelectedChange}
          onFieldBlur={handleFieldBlur}
          errors={errors}
          touchedFields={touchedFields}
        />
      </SidebarContent>
      <SidebarFooter className="border-t border-gray-100/80 p-0 rounded-b-2xl bg-white/90">
        <FooterContent 
          onCancel={handleCancel} 
          onSave={handleSave} 
          isSubmitting={isSubmitting}
          hasErrors={Object.keys(errors).length > 0}
        />
      </SidebarFooter>
    </Sidebar>
  )
}

export { BusinessProfileForm }
