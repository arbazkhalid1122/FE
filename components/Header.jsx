"use client"

import { ChevronDown, Headset } from "lucide-react"

function Header({ variant = "light", showSupport = true, className = "" }) {
  const isDark = variant === "dark"

  
  return (
    <header
      className={`px-3 sm:px-10 py-3 sm:py-4 flex items-center justify-between ${
        isDark ? "relative z-10" : "bg-[#f7f7f7] "
      } ${className}`}
    >
      <div className="flex items-center gap-2">

        {variant === 'light' ? 
        <img src={"/darkLogo.svg"} alt="Envoy Logo" className="h-6 sm:h-8" />
        : <img src={"/logo.svg"} alt="Envoy Logo" className="h-6 sm:h-8" />}
      </div>

      <div className={`flex items-center gap-2 sm:gap-6 ${isDark ? "text-white" : "text-[#272635]"}`}>
        {showSupport && (
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-[#babdb9] text-[12px] sm:text-[14px] hidden sm:inline">Call support</span>
            <Headset className="w-4 h-4 sm:w-5 sm:h-5 text-[#03a84e]" strokeWidth={2.5} />
            <span className="text-[12px] sm:text-base">+225-27-21-29-35-27</span>
          </div>
        )}

        <div className="bg-white w-[1px] h-4 sm:h-6 hidden sm:block"></div>

        <div className="flex items-center gap-1 sm:gap-2">
          <span className="text-[12px] sm:text-base">English</span>
          <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-[#03A84E]" strokeWidth={3} />
        </div>
      </div>
    </header>
  )
}

export default Header
