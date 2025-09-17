"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, ArrowUpDown, AlertTriangle, CheckCircle, XCircle, Clock, Eye, EyeOff, Flag } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import api from "@/lib/axios"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import FlagClaimModal from "./flag-claim-modal"
import { formatDummyValue } from "@/lib/dummy-data"

export default function PendingTable({invoices, onRefresh}) {
  const [showAllColumns, setShowAllColumns] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [flagDialogOpen, setFlagDialogOpen] = useState(false)
  const [forceUpdate, setForceUpdate] = useState(0)
  const mountedRef = useRef(true)

  const handleFlagInvoice = (invoice) => {
    // Force a re-render to ensure clean state
    setForceUpdate(prev => prev + 1)
    setSelectedInvoice(invoice)
    setFlagDialogOpen(true)
  }

  const handleFlagSubmit = async (invoiceId, flagData) => {
    try {
      await api.post(`/flagged-claims/${invoiceId}/flag`, flagData)
      handleCloseModal()
      if (onRefresh) {
        onRefresh()
      }
    } catch (error) {
      console.error('Error flagging invoice:', error)
    }
  }

  const handleCloseModal = () => {
    setFlagDialogOpen(false)
    setSelectedInvoice(null)
    setForceUpdate(prev => prev + 1)
  }


  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

  const getExtractionStatusBadge = (invoice) => {
    if (invoice.extractionSuccess) {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Extracted
        </Badge>
      )
    } else if (invoice.extractionError) {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <XCircle className="w-3 h-3 mr-1" />
          Failed
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      )
    }
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

  const formatProcessingTime = (time) => {
    if (!time) return 'N/A'
    return `${time.toFixed(2)}s`
  }

  return (
    <>
      {/* Toggle button for showing/hiding additional columns */}
      <div className="flex justify-between items-center p-4 border-b border-[#e4e4e7]">
        <div className="text-sm text-[#71717A] hidden lg:block">
          💡 Tip: Scroll horizontally when columns exceed screen width
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAllColumns(!showAllColumns)}
          className="flex items-center gap-2"
        >
          {showAllColumns ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {showAllColumns ? 'Hide Details' : 'Show All Details'}
        </Button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block w-full">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="min-w-max">
            <Table className="w-full" key={forceUpdate}>
          <TableHeader>
            <TableRow className="border-b border-[#e4e4e7]">
              <TableHead className="text-[#49454f] font-medium p-6 min-w-[140px] whitespace-nowrap">
                <button className="flex items-center gap-1 hover:text-[#000000]">
                  Insured ID
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead className="text-[#49454f] font-medium min-w-[140px] whitespace-nowrap">
                <button className="flex items-center gap-1 hover:text-[#000000]">
                  Claim Number
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead className="text-[#49454f] font-medium min-w-[160px] whitespace-nowrap">
                <button className="flex items-center gap-1 hover:text-[#000000]">
                  Insurance Name
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead className="text-[#49454f] font-medium min-w-[140px] whitespace-nowrap">
                <button className="flex items-center gap-1 hover:text-[#000000]">
                  Patient Name
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead className="text-[#49454f] font-medium min-w-[140px] whitespace-nowrap">
                <button className="flex items-center gap-1 hover:text-[#000000]">
                  Invoice Number
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead className="text-[#49454f] font-medium min-w-[140px] whitespace-nowrap">
                <button className="flex items-center gap-1 hover:text-[#000000]">
                  Submission Date
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead className="text-[#49454f] font-medium min-w-[160px] whitespace-nowrap">
                <button className="flex items-center gap-1 hover:text-[#000000]">
                  Extraction Status
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead className="text-[#49454f] font-medium min-w-[120px] whitespace-nowrap">
                <button className="flex items-center gap-1 hover:text-[#000000]">
                  Status
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </TableHead>
              {/* Additional columns shown when showAllColumns is true */}
              {showAllColumns && (
                <>
                  <TableHead className="text-[#49454f] font-medium min-w-[140px] whitespace-nowrap">
                    <button className="flex items-center gap-1 hover:text-[#000000]">
                      Out of Pocket %
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </TableHead>
                  <TableHead className="text-[#49454f] font-medium min-w-[140px] whitespace-nowrap">
                    <button className="flex items-center gap-1 hover:text-[#000000]">
                      Max Coverage
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </TableHead>
                  <TableHead className="text-[#49454f] font-medium min-w-[140px] whitespace-nowrap">
                    <button className="flex items-center gap-1 hover:text-[#000000]">
                      Liasse Number
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </TableHead>
                  <TableHead className="text-[#49454f] font-medium min-w-[180px] whitespace-nowrap">
                    <button className="flex items-center gap-1 hover:text-[#000000]">
                      Insurance Value (Before)
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </TableHead>
                  <TableHead className="text-[#49454f] font-medium min-w-[180px] whitespace-nowrap">
                    <button className="flex items-center gap-1 hover:text-[#000000]">
                      Insurance Value (After)
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </TableHead>
                  <TableHead className="text-[#49454f] font-medium min-w-[140px] whitespace-nowrap">
                    <button className="flex items-center gap-1 hover:text-[#000000]">
                      Processing Time
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </TableHead>
                </>
              )}
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={showAllColumns ? 15 : 9} className="text-center py-8 text-gray-500">
                  No invoices found
                </TableCell>
              </TableRow>
            ) : (
              invoices?.map((row, index) => (
                <TableRow key={index} className="border-b border-[#e4e4e7] hover:bg-[#f7f7f7]">
                  <TableCell className="font-medium text-[#000000] p-4 min-w-[140px]">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-[#f59e0b]" />
                      {formatDummyValue('insuredId', row.insuredId) || 'Claims #007'}
                    </div>
                  </TableCell>
                  <TableCell className="text-[#49454f] p-4 min-w-[140px]">
                    {formatDummyValue('claimNumber', row.claimNumber)}
                  </TableCell>
                  <TableCell className="text-[#49454f] p-4 min-w-[160px]">
                    {formatDummyValue('insuranceName', row.insuranceName)}
                  </TableCell>
                  <TableCell className="text-[#49454f] p-4 min-w-[140px]">
                    {formatDummyValue('patientName', row.patientName)}
                  </TableCell>
                  <TableCell className="text-[#49454f] p-4 min-w-[140px]">
                    {formatDummyValue('invoiceNumber', row.invoiceNumber)}
                  </TableCell>
                  <TableCell className="text-[#49454f] p-4 min-w-[140px]">
                    {formatDummyValue('submissionDate', row.submissionDate || row.createdAt)}
                  </TableCell>
                  <TableCell className="p-4 min-w-[160px]">
                    {getExtractionStatusBadge(row)}
                  </TableCell>
                  <TableCell className="p-4 min-w-[120px]">
                    <Badge variant="secondary" className="bg-[#f7f7f7] text-[#49454f] hover:bg-[#f7f7f7]">
                      {row.invoiceStatus || row.status || 'Pending'}
                    </Badge>
                  </TableCell>
                  {/* Additional columns shown when showAllColumns is true */}
                  {showAllColumns && (
                    <>
                      <TableCell className="text-[#49454f] p-4 min-w-[140px]">
                        {formatDummyValue('outOfPocketPercentage', row.outOfPocketPercentage)}
                      </TableCell>
                      <TableCell className="text-[#49454f] p-4 min-w-[140px]">
                        {formatDummyValue('maxCoverage', row.maxCoverage)}
                      </TableCell>
                      <TableCell className="text-[#49454f] p-4 min-w-[140px]">
                        {formatDummyValue('dossierLiasseNumber', row.dossierLiasseNumber)}
                      </TableCell>
                      <TableCell className="text-[#49454f] p-4 min-w-[180px]">
                        {formatDummyValue('insuranceValueBeforeValidation', row.insuranceValueBeforeValidation)}
                      </TableCell>
                      <TableCell className="text-[#49454f] p-4 min-w-[180px]">
                        {formatDummyValue('insuranceValuePostValidation', row.insuranceValuePostValidation)}
                      </TableCell>
                      <TableCell className="text-[#49454f] p-4 min-w-[140px]">
                        {formatDummyValue('extractionProcessingTime', row.extractionProcessingTime)}
                      </TableCell>
                    </>
                  )}
                  <TableCell className="p-4 w-12">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="w-8 h-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleFlagInvoice(row)}>
                          <Flag className="w-4 h-4 mr-2" />
                          Flag for Review
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="lg:hidden">
        {invoices?.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No invoices found
          </div>
        ) : (
          <div className="space-y-4 p-4">
            {invoices?.map((row, index) => (
              <div key={index} className="bg-white border border-[#e4e4e7] rounded-lg p-4 space-y-3">
                {/* Header with ID and Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#f59e0b]" />
                    <span className="font-medium text-[#000000]">
                      {formatDummyValue('insuredId', row.insuredId) || 'Claims #007'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getExtractionStatusBadge(row)}
                    <Badge variant="secondary" className="bg-[#f7f7f7] text-[#49454f]">
                      {row.invoiceStatus || row.status || 'Pending'}
                    </Badge>
                  </div>
                </div>

                {/* Basic Info Grid */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-[#71717A]">Claim Number:</span>
                    <div className="font-medium">{formatDummyValue('claimNumber', row.claimNumber)}</div>
                  </div>
                  <div>
                    <span className="text-[#71717A]">Invoice Number:</span>
                    <div className="font-medium">{formatDummyValue('invoiceNumber', row.invoiceNumber)}</div>
                  </div>
                  <div>
                    <span className="text-[#71717A]">Insurance Name:</span>
                    <div className="font-medium">{formatDummyValue('insuranceName', row.insuranceName)}</div>
                  </div>
                  <div>
                    <span className="text-[#71717A]">Patient Name:</span>
                    <div className="font-medium">{formatDummyValue('patientName', row.patientName)}</div>
                  </div>
                  <div>
                    <span className="text-[#71717A]">Submission Date:</span>
                    <div className="font-medium">{formatDummyValue('submissionDate', row.submissionDate || row.createdAt)}</div>
                  </div>
                </div>

                {/* Additional Details (shown when showAllColumns is true) */}
                {showAllColumns && (
                  <div className="border-t border-[#e4e4e7] pt-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-[#71717A]">Out of Pocket %:</span>
                        <div className="font-medium">{formatDummyValue('outOfPocketPercentage', row.outOfPocketPercentage)}</div>
                      </div>
                      <div>
                        <span className="text-[#71717A]">Max Coverage:</span>
                        <div className="font-medium">{formatDummyValue('maxCoverage', row.maxCoverage)}</div>
                      </div>
                      <div>
                        <span className="text-[#71717A]">Liasse Number:</span>
                        <div className="font-medium">{formatDummyValue('dossierLiasseNumber', row.dossierLiasseNumber)}</div>
                      </div>
                      <div>
                        <span className="text-[#71717A]">Processing Time:</span>
                        <div className="font-medium">{formatDummyValue('extractionProcessingTime', row.extractionProcessingTime)}</div>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[#71717A]">Insurance Value (Before):</span>
                        <div className="font-medium">{formatDummyValue('insuranceValueBeforeValidation', row.insuranceValueBeforeValidation)}</div>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[#71717A]">Insurance Value (After):</span>
                        <div className="font-medium">{formatDummyValue('insuranceValuePostValidation', row.insuranceValuePostValidation)}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <div className="flex justify-end pt-2">
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <MoreHorizontal className="w-4 h-4" />
                    Actions
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
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

      {/* Flag Claim Modal */}
      {selectedInvoice && flagDialogOpen && (
        <FlagClaimModal
          key={`modal-${selectedInvoice.id}-${forceUpdate}`}
          invoice={selectedInvoice}
          onSubmit={handleFlagSubmit}
          onClose={handleCloseModal}
        />
      )}
    </>
  )
}
