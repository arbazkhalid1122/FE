"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, Phone, Globe } from "lucide-react"

export default function Component() {
  const [accessCode, setAccessCode] = useState("")

  return (
    <div className="min-h-screen bg-[#081f24] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        {/* Mountains silhouette */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0d2c0d] to-transparent"></div>

        {/* Floating documents */}
        <div className="absolute bottom-20 left-10 w-16 h-20 bg-white rounded transform rotate-12 shadow-lg"></div>
        <div className="absolute bottom-32 right-20 w-20 h-24 bg-white rounded transform -rotate-6 shadow-lg"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-16 bg-white rounded transform rotate-45 shadow-lg"></div>

        {/* Green shield with checkmark */}
        <div className="absolute bottom-40 right-1/3 w-16 h-20 bg-[#03a84e] rounded-t-full rounded-b-sm flex items-center justify-center shadow-lg">
          <Check className="w-8 h-8 text-white" />
        </div>

        {/* Floating green elements */}
        <div className="absolute top-1/4 left-1/3 w-8 h-2 bg-[#61c454] rounded-full"></div>
        <div className="absolute top-1/3 right-1/4 w-12 h-2 bg-[#7ccc4a] rounded-full"></div>
        <div className="absolute bottom-1/3 left-1/5 w-6 h-2 bg-[#66db4a] rounded-full"></div>
        <div className="absolute top-2/3 right-1/5 w-10 h-2 bg-[#95f270] rounded-full"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6">
        <div className="flex items-center gap-2">
          <div className="text-white text-2xl font-bold">ENVOY</div>
          <div className="w-6 h-6 bg-[#03a84e] rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
        </div>

        <div className="flex items-center gap-6 text-white">
          <div className="flex items-center gap-2">
            <span>Call support</span>
            <Phone className="w-4 h-4 text-[#03a84e]" />
            <span className="text-[#03a84e]">+225-27-21-29-35-27</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span>English</span>
            <div className="w-2 h-2 bg-[#03a84e] rounded-full"></div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)]">
        <div className="bg-white rounded-2xl p-12 max-w-md w-full mx-4 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-[#272635] mb-4">Validate your access code</h1>
            <p className="text-[#5f6057] leading-relaxed">
              Access code is way we validate each of our partner financial partner to avoid spam and reduce fraud.
            </p>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[#272635]">Provide the 6-digit code sent to your email</span>
              <div className="w-6 h-6 bg-[#03a84e] rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="flex gap-2 mb-6">
              {[...Array(6)].map((_, i) => (
                <Input
                  key={i}
                  type="text"
                  maxLength={1}
                  className="w-12 h-12 text-center text-lg font-semibold border-2 border-[#e4e4e7] rounded-lg focus:border-[#03a84e] focus:ring-[#03a84e]"
                  onChange={(e) => {
                    const value = e.target.value
                    if (value && i < 5) {
                      const nextInput = e.target.parentElement?.children[i + 1]
                      nextInput?.focus()
                    }
                  }}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mb-8">
            <button className="text-[#272635] hover:text-[#03a84e] transition-colors">
              {"Didn't receive any access code?"}
            </button>
            <Button
              className="bg-[#081f24] hover:bg-[#0d2c0d] text-white px-8 py-2 rounded-lg"
              onClick={() => console.log("Validate clicked")}
            >
              Validate
            </Button>
          </div>

          <div className="text-center text-sm text-[#5f6057] space-y-1">
            <div>
              © 2025 <span className="text-[#03a84e] font-medium">EnvoyX</span>, Inc. All rights reserved |
              <a href="#" className="hover:text-[#03a84e] ml-1">
                Privacy Policy
              </a>{" "}
              |
              <a href="#" className="hover:text-[#03a84e] ml-1">
                Terms of Use
              </a>
            </div>
            <div>
              <a href="#" className="hover:text-[#03a84e]">
                Service Provider Agreement
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
