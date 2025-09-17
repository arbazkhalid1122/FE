"use client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"

export function BusinessVerificationModal({ open, onOpenChange, onCancel, onProceed }) {
  const handleCancel = () => {
    onCancel?.()
    onOpenChange(false)
  }

  const handleProceed = () => {
    onProceed?.()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] mx-4 p-0 gap-0 bg-white rounded-lg border-0">
        {/* Modal content */}
        <div className="p-4 sm:p-6 text-center">
          {/* Illustration container */}
          <div className="relative mb-6 sm:mb-8 flex justify-center w-full max-w-[500px] h-[300px]">
  <Image
    src="/modalbg.svg"
    alt="Background decorative lines"
    fill
    className="object-cover"
  />
</div>

          {/* Text content */}
          <DialogHeader className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 text-center flex flex-col items-center">
            <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
              Verify your business profile
            </DialogTitle>
            <p className="text-xs sm:text-sm text-[#081F24B2] leading-relaxed px-4 sm:px-8 text-center">
              You're two steps away from enjoying steady cashflow to drive your business growth. Complete our KYC/B to
              get started like a boss
            </p>
          </DialogHeader>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between py-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleProceed}
              className="px-6 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors order-1 sm:order-2"
            >
              Proceed
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
