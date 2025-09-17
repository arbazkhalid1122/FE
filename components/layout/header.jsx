"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Command, File } from "lucide-react"
import { SidebarProvider } from "../ui/sidebar"
import { useState } from "react"
import InvoiceUploadDialog from "../invoices/finance-dialog"
import NotificationBell from "../notifications/notification-bell"

export default function Header({ onUploadSuccess }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="px-8 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-[#000000] mb-1">Invoices</h1>
          <p className="text-sm text-[#000000]">Increase cashflow with your invoices</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#a1a1aa]" />
            <Input
              placeholder="Search"
              className="pl-10 pr-12 w-84 h-[40px] bg-white border-none"
              style={{ boxShadow: "none" }}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1 text-xs text-[#a1a1aa]">
              <Command className="w-3 h-3" />
              <span>K</span>
            </div>
          </div>

          {/* Notification */}
          <NotificationBell />

          {/* Finance New Invoice Button */}
          <Button className="bg-[#081f24] hover:bg-[#0e363f] text-white px-6 h-10"
            onClick={() => setIsOpen(true)}
          >
            Finance New Invoice <File size={20} />
          </Button>
        </div>
      </div>
     {isOpen && (
  <SidebarProvider open={isOpen} onOpenChange={setIsOpen} className="fixed z-100">
    {/* Dark backdrop overlay */}
    <div
      className={`fixed lg:bg-black/40 md:bg-black/40 sm:bg-transparent inset-0 transition-all duration-300 ease-in-out`}
      onClick={() => setIsOpen(false)}
      aria-hidden="true"
    />
    <InvoiceUploadDialog
      setIsOpen={setIsOpen}
      isOpen={isOpen}
      onUploadSuccess={onUploadSuccess}
    />
  </SidebarProvider>
)}

    </header>
  )
}
