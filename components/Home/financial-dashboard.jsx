"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, ArrowRight } from "lucide-react"



export default function FinancialDashboard({
  data = {
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
  },
  onCloseBanner,
  onContactSupport,
  onFilter,
  onRescind,
  onPac,
  onViewReport,
  className = "",
}) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Support Banner */}
      {data.supportBanner?.show && (
        <Card className="bg-blue-50 border-blue-100 p-6">
          <div className="flex items-start gap-4">
            {/* Illustration */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                  <div className="w-8 h-6 bg-gray-300 rounded-sm"></div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-medium text-gray-900 mb-2">{data.supportBanner.title}</h3>
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">{data.supportBanner.description}</p>
              <Button
                variant="link"
                className="p-0 h-auto text-green-600 hover:text-green-700 font-medium"
                onClick={onContactSupport}
              >
                {data.supportBanner.supportText}
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>

            {/* Close Button */}
            {onCloseBanner && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600 flex-shrink-0"
                onClick={onCloseBanner}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Activity Section */}
      <div className="space-y-4">
        {/* Activity Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{data.activity?.title}</h2>
            <p className="text-sm text-gray-500 mt-1">{data.activity?.subtitle}</p>
          </div>

          {/* Filter Controls */}
          <div className="flex items-center gap-3 text-sm">
            <Button
              variant="link"
              className="p-0 h-auto text-blue-600 hover:text-blue-700 font-medium"
              onClick={onFilter}
            >
              Filter
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <Button
                variant="link"
                className="p-0 h-auto text-gray-600 hover:text-gray-700 font-medium"
                onClick={onRescind}
              >
                Rescind
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <Button
                variant="link"
                className="p-0 h-auto text-gray-600 hover:text-gray-700 font-medium"
                onClick={onPac}
              >
                Pac
              </Button>
            </div>
            <Button
              variant="link"
              className="p-0 h-auto text-green-600 hover:text-green-700 font-medium"
              onClick={onViewReport}
            >
              View detailed report
            </Button>
          </div>
        </div>

        {/* Activity Chart */}
        <Card className="p-6">
          <div className="h-64 flex items-end justify-between border-b border-gray-100 pb-4 mb-4">
            {/* Chart area - currently empty as shown in the image */}
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <div className="w-8 h-8 bg-gray-200 rounded"></div>
                </div>
                <p className="text-sm">No activity data to display</p>
              </div>
            </div>
          </div>

          {/* Date labels */}
          <div className="flex justify-between items-center text-xs text-gray-500">
            {data.chartData?.map((point, index) => (
              <span key={index} className="text-center">
                {point.date}
              </span>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
