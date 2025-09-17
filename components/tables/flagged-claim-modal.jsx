"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle2, Upload, Edit, Trash2, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"

export default function FlaggedClaimModal({ claim, onResolve, onWithdraw, onClose }) {
  const [activeTab, setActiveTab] = useState("details")
  const [loading, setLoading] = useState(false)
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  // Reset form and tab when component mounts
  useEffect(() => {
    reset()
    setActiveTab("details")
  }, [reset])

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(dateString))
    } catch {
      return dateString
    }
  }

  const formatAmount = (amount) => {
    if (!amount) return '0.00'
    return parseFloat(amount).toFixed(2)
  }

  const handleResolveSubmit = async (data) => {
    setLoading(true)
    try {
      await onResolve(claim.id, data)
      reset()
      onClose()
    } catch (error) {
      console.error('Error resolving claim:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleWithdrawSubmit = async (data) => {
    setLoading(true)
    try {
      await onWithdraw(claim.id, data.reason)
      reset()
      onClose()
    } catch (error) {
      console.error('Error withdrawing claim:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      // This would typically call an upload endpoint
      console.log('Uploading file:', file.name)
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error('Error uploading file:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!claim) return null

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#f59e0b]" />
            Flagged Claim Details
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="resolve">Resolve</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Claim Information */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Claim Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-600">Claim ID:</span>
                    <div className="font-medium">{claim.claimNumber || claim.invoiceNumber || 'N/A'}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Submission Date:</span>
                    <div className="font-medium">{formatDate(claim.submissionDate || claim.createdAt)}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Insurance Provider:</span>
                    <div className="font-medium">{claim.insuranceName || 'N/A'}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Amount:</span>
                    <div className="font-medium">
                      {formatAmount(claim.insuranceValuePostValidation || claim.insuranceValueBeforeValidation)} XOF
                    </div>
                  </div>
                </div>
              </div>

              {/* Flag Information */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Flag Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-600">Flag Reason:</span>
                    <div className="font-medium text-[#f59e0b]">{claim.flagReason || 'N/A'}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Flag Details:</span>
                    <div className="font-medium">{claim.flagDetails || 'N/A'}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Flagged At:</span>
                    <div className="font-medium">{formatDate(claim.flaggedAt)}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Status:</span>
                    <Badge variant="secondary" className="bg-[#fef3c7] text-[#d97706]">
                      {claim.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="resolve" className="space-y-4">
            <form onSubmit={handleSubmit(handleResolveSubmit)} className="space-y-4">
              <div>
                <label className="text-sm font-medium">
                  Resolution Action <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register("resolutionAction", { required: "Resolution action is required" })}
                  placeholder="e.g., Missing document uploaded, Information corrected"
                  className="mt-1"
                />
                {errors.resolutionAction && (
                  <p className="text-sm text-red-600 mt-1">{errors.resolutionAction.message}</p>
                )}
              </div>
              
              <div>
                <label className="text-sm font-medium">Resolution Details</label>
                <Textarea
                  {...register("resolutionDetails")}
                  placeholder="Provide detailed steps taken to resolve the flag..."
                  className="mt-1"
                  rows={4}
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                Resolve Claim
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="actions" className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Upload Additional Documents</label>
                <Input
                  type="file"
                  onChange={handleFileUpload}
                  className="mt-1"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <Button 
                  onClick={() => document.querySelector('input[type="file"]').click()} 
                  disabled={loading}
                  className="mt-2 w-full"
                >
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                  Upload Documents
                </Button>
              </div>

              <Button variant="outline" className="w-full">
                <Edit className="mr-2 h-4 w-4" />
                Edit Claim Details
              </Button>

              <form onSubmit={handleSubmit(handleWithdrawSubmit)} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">
                    Withdraw Claim <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    {...register("reason", { required: "Withdrawal reason is required" })}
                    placeholder="Reason for withdrawing the claim..."
                    className="mt-1"
                    rows={3}
                  />
                  {errors.reason && (
                    <p className="text-sm text-red-600 mt-1">{errors.reason.message}</p>
                  )}
                </div>
                <Button type="submit" disabled={loading} variant="destructive" className="w-full">
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                  Withdraw Claim
                </Button>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
