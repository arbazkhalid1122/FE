"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Command, Filter } from "lucide-react"
import ApprovedTable from "@/components/tables/approved-table"
import RejectedTable from "@/components/tables/rejected-table"
import { useEffect, useState } from "react"
import api from "@/lib/axios"

export default function InvoiceHistoryTabs({ refreshTrigger }) {
  const [invoices, setInvoices] = useState([])

  const fetchInvoices = async () => {
    try {
      const response = await api.get('/invoices')
      console.log("response", response);      
      setInvoices(response.data.data)
    } catch (error) {
      console.error("Error fetching invoices:", error)
    }
  }

  const fetchApprovedInvoices = async () => {
    try {
      const response = await api.get('/invoices/status/APPROVED')
      console.log("approved invoices", response.data.data);      
      return response.data.data
    } catch (error) {
      console.error("Error fetching approved invoices:", error)
      return []
    }
  }

  const fetchRejectedInvoices = async () => {
    try {
      const response = await api.get('/invoices/status/FLAGGED')
      console.log("rejected invoices", response.data.data);      
      return response.data.data
    } catch (error) {
      console.error("Error fetching rejected invoices:", error)
      return []
    }
  }

 useEffect(()=>{
    fetchInvoices()
},[refreshTrigger])
  
  return (
    <div className="bg-[#ffffff] rounded-lg border border-[#e4e4e7]">
      <div className="p-6 border-b border-[#e4e4e7]">
        <h2 className="text-lg font-semibold text-[#000000] mb-1">Invoice history</h2>
        <p className="text-sm text-[#a1a1aa]">Showing activities on the invoices submitted for financing</p>
      </div>

      <Tabs defaultValue="approved" className="w-full">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between bg-[#FAFAFA] px-4 lg:px-6 py-4 border-b border-[#e4e4e7] gap-4">
    <TabsList className="bg-transparent p-0 h-auto w-full lg:w-auto overflow-x-auto">
        <TabsTrigger
          value="approved"
          className="bg-white data-[state=active]:bg-[#FAFAFA] border border-[#e4e4e7] rounded-l-lg rounded-r-none px-3 lg:px-4 py-2 shadow-none border-r-0 whitespace-nowrap text-sm"
        >
          Approved
        </TabsTrigger>
        <TabsTrigger
          value="rejected"
          className="bg-white data-[state=active]:bg-[#FAFAFA] rounded-r-lg rounded-l-none px-3 lg:px-4 py-2 border border-[#e4e4e7] shadow-none whitespace-nowrap text-sm"
        >
          Rejected
        </TabsTrigger>
      </TabsList>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:gap-4 w-full lg:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#a1a1aa]" />
              <Input
                placeholder="Search"
                className="pl-10 pr-12 w-full sm:w-64 bg-white border-[#e4e4e7] border-none focus-none outline-none"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1 text-xs text-[#a1a1aa]">
                <Command className="w-3 h-3" />
                <span>K</span>
              </div>
            </div>
            <Button variant="outline" className="border-[#e4e4e7] text-[#49454f] bg-white w-full sm:w-auto">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        <TabsContent value="approved" className="mt-0">
          <ApprovedTable fetchInvoices={fetchApprovedInvoices} onRefresh={fetchInvoices} />
        </TabsContent>

        <TabsContent value="rejected" className="mt-0">
          <RejectedTable fetchInvoices={fetchRejectedInvoices} onRefresh={fetchInvoices} />
        </TabsContent>
      </Tabs>

           
    </div>
  )
}
