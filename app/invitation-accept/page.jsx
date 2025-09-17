'use client'

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"
import api from "@/lib/axios"
import { toast } from "react-hot-toast"
import { FaCircle, FaCircleNotch } from "react-icons/fa";

function InvitationAcceptContent() {
  const searchParams = useSearchParams()
  const [step, setStep] = useState(1) // 1: Basic details, 2: Create password
  const [loading, setLoading] = useState(false)
  const [inviteData, setInviteData] = useState({
    inviteId: '',
    email: '',
    role: '',
    inviterName: ''
  })
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: ''
  })

  useEffect(() => {
    // Get invitation details from URL parameters
    const inviteId = searchParams.get('inviteId')
    const email = searchParams.get('email')
    const role = searchParams.get('role')
    const inviterName = searchParams.get('name')

    if (inviteId && email) {
      setInviteData({
        inviteId,
        email,
        role: role || 'Member',
        inviterName: inviterName || 'EnvoyX User'
      })
    }
  }, [searchParams])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleContinue = async () => {
    if (step === 1) {
      // Validate basic details
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        toast.error('Please enter your first and last name')
        return
      }
      setStep(2)
    } else {
      // Create account
      if (!formData.password || !formData.confirmPassword) {
        toast.error('Please enter and confirm your password')
        return
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match')
        return
      }
      if (formData.password.length < 8) {
        toast.error('Password must be at least 8 characters long')
        return
      }

      setLoading(true)
      try {
        // Accept the invitation and create account
        const response = await api.post('/auth/signup', {
          email: inviteData.email,
          password: formData.password,
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          inviteId: inviteData.inviteId
        })

        toast.success('Account created successfully! Please sign in.')
        // Redirect to sign in page
        window.location.href = '/sign-in'
      } catch (error) {
        console.error('Error creating account:', error)
        toast.error(error.response?.data?.message || 'Failed to create account')
      } finally {
        setLoading(false)
      }
    }
  }

  const reportInvitation = () => {
    toast.info('Invitation reported. Thank you for your feedback.')
  }

  if (!inviteData.inviteId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Invalid Invitation</h1>
          <p className="text-gray-600 mb-4">This invitation link is not valid or has expired.</p>
          <Link href="/sign-in">
            <Button>Go to Sign In</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-green-200 rounded-full opacity-20 -translate-x-16 -translate-y-16"></div>
      <div className="absolute top-20 right-10 w-24 h-24 bg-green-300 rounded-full opacity-30"></div>
      <div className="absolute bottom-20 left-20 w-40 h-40 bg-green-100 rounded-full opacity-40"></div>
      <div className="absolute bottom-0 right-0 w-56 h-56 bg-green-200 rounded-full opacity-20 translate-x-28 translate-y-28"></div>

      <div className="relative z-10  flex items-center justify-center p-4 h-screen">
        <div className="w-full max-w-lg">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-6">
              <Image src="/darkLogo.svg" alt="EnvoyX" width={100} height={100} />
            </div>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-2">
              <div className={`text-green-500`}>
                {step > 1 ? <FaCircle /> : <FaCircleNotch />                }
              </div>
              <div className="text-sm text-gray-600">Provide basic details</div>
              
              <div className="w-8 h-px bg-gray-300 mx-2"></div>
              
              <div className={`text-green-500`}>
                {step > 2 ? <FaCircle/> : <FaCircleNotch  />                }
              </div>
              <div className="text-sm text-gray-600">Secure your account</div>
            </div>
          </div>

          {/* Main card */}
          <div className=" rounded-2xl  overflow-hidden">
            <div className="p-8">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                  You've been invited to join EnvoyX 🎉
                </h1>
                <p className="text-gray-600">
                  Join EnvoyX workspace with <span className="font-semibold">{inviteData.inviterName}</span>
                </p>
              </div>

              {step === 1 ? (
                // Step 1: Basic Details
                <div className="space-y-6">
                  
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Confirm Email</label>
                    <Input
                      type="email"
                      value={inviteData.email}
                      disabled
                      className="bg-gray-50 border-gray-200 rounded-sm py-5 cursor-not-allowed"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">First name</label>
                      <Input
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="John"
                        className="border-gray-200 rounded-sm py-5 focus:border-green-500 focus:ring-green-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Last name</label>
                      <Input
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Doe"
                        className="border-gray-200 rounded-sm py-5 focus:border-green-500 focus:ring-green-500/20"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex gap-4 justify-end ">
                <button
                  onClick={reportInvitation}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Report this invitation
                </button>
                    <Button
                      onClick={handleContinue}
                      className="bg-[#027D3A] hover:bg-green-600 text-white py-5 rounded-md font-medium"
                    >
                      Continue →
                    </Button>
                  </div>
                </div>
              ) : (
                // Step 2: Create Password
                <div className="space-y-6">
                  <h2 className="text-lg font-medium text-gray-900">Create password</h2>
                  
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Password</label>
                    <Input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      className="border-gray-200 rounded-sm py-5 focus:border-green-500 focus:ring-green-500/20"
                    />
                    <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Confirm password</label>
                    <Input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      className="border-gray-200 rounded-sm py-5 focus:border-green-500 focus:ring-green-500/20"
                    />
                  </div>

                  <div className="pt-4 flex gap-4 justify-end ">
                <button
                  onClick={reportInvitation}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Report this invitation
                </button>
                    <Button
                      onClick={handleContinue}
                      disabled={loading}
                      className="bg-green-500 hover:bg-green-600 text-white py-5 rounded-lg font-medium disabled:bg-gray-300"
                    >
                      {loading ? 'Creating Account...' : 'Join EnvoyX →'}
                    </Button>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
          {/* Footer */}
          <div className="absolute bottom-0 left-0 w-full">

          <div className="text-center mt-8 flex justify-between px-8 py-4">
            <p className="text-sm text-gray-500">© 2025 Envoyy</p>
            <div className="flex justify-center gap-6 mt-2">
              <Link href="/terms-and-conditions" className="text-sm text-gray-500 hover:text-gray-700">Terms</Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-gray-700">Privacy</Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-gray-700">Cookies</Link>
            </div>
          </div>
          </div>
    </div>
  )
}

export default function InvitationAcceptPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <InvitationAcceptContent />
    </Suspense>
  )
}
