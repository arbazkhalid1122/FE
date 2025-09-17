"use client"

import * as React from "react"
import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, useSidebar, SidebarProvider } from "@/components/ui/sidebar"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { inviteMemberSchema } from "@/lib/validations"
import { useIsMobile } from "@/hooks/use-mobile"
import api from "@/lib/axios"
import { toast } from "react-hot-toast"

// Error message component
const ErrorMessage = ({ error, show }) => {
  if (!show || !error) return null
  return <p className="text-red-500 text-xs mt-1">{error}</p>
}

// Header component
const HeaderContent = React.memo(({ onCancel }) => (
  <div className="flex items-center justify-between p-4 sm:p-6">
    <div>
      <h2 className="text-lg font-semibold text-gray-900">Invite Team Member</h2>
      <p className="text-sm text-gray-600 mt-1">Send an invitation to join your workspace</p>
    </div>
    <Button
      variant="ghost"
      size="sm"
      onClick={onCancel}
      className="shrink-0 rounded-full p-2 hover:bg-gray-100"
    >
      <X className="h-4 w-4" />
    </Button>
  </div>
))

// Footer component
const FooterContent = React.memo(({ onCancel, onSave, isSubmitting, hasErrors }) => (
  <div className="flex items-center justify-between gap-3 p-4 sm:p-6">
    <Button
      variant="outline"
      onClick={onCancel}
      disabled={isSubmitting}
      className="border-gray-200 text-gray-700 hover:bg-gray-50 w-[fit-coontent]"
    >
      Cancel
    </Button>
    <Button
      onClick={onSave}
      disabled={isSubmitting || hasErrors}
      className="w-[fit-coontent] bg-black hover:bg-black/80 text-white disabled:bg-gray-300"
    >
      {isSubmitting ? "Sending Invite..." : "Send Invite"}
    </Button>
  </div>
))

// Form content component
const FormContent = React.memo(
  ({ formData, onInputChange, onFieldBlur, onRoleChange, errors, touchedFields }) => (
    <div className="space-y-6">
      {/* Email Field */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Email Address <span className="text-red-500">*</span>
        </label>
        <Input
          type="email"
          placeholder="Enter email address"
          value={formData.email}
          onChange={(e) => onInputChange("email", e.target.value)}
          onBlur={() => onFieldBlur("email")}
          className={`
            transition-colors duration-200 rounded-sm py-6 px-4
            ${touchedFields.email && errors.email 
              ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" 
              : "border-gray-200 focus:border-[#03A84E] focus:ring-[#03A84E]/20"
            }
          `}
        />
        <ErrorMessage error={errors.email} show={touchedFields.email} />
      </div>

      {/* Role Field */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Role <span className="text-red-500">*</span>
        </label>
        <Select value={formData.role} onValueChange={(value) => onRoleChange(value)}>
          <SelectTrigger
            className={`h-11 min-h-11
              transition-colors duration-200
              ${touchedFields.role && errors.role 
                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" 
                : "border-gray-200 focus:border-[#03A84E] focus:ring-[#03A84E]/20"
              }
            `}
            onBlur={() => onFieldBlur("role")}
          >
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent className='z-100'>
            <SelectItem value="USER">Member</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
          </SelectContent>
        </Select>
        <ErrorMessage error={errors.role} show={touchedFields.role} />
      </div>

    
    </div>
  ),
)

function InviteMemberForm({ onSave, onCancel, open = true, onOpenChange }) {
  const { setOpen } = useSidebar()  
  const isMobile = useIsMobile()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [touchedFields, setTouchedFields] = useState({})
  const [formData, setFormData] = useState({
    email: "",
    role: "",
  })

  // Validate a single field
  const validateField = React.useCallback((field, value) => {
    try {
      // Handle empty values for required fields
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        const errorMessage = field === 'email' ? 'Email address is required' :
                            field === 'role' ? 'Role is required' :
                            'This field is required'
        setErrors(prev => ({ ...prev, [field]: errorMessage }))
        return errorMessage
      }

      // Create a partial object for validation
      const dataToValidate = { [field]: value }
      const fieldSchema = inviteMemberSchema.pick({ [field]: true })
      
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

  // Memoize the input change handler to prevent recreation
  const handleInputChange = React.useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    
    // If field was previously touched, validate immediately
    if (touchedFields[field]) {
      // Use setTimeout to ensure state update happens first
      setTimeout(() => {
        validateField(field, value)
      }, 0)
    }
  }, [touchedFields, validateField])

  // Handle field blur for validation
  const handleFieldBlur = React.useCallback((field) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }))
    
    // Get the current value
    const currentValue = formData[field]
    
    // Use setTimeout to ensure touched state update happens first
    setTimeout(() => {
      validateField(field, currentValue)
    }, 0)
  }, [formData, validateField])

  // Handle role change
  const handleRoleChange = React.useCallback((value) => {
    handleInputChange("role", value)
    // Also mark as touched since user interacted with it
    setTouchedFields(prev => ({ ...prev, role: true }))
  }, [handleInputChange])

  const handleSave = React.useCallback(async () => {
    // Mark all fields as touched to show validation errors
    const allFields = {
      email: true,
      role: true
    }
    setTouchedFields(allFields)

    // Validate form and collect all errors
    try {
      inviteMemberSchema.parse(formData)
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
      const res = await api.post("/invites", formData)
      
      // Generate the invitation link
      const inviteLink = `${window.location.origin}/invitation-accept?inviteId=${res.data.id}&email=${formData.email}&role=${formData.role}&name=${encodeURIComponent('EnvoyX User')}`
      
      // Enhanced console logging for testing
      console.log("🎉 INVITATION SENT SUCCESSFULLY!")
      console.log("=" .repeat(50))
      console.log("📨 Backend Response:", res.data)
      console.log("🔗 Generated Invitation Link:", inviteLink)
      console.log("📧 Invited Email:", formData.email)
      console.log("👤 Role Assigned:", formData.role)
      console.log("👨‍💼 Inviter:", 'EnvoyX User')
      console.log("🆔 Invitation ID:", res.data.id)
      console.log("📅 Created At:", new Date().toISOString())
      console.log("=" .repeat(50))
      
      // Test link instructions
      console.log("🧪 TESTING INSTRUCTIONS:")
      console.log("1. Copy the invitation link above")
      console.log("2. Open it in a new tab/window")
      console.log("3. Test the invitation acceptance flow")
      console.log("=" .repeat(50))
      
      // Success message with link
      toast.success(`Invitation sent to ${formData.email}! Check console for invitation link.`)
      
      // Call onSave with additional data including the link
      onSave?.({
        ...formData,
        inviteId: res.data.id,
        inviteLink: inviteLink,
        inviteResponse: res.data
      })
      
      // Reset form
      setFormData({ email: "", role: "" })
      setErrors({})
      setTouchedFields({})
    } catch (err) {
      console.error("❌ INVITATION FAILED!")
      console.error("Error details:", err)
      console.error("Response data:", err.response?.data)
      console.error("Status code:", err.response?.status)
      toast.error(err.response?.data?.message || "Failed to send invitation. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, onSave])

  const handleCancel = React.useCallback(() => {
    onCancel?.()
    onOpenChange?.(false)
    setOpen(false)
    // Reset form
    setFormData({ email: "", role: "" })
    setErrors({})
    setTouchedFields({})
  }, [onCancel, onOpenChange, setOpen])

  // Mobile drawer
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full max-w-md p-0">
          <SheetHeader className="text-left">
            <HeaderContent onCancel={handleCancel} />
          </SheetHeader>
          <div className="px-4 pb-4 overflow-y-auto flex-1">
            <FormContent
              formData={formData}
              onInputChange={handleInputChange}
              onFieldBlur={handleFieldBlur}
              onRoleChange={handleRoleChange}
              errors={errors}
              touchedFields={touchedFields}
            />
          </div>
          <FooterContent 
            onCancel={handleCancel} 
            onSave={handleSave} 
            isSubmitting={isSubmitting}
            hasErrors={Object.keys(errors).length > 0}
          />
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
          onInputChange={handleInputChange}
          onFieldBlur={handleFieldBlur}
          onRoleChange={handleRoleChange}
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

export { InviteMemberForm }
