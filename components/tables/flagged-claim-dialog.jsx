"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Upload, Edit, Trash2, CheckCircle, XCircle, FileText, Calendar, User, DollarSign } from "lucide-react"
import { useForm } from "react-hook-form"

export default function FlaggedClaimDialog({ claim, open, onOpenChange, onResolve, onWithdraw }) {
  const [activeTab, setActiveTab] = useState("details")
  const [loading, setLoading] = useState(false)
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  // Reset form and tab when dialog opens with a new claim
  useEffect(() => {
    if (open && claim) {
      reset()
      setActiveTab("details") // Reset to details tab
    }
  }, [open, claim, reset])

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
    } catch (error) {
      console.error('Error withdrawing claim:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDialogClose = (open) => {
    if (!open) {
      reset() // Reset form when dialog is closed
    }
    onOpenChange(open)
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      // This would call the upload endpoint
      // await api.post(`/flagged-claims/${claim.id}/upload-documents`, formData)
      console.log('File upload not implemented yet')
    } catch (error) {
      console.error('Error uploading file:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!claim) return null

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Claim Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">
                      <strong>Claim ID:</strong> {claim.claimNumber || claim.invoiceNumber || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">
                      <strong>Submission Date:</strong> {formatDate(claim.submissionDate || claim.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">
                      <strong>Amount:</strong> {formatAmount(claim.insuranceValuePostValidation || claim.insuranceValueBeforeValidation)} XOF
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">
                      <strong>Patient:</strong> {claim.patientName || 'N/A'}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Flag Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-sm font-medium">Flag Reason:</span>
                    <p className="text-sm text-gray-600 mt-1">{claim.flagReason || 'No reason provided'}</p>
                  </div>
                  {claim.flagDetails && (
                    <div>
                      <span className="text-sm font-medium">Details:</span>
                      <p className="text-sm text-gray-600 mt-1">{claim.flagDetails}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-sm font-medium">Flagged At:</span>
                    <p className="text-sm text-gray-600 mt-1">{formatDate(claim.flaggedAt)}</p>
                  </div>
                  <div>
                    <Badge variant="secondary" className="bg-[#fef3c7] text-[#d97706]">
                      {claim.status === 'FLAGGED' ? 'Flagged' : claim.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {claim.resolutionAction && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Resolution Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-sm font-medium">Action Taken:</span>
                    <p className="text-sm text-gray-600 mt-1">{claim.resolutionAction}</p>
                  </div>
                  {claim.resolutionDetails && (
                    <div>
                      <span className="text-sm font-medium">Details:</span>
                      <p className="text-sm text-gray-600 mt-1">{claim.resolutionDetails}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-sm font-medium">Resolved At:</span>
                    <p className="text-sm text-gray-600 mt-1">{formatDate(claim.resolvedAt)}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="resolve" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Resolve Flag</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(handleResolveSubmit)} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Resolution Action *</label>
                    <Input
                      {...register("resolutionAction", { required: "Resolution action is required" })}
                      placeholder="e.g., Uploaded missing documents, Corrected claim information"
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
                      placeholder="Provide additional details about how the issue was resolved..."
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" disabled={loading} className="flex-1">
                      {loading ? "Resolving..." : "Mark as Resolved"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => reset()}>
                      Clear
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="actions" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Upload Documents
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Upload additional documents to support your claim
                  </p>
                  <div>
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      disabled={loading}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    Edit Claim
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Make corrections to claim information
                  </p>
                  <Button variant="outline" className="w-full" disabled>
                    Edit Claim Details
                  </Button>
                  <p className="text-xs text-gray-500">
                    Feature coming soon
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-red-600">
                  <Trash2 className="w-4 h-4" />
                  Withdraw Claim
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(handleWithdrawSubmit)} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Withdrawal Reason *</label>
                    <Textarea
                      {...register("reason", { required: "Withdrawal reason is required" })}
                      placeholder="Explain why you want to withdraw this claim..."
                      className="mt-1"
                      rows={3}
                    />
                    {errors.reason && (
                      <p className="text-sm text-red-600 mt-1">{errors.reason.message}</p>
                    )}
                  </div>
                  
                  <Button 
                    type="submit" 
                    variant="destructive" 
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? "Withdrawing..." : "Withdraw Claim"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
