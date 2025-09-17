"use client"

import { useState } from "react"
import { TermsSidebar } from "@/components/terms-sidebar"
import { TermsContent } from "@/components/terms-content"
import Header from "@/components/Header"

export default function TermsAndConditionsPage() {
  const [activeSection, setActiveSection] = useState("1")
  const [sectionProgress, setSectionProgress] = useState(0)
  const [indicatorTop, setIndicatorTop] = useState(0)
  const [indicatorHeight, setIndicatorHeight] = useState(0)

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Header variant="light" showSupport={false} />
      <div className="flex flex-col lg:flex-row lg:px-30 lg:py-10 relative">
        <TermsSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          sectionProgress={sectionProgress}
        />

        <div
          className="hidden lg:flex absolute left-[470px] w-0.5 z-10 bg-[#03A84E] transition-all duration-300"
          style={{
            top: `${indicatorTop + 190}px`,
            height: `${indicatorHeight}px`,
          }}
        ></div>

        <TermsContent
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          setSectionProgress={setSectionProgress}
          setIndicatorTop={setIndicatorTop}
          setIndicatorHeight={setIndicatorHeight}
        />

      </div>
    </div>
  )
}
