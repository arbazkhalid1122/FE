'use client'

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import api from "@/lib/axios"
import { toast } from "react-hot-toast"

export default function SecurityPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const errors = [];
    if (password.length < minLength) errors.push(`At least ${minLength} characters`);
    if (!hasUpperCase) errors.push('At least one uppercase letter');
    if (!hasLowerCase) errors.push('At least one lowercase letter');
    if (!hasNumbers) errors.push('At least one number');
    if (!hasSpecialChar) errors.push('At least one special character');

    return errors;
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    // Validate password strength
    const passwordErrors = validatePassword(passwordData.newPassword);
    if (passwordErrors.length > 0) {
      toast.error(`Password requirements not met: ${passwordErrors.join(', ')}`);
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/user/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      });

      // Clear form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setShowPasswordForm(false);

      toast.success('Password updated successfully!');
    } catch (error) {
      console.error('Error updating password:', error);
      if (error.response?.status === 400) {
        toast.error(error.response?.data?.message || 'Failed to update password');
      } else {
        toast.error('Failed to update password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || !session) {
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
        <h1 className="text-2xl font-semibold mb-1">Account Management</h1>
        <p className="text-gray-600 text-sm">Increase cashflow with your invoices</p>
      </div>
<div className="max-w-4xl mx-auto">      
      {/* Manage Password Card */}
      <div className="bg-white rounded-lg border border-[#e4e4e7] mb-6">
        <div className="p-6 border-b border-[#e4e4e7]">
          <h2 className="text-base font-medium mb-1">Manage Password</h2>
          <p className="text-sm text-[#71717A]">Real-time information about you</p>
        </div>
        
        <div className="p-6">
          {!showPasswordForm ? (
            <div className="p-4 bg-red-50 rounded-lg border border-red-100">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-red-100 rounded">
                  <Shield className="w-4 h-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    To keep your account safe, you can change your password directly. Click the button below to proceed.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-3 text-sm h-11 font-medium bg-white hover:bg-gray-50"
                    onClick={() => setShowPasswordForm(true)}
                  >
                    Change Password
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm text-[#71717A] mb-2">Current Password</label>
                <Input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handleInputChange}
                  className="bg-white border-[#E4E4E7] h-11"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-[#71717A] mb-2">New Password</label>
                <Input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handleInputChange}
                  className="bg-white border-[#E4E4E7] h-11"
                  required
                />
                <div className="mt-2 text-sm text-gray-600">
                  <p className="font-medium">Password requirements:</p>
                  <ul className="list-disc list-inside space-y-1 mt-1">
                    <li>At least 8 characters</li>
                    <li>At least one uppercase letter</li>
                    <li>At least one lowercase letter</li>
                    <li>At least one number</li>
                    <li>At least one special character</li>
                  </ul>
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#71717A] mb-2">Confirm New Password</label>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handleInputChange}
                  className="bg-white border-[#E4E4E7] h-11"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  type="submit"
                  disabled={loading}
                  className="bg-[#03A84E] hover:bg-[#028A42] text-white"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: '',
                    });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Account Information Card */}
      <div className="bg-white rounded-lg border border-[#e4e4e7] mb-6">
        <div className="p-6 border-b border-[#e4e4e7]">
          <h2 className="text-base font-medium mb-1">Account Information</h2>
          <p className="text-sm text-[#71717A]">Your account details and activity</p>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-[#71717A] mb-1">Email Address</label>
              <p className="text-sm text-gray-900">{session?.user?.email}</p>
            </div>
            <div>
              <label className="block text-sm text-[#71717A] mb-1">Account Created</label>
              <p className="text-sm text-gray-900">
                {session?.user?.createdAt ? new Date(session.user.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div>
              <label className="block text-sm text-[#71717A] mb-1">Last Updated</label>
              <p className="text-sm text-gray-900">
                {session?.user?.updatedAt ? new Date(session.user.updatedAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sign-in Security Card */}
      <div className="bg-white rounded-lg border border-[#e4e4e7]">
        <div className="p-6 border-b border-[#e4e4e7]">
          <h2 className="text-base font-medium mb-1">Sign-in Security</h2>
          <p className="text-sm text-[#71717A]">Additional security features</p>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-medium mb-1">Two-Factor authentication</h3>
              <p className="text-sm text-[#71717A]">Coming soon - Enhanced security for your account</p>
            </div>
            <Switch disabled />
          </div>
        </div>
      </div>
      </div>
      </div>
  )
}
