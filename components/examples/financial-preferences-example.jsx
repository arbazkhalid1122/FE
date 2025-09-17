"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { FinancialPreferencesDrawer } from "@/components/onBoarding/financial-preferences-drawer"
import { SidebarProvider } from "@/components/ui/sidebar"

const FinancialPreferencesExample = () => {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)

  const handleOpenDrawer = () => {
    setIsDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false)
  }

  const handleComplete = (data) => {
    console.log("Financial preferences completed:", data)
    // Handle the completion logic here
    // For example, you might want to show a success message
    // or redirect to another page
    alert("Financial preferences saved successfully!")
  }

  return (
    <SidebarProvider>
      <div className="p-6">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4">Financial Preferences Example</h2>
          <p className="text-gray-600 mb-6">
            Click the button below to open the financial preferences drawer.
          </p>
          
          <Button 
            onClick={handleOpenDrawer}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Open Financial Preferences
          </Button>

          <FinancialPreferencesDrawer
            open={isDrawerOpen}
            onOpenChange={setIsDrawerOpen}
            onComplete={handleComplete}
            onCancel={handleCloseDrawer}
          />
        </div>
      </div>
    </SidebarProvider>
  )
}

export { FinancialPreferencesExample }
