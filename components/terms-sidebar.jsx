"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function TermsSidebar({ activeSection, setActiveSection, scrollIndicatorPosition }) {
  const [isOpen, setIsOpen] = useState(false)

  const sections = [
    { num: "1", title: "Introduction", id: "introduction" },
    { num: "2", title: "User Responsibilities", id: "user-responsibilities" },
    { num: "3", title: "Platform Usage", id: "platform-usage" },
    { num: "4", title: "Fund Transactions", id: "fund-transactions" },
    { num: "5", title: "Termination & Suspension", id: "termination-suspension" },
    { num: "6", title: "Liability & Indemnification", id: "liability-indemnification" },
    { num: "7", title: "Change to Terms", id: "change-to-terms" },
  ]

  const scrollToSection = (sectionId, sectionNum) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
      setActiveSection(sectionNum)
      setIsOpen(false) // Close mobile menu
    }
  }

  return (
    <>
   
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-90 bg-white min-h-[calc(100vh-73px)] px-14 pt-24 sticky top-[73px] relative">
        <div className="space-y-4">
          {sections.map((item) => (
            <div
              key={item.num}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer w-[fit-content] transition-colors duration-300 ${
                item.num === activeSection ? "text-[#03A84E]" : "text-[#272635] hover:text-[#03A84E]"
              }`}
              onClick={() => scrollToSection(item.id, item.num)}
            >
              <span className="font-medium">{item.num}.</span>
              <span>{item.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setIsOpen(false)}>
          <div className="bg-white w-80 h-full overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-[#272635]">Table of Contents</h2>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="p-2">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {sections.map((item) => (
                <div
                  key={item.num}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors duration-300 ${
                    item.num === activeSection
                      ? "text-[#03A84E] bg-[#03A84E]/5"
                      : "text-[#272635] hover:text-[#03A84E] hover:bg-[#03A84E]/5"
                  }`}
                  onClick={() => scrollToSection(item.id, item.num)}
                >
                  <span className="font-medium">{item.num}.</span>
                  <span>{item.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
