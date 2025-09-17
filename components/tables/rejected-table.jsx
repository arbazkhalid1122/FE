"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, X, CheckCircle, XCircle, Clock, MoreHorizontal, Eye, EyeOff } from "lucide-react"
import { useEffect, useState } from "react"
import api from "@/lib/axios"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatDummyValue } from "@/lib/dummy-data"

export default function RejectedTable({fetchInvoices, onRefresh}) {
  const [showAllColumns, setShowAllColumns] = useState(false)
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)

  const loadInvoices = async () => {
    setLoading(true)
    try {
      const data = await fetchInvoices()
      setInvoices(data)
    } catch (error) {
      console.error("Error loading rejected invoices:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInvoices()
  }, [])

  const handleApproveInvoice = async (invoiceId) => {
    try {
      await api.put(`/invoices/${invoiceId}/approve`)
      loadInvoices() // Reload to show updated status
      if (onRefresh) {
        onRefresh()
      }
    } catch (error) {
      console.error("Error approving invoice:", error)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        )
      case 'FLAGGED':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        )
      case 'EXTRACTED':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Processed
          </Badge>
        )
      case 'FAILED':
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            <XCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            {status}
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

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading rejected invoices...</p>
      </div>
    )
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
            <Table className="w-full">
              <TableHeader>
                <TableRow className="border-b border-[#e4e4e7]">
                  <TableHead className="text-[#49454f] font-medium p-6 min-w-[140px] whitespace-nowrap">
                    <button className="flex items-center gap-1 hover:text-[#000000]">
                      Claim Number
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </TableHead>
                  {/* <TableHead className="text-[#49454f] font-medium min-w-[140px] whitespace-nowrap">
                    <button className="flex items-center gap-1 hover:text-[#000000]">
                      Claim Number
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </TableHead> */}
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
                  {/* <TableHead className="text-[#49454f] font-medium min-w-[160px] whitespace-nowrap">
                    <button className="flex items-center gap-1 hover:text-[#000000]">
                      Extraction Status
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </TableHead> */}
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
                      {/* <TableHead className="text-[#49454f] font-medium min-w-[140px] whitespace-nowrap">
                        <button className="flex items-center gap-1 hover:text-[#000000]">
                          Processing Time
                          <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </TableHead> */}
                    </>
                  )}
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={showAllColumns ? 15 : 9} className="text-center py-8 text-gray-500">
                      No rejected invoices found
                    </TableCell>
                  </TableRow>
                ) : (
                  invoices?.map((row, index) => (
                    <TableRow key={index} className="border-b border-[#e4e4e7] hover:bg-[#f7f7f7]">
                      <TableCell className="font-medium text-[#000000] p-6 min-w-[140px]">
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-[#ef4444]" />
                          {formatDummyValue('claimNumber', row.claimNumber)}
                        </div>
                      </TableCell>
                      {/* <TableCell className="text-[#49454f] p-4 min-w-[140px]">
                        {row.claimNumber || 'N/A'}
                      </TableCell> */}
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
                      {/* <TableCell className="p-4 min-w-[160px]">
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          <XCircle className="w-3 h-3 mr-1" />
                          Failed
                        </Badge>
                      </TableCell> */}
                      <TableCell className="p-4 min-w-[120px]">
                        {getStatusBadge(row.status)}
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
                          {/* <TableCell className="text-[#49454f] p-4 min-w-[140px]">
                            {formatProcessingTime(row.extractionProcessingTime)}
                          </TableCell> */}
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
                            <DropdownMenuItem onClick={() => handleApproveInvoice(row.id)}>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
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
        <div className="p-4 space-y-4">
          {invoices?.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No rejected invoices found
            </div>
          ) : (
            invoices?.map((invoice, index) => (
              <div key={index} className="bg-white border border-[#e4e4e7] rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-[#ef4444]" />
                    <span className="font-medium text-[#000000]">
                      {invoice.insuredId || 'Claims #007'}
                    </span>
                  </div>
                  {getStatusBadge(invoice.status)}
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-[#71717A]">Claim Number:</span>
                    <p className="text-[#49454f] font-medium">{formatDummyValue('claimNumber', invoice.claimNumber)}</p>
                  </div>
                  <div>
                    <span className="text-[#71717A]">Insurance:</span>
                    <p className="text-[#49454f] font-medium">{formatDummyValue('insuranceName', invoice.insuranceName)}</p>
                  </div>
                  <div>
                    <span className="text-[#71717A]">Patient:</span>
                    <p className="text-[#49454f] font-medium">{formatDummyValue('patientName', invoice.patientName)}</p>
                  </div>
                  <div>
                    <span className="text-[#71717A]">Invoice #:</span>
                    <p className="text-[#49454f] font-medium">{formatDummyValue('invoiceNumber', invoice.invoiceNumber)}</p>
                  </div>
                  <div>
                    <span className="text-[#71717A]">Date:</span>
                    <p className="text-[#49454f] font-medium">{formatDummyValue('submissionDate', invoice.submissionDate || invoice.createdAt)}</p>
                  </div>
                  <div>
                    <span className="text-[#71717A]">Amount:</span>
                    <p className="text-[#49454f] font-medium">{formatDummyValue('insuranceValueBeforeValidation', invoice.insuranceValueBeforeValidation)}</p>
                  </div>
                </div>

                {showAllColumns && (
                  <div className="grid grid-cols-2 gap-3 text-sm pt-3 border-t border-[#e4e4e7]">
                    <div>
                      <span className="text-[#71717A]">Out of Pocket %:</span>
                      <p className="text-[#49454f] font-medium">{formatDummyValue('outOfPocketPercentage', invoice.outOfPocketPercentage)}</p>
                    </div>
                    <div>
                      <span className="text-[#71717A]">Max Coverage:</span>
                      <p className="text-[#49454f] font-medium">{formatDummyValue('maxCoverage', invoice.maxCoverage)}</p>
                    </div>
                    <div>
                      <span className="text-[#71717A]">Liasse Number:</span>
                      <p className="text-[#49454f] font-medium">{formatDummyValue('dossierLiasseNumber', invoice.dossierLiasseNumber)}</p>
                    </div>
                    <div>
                      <span className="text-[#71717A]">Processing Time:</span>
                      <p className="text-[#49454f] font-medium">{formatProcessingTime(invoice.extractionProcessingTime)}</p>
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleApproveInvoice(invoice.id)}>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}