"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, AlertTriangle, ExternalLink, Eye, Upload, Edit, Trash2, Loader2 } from "lucide-react"
import api from "@/lib/axios"
import { useSession } from "next-auth/react"
import FlaggedClaimModal from "./flagged-claim-modal"

export default function ResolveTable({ refreshTrigger = 0 }) {
  const { data: session } = useSession()
  const [flaggedClaims, setFlaggedClaims] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedClaim, setSelectedClaim] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    if (session?.user?.id) {
      fetchFlaggedClaims()
    }
  }, [session?.user?.id, refreshTrigger])

  const fetchFlaggedClaims = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get('/flagged-claims')
      setFlaggedClaims(response.data)
    } catch (error) {
      console.error('Error fetching flagged claims:', error)
      setError('Failed to load flagged claims')
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (claim) => {
    setSelectedClaim(claim)
    setDialogOpen(true)
  }

  const handleResolveClaim = async (claimId, resolutionData) => {
    try {
      await api.put(`/flagged-claims/${claimId}/resolve`, resolutionData)
      await fetchFlaggedClaims() // Refresh the list
      handleCloseModal()
    } catch (error) {
      console.error('Error resolving claim:', error)
    }
  }

  const handleWithdrawClaim = async (claimId, reason) => {
    try {
      await api.put(`/flagged-claims/${claimId}/withdraw`, { reason })
      await fetchFlaggedClaims() // Refresh the list
      handleCloseModal()
    } catch (error) {
      console.error('Error withdrawing claim:', error)
    }
  }

  const handleCloseModal = () => {
    setDialogOpen(false)
    setSelectedClaim(null)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(new Date(dateString))
    } catch {
      return dateString
    }
  }

  const formatAmount = (amount) => {
    if (!amount) return '0.00'
    return parseFloat(amount).toFixed(2)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-500">Loading flagged claims...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-600 mb-2">⚠️ {error}</div>
        <Button onClick={fetchFlaggedClaims} variant="outline" size="sm">
          Try Again
        </Button>
      </div>
    )
  }

  if (flaggedClaims.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-500 mb-2">🎉 No flagged claims to resolve</div>
        <p className="text-sm text-gray-400">All your claims are in good standing</p>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[#e4e4e7]">
              <TableHead className="text-[#49454f] font-medium p-6">
                <button className="flex items-center gap-1 hover:text-[#000000]">
                  Claim ID
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead className="text-[#49454f] font-medium">
                <button className="flex items-center gap-1 hover:text-[#000000]">
                  Submission date
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead className="text-[#49454f] font-medium">Insurance Provider</TableHead>
              <TableHead className="text-[#49454f] font-medium">
                <button className="flex items-center gap-1 hover:text-[#000000]">
                  Amount
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead className="text-[#49454f] font-medium">
                <button className="flex items-center gap-1 hover:text-[#000000]">
                  Flag reason
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead className="text-[#49454f] font-medium">
                <button className="flex items-center gap-1 hover:text-[#000000]">
                  Status
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead className="text-[#49454f] font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flaggedClaims.map((claim, index) => (
              <TableRow key={claim.id || index} className="border-b border-[#e4e4e7] hover:bg-[#f7f7f7]">
                <TableCell className="font-medium text-[#000000] p-6">
                  {claim.claimNumber || claim.invoiceNumber || 'N/A'}
                </TableCell>
                <TableCell className="text-[#49454f]">
                  {formatDate(claim.submissionDate || claim.createdAt)}
                </TableCell>
                <TableCell className="text-[#49454f]">
                  {claim.insuranceName || 'N/A'}
                </TableCell>
                <TableCell className="text-[#49454f]">
                  {formatAmount(claim.insuranceValuePostValidation || claim.insuranceValueBeforeValidation)} 
                  <span className="text-[#a1a1aa]"> XOF</span>
                </TableCell>
                <TableCell className="text-[#49454f]">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#f59e0b]" />
                    <span className="max-w-[200px] truncate" title={claim.flagReason}>
                      {claim.flagReason || 'No reason provided'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-[#fef3c7] text-[#d97706] hover:bg-[#fef3c7]">
                    {claim.status === 'FLAGGED' ? 'Flagged' : claim.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="link" 
                      className="text-[#000000] hover:text-[#61c454] p-0 h-auto"
                      onClick={() => handleViewDetails(claim)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View Details
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4 p-6 border-t border-[#e4e4e7]">
        <Button variant="outline" className="border-[#e4e4e7] text-[#49454f] bg-transparent">
          Previous
        </Button>
        <Button variant="outline" className="border-[#e4e4e7] text-[#49454f] bg-transparent">
          Next
        </Button>
      </div>

      {/* Flagged Claim Modal */}
      {selectedClaim && dialogOpen && (
        <FlaggedClaimModal
          key={`modal-${selectedClaim.id}`}
          claim={selectedClaim}
          onResolve={handleResolveClaim}
          onWithdraw={handleWithdrawClaim}
          onClose={handleCloseModal}
        />
      )}
    </>
  )
}