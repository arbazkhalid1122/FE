"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { profileFormSchema } from "@/lib/validations"
import { toast } from "react-hot-toast"
import api from "@/lib/axios"

// Error message component for ProfileForm
const ErrorMessage = ({ error }) => {
  if (!error) return null
  return (
    <div className="flex items-center gap-1 mt-1">
      <AlertCircle className="h-4 w-4 text-red-500" />
      <span className="text-sm text-red-500">{error}</span>
    </div>
  )
}

export function ProfileForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [touchedFields, setTouchedFields] = useState({})
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    workEmail: "",
    phoneNumber: "",
    role: "",
    password: "",
    confirmPassword: "",
  })

  const router = useRouter()

  // Validate a single field
  const validateField = useCallback((field, value) => {
    try {
      const fieldSchema = profileFormSchema.shape[field]
      if (fieldSchema) {
        fieldSchema.parse(value)
        setErrors(prev => {
          const { [field]: removed, ...rest } = prev
          return rest
        })
        return null
      }
    } catch (error) {
      const errorMessage = error.errors?.[0]?.message || "Invalid input"
      setErrors(prev => ({ ...prev, [field]: errorMessage }))
      return errorMessage
    }
  }, [])

  // Validate entire form
  const validateForm = useCallback(() => {
    try {
      profileFormSchema.parse(formData)
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
  }, [formData])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    
    // Mark field as touched
    setTouchedFields(prev => ({ ...prev, [field]: true }))
    
    // Validate field in real-time if it was touched
    if (touchedFields[field]) {
      validateField(field, value)
    }
  }

  // Handle field blur for validation
  const handleFieldBlur = useCallback((field) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }))
    validateField(field, formData[field])
  }, [formData, validateField])

  const handleActivateAccount = async () => {
    // Mark all fields as touched to show validation errors
    setTouchedFields({
      firstName: true,
      lastName: true,
      workEmail: true,
      phoneNumber: true,
      role: true,
      password: true,
      confirmPassword: true
    })

    // Validate form before submission
    if (!validateForm()) {
      toast.error("Please fix the errors in the form before submitting")
      return
    }

    setIsLoading(true)
    try {
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match")
        setIsLoading(false)
        return
      }

      // Call the profile creation API
      const response = await api.post('/profile', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        workEmail: formData.workEmail,
        phoneNumber: formData.phoneNumber,
        role: formData.role,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      })

      console.log('Profile created successfully:', response.data)
      toast.success("Account activated successfully!")
      
      // Navigate to terms and conditions - middleware will check fresh user data from backend
      router.push("/terms-and-conditions")
    } catch (error) {
      console.error('Error creating profile:', error)
      toast.error(error.response?.data?.message || 'Failed to activate account. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDoLater = () => {
    router.push("/terms-and-conditions")
  }

  // Disable "Activate your account" button if any required field is empty
  const isFormIncomplete =
    !formData.firstName ||
    !formData.lastName ||
    !formData.workEmail ||
    !formData.phoneNumber ||
    !formData.role ||
    !formData.password ||
    !formData.confirmPassword

  return (
    <div className="bg-white rounded-lg p-4 sm:p-8 lg:p-12 max-w-2xl w-full mx-4 sm:mx-auto">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#272635] mb-4">Create contact profile</h1>
        <p className="text-[#5f6057] leading-relaxed max-w-md mx-auto text-sm sm:text-base">
          Provide basic details to help us identify the contact person for your business
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm text-[#272635] mb-2">First name *</label>
            <Input
              className={`w-full border-[#e4e4e7] focus:border-[#03a84e] focus:ring-[#03a84e] p-4 sm:p-6 ${
                errors.firstName && touchedFields.firstName ? 'border-red-500 focus:border-red-500' : ''
              }`}
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              onBlur={() => handleFieldBlur("firstName")}
              placeholder="Enter your first name"
            />
            <ErrorMessage error={touchedFields.firstName ? errors.firstName : null} />
          </div>
          <div>
            <label className="block text-sm text-[#272635] mb-2">Last name *</label>
            <Input
              className={`w-full border-[#e4e4e7] focus:border-[#03a84e] focus:ring-[#03a84e] p-4 sm:p-6 ${
                errors.lastName && touchedFields.lastName ? 'border-red-500 focus:border-red-500' : ''
              }`}
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              onBlur={() => handleFieldBlur("lastName")}
              placeholder="Enter your last name"
            />
            <ErrorMessage error={touchedFields.lastName ? errors.lastName : null} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm text-[#272635] mb-2">Work email *</label>
            <Input
              type="email"
              className={`w-full border-[#e4e4e7] focus:border-[#03a84e] focus:ring-[#03a84e] p-4 sm:p-6 ${
                errors.workEmail && touchedFields.workEmail ? 'border-red-500 focus:border-red-500' : ''
              }`}
              value={formData.workEmail}
              onChange={(e) => handleInputChange("workEmail", e.target.value)}
              onBlur={() => handleFieldBlur("workEmail")}
              placeholder="Enter your work email"
            />
            <ErrorMessage error={touchedFields.workEmail ? errors.workEmail : null} />
          </div>
          <div>
            <label className="block text-sm text-[#272635] mb-2">Personal phone number *</label>
            <div className="flex">
              <div className="flex items-center gap-2 px-3 border border-r-0 border-[#e4e4e7] rounded-l-md bg-[#f7f7f7]">
                <div className="w-6 h-4 bg-orange-500 rounded-sm"></div>
                <span className="text-sm">+225</span>
              </div>
              <Input
                placeholder="123 456 789"
                className={`flex-1 border-[#e4e4e7] rounded-l-none focus:border-[#03a84e] focus:ring-[#03a84e] p-4 sm:p-6 ${
                  errors.phoneNumber && touchedFields.phoneNumber ? 'border-red-500 focus:border-red-500' : ''
                }`}
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                onBlur={() => handleFieldBlur("phoneNumber")}
              />
            </div>
            <ErrorMessage error={touchedFields.phoneNumber ? errors.phoneNumber : null} />
          </div>
        </div>

        <div>
          <label className="block text-sm text-[#272635] mb-2">What's your role? *</label>
          <Select 
            value={formData.role} 
            onValueChange={(value) => {
              handleInputChange("role", value)
              handleFieldBlur("role")
            }}
          >
            <SelectTrigger className={`w-full border-[#e4e4e7] focus:border-[#03a84e] focus:ring-[#03a84e] p-4 sm:p-6 ${
              errors.role && touchedFields.role ? 'border-red-500 focus:border-red-500' : ''
            }`}>
              <SelectValue placeholder="Select or create a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ceo">CEO</SelectItem>
              <SelectItem value="cfo">CFO</SelectItem>
              <SelectItem value="cto">CTO</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="accountant">Accountant</SelectItem>
              <SelectItem value="owner">Business Owner</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <ErrorMessage error={touchedFields.role ? errors.role : null} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm text-[#272635] mb-2">Create password *</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                className={`w-full border-[#e4e4e7] focus:border-[#03a84e] focus:ring-[#03a84e] pr-12 p-4 sm:p-6 ${
                  errors.password && touchedFields.password ? 'border-red-500 focus:border-red-500' : ''
                }`}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                onBlur={() => handleFieldBlur("password")}
                placeholder="Create a strong password"
              />
              {formData.password && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#03a84e] hover:text-[#58a942]"
                >
                  {showPassword ? (
                    <span className="text-sm text-[#03a84e] hover:underline">Hide</span>
                  ) : (
                    <span className="text-sm text-[#03a84e] hover:underline">Show</span>
                  )}
                </button>
              )}
            </div>
            <ErrorMessage error={touchedFields.password ? errors.password : null} />
          </div>
          <div>
            <label className="block text-sm text-[#272635] mb-2">Confirm password *</label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                className={`w-full border-[#e4e4e7] focus:border-[#03a84e] focus:ring-[#03a84e] pr-12 p-4 sm:p-6 ${
                  errors.confirmPassword && touchedFields.confirmPassword ? 'border-red-500 focus:border-red-500' : ''
                }`}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                onBlur={() => handleFieldBlur("confirmPassword")}
                placeholder="Confirm your password"
              />
              {formData.confirmPassword && (
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#03a84e] hover:text-[#58a942]"
                >
                  {showConfirmPassword ? (
                    <span className="text-sm text-[#03a84e] hover:underline">Hide</span>
                  ) : (
                    <span className="text-sm text-[#03a84e] hover:underline">Show</span>
                  )}
                </button>
              )}
            </div>
            <ErrorMessage error={touchedFields.confirmPassword ? errors.confirmPassword : null} />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between mt-8 sm:mt-12 gap-4 sm:gap-0">
        <Button
          variant="outline"
          className="p-4 sm:p-6 bg-transparent w-full sm:w-auto order-2 sm:order-1"
          onClick={handleDoLater}
        >
          Do this later
        </Button>
        <Button
          className="bg-[#081f24] hover:bg-[#0d2c0d] text-white p-4 sm:p-6 w-full sm:w-auto order-1 sm:order-2 disabled:opacity-50"
          onClick={handleActivateAccount}
          disabled={isLoading}
        >
          {isLoading ? "Activating..." : "Activate your account"}
        </Button>
      </div>
    </div>
  )
}
