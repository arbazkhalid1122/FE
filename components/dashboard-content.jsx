"use client"

import React, { useState, useEffect } from "react"
import { Bell, MoreHorizontal, MoveUpRight, Search, X, ArrowUpRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import Sidebar from "./layout/sidebar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Button } from "./ui/button"
import InvoiceCard from "@/components/invoice-card"
import FinancialDashboard from "@/components/Home/financial-dashboard"
import TransactionHistory from "@/components/Home/transaction"
import DashboardMetrics from "@/components/dashboard/dashboard-metrics"
import { MultiStepBusinessSetup } from "@/components/onBoarding/multi-step-business-setup"
import { KycVerificationDrawer } from "@/components/onBoarding/kyc-drawer"
import { FinancialPreferencesDrawer } from "@/components/onBoarding/financial-preferences-drawer"
import { SidebarProvider } from "@/components/ui/sidebar"
import api from "@/lib/axios"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export function DashboardContent() {
  const { data: session } = useSession()
  const router = useRouter()
  const [showProfileHelp, setShowProfileHelp] = useState(true)
  const [dashboardMetrics, setDashboardMetrics] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // State for managing onboarding flows
  const [isBusinessSetupOpen, setIsBusinessSetupOpen] = useState(false)
  const [isKycOpen, setIsKycOpen] = useState(false)
  const [isFinancialPrefsOpen, setIsFinancialPrefsOpen] = useState(false)
  const [businessProfileComplete, setBusinessProfileComplete] = useState(false)
  const [kycComplete, setKycComplete] = useState(false)
  const [kycStarted, setKycStarted] = useState(false)
  const [financialPrefsComplete, setFinancialPrefsComplete] = useState(false)
  const [isLoadingStatus, setIsLoadingStatus] = useState(false)

  useEffect(() => {
    if (session?.user?.id) {
      fetchDashboardMetrics()
      loadCompletionStatus()
    }
  }, [session?.user?.id])

  // Refresh completion status when component becomes visible (like FE-BANKS)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && session?.user?.id) {
        loadCompletionStatus()
      }
    }

    const handleFocus = () => {
      if (session?.user?.id) {
        loadCompletionStatus()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [session?.user?.id])

  // Load completion status from API (with loading protection)
  const loadCompletionStatus = async () => {
    if (isLoadingStatus) return // Prevent multiple simultaneous calls
    
    try {
      setIsLoadingStatus(true)
      // Get completion status from the dedicated endpoint
      const response = await api.get('/dashboard/completion-status')
      const completionData = response.data
      
      console.log('Completion status from backend:', completionData)
      
      setBusinessProfileComplete(completionData.hasBusinessProfile || false)
      setKycComplete(completionData.kycComplete || false)
      setKycStarted(completionData.kycStarted || false)
      setFinancialPrefsComplete(completionData.financialPreferencesComplete || false)
    } catch (error) {
      console.error('Error loading completion status:', error)
      // Keep default values (all false)
    } finally {
      setIsLoadingStatus(false)
    }
  }

  const fetchDashboardMetrics = async () => {
    try {
      setLoading(true)
      const response = await api.get('/dashboard/metrics')
      setDashboardMetrics(response.data)
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error)
    } finally {
      setLoading(false)
    }
  }

  const dashboardData = {
    supportBanner: {
      title: "Having trouble completing your profile?",
      description:
        "If you're having trouble with completing your profile, kindly reach out to one of our amazing humans at ErrorX to give you a helping hand. We really want you and your business to win.",
      supportText: "Contact support",
      show: true,
    },
    activity: {
      title: "Financing activity",
      subtitle: "Showing daily activity for the last 30 months",
    },
    chartData: [
      { date: "6 Jan", value: 0 },
      { date: "16 Jan", value: 0 },
      { date: "20 Jan", value: 0 },
      { date: "30 Jan", value: 0 },
      { date: "6 Feb", value: 0 },
      { date: "10 Feb", value: 0 },
      { date: "17 Feb", value: 0 },
      { date: "28 Feb", value: 0 },
      { date: "2 Mar", value: 0 },
    ],
  }

  // Alternative data example
  const customData = {
    supportBanner: {
      title: "Need help with your account?",
      description: "Our support team is ready to assist you with any questions or issues you might have.",
      supportText: "Get help now",
      show: true,
    },
    activity: {
      title: "Transaction activity",
      subtitle: "Showing weekly activity for the last 6 months",
    },
    chartData: [
      { date: "Week 1", value: 5 },
      { date: "Week 2", value: 3 },
      { date: "Week 3", value: 8 },
      { date: "Week 4", value: 2 },
      { date: "Week 5", value: 6 },
      { date: "Week 6", value: 1 },
    ],
  }

  const handleContactSupport = () => {
    console.log("Contact support clicked")
  }

  const handleCloseBanner = () => {
    console.log("Banner closed")
  }

  const handleFilter = () => {
    console.log("Filter clicked")
  }

  const handleViewReport = () => {
    console.log("View detailed report clicked")
  }

  // Callback handlers for onboarding flows
  const handleBusinessProfileComplete = React.useCallback((data) => {
    console.log("Business profile completed:", data)
    // Update state immediately and don't refresh from backend to avoid conflicts
    setBusinessProfileComplete(true)
    setIsBusinessSetupOpen(false)
    
    // Update backend status without refreshing the UI state
    api.put('/auth/user', { 
      hasBusinessProfile: true 
    }).then(response => {
      console.log('Business profile status updated successfully:', response.data)
    }).catch(error => {
      console.error('Error updating business profile status in backend:', error)
    })
  }, [])

  const handleKycComplete = React.useCallback((data) => {
    console.log("KYC completed:", data)
    // Update state immediately and don't refresh from backend to avoid conflicts
    setKycComplete(true)
    setKycStarted(true)
    setIsKycOpen(false)
    
    // KYC status is automatically updated from business verification record
    console.log('KYC completed - status will be updated automatically')
  }, [])

  const handleFinancialPrefsComplete = React.useCallback((data) => {
    console.log("Financial preferences completed:", data)
    // Update state immediately
    setFinancialPrefsComplete(true)
    setIsFinancialPrefsOpen(false)
    
    // Refresh completion status from backend to get the latest state
    setTimeout(() => {
      loadCompletionStatus()
    }, 500)
    
    console.log('Financial preferences completed - status updated')
  }, [loadCompletionStatus])

  const invoiceData = dashboardMetrics ? [
    {
      amount: dashboardMetrics.pendingAmount.toFixed(2),
      currency: "XOF",
      title: "Pending Invoices",
      description: `You've ${dashboardMetrics.pendingInvoices} pending invoices`,
      highlightNumber: true,
    },
    {
      amount: dashboardMetrics.rejectedAmount.toFixed(2),
      currency: "XOF",
      title: "Rejected Invoices",
      description: `${dashboardMetrics.rejectedInvoices} rejected invoices`,
      percentageChange: "0% vs last month",
      highlightNumber: true,
    },
    {
      amount: dashboardMetrics.approvedAmount.toFixed(2),
      currency: "XOF",
      title: "Paid Invoices",
      description: `You've received ${dashboardMetrics.approvedInvoices} invoices duly paid so far.`,
      percentageChange: "0% vs last month",
      highlightNumber: true,
    },
  ] : [
    {
      amount: "00.0",
      currency: "XOF",
      title: "Pending Invoices",
      description: "Loading...",
      highlightNumber: true,
    },
    {
      amount: "00.0",
      currency: "XOF",
      title: "Rejected Invoices",
      description: "Loading...",
      percentageChange: "0% vs last month",
      highlightNumber: true,
    },
    {
      amount: "00.0",
      currency: "XOF",
      title: "Paid Invoices",
      description: "Loading...",
      percentageChange: "0% vs last month",
      highlightNumber: true,
    },
  ]

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex">
      {/* <Sidebar /> */}
      <div>
        {/* Header */}
        <header className="bg-white border-b border-[#e4e4e7] px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-[#272635] flex items-center gap-2">Hello Assi 👋</h1>
            <p className="text-sm text-[#5f6057]">Increase cashflow with your invoices</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5f6057]" />
              <Input
                placeholder="Search"
                className="pl-10 w-64 border-[#e4e4e7] focus:border-[#03a84e] focus:ring-[#03a84e]"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#5f6057]">⌘K</span>
            </div>
            <Bell className="w-5 h-5 text-[#5f6057]" />
          </div>
        </header>

        {/* Dashboard content */}
        <div className="p-6 space-y-6">
        {/* Account setup */}
        <div>
          <h2 className="text-lg font-semibold text-[#272635] mb-4">Complete your account setup</h2>
          
          {/* Temporary debug panel */}
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs">
            <strong>Debug Status:</strong><br />
            Business Profile: {businessProfileComplete ? '✅ Complete' : '❌ Incomplete'}<br />
            KYC: {kycComplete ? '✅ Complete' : '❌ Incomplete'} (Started: {kycStarted ? 'Yes' : 'No'})<br />
            Financial Prefs: {financialPrefsComplete ? '✅ Complete' : '❌ Incomplete'}<br />
            <button 
              onClick={loadCompletionStatus}
              className="mt-2 px-2 py-1 bg-blue-500 text-white rounded text-xs mr-2"
            >
              Refresh Status
            </button>
            <button 
              onClick={async () => {
                try {
                  // Refresh completion status from the correct endpoint
                  loadCompletionStatus()
                  alert("Completion status refreshed from backend")
                } catch (error) {
                  alert("Failed to refresh completion status: " + error.message)
                }
              }}
              className="mt-2 px-2 py-1 bg-green-500 text-white rounded text-xs"
            >
              Force KYC Complete
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                {
                  title: "Setup your business profile",
                  description: "Pre-fill your business information to get started",
                  status: businessProfileComplete ? "Completed" : "Ready",
                  color: "bg-purple-100",
                  progress: businessProfileComplete ? "100%" : "0%",
                  src: '/Frame.svg',
                  buttonText: businessProfileComplete ? "Completed" : "Setup business profile",
                  buttonAction: React.useCallback(() => {
                    if (!businessProfileComplete) {
                      setIsBusinessSetupOpen(true)
                    }
                  }, [businessProfileComplete]),
                  disabled: businessProfileComplete
                },
                {
                  title: "Complete KYC/B",
                  description: "Provide documents to help us keep EnvoyX safe",
                  status: kycComplete ? "Completed" : (kycStarted ? "In Progress" : (businessProfileComplete ? "Ready" : "Locked")),
                  color: "bg-green-100",
                  progress: kycComplete ? "100%" : "0%",
                  src: '/Frame1.svg',
                  buttonText: kycComplete ? "Completed" : (kycStarted ? "In Progress" : (businessProfileComplete ? "Start KYC" : "Complete business profile first")),
                  buttonAction: React.useCallback(() => {
                    if (!kycComplete && !kycStarted && businessProfileComplete) {
                      setIsKycOpen(true)
                    }
                  }, [kycComplete, kycStarted, businessProfileComplete]),
                  disabled: !businessProfileComplete || kycComplete
                },
                {
                  title: "Financing preferences",
                  description: "Configure your financing and payment preferences",
                  status: financialPrefsComplete ? "Completed" : (kycComplete ? "Ready" : "Locked"),
                  color: "bg-blue-100",
                  progress: financialPrefsComplete ? "100%" : "0%",
                  src: '/Frame2.svg',
                  buttonText: financialPrefsComplete ? "Completed" : (kycComplete ? "Setup preferences" : "Complete KYC first"),
                  buttonAction: React.useCallback(() => {
                    if (!financialPrefsComplete && kycComplete) {
                      setIsFinancialPrefsOpen(true)
                    }
                  }, [financialPrefsComplete, kycComplete]),
                  disabled: !kycComplete || financialPrefsComplete
                },
              ].map((item, index) => (
                <div key={index} className={`bg-white rounded-xl p-6 border border-[#e4e4e7] flex flex-col h-full ${item.disabled ? 'opacity-60' : ''}`}>
                  {/* Image with badge overlay on top-right */}
                  <div className="relative mb-4">
                    <img src={item?.src || "/placeholder.svg"} alt="" />
                    {/* Badge positioned on top-right of image */}
                    <span className={`absolute top-0 right-0 text-xs px-2 py-1 rounded-full ${
                      item.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      item.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                      item.status === 'Ready' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  
                  {/* Spacer to push content to bottom */}
                  <div className="flex-grow"></div>
                  
                  {/* Title and description at bottom */}
                  <div className="mt-auto">
                    <h3 className="font-semibold text-[#272635] mb-2">{item.title}</h3>
                    <p className="text-sm mb-4">{item.description}</p>
                    
                    {/* Button at bottom */}
                    <div className="flex justify-end">
                      <button 
                        className={`text-sm underline flex items-center gap-1 ${
                          item.disabled ? 'text-gray-400 cursor-not-allowed' : 'text-[#03a84e] hover:text-[#0e363f]'
                        }`}
                        onClick={item.buttonAction}
                        disabled={item.disabled}
                      >
                        {item.buttonText} {!item.disabled && <MoveUpRight className="h-3 w-3" />}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dashboard Metrics */}
          <DashboardMetrics />

          {/* Account overview */}
          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Account overview</h2>
                <p className="text-sm text-gray-500">Showing total visitors for the last 3 months</p>
              </div>
              <div className="flex items-center gap-3">
                <Select defaultValue="last-3-months">
                  <SelectTrigger className="w-auto border-gray-200 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last-3-months">Last 3 months</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="daily">
                  <SelectTrigger className="w-auto border-gray-200 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all-invoices">
                  <SelectTrigger className="w-auto border-gray-200 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-invoices">All invoices</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Main Metric */}
            <div className="text-center mb-12">
              <h3 className="text-sm text-gray-500 mb-3">Total invoice financed</h3>
              <div className="mb-3">
                <span className="text-5xl font-bold text-gray-900">
                  {dashboardMetrics ? dashboardMetrics.totalAmount.toFixed(2) : "00.0"}
                </span>
                <span className="text-lg text-gray-400 ml-2">XOF</span>
              </div>
              <div className="text-sm text-gray-500">
                vs. <span className="text-gray-700">32,500,650.00 XOF</span> last period{" "}
                <span className="text-green-600 font-medium">+38.7%</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {invoiceData.map((data, index) => (
                <InvoiceCard key={index} data={data} />
              ))}
            </div>
          </div>
          <FinancialDashboard
            data={dashboardData}
            onContactSupport={handleContactSupport}
            onCloseBanner={handleCloseBanner}
            onFilter={handleFilter}
            onViewReport={handleViewReport}
          />
      <TransactionHistory
        recentTransactionsTitle="Recent transactions"
        recentTransactionsSubtitle="Showing your recent transfers"
        awaitingFinancingTitle="Invoices awaiting financing"
        awaitingFinancingSubtitle="Showing activities on the invoices submitted for financing"
        transactions={[]}
        onTransactionClick={(transaction) => console.log(transaction)}
        className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm"
      />
        </div>

      {/* Business Setup Sidebar */}
      <SidebarProvider open={isBusinessSetupOpen} onOpenChange={setIsBusinessSetupOpen}>
        {isBusinessSetupOpen && (
          <div className="fixed inset-0 z-[9999]">
            {/* Dark backdrop overlay */}
            <div
              className="fixed inset-0 bg-black/40 transition-all duration-300 ease-in-out"
              onClick={() => setIsBusinessSetupOpen(false)}
              aria-hidden="true"
            />
            <MultiStepBusinessSetup
              onComplete={handleBusinessProfileComplete}
              onCancel={() => setIsBusinessSetupOpen(false)}
            />
          </div>
        )}
      </SidebarProvider>

      {/* KYC Verification Drawer */}
      <SidebarProvider open={isKycOpen} onOpenChange={setIsKycOpen}>
        {isKycOpen && (
          <div className="fixed inset-0 z-[9999]">
            {/* Dark backdrop overlay */}
            <div
              className="fixed inset-0 bg-black/40 transition-all duration-300 ease-in-out"
              onClick={() => setIsKycOpen(false)}
              aria-hidden="true"
            />
            <KycVerificationDrawer
              onComplete={handleKycComplete}
              onStart={() => setKycStarted(true)}
              onCancel={() => setIsKycOpen(false)}
            />
          </div>
        )}
      </SidebarProvider>

      {/* Financial Preferences Drawer */}
      <SidebarProvider open={isFinancialPrefsOpen} onOpenChange={setIsFinancialPrefsOpen}>
        {isFinancialPrefsOpen && (
          <div className="fixed inset-0 z-[9999]">
            {/* Dark backdrop overlay */}
            <div
              className="fixed inset-0 bg-black/40 transition-all duration-300 ease-in-out"
              onClick={() => setIsFinancialPrefsOpen(false)}
              aria-hidden="true"
            />
            <FinancialPreferencesDrawer
              onComplete={handleFinancialPrefsComplete}
              onCancel={() => setIsFinancialPrefsOpen(false)}
            />
          </div>
        )}
      </SidebarProvider>
      </div>
    </div>
  )
}
