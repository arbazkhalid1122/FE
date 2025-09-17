"use client"
import { ArrowUpRight, Bell, MoveUpRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { SidebarProvider } from "@/components/ui/sidebar"
import { BusinessProfileForm } from "@/components/onBoarding/sidebar"
import { useState } from "react"
import { BusinessVerificationModal } from "@/components/onBoarding/business-verification-modal"
import { useRouter } from "next/navigation"

function DashboardContent() {
    const [isOpen, setIsOpen] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const route = useRouter()

    const handleCancel = () => {
        // User cancelled verification - just close modal
    }

    const handleProceed = () => {
        route.push("/dashboard")
    }

    const toggleSidebar = () => {
        setIsOpen(!isOpen)
    }

    return (
        <div className="min-h-screen bg-[#f7f7f7] flex">
            {/* <Sidebar /> */}
            <div className="min-h-screen bg-[#f7f7f7] flex-1">
                {/* Main Content */}
                <div className="flex-col">
                    {/* Main Content Area */}
                    <main className="p-4 sm:p-6 lg:p-8">
                        <div className="">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                {/* Welcome Section */}
                                <div className="mb-6 sm:mb-8">
                                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 mb-2">Hello Assi 👋</h1>
                                    <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl">
                                        Complete your business profile to start enjoying instant cashflow using your insurance claims
                                        invoices
                                    </p>
                                </div>
                                <Button variant="ghost" size="icon" className="text-[#ffcb37] bg-white h-10 self-start sm:self-center">
                                    <Bell className="fill-[#ffcb37] stroke-[#ffcb37]" />
                                </Button>
                            </div>

                            {/* Cards Grid with responsive layout */}
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                                {[
                                    {
                                        title: "Setup your business profile",
                                        description: "Pre-fill your business information to get started",
                                        status: "Not started",
                                        color: "bg-purple-100",
                                        progress: "0%",
                                        src: "/Frame.svg",
                                    },
                                    {
                                        title: "Complete KYC/B",
                                        description: "Provide some documents to help us keep EnvoyX safe",
                                        status: "Not started",
                                        color: "bg-green-100",
                                        progress: "0%",
                                        src: "/Frame1.svg",
                                    },
                                    {
                                        title: "Financing preferences",
                                        description: "Help us identify you by submitting the basic government issue documents",
                                        status: "Not started",
                                        color: "bg-blue-100",
                                        progress: "0%",
                                        src: "/Frame2.svg",
                                    },
                                ].map((item, index) => (
                                    <div key={index} className="bg-white rounded-xl p-4 sm:p-6 border border-[#e4e4e7]">
                                        <img src={item?.src || "/placeholder.svg"} alt="" className="mb-8 sm:mb-12 w-full max-w-[200px]" />
                                        <h3 className="font-semibold text-[#272635] mb-2 text-sm sm:text-base">{item.title}</h3>
                                        <p className="text-xs sm:text-sm mb-4">{item.description}</p>
                                        {index === 1 && (
                                            <button
                                                onClick={toggleSidebar}
                                                className="text-[#03a84e] text-xs sm:text-sm underline flex items-center gap-1 cursor-pointer"
                                            >
                                                Setup Profile <MoveUpRight className="h-3 w-3" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Card className="border-0 shadow-sm bg-white rounded-xl mt-6 p-0">
                            <CardContent className="p-4 sm:p-6">
                                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 flex-shrink-0 mx-auto sm:mx-0">
                                        <Image
                                            src="/help.svg"
                                            alt="Customer support illustration"
                                            width={96}
                                            height={96}
                                            className="w-full h-full"
                                        />
                                    </div>
                                    <div className="flex-1 text-center sm:text-left">
                                        <h3 className="font-semibold text-gray-900 mb-3 text-lg sm:text-xl">
                                            Having trouble completing your profile?
                                        </h3>
                                        <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4 max-w-xl">
                                            If you're having trouble with completing your profile, kindly reach out to one of our amazing
                                            humans of EnvoyX to give you a helping hand. We really want you and your business to win.
                                        </p>
                                        <Button variant="link" className="text-[#03a84e] hover:text-[#0e363f] p-0 h-auto font-medium">
                                            Contact support
                                            <ArrowUpRight className="ml-1 h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </main>

                    <SidebarProvider open={isOpen} onOpenChange={setIsOpen} className={"fixed z-100"}>
                        {isOpen && (
                            <>
                                {/* Dark backdrop overlay */}
                                <div
                                    className="fixed top-auto right-auto bottom-auto left-auto md:inset-0 bg-black/40 transition-all duration-300 ease-in-out"
                                    onClick={() => setIsOpen(false)}
                                    aria-hidden="true"
                                />
                                <BusinessProfileForm
                                    onSave={(data) => {
                                        setIsModalOpen(true)
                                        setIsOpen(false)
                                    }}
                                    onCancel={() => setIsOpen(false)}
                                />
                            </>
                        )}
                    </SidebarProvider>
                </div>
            </div>

            <BusinessVerificationModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                onCancel={handleCancel}
                onProceed={handleProceed}
            />
        </div>
    )
}

export default DashboardContent
