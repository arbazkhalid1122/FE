import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"


export default function InvoiceCard({ data, className = "" }) {
  const { amount, currency, title, description, percentageChange, highlightNumber } = data

  // Function to highlight numbers in description
  const renderDescription = (text) => {
    if (!highlightNumber) return text

    // Split text and highlight numbers
    const parts = text.split(/(\d+)/)
    return parts.map((part, index) => {
      if (/^\d+$/.test(part)) {
        return (
          <span key={index} className="font-semibold text-gray-900">
            {part}
          </span>
        )
      }
      return part
    })
  }

  return (
    <Card className={`w-full bg-white border border-gray-200 shadow-sm ${className}`}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 pt-6 px-6">
        <div className="space-y-1 flex-1">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-normal text-gray-900">{amount}</span>
            <span className="text-sm font-normal text-gray-500 uppercase tracking-wide">{currency}</span>
          </div>
          <h3 className="text-base font-medium text-gray-900">{title}</h3>
          {/* {percentageChange && <p className="text-xs text-gray-500 mt-1">{percentageChange}</p>} */}
        </div>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 flex-shrink-0">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">More options</span>
        </Button>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <p className="text-sm text-gray-600">{renderDescription(description)}</p>
      </CardContent>
    </Card>
  )
}
