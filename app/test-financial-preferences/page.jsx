"use client"

import { FinancialPreferencesExample } from "@/components/examples/financial-preferences-example"

export default function TestFinancialPreferencesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Financial Preferences Test Page</h1>
        <FinancialPreferencesExample />
      </div>
    </div>
  )
}
