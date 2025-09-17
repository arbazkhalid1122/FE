"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Header from "@/components/Header"
import axios from "@/lib/axios"

function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#081f24] relative overflow-hidden">
      <BackgroundElements />
      <Header variant="dark" className="relative z-20" />
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] sm:min-h-[calc(100vh-120px)] px-4 py-8">
        <Suspense fallback={<div className="text-white text-center">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  )
}

export default ResetPasswordPage

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    email: "",
    code: "",
    password: "",
    confirmPassword: ""
  })
  const [hasEmailFromUrl, setHasEmailFromUrl] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    const emailParam = searchParams.get('email')
    const codeParam = searchParams.get('code')
    if (emailParam) {
      setFormData(prev => ({ ...prev, email: emailParam }))
      setHasEmailFromUrl(true)
    }
    if (codeParam) {
      setFormData(prev => ({ ...prev, code: codeParam }))
    }
  }, [searchParams])

  const handleResetPassword = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match")
      return
    }

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await axios.post('/auth/reset-password', {
        email: formData.email,
        code: formData.code,
        password: formData.password
      })
      setSuccess('Password reset successfully! Redirecting to sign in...')
      setTimeout(() => {
        router.push('/sign-in')
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
          Reset your password 🔐
        </h1>
        <p className="text-sm sm:text-base text-[#5f6057] leading-relaxed">
          {hasEmailFromUrl ? 
            "Enter the reset code and create a new password." : 
            "Enter your email, reset code, and create a new password."
          }
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

      <div className="space-y-4 sm:space-y-6">
        {!hasEmailFromUrl && (
          <div>
            <label className="block text-sm font-medium text-[#272635] mb-2">Email Address</label>
            <Input
              type="email"
              placeholder="Enter your email address"
              className="w-full border-[#e4e4e7] focus:border-[#03a84e] focus:ring-[#03a84e] h-12 sm:h-14 px-4 text-sm sm:text-base"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        )}

        {hasEmailFromUrl && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-sm text-green-700">
                Reset code sent to <span className="font-medium">{formData.email}</span>
              </p>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-[#272635] mb-2">Reset Code</label>
          <Input
            type="text"
            placeholder={hasEmailFromUrl ? "Enter the reset code" : "Enter the reset code from console"}
            className="w-full border-[#e4e4e7] focus:border-[#03a84e] focus:ring-[#03a84e] h-12 sm:h-14 px-4 text-sm sm:text-base"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#272635] mb-2">New Password</label>
          <Input
            type="password"
            placeholder="Enter your new password"
            className="w-full border-[#e4e4e7] focus:border-[#03a84e] focus:ring-[#03a84e] h-12 sm:h-14 px-4 text-sm sm:text-base"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#272635] mb-2">Confirm New Password</label>
          <Input
            type="password"
            placeholder="Confirm your new password"
            className="w-full border-[#e4e4e7] focus:border-[#03a84e] focus:ring-[#03a84e] h-12 sm:h-14 px-4 text-sm sm:text-base"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          />
        </div>
      </div>

      <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={() => router.push('/sign-in')}
          className="bg-white text-black border-[#e4e4e7] hover:bg-gray-50 w-fit h-12 sm:h-14 text-xs sm:text-sm lg:text-base font-medium rounded-lg shadow-sm px-6"
        >
          Back to Sign In
        </Button>
        <Button
          onClick={handleResetPassword}
          disabled={loading || !formData.email || !formData.code || !formData.password || !formData.confirmPassword}
          variant="default"
          size="lg"
          className="bg-[#081f24] hover:bg-[#0d2c0d] text-white w-fit h-12 sm:h-14 text-xs sm:text-sm lg:text-base font-medium rounded-lg shadow-sm px-6"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </Button>
      </div>

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
