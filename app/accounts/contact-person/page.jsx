'use client'

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import api from "@/lib/axios"
import { toast } from "react-hot-toast"

export default function ContactPersonPage() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [fetchingUserData, setFetchingUserData] = useState(false);
  const [originalEmail, setOriginalEmail] = useState('');
  const [showEmailChangeButton, setShowEmailChangeButton] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });

  const fetchUserData = async () => {
    setFetchingUserData(true);
    try {
      const response = await api.get('/auth/user');
      setUserData(response.data);
      
      const nameParts = (response.data.name || '').split(' ');
      const userEmail = response.data.email || '';
      setFormData({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: userEmail,
        phoneNumber: response.data.data?.phoneNumber || '',
      });
      setOriginalEmail(userEmail);
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Fallback to session data if API call fails
      if (session?.user) {
        const nameParts = (session.user.name || '').split(' ');
        setFormData({
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          email: session.user.email || '',
          phoneNumber: session.user.data?.phoneNumber || '',
        });
      }
    } finally {
      setFetchingUserData(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchUserData();
    }
  }, [session]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Check if email has changed from original
    if (name === 'email') {
      setShowEmailChangeButton(value !== originalEmail && value.trim() !== '');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.put('/auth/user', {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        data: {
          ...session.user.data,
          phoneNumber: formData.phoneNumber,
        }
      });

      // Update session with new data
      await update({
        ...session,
        user: {
          ...session.user,
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          data: {
            ...session.user.data,
            phoneNumber: formData.phoneNumber,
          }
        }
      });

      // Refresh user data from backend
      await fetchUserData();

      toast.success('Contact information updated successfully!');
    } catch (error) {
      console.error('Error updating contact information:', error);
      toast.error(error.response?.data?.message || 'Failed to update contact information');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChangeRequest = async () => {
    setLoading(true);
    try {
      // Directly update the email via the user update endpoint
      const response = await api.put('/auth/user', {
        email: formData.email,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        data: {
          ...session.user.data,
          phoneNumber: formData.phoneNumber,
        }
      });

      // Update session with new email
      await update({
        ...session,
        user: {
          ...session.user,
          email: formData.email,
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          data: {
            ...session.user.data,
            phoneNumber: formData.phoneNumber,
          }
        }
      });

      // Update original email to new value
      setOriginalEmail(formData.email);
      setShowEmailChangeButton(false);
      
      // Refresh user data from backend
      await fetchUserData();
      
      toast.success('Email updated successfully!');
    } catch (error) {
      console.error('Error updating email:', error);
      toast.error(error.response?.data?.message || 'Failed to update email');
    } finally {
      setLoading(false);
    }
  };


  if (!session || fetchingUserData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-1">General</h1>
        <p className="text-gray-600 text-sm">Increase cashflow with your invoices</p>
      </div>
<div className="max-w-4xl mx-auto">  
      {/* Personal Information Card */}
      <div className="bg-white rounded-lg border border-[#e4e4e7] mb-6">
        <div className="p-6 border-b border-[#e4e4e7]">
          <h2 className="text-base font-medium mb-1">Personal Information</h2>
          <p className="text-sm text-[#71717A]">Real-time information about you</p>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm text-[#71717A] mb-2">First name</label>
                <Input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={true}
                  className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-all cursor-not-allowed h-11"
                />
              </div>
              
              <div>
                <label className="block text-sm text-[#71717A] mb-2">Last name</label>
                <Input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={true}
                  className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-all cursor-not-allowed h-11"
                />
              </div>
            </div>
            <div>
              <h3 className="text-sm text-[#71717A] mb-1">Profile picture</h3>
              <p className="text-xs text-[#A1A1AA] mb-4">PNG, JPG (5MB)</p>
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-full bg-[#FAFAFA] border border-[#E4E4E7] flex items-center justify-center">
                  <span className="text-sm font-medium text-[#71717A]">
                    {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
                  </span>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="text-sm h-11 font-medium">Upload photo</Button>
                  <Button variant="ghost" className="text-red-600 hover:bg-red-50">
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Account Email Card */}
      <div className="bg-white rounded-lg border border-[#e4e4e7] mb-6">
        <div className="p-6 border-b border-[#e4e4e7]">
          <h2 className="text-base font-medium mb-1">Account Email</h2>
          <p className="text-sm text-[#71717A]">This is the email linked to your account</p>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <label className="block text-sm text-[#71717A] mb-2">Work email</label>
            <Input
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="h-11 bg-white border-[#E4E4E7]"
              placeholder="Enter your email address"
            />
          </div>

          {showEmailChangeButton && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-blue-100 rounded">
                  <Shield className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    You've changed your email address. Click below to update it.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-3 h-11 text-sm font-medium bg-white hover:bg-gray-50"
                    onClick={handleEmailChangeRequest}
                    disabled={loading}
                  >
                    {loading ? 'Updating...' : 'Update Email'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {!showEmailChangeButton && formData.email === originalEmail && (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-gray-100 rounded">
                  <Shield className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    To change your email address, modify the email field above.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contact Number Card */}
      <div className="bg-white rounded-lg border border-[#e4e4e7]">
        <div className="p-6 border-b border-[#e4e4e7]">
          <h2 className="text-base font-medium mb-1">Contact number</h2>
          <p className="text-sm text-[#71717A]">Modify your contact number</p>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm text-[#71717A] mb-2">Phone number</label>
              <Input
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="+1 (555) 123-4567"
                className="bg-white border-[#E4E4E7] h-11"
              />
            </div>

            <div className="flex justify-end mt-6">
              <Button
                type="submit"
                disabled={loading}
                className="bg-transparent text-black border hover:bg-gray-100 h-11"
              >
                {loading ? 'Updating...' : (formData.phoneNumber ? 'Update Contact Number' : 'Add Contact Number')}
              </Button>
            </div>
          </form>
        </div>
      </div>
      </div>
      </div>
    
  )
}