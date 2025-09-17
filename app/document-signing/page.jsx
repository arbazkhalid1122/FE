"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {  ChevronLeft } from "lucide-react"
import { SignatureModal } from "@/components/onBoarding/signature-modal"
import { useRouter } from "next/navigation"

const documentContent = [
    {
        id: 1,
        content: `SERVICE AGREEMENT BETWEEN ENVOVX & LAPAIRE GLASSES

INVOICE FINANCING AGREEMENT

This Agreement is made and entered into this 19th day of July, 2025 (the "Effective Date"), by and between:

EnvoyX Technologies Ltd., a company incorporated under the laws of [Country], with its principal office located at [EnvoyX Address], herein referred to as "EnvoyX" or "Financier".

AND

Lapaire Glasses Ltd., a company incorporated under the laws of [Country], with its registered office located at [Lapaire Address], herein referred to as "Lapaire" or "Client".

1. Purpose of Agreement

EnvoyX agrees to provide invoice financing to Lapaire for selected outstanding invoices owed by third-party payers (e.g., insurers or corporate partners) in exchange for a financing fee and subject to the terms herein.

2. Financing Structure

• Financing Limit: EnvoyX agrees to finance up to $150,000 USD in outstanding invoices at any given time.
• Advance Rate: EnvoyX will advance up to 80% of the face value of approved invoices.
• Reserve: The remaining 20% (the "Reserve") shall be held as security and paid to Lapaire upon full repayment by the debtor, minus any applicable fees.
• Tenor: Maximum financing tenor is 60 days from the financing date.

3. Eligibility Criteria

To be eligible for invoice financing under this Agreement, invoices must meet the following criteria:

• The invoice must be issued to a creditworthy debtor approved by EnvoyX.
• The invoice amount must be between $1,000 and $50,000 USD.
• The invoice must have a payment term not exceeding 60 days from the invoice date.
• The goods or services invoiced must have been delivered or performed.
• The invoice must be free from any disputes, liens, or encumbrances.`,
    },
    {
        id: 2,
        content: `4. Fees and Interest

• Financing Fee: EnvoyX shall charge a financing fee of 2.5% per month on the outstanding financed amount.
• Late Payment Fee: If the debtor fails to pay within the agreed tenor, an additional fee of 1% per week shall apply.
• Processing Fee: A one-time processing fee of $250 per invoice batch shall be charged.
• Early Payment Discount: If the debtor pays within 15 days, Lapaire receives a 0.5% discount on the financing fee.

5. Responsibilities of Lapaire

• Lapaire shall provide accurate and complete invoice documentation including:
  - Original invoice copies
  - Proof of delivery or service completion
  - Debtor contact information and credit references
  - Any relevant contracts or purchase orders

• Lapaire warrants that all invoices are genuine and legally enforceable.
• Lapaire shall notify EnvoyX immediately of any disputes or payment issues.
• Lapaire shall maintain adequate insurance coverage for its operations.
• Lapaire shall not assign, pledge, or otherwise encumber any financed invoices.

6. Responsibilities of EnvoyX

• EnvoyX shall review and approve eligible invoices within 2 business days of submission.
• EnvoyX shall advance approved amounts within 1 business day of approval.
• EnvoyX shall maintain confidentiality of all client information and trade secrets.
• EnvoyX shall provide monthly statements detailing all transactions and outstanding balances.
• EnvoyX shall handle all collection activities in a professional manner.

7. Collections and Payments

• All payments from debtors shall be made directly to EnvoyX's designated collection account.
• EnvoyX may engage third-party collection agencies if necessary.
• Lapaire shall cooperate fully with all collection efforts.
• Any disputes between Lapaire and debtors must be resolved promptly.`,
    }
]

export default function DocumentViewer() {
    const [currentPage, setCurrentPage] = useState(1)
    const [zoomLevel, setZoomLevel] = useState(100)
    const [showSignatureModal, setShowSignatureModal] = useState(false)
    const mainScrollRef = useRef(null)
    const pageRefs = useRef([])
    const router = useRouter()

    // Handle scroll to update current page
    useEffect(() => {
        const handleScroll = () => {
            if (!mainScrollRef.current) return

            const scrollTop = mainScrollRef.current.scrollTop
            const containerHeight = mainScrollRef.current.clientHeight

            // Find which page is most visible
            let mostVisiblePage = 1
            let maxVisibleArea = 0

            pageRefs.current.forEach((pageRef, index) => {
                if (!pageRef) return

                const rect = pageRef.getBoundingClientRect()
                const containerRect = mainScrollRef.current ? mainScrollRef.current.getBoundingClientRect() : { top: 0, bottom: 0 }

                const visibleTop = Math.max(rect.top, containerRect.top)
                const visibleBottom = Math.min(rect.bottom, containerRect.bottom)
                const visibleArea = Math.max(0, visibleBottom - visibleTop)

                if (visibleArea > maxVisibleArea) {
                    maxVisibleArea = visibleArea
                    mostVisiblePage = index + 1
                }
            })

            setCurrentPage(mostVisiblePage)
        }

        const scrollContainer = mainScrollRef.current
        if (scrollContainer) {
            scrollContainer.addEventListener("scroll", handleScroll)
            return () => scrollContainer.removeEventListener("scroll", handleScroll)
        }
    }, [])

    const scrollToPage = (pageNumber) => {
        const pageRef = pageRefs.current[pageNumber - 1]
        if (pageRef && mainScrollRef.current) {
            const offsetTop = pageRef.offsetTop - 20 // Small offset for better positioning
            mainScrollRef.current.scrollTo({
                top: offsetTop,
                behavior: "smooth",
            })
        }
    }

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2 border border-gray-200 rounded-lg w-[fit-content] cursor-pointer px-1 py-1">
                        <ChevronLeft className="w-6 h-6" onClick={() => window.history.back()}/>
                    </div>
                </div>

                <ScrollArea className="flex-1 p-2">
                    <div className="space-y-2">
                        {documentContent.map((page) => (
                            <div
                                key={page.id}
                                className={`relative cursor-pointer rounded-lg border transition-all text-xs ${
                                    currentPage === page.id
                                        ? "border-blue-500 bg-blue-50 shadow-md"
                                        : "border-gray-200 hover:border-gray-300"
                                }`}
                                onClick={() => scrollToPage(page.id)}
                            >
                                <div className="aspect-[3/4] bg-white rounded-md p-2 m-1 flex flex-col justify-between">
                                    <div className="font-serif text-[11px] text-gray-800 leading-snug line-clamp-10">
                                        {page.content}...
                                    </div>
                                </div>
                                <div className="absolute top-2 right-2 bg-white rounded px-1 py-0.5 text-[10px] font-semibold text-gray-600 shadow-sm">
                                    {page.id}
                                </div>
                                {/* Show current page indicator */}
                                {currentPage === page.id && (
                                    <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-[10px] rounded px-2 py-0.5 shadow">
                                        Viewing
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    {/* Show current page at the bottom of the scroll area */}
                    <div className="mt-6 flex justify-center">
                        <span className="text-xs text-gray-600">
                            Page {currentPage} of {documentContent.length}
                        </span>
                    </div>
                </ScrollArea>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="bg-[#F7F7F7] border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl text-gray-900">Underwriting between Lapaire Glasses CI</h1>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                <div className="text-[#babdb9]">Underwriting | Updated about 1 hour ago</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button variant="outline" className='p-5' onClick={() => setShowSignatureModal(true)}>
                                Add signature
                            </Button>

                            <div className="flex items-center gap-1"></div>

                            <div className="flex items-center gap-1">
                <div className="flex -space-x-2">
                  <div className="relative z-20">
                    <div className="w-8 h-8 rounded-full bg-[#FFEAD2] text-black flex items-center justify-center text-sm font-medium">
                      AF
                    </div>
                  </div>
                  <div className="relative z-10">
                    <div className="w-8 h-8 rounded-full bg-[#CEE4FE] text-black flex items-center justify-center text-sm font-medium">
                      AP
                    </div>
                  </div>
                </div>
              </div>
                        </div>
                    </div>
                </div>

                <div
                    ref={mainScrollRef}
                    className="flex-1 bg-gray-100 p-6 overflow-auto"
                    style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
                >
                    <div className="max-w-4xl mx-auto space-y-8">
                        {documentContent.map((page, index) => (
                            <div
                                key={page.id}
                                ref={(el) => (pageRefs.current[index] = el)}
                                className="bg-white shadow-lg rounded-lg overflow-hidden min-h-[800px]"
                            >
                                <div className="p-12">
                                    <div className="prose prose-lg max-w-none">
                                        <div className="whitespace-pre-line text-gray-800 leading-relaxed text-sm">{page.content}</div>
                                    </div>

                                    {/* Page number at bottom */}
                                    <div className="flex justify-center mt-12 pt-8 border-t border-gray-200">
                                        <span className="text-sm text-gray-500">
                                            Page {page.id} of {documentContent.length}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="bg-[#192517] text-white p-6 absolute bottom-0 left-0 right-0">
                    <div className="flex items-center justify-center gap-4">
                        <div className="flex items-center gap-4">
                                Review this document and fill in the relevant fields. Finish the document when you're ready.
                            </div>

                        <Button className="bg-white text-[#081F24] hover:bg-white"
                        onClick={()=>router.push('/invoices')}
                        >Finish document</Button>
                    </div>
                </div>
            </div>

            <SignatureModal open={showSignatureModal} onOpenChange={setShowSignatureModal} />
        </div>
    )
}
