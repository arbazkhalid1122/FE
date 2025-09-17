"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, DollarSign, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import api from "@/lib/axios"
import { useSession } from "next-auth/react"

export default function DashboardMetrics() {
  const { data: session } = useSession()
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (session?.user?.id) {
      fetchDashboardMetrics()
    }
  }, [session?.user?.id])

  const fetchDashboardMetrics = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('Fetching dashboard metrics for user:', session?.user?.id)
      
      // First test the basic endpoint
      try {
        const testResponse = await api.get('/dashboard/test')
        console.log('Dashboard test response:', testResponse.data)
      } catch (testError) {
        console.error('Dashboard test failed:', testError)
      }
      
      const response = await api.get('/dashboard/metrics')
      console.log('Dashboard metrics response:', response.data)
      setMetrics(response.data)
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error)
      console.error('Error details:', error.response?.data)
      setError(`Failed to load dashboard metrics: ${error.response?.data?.message || error.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="border-[#e4e4e7] shadow-none">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={fetchDashboardMetrics}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    )
  }

  if (!metrics) return null

  const metricsData = [
    {
      value: metrics.totalInvoices || 0,
      label: "Total Invoices Submitted",
      icon: FileText,
      iconColor: "text-blue-500",
      description: "Total number of invoices submitted",
    },
    {
      value: metrics.totalFinancingRequested || 0,
      label: "Total Financing Requested",
      icon: DollarSign,
      iconColor: "text-green-500",
      description: "Total amount of financing requested",
      isAmount: true,
    },
    {
      value: metrics.pendingInvoices || 0,
      label: "Pending Review",
      icon: Clock,
      iconColor: "text-yellow-500",
      description: "Invoices awaiting review",
    },
    {
      value: metrics.approvedInvoices || 0,
      label: "Approved Invoices",
      icon: CheckCircle,
      iconColor: "text-green-500",
      description: "Invoices that have been approved",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metricsData.map((metric, index) => (
        <Card key={index} className="border-[#e4e4e7] shadow-none hover:shadow-sm transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold text-[#000000]">
                {metric.isAmount ? `$${metric.value.toLocaleString()}` : metric.value}
              </span>
              {metric.icon && (
                <metric.icon className={`w-5 h-5 ${metric.iconColor}`} />
              )}
            </div>
            <p className="text-sm text-[#a1a1aa] mb-1">{metric.label}</p>
            <p className="text-xs text-[#a1a1aa]">{metric.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
