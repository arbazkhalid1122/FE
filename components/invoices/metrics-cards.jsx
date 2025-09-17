"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Infinity, AlertCircle, ExternalLink, CheckCircle2, Ellipsis, Loader2 } from "lucide-react"
import api from "@/lib/axios"
import { useSession } from "next-auth/react"

export default function MetricsCards({ refreshTrigger = 0 }) {
  const { data: session } = useSession()
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (session?.user?.id) {
      fetchMetrics()
    }
  }, [session?.user?.id, refreshTrigger])

  const fetchMetrics = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get('/dashboard/metrics')
      setMetrics(response.data)
    } catch (error) {
      console.error('Error fetching metrics:', error)
      setError('Failed to load metrics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 overflow-x-hidden">
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
      <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
        {error}
      </div>
    )
  }

  if (!metrics) {
    return null
  }

  const metricsData = [
    {
      value: metrics.pendingInvoices.toString(),
      label: "Your pending invoices",
      sublabel: `${metrics.pendingAmount.toFixed(2)} XOF pending`,
      icon: Infinity,
      iconColor: "text-[#61c454]",
    },
    {
      value: metrics.rejectedInvoices.toString(),
      label: "Invoices rejected",
      sublabel: `${metrics.rejectedAmount.toFixed(2)} XOF rejected`,
      icon: Ellipsis,
      iconColor: "text-[#ee6a5f]",
    },
    {
      value: metrics.totalInvoices.toString(),
      label: "Total invoices",
      sublabel: `${metrics.totalAmount.toFixed(2)} XOF total`,
      icon: AlertCircle,
      iconColor: "text-[#3b82f6]",
    },
    {
      value: metrics.approvedInvoices.toString(),
      label: "Processed invoices",
      sublabel: `${metrics.approvedAmount.toFixed(2)} XOF approved`,
      icon: CheckCircle2,
      iconColor: "text-[#61c454]",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 overflow-x-hidden">
      {metricsData.map((metric, index) => (
        <Card key={index} className="border-[#e4e4e7] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl text-[#000000]">{metric.value}</span>
              {metric.icon ? (
                <metric.icon className={`w-5 h-5 ${metric.iconColor}`} />
              ) : (
                <div className="text-xs text-[#a1a1aa]">...</div>
              )}
            </div>
            <p className="text-sm text-[#a1a1aa] mb-1">{metric.label}</p>
            {metric.sublabel && <p className="text-xs text-[#a1a1aa] mb-2">{metric.sublabel}</p>}
            {metric.hasAction && (
              <button className="text-xs text-[#000000] hover:text-[#61c454] flex items-center gap-1">
                Resolve invoices
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
