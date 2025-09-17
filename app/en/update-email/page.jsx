'use client'

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "react-hot-toast"
import api from "@/lib/axios"

function UpdateEmailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    newEmail: '',
    code: '',
    existingEmail: ''
  })

  useEffect(() => {
    const code = searchParams.get('code')
    const email = searchParams.get('email')
    
    if (code && email) {
      setFormData(prev => ({
        ...prev,
        code,
        existingEmail: email
      }))
    }
  }, [searchParams])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await api.post('/auth/user/email/confirm', {
        email: formData.newEmail,
        code: formData.code,
        existingEmail: formData.existingEmail
      })

      if (response.data) {
        toast.success('Email updated successfully! You can now sign in with your new email.')
        router.push('/sign-in')
      }
    } catch (error) {
      console.error('Error confirming email update:', error)
      toast.error(error.response?.data?.message || 'Failed to update email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Update Your Email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your new email address to complete the email update process
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="existingEmail">Current Email</Label>
              <Input
                id="existingEmail"
                name="existingEmail"
                type="email"
                value={formData.existingEmail}
                readOnly
                className="bg-gray-50"
              />
            </div>
            
            <div>
              <Label htmlFor="newEmail">New Email Address</Label>
              <Input
                id="newEmail"
                name="newEmail"
                type="email"
                required
                value={formData.newEmail}
                onChange={handleInputChange}
                placeholder="Enter your new email address"
              />
            </div>
            
            <div>
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                name="code"
                type="text"
                required
                value={formData.code}
                onChange={handleInputChange}
                placeholder="Enter the verification code"
              />
            </div>
          </div>

          <div>
            <Button 
              variant="default"
              size="default"
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Updating Email...' : 'Update Email'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function UpdateEmailPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <UpdateEmailContent />
    </Suspense>
  )
}

