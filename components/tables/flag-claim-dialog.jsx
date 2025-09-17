"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle, Flag } from "lucide-react"
import { useForm } from "react-hook-form"

export default function FlagClaimDialog({ invoice, open, onOpenChange, onSubmit }) {
  const [loading, setLoading] = useState(false)
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  // Reset form when dialog opens with a new invoice
  useEffect(() => {
    if (open && invoice) {
      reset()
    }
  }, [open, invoice, reset])

  const handleFormSubmit = async (data) => {
    setLoading(true)
    try {
      await onSubmit(invoice.id, data)
      reset()
    } catch (error) {
      console.error('Error flagging claim:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDialogClose = (open) => {
    console.log('FlagClaimDialog closing:', open) // Debug log
    if (!open) {
      reset() // Reset form when dialog is closed
    }
    onOpenChange(open)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(new Date(dateString))
    } catch {
      return dateString
    }
  }

  if (!invoice) return null

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-2xl" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-[#f59e0b]" />
            Flag Claim for Review
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Claim Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3">Claim Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Claim ID:</span>
                <div className="font-medium">{invoice.claimNumber || invoice.invoiceNumber || 'N/A'}</div>
              </div>
              <div>
                <span className="text-gray-600">Submission Date:</span>
                <div className="font-medium">{formatDate(invoice.submissionDate || invoice.createdAt)}</div>
              </div>
              <div>
                <span className="text-gray-600">Insurance Provider:</span>
                <div className="font-medium">{invoice.insuranceName || 'N/A'}</div>
              </div>
              <div>
                <span className="text-gray-600">Amount:</span>
                <div className="font-medium">
                  {invoice.insuranceValuePostValidation || invoice.insuranceValueBeforeValidation || '0.00'} XOF
                </div>
              </div>
            </div>
          </div>

          {/* Flag Form */}
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium">
                Flag Reason <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("flagReason", { required: "Flag reason is required" })}
                placeholder="e.g., Missing insured ID, Incomplete documentation, Amount discrepancy"
                className="mt-1"
              />
              {errors.flagReason && (
                <p className="text-sm text-red-600 mt-1">{errors.flagReason.message}</p>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium">Additional Details</label>
              <Textarea
                {...register("flagDetails")}
                placeholder="Provide additional details about why this claim needs review..."
                className="mt-1"
                rows={4}
              />
            </div>

            {/* Warning Message */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">Important Notice</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Flagging a claim will move it to the "Resolve" tab where you can take corrective actions. 
                    This action will be logged in the system.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Flagging..." : "Flag Claim"}
              </Button>
              <Button type="button" variant="outline" onClick={() => {
                reset()
                onOpenChange(false)
              }}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
