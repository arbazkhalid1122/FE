"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"

export default function ProgressTable() {
  const progressData = [
    {
      id: "AS-127GH673",
      dateCreated: "Dec 1, 2025",
      submissionDate: "Dec 1, 2025",
      provider: "ASCOMA",
      amount: "100.000",
      status: "Processing",
    },
    {
      id: "AS-127GH673",
      dateCreated: "Nov 1, 2025",
      submissionDate: "Nov 1, 2025",
      provider: "MCI",
      amount: "100.000",
      status: "Processing",
    },
    {
      id: "AS-127GH673",
      dateCreated: "Oct 1, 2025",
      submissionDate: "Oct 1, 2025",
      provider: "ASCOMA",
      amount: "100.000",
      status: "Processing",
    },
    {
      id: "AS-127GH673",
      dateCreated: "Sep 1, 2025",
      submissionDate: "Sep 1, 2025",
      provider: "VITALIS ASANTE",
      amount: "100.000",
      status: "Processing",
    },
    {
      id: "AS-127GH673",
      dateCreated: "Aug 1, 2025",
      submissionDate: "Aug 1, 2025",
      provider: "ASCOMA",
      amount: "100.000",
      status: "Processing",
    },
    {
      id: "AS-127GH673",
      dateCreated: "Aug 1, 2025",
      submissionDate: "Aug 1, 2025",
      provider: "ASCOMA",
      amount: "100.000",
      status: "Processing",
    },
    {
      id: "AS-127GH673",
      dateCreated: "Aug 1, 2025",
      submissionDate: "Aug 1, 2025",
      provider: "MCI",
      amount: "100.000",
      status: "Processing",
    },
    {
      id: "AS-127GH673",
      dateCreated: "Aug 1, 2025",
      submissionDate: "Aug 1, 2025",
      provider: "ASCOMA",
      amount: "100.000",
      status: "Processing",
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
              <TableHead className="text-[#49454f] font-medium">
                <button className="flex items-center gap-1 hover:text-[#000000]">
                  Invoice reference
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {progressData.map((row, index) => (
              <TableRow key={index} className="border-b border-[#e4e4e7] hover:bg-[#f7f7f7]">
                <TableCell className="font-medium text-[#000000] p-6">{row.id}</TableCell>
                <TableCell className="text-[#49454f]">{row.dateCreated}</TableCell>
                <TableCell className="text-[#49454f]">{row.submissionDate}</TableCell>
                <TableCell className="text-[#49454f]">{row.provider}</TableCell>
                <TableCell className="text-[#49454f]">
                  {row.amount} <span className="text-[#a1a1aa]">XOF</span>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-[#f7f7f7] text-[#49454f] hover:bg-[#f7f7f7]">
                    {row.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-[#49454f]">#61092</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="w-8 h-8">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
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
    </>
  )
}
