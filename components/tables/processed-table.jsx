"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, ArrowUpDown, CheckCircle, XCircle, Clock } from "lucide-react"

export default function ProcessedTable({invoices}) {

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
  const processedData = [
    {
      id: "AS-127GH673",
      dateCreated: "Dec 1, 2025",
      invoiceRef: "#61092",
      submissionDate: "Dec 1, 2025",
      provider: "ASCOMA",
      amount: "100.000",
      status: "Processed",
    },
    {
      id: "AS-127GH673",
      dateCreated: "Nov 1, 2025",
      invoiceRef: "#61092",
      submissionDate: "Nov 1, 2025",
      provider: "MCI",
      amount: "100.000",
      status: "Processed",
    },
    {
      id: "AS-127GH673",
      dateCreated: "Oct 1, 2025",
      invoiceRef: "#61092",
      submissionDate: "Oct 1, 2025",
      provider: "ASCOMA",
      amount: "100.000",
      status: "Processed",
    },
    {
      id: "AS-127GH673",
      dateCreated: "Sep 1, 2025",
      invoiceRef: "#61092",
      submissionDate: "Sep 1, 2025",
      provider: "VITALIS ASANTE",
      amount: "100.000",
      status: "Processed",
    },
    {
      id: "AS-127GH673",
      dateCreated: "Aug 1, 2025",
      invoiceRef: "#61092",
      submissionDate: "Aug 1, 2025",
      provider: "ASCOMA",
      amount: "100.000",
      status: "Processed",
    },
    {
      id: "AS-127GH673",
      dateCreated: "Aug 1, 2025",
      invoiceRef: "#61092",
      submissionDate: "Aug 1, 2025",
      provider: "ASCOMA",
      amount: "100.000",
      status: "Processed",
    },
    {
      id: "AS-127GH673",
      dateCreated: "Aug 1, 2025",
      invoiceRef: "#61092",
      submissionDate: "Aug 1, 2025",
      provider: "MCI",
      amount: "100.000",
      status: "Processed",
    },
    {
      id: "AS-127GH673",
      dateCreated: "Aug 1, 2025",
      invoiceRef: "#61092",
      submissionDate: "Aug 1, 2025",
      provider: "ASCOMA",
      amount: "100.000",
      status: "Processed",
    },
  ]

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[#e4e4e7]">
              <TableHead className="text-[#49454f] font-medium p-6">
                <button className="flex items-center gap-1 hover:text-[#000000]">
                  Insured ID
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead className="text-[#49454f] font-medium">
                <button className="flex items-center gap-1 hover:text-[#000000]">
                  Date created
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead className="text-[#49454f] font-medium">
                <button className="flex items-center gap-1 hover:text-[#000000]">
                  Invoice reference
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead className="text-[#49454f] font-medium">
                <button className="flex items-center gap-1 hover:text-[#000000]">
                  Submission date
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead className="text-[#49454f] font-medium">Payment provider</TableHead>
              <TableHead className="text-[#49454f] font-medium">
                <button className="flex items-center gap-1 hover:text-[#000000]">
                  Amount Paid
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead className="text-[#49454f] font-medium">
                <button className="flex items-center gap-1 hover:text-[#000000]">
                  Status
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  No processed invoices found
                </TableCell>
              </TableRow>
            ) : (
              invoices?.map((row, index) => (
                <TableRow key={index} className="border-b border-[#e4e4e7] hover:bg-[#f7f7f7]">
                  <TableCell className="font-medium text-[#000000] p-6">
                    {row.insuredId || 'Claims #007'}
                  </TableCell>
                  <TableCell className="text-[#49454f]">
                    {formatDate(row.createdAt)}
                  </TableCell>
                  <TableCell className="text-[#49454f]">
                    {row.invoiceNumber || 'N/A'}
                  </TableCell>
                  <TableCell className="text-[#49454f]">
                    {formatDate(row.submissionDate)}
                  </TableCell>
                  <TableCell className="text-[#49454f]">
                    {row.insuranceName || 'N/A'}
                  </TableCell>
                  <TableCell className="text-[#49454f]">
                    {row.insuranceValuePostValidation || 'N/A'} <span className="text-[#a1a1aa]">XOF</span>
                  </TableCell>
                  <TableCell>
                    {getExtractionStatusBadge(row)}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="w-8 h-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
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
    </>
  )
}
