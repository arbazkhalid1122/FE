'use client'

import { useState, useEffect } from "react"
import { Search, ChevronDown, Plus, Users, Mail, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { SidebarProvider } from "@/components/ui/sidebar"
import { InviteMemberForm } from "@/components/invite-member-form"
import api from "@/lib/axios"
import { toast } from "react-hot-toast"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default function TeamMembersPage() {
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [invites, setInvites] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('pending') // 'pending' or 'accepted'
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [copiedLinks, setCopiedLinks] = useState({})

  // Fetch invites from the backend
  const fetchInvites = async () => {
    try {
      setLoading(true)
      const response = await api.get('/invites')
      setInvites(response.data || [])
    } catch (error) {
      console.error('Error fetching invites:', error)
      toast.error('Failed to fetch team members')
    } finally {
      setLoading(false)
    }
  }

  // Load invites on component mount
  useEffect(() => {
    fetchInvites()
  }, [])

  const handleInviteMember = (inviteData) => {
    console.log('🎯 TEAM MEMBER INVITATION COMPLETED!')
    console.log('='.repeat(60))
    console.log('📋 Invitation Data:', inviteData)

    if (inviteData.inviteLink) {
      console.log('🔗 Invitation Link Ready for Testing:', inviteData.inviteLink)
      console.log('📋 Quick Test: Copy the link above and open in new tab')
    }

    if (inviteData.inviteResponse) {
      console.log('📨 Backend Response:', inviteData.inviteResponse)
    }

    console.log('='.repeat(60))

    setIsInviteOpen(false)
    // Refresh the invites list to show the new invitation
    fetchInvites()
  }

  const handleResendInvitation = async (inviteId) => {
    try {
      const response = await api.post(`/invites/${inviteId}/resend`)

      console.log('🔄 INVITATION RESENT SUCCESSFULLY!')
      console.log('='.repeat(50))
      console.log('🆔 Invite ID:', inviteId)
      console.log('📨 Resend Response:', response.data)
      console.log('📅 Resent At:', new Date().toISOString())
      console.log('='.repeat(50))

      toast.success('Invitation resent successfully!')
    } catch (error) {
      console.error('❌ RESEND INVITATION FAILED!')
      console.error('🆔 Invite ID:', inviteId)
      console.error('Error details:', error)
      console.error('Response data:', error.response?.data)
      toast.error('Failed to resend invitation')
    }
  }

  const handleRevokeInvitation = async (inviteId) => {
    try {
      await api.delete(`/invites/${inviteId}`)
      toast.success('Invitation revoked successfully!')
      fetchInvites() // Refresh the list
    } catch (error) {
      console.error('Error revoking invitation:', error)
      toast.error('Failed to revoke invitation')
    }
  }

  // Generate invitation link for a given invite
  const generateInvitationLink = (invite) => {
    return `${window.location.origin}/invitation-accept?inviteId=${invite.id}&email=${invite.email}&role=${invite.role}&name=${encodeURIComponent('EnvoyX User')}`
  }

  // Copy invitation link to clipboard
  const handleCopyInvitationLink = async (invite) => {
    try {
      const link = generateInvitationLink(invite)
      await navigator.clipboard.writeText(link)
      
      // Update copied state
      setCopiedLinks(prev => ({ ...prev, [invite.id]: true }))
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopiedLinks(prev => {
          const newState = { ...prev }
          delete newState[invite.id]
          return newState
        })
      }, 2000)
      
      toast.success('Invitation link copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy link:', error)
      toast.error('Failed to copy invitation link')
    }
  }

  // Filter invites based on search term and role filter
  const filterInvites = (status) => {
    return invites.filter(invite => {
      // Filter by status
      const statusMatch = invite.status === status

      // Filter by search term (email)
      const searchMatch = invite.email.toLowerCase().includes(searchTerm.toLowerCase())

      // Filter by role
      const roleMatch = roleFilter === 'all' ||
        (roleFilter === 'admin' && invite.role === 'ADMIN') ||
        (roleFilter === 'member' && invite.role === 'USER')

      return statusMatch && searchMatch && roleMatch
    })
  }

  const pendingInvites = filterInvites('PENDING')
  const acceptedInvites = filterInvites('ACCEPTED')

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: '2-digit'
    })
  }

  // Reusable table content component
  const TableContent = ({ invitesList, tabType }) => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#03A84E] mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading team members...</p>
          </div>
        </div>
      )
    }

    if (invitesList.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            {tabType === 'pending' ? (
              <Mail className="w-8 h-8 text-gray-400" />
            ) : (
              <Users className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {tabType === 'pending' ? 'No pending invitations' : 'No accepted members'}
          </h3>
          <p className="text-gray-600 text-center max-w-sm">
            {tabType === 'pending'
              ? 'Use the “Invite team” button top right to invite a team member to join your workspace'
              : 'No team members have accepted invitations yet.'}
          </p>
          {tabType === 'pending' && (
            <Button
              onClick={() => setIsInviteOpen(true)}
              className="mt-4 h-11 bg-white hover:bg-[#03A84E]/90 text-white gap-2"
            >
              <Plus className="w-4 h-4" />
              Invite Member
            </Button>
          )}
        </div>
      )
    }

    return (
      <>
        <div className="flex items-center py-3 px-4 border-b border-[#E4E4E7] text-sm text-[#71717A]">
          <div className="w-8">
            <Checkbox />
          </div>
          <div className="flex-1">Email</div>
          <div className="w-32 flex items-center gap-1">
            Date Invited
            <ChevronDown className="w-4 h-4" />
          </div>
          <div className="w-32">Role</div>
          <div className="w-32">Status</div>
          {tabType === 'pending' && <div className="w-40">Invitation Link</div>}
          <div className="w-48 text-right">Action</div>
        </div>

        {invitesList.map((invite) => (
          <div key={invite.id} className="flex items-center py-4 px-4 border-b border-[#E4E4E7]">
            <div className="w-8">
              <Checkbox />
            </div>
            <div className="flex-1">
              <div className="font-medium">{invite.email}</div>
              <div className="text-sm text-[#71717A]">
                {invite.status === 'PENDING' ? 'Invitation sent' : 'Active member'}
              </div>
            </div>
            <div className="w-32">{formatDate(invite.createdAt)}</div>
            <div className="w-32">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {invite.role === 'ADMIN' ? 'Admin' : 'Member'}
              </span>
            </div>
            <div className="w-32">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${invite.status === 'PENDING'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-green-100 text-green-800'
                }`}>
                {invite.status === 'PENDING' ? 'Pending' : 'Accepted'}
              </span>
            </div>
            {tabType === 'pending' && (
              <div className="w-40">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopyInvitationLink(invite)}
                  className="flex items-center gap-2 text-xs font-medium hover:bg-gray-50 text-gray-600 hover:text-gray-800"
                >
                  {copiedLinks[invite.id] ? (
                    <>
                      <Check className="w-3 h-3 text-green-600" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy Link
                    </>
                  )}
                </Button>
              </div>
            )}
            <div className="w-48 flex justify-end items-center gap-2">
              {invite.status === 'PENDING' && (
                <>
                  <Button
                    variant="ghost"
                    className="text-sm font-medium hover:bg-gray-50"
                    onClick={() => handleResendInvitation(invite.id)}
                  >
                    Resend invitation
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 text-sm font-medium"
                    onClick={() => handleRevokeInvitation(invite.id)}
                  >
                    Revoke
                  </Button>
                </>
              )}
              {invite.status === 'ACCEPTED' && (
                <Button
                  variant="ghost"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 text-sm font-medium"
                >
                  Remove
                </Button>
              )}
            </div>
          </div>
        ))}

        {/* Pagination - show only if there are results */}
        {invitesList.length > 0 && (
          <div className="flex justify-center gap-2 mt-6">
            <Button variant="outline" className="text-sm">
              Previous
            </Button>
            <Button variant="outline" className="text-sm">
              Next
            </Button>
          </div>
        )}
      </>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-1">Account Management</h1>
        <p className="text-gray-600 text-sm">Increase cashflow with your invoices</p>
      </div>
<div className="max-w-4xl mx-auto">      
      {/* Team Members Card */}
      <div className="bg-white rounded-lg border border-[#e4e4e7]">
        <div className="p-6 border-b border-[#e4e4e7] flex items-center justify-between">
          <div>
            <h2 className="text-base font-medium mb-1">Team Members</h2>
            <p className="text-sm text-[#71717A]">Invite others to join your workspace.</p>
          </div>
          <Button
            className="bg-transparent h-11 border hover:bg-gray-100 text-black gap-2"
            onClick={() => setIsInviteOpen(true)}
          >
            Invite Member
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6">
          {/* Tabs with Search and Filter */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center justify-between mb-6">
              <TabsList className="bg-transparent p-0 h-auto flex-nowrap w-max md:w-auto">
                <TabsTrigger
                  value="accepted"
                  className="bg-white data-[state=active]:bg-[#FAFAFA] border border-gray-200 rounded-l-lg rounded-r-none px-3 md:px-4 py-2 shadow-none border-r-0 whitespace-nowrap h-11 transition-all"
                >
                  Accepted
                </TabsTrigger>

                <TabsTrigger
                  value="pending"
                  className="bg-white data-[state=active]:bg-[#FAFAFA] rounded-r-lg rounded-l-none px-3 md:px-4 py-2 border border-gray-200 h-11 transition-all whitespace-nowrap"
                >
                  Pending
                </TabsTrigger>
              </TabsList>

              {/* Search and Filter */}
              <div className="flex gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
                  <Input 
                    placeholder="Search email" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-11 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-all w-[200px]"
                  />
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="h-11 min-h-11 w-[120px] bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span>
                        {roleFilter === 'all' ? 'All roles' : 
                         roleFilter === 'admin' ? 'Admin' : 'Member'}
                      </span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="pending" className="mt-0">
              <div className="w-full">
                <TableContent invitesList={pendingInvites} tabType="pending" />
              </div>
            </TabsContent>

            <TabsContent value="accepted" className="mt-0">
              <div className="w-full">
                <TableContent invitesList={acceptedInvites} tabType="accepted" />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Invite Member Sidebar */}
      <SidebarProvider open={isInviteOpen} onOpenChange={setIsInviteOpen} className={"fixed z-100"}>
        {isInviteOpen && (
          <>
            {/* Dark backdrop overlay */}
            <div
              className="fixed top-auto right-auto bottom-auto left-auto md:inset-0 bg-black/40 transition-all duration-300 ease-in-out"
              onClick={() => setIsInviteOpen(false)}
              aria-hidden="true"
            />
            <InviteMemberForm
              onSave={handleInviteMember}
              onCancel={() => setIsInviteOpen(false)}
            />
          </>
        )}
      </SidebarProvider>
    </div>
      </div>
  )
}
