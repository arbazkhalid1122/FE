"use client"

import { CircleQuestionMark } from "lucide-react"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Header from "@/components/Header"
import axios from "@/lib/axios"

function ValidateAccessCodePage() {
  return (
    <div className="min-h-screen bg-[#081f24] relative overflow-hidden">
      <BackgroundElements />
      <Header variant="dark" className="relative z-20" />
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] sm:min-h-[calc(100vh-120px)] px-4 py-4 sm:py-0">
        <Suspense fallback={<div className="text-white text-center">Loading...</div>}>
          <ValidationForm />
        </Suspense>
      </div>
    </div>
  )
}

export default ValidateAccessCodePage

function ValidationForm() {
  const [accessCode, setAccessCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [email, setEmail] = useState("")
  const [isOtpMode, setIsOtpMode] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check if this is an OTP verification (email in URL params)
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(emailParam)
      setIsOtpMode(true)
    }
  }, [searchParams])

  const handleValidate = async () => {
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      if (isOtpMode) {
        // Handle OTP verification
        const response = await axios.post('/auth/verify-otp', {
          email: email,
          otp: accessCode
        })
        setSuccess('Account created successfully! Redirecting to sign-in...')
        setTimeout(() => {
          router.push('/sign-in')
        }, 2000)
      } 
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid code')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await axios.post('/auth/resend-otp', {
        email: email
      })
      
      // Show new OTP in alert since email is not configured yet
      if (response.data.otp) {
        alert(`Your new OTP code is: ${response.data.otp}\n\nPlease use this code to verify your account.`)
      }
      
      setSuccess(response.data.message)
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to resend OTP')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-8 lg:p-16 max-w-xl w-full mx-4 shadow-2xl">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-medium text-[#081F24] mb-3 sm:mb-4">
          {isOtpMode ? "Verify your email" : "Validate your access code"}
        </h1>
        <p className="text-sm sm:text-base text-[#5f6057] leading-relaxed px-2 sm:px-0">
          {isOtpMode ? (
            <>
              <span className="block sm:hidden">Enter the 6-digit code sent to your email</span>
              <span className="hidden sm:block">
                We've sent a verification code to <span className="font-medium text-[#03A84E]">{email}</span>
              </span>
            </>
          ) : (
            <>
              <span className="block sm:hidden">Check your email for the code</span>
              <span className="hidden sm:block">
                Access code is way we validate each of our partner financial partner to avoid spam and reduce fraud.
              </span>
            </>
          )}
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

      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 justify-between">
          <span className="text-[#081F24] text-xs sm:text-sm">
            {isOtpMode ? "Provide the 6-digit verification code" : "Provide the 6-digit code sent to your email"}
          </span>
          <CircleQuestionMark className="w-4 h-4 sm:w-5 sm:h-5 fill-[#03A84E] text-white stroke-white" />
        </div>

        <div className="flex gap-2 sm:gap-4 mb-6 w-full">
          {[...Array(6)].map((_, i) => (
            <Input
              key={i}
              type="text"
              placeholder="."
              maxLength={1}
              className="flex-1 h-12 sm:h-16 lg:h-18 text-center text-base sm:text-lg font-semibold border-1 border-[#E4E4E7] rounded-sm shadow-none"
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '') // Only allow digits
                if (value) {
                  // Update the access code
                  const newCode = accessCode.split('')
                  newCode[i] = value
                  setAccessCode(newCode.join(''))
                  
                  // Move to next input
                  if (i < 5) {
                    const nextInput = e.target.parentElement?.children[i + 1] 
                    nextInput?.focus()
                  }
                }
              }}
              onKeyDown={(e) => {
                // Handle backspace
                if (e.key === 'Backspace' && !accessCode[i] && i > 0) {
                  const prevInput = e.target.parentElement?.children[i - 1]
                  prevInput?.focus()
                }
              }}
              onPaste={(e) => {
                e.preventDefault()
                const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
                if (pastedData.length > 0) {
                  setAccessCode(pastedData)
                  // Focus the next empty input or the last input
                  const nextEmptyIndex = Math.min(pastedData.length, 5)
                  const nextInput = e.target.parentElement?.children[nextEmptyIndex]
                  nextInput?.focus()
                }
              }}
              value={accessCode[i] || ''}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8 gap-4 sm:gap-0">
        {isOtpMode ? (
          <>
            <button 
              className="text-[#081F24] hover:text-[#03a84e] transition-colors text-sm sm:text-base order-2 sm:order-1"
              onClick={handleResendOtp}
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Resend Code"}
            </button>
            <Button
              variant="default"
              size="default"
              className="bg-[#081f24] hover:bg-[#0d2c0d] text-white px-6 sm:px-8 py-3 sm:py-6 rounded-lg w-full sm:w-auto order-1 sm:order-2"
              onClick={handleValidate}
              disabled={isLoading || accessCode.length !== 6}
            >
              {isLoading ? "Verifying..." : "Verify & Create Account"}
            </Button>
          </>
        ) : (
          <>
            <button className="text-[#081F24] hover:text-[#03a84e] transition-colors text-sm sm:text-base order-2 sm:order-1">
              {"Didn't receive any access code?"}
            </button>
            <Button
              variant="default"
              size="default"
              className="bg-[#081f24] hover:bg-[#0d2c0d] text-white px-6 sm:px-8 py-3 sm:py-6 rounded-lg w-full sm:w-auto order-1 sm:order-2"
              onClick={handleValidate}
              disabled={isLoading}
            >
              {isLoading ? "Validating..." : "Validate"}
            </Button>
          </>
        )}
      </div>

      <div className="border-t border-[#E4E4E7] my-6 sm:my-8 hidden sm:block" />

      <div className="text-center text-xs sm:text-sm text-gray-400 space-y-2 sm:space-y-1 hidden sm:block">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-0">
          <a href="#" className="hover:text-[#03a84e]">
            Privacy Policy
          </a>
          <span className="hidden sm:inline mx-2">|</span>
          <a href="#" className="hover:text-[#03a84e]">
            Terms of Use
          </a>
          <span className="hidden sm:inline mx-2">|</span>
          <a href="#" className="hover:text-[#03a84e]">
            Service Provider Agreement
          </a>
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
