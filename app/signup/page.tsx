"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Header from "@/components/Header"
import { FormField } from "@/components/ui/form-field"
import { Form, useFormValidation } from "@/components/ui/form"
import { signupSchema, type SignupFormData } from "@/lib/validations"
import axios from "@/lib/axios"

function SignupPage() {
  return (
    <div className="min-h-screen bg-[#081f24] relative overflow-hidden">
      <BackgroundElements />
      <Header variant="dark" className="relative z-20" />
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] sm:min-h-[calc(100vh-120px)] px-4 py-8">
        <SignupForm />
      </div>
    </div>
  )
}

export default SignupPage

function SignupForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const form = useFormValidation<SignupFormData>(signupSchema, {
    name: "",
    email: "",
    password: "",
  })

  // Handle autocomplete events
  useEffect(() => {
    const handleAutocomplete = () => {
      // Trigger validation when autocomplete fills fields
      form.trigger();
    };

    // Listen for autocomplete events
    document.addEventListener('animationstart', handleAutocomplete);
    document.addEventListener('input', handleAutocomplete);

    return () => {
      document.removeEventListener('animationstart', handleAutocomplete);
      document.removeEventListener('input', handleAutocomplete);
    };
  }, [form]);

  const handleSignup = async (data: SignupFormData) => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await axios.post('/auth/signup-with-otp', data)
      
      // Show OTP in alert since email is not configured yet
      if (response.data.email) {
        alert(`Your OTP code is: ${response.data.email}\n\nPlease use this code to verify your account.`)
      }
      
      setSuccess(response.data.message)
      // Redirect to validate-access-code with email parameter
      setTimeout(() => {
        router.push(`/validate-access-code?email=${encodeURIComponent(data.email)}`)
      }, 2000)
    } catch (error: any) {
      setError(error.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }



  return (
    <div className="bg-white rounded-2xl p-4 sm:p-8 lg:p-12 xl:p-16 max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl w-full shadow-2xl">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-medium text-[#081F24] mb-3 sm:mb-4">
          Create your account 🚀
        </h1>
        <p className="text-sm sm:text-base text-[#5f6057] leading-relaxed">
          <span className="block text-[#03A84E] text-base sm:text-lg lg:text-xl">Join EnvoyX today</span>
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
          {success}
        </div>
      )}

      <Form schema={signupSchema} onSubmit={handleSignup}>
        {(formInstance) => (
          <>
            <div className="space-y-4 sm:space-y-6">
              <FormField
                label="Full Name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formInstance.watch("name") || ""}
                onChange={(e) => {
                  formInstance.setValue("name", e.target.value, { shouldValidate: true });
                }}
                onBlur={() => formInstance.trigger("name")}
                error={formInstance.formState.errors.name?.message}
                required
              />

              <FormField
                label="Work Email"
                name="email"
                type="email"
                placeholder="Enter your work email"
                value={formInstance.watch("email") || ""}
                onChange={(e) => {
                  formInstance.setValue("email", e.target.value, { shouldValidate: true });
                }}
                onBlur={() => formInstance.trigger("email")}
                error={formInstance.formState.errors.email?.message}
                required
              />

              <FormField
                label="Password"
                name="password"
                type="password"
                placeholder="Create a strong password"
                value={formInstance.watch("password") || ""}
                onChange={(e) => {
                  formInstance.setValue("password", e.target.value, { shouldValidate: true });
                }}
                onBlur={() => formInstance.trigger("password")}
                error={formInstance.formState.errors.password?.message}
                required
              />

            </div>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => router.push('/sign-in')}
                className="bg-white text-black border-[#e4e4e7] hover:bg-gray-50 w-fit h-12 sm:h-14 text-xs sm:text-sm lg:text-base font-medium rounded-lg shadow-sm px-6"
              >
                Already have an account?
              </Button>
              <Button
                type="submit"
                disabled={loading || !formInstance.formState.isValid}
                variant="default"
                size="lg"
                className="bg-[#081f24] hover:bg-[#0d2c0d] text-white w-fit h-12 sm:h-14 text-xs sm:text-sm lg:text-base font-medium rounded-lg shadow-sm px-6"
              >
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </div>
          </>
        )}
      </Form>

      <div className="border-t border-[#E4E4E7] my-6 sm:my-8 hidden sm:block" />

      <div className="text-center">
        <div className="text-xs sm:text-sm text-gray-400 space-y-2 hidden sm:block">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
            <a href="#" className="hover:text-[#03a84e] transition-colors">
              Privacy Policy
            </a>
            <span className="hidden sm:inline text-gray-300">|</span>
            <a href="#" className="hover:text-[#03a84e] transition-colors">
              Terms of Use
            </a>
            <span className="hidden sm:inline text-gray-300">|</span>
            <a href="#" className="hover:text-[#03a84e] transition-colors">
              Service Provider Agreement
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

function BackgroundElements() {
  return (
    <div className="absolute inset-0 bg-[#192517]">
      <img src="HeroBackgroun1.svg" alt="Mountains" className="absolute bottom-0 left-0 w-full h-auto object-cover" />
    </div>
  )
}
