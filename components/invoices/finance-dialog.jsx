"use client"

import * as React from "react"
import { File, X, Trash2, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar"
import { Sheet, SheetContent, SheetHeader, SheetFooter } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"
import axios from "axios"
import api from "@/lib/axios"

// Hook to detect mobile screen
function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIsMobile()
    window.addEventListener("resize", checkIsMobile)
    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  return isMobile
}

function InvoiceUploadDialog({ open = true, setIsOpen, onUploadSuccess }) {
  const isMobile = useIsMobile()
  const [agreedToTerms, setAgreedToTerms] = React.useState(false)
  const [dragActive, setDragActive] = React.useState(false)
  const [uploadedFiles, setUploadedFiles] = React.useState([])
  const fileInputRef = React.useRef(null)
  const replaceFileInputRef = React.useRef(null)
  const [replacingFileIndex, setReplacingFileIndex] = React.useState(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submitMessage, setSubmitMessage] = React.useState("")
  const [submitError, setSubmitError] = React.useState(false)
  const [extractionResults, setExtractionResults] = React.useState([])
  const [showExtractionResults, setShowExtractionResults] = React.useState(false)

  const handleSave = async () => {
    if (!agreedToTerms) return
    if (uploadedFiles.length === 0) {
      setSubmitMessage("Please upload at least one file.")
      setSubmitError(true)
      return
    }

    setIsSubmitting(true)
    setSubmitMessage("")
    setSubmitError(false)

    const formData = new FormData()

    // Append all files to FormData
    uploadedFiles.forEach((fileData, index) => {
      formData.append(`file`, fileData.file)
    })

    try {
      const response = await api.post("/invoices/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      const { data, extractionResult } = response.data
      
      setSubmitMessage(`Upload successful: ${uploadedFiles.length} file(s) uploaded`)
      setSubmitError(false)

      // Store extraction results if available
      if (extractionResult && extractionResult.success) {
        setExtractionResults([{
          filename: uploadedFiles[0]?.file?.name || 'Unknown',
          data: data,
          processingTime: extractionResult.processingTime
        }])
        setShowExtractionResults(true)
      }

      // Refresh invoice data after successful upload
      if (onUploadSuccess) {
        onUploadSuccess()
      }

      // Close dialog after successful upload and extraction (with short delay to show results)
      setTimeout(() => {
        setIsOpen(false)
        setShowExtractionResults(false)
        setExtractionResults([])
      }, 2000)
    } catch (error) {
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.message || "Unknown server error"
        setSubmitMessage(`Upload failed: ${errorMessage}`)
      } else if (error.request) {
        // Request was made but no response received
        setSubmitMessage("Error uploading invoice. Please check your connection.")
      } else {
        // Something else happened
        setSubmitMessage("Error uploading invoice. Please try again.")
      }
      setSubmitError(true)
      console.error("Upload error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setIsOpen(false)
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files)
      addFiles(files)
    }
  }

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files)
      addFiles(files)
    }
  }

  const handleReplaceFileChange = (e) => {
    if (e.target.files && e.target.files[0] && replacingFileIndex !== null) {
      const newFile = e.target.files[0]
      const fileWithPreview = {
        file: newFile,
        name: newFile.name,
        size: newFile.size,
        type: newFile.type,
        preview: newFile.type.startsWith("image/") ? URL.createObjectURL(newFile) : null,
        id: Date.now() + Math.random(),
      }

      setUploadedFiles((prev) => {
        const newFiles = [...prev]
        // Clean up old preview URL
        if (newFiles[replacingFileIndex].preview) {
          URL.revokeObjectURL(newFiles[replacingFileIndex].preview)
        }
        newFiles[replacingFileIndex] = fileWithPreview
        return newFiles
      })

      setReplacingFileIndex(null)
    }
  }

  const addFiles = (files) => {
    const maxFileSize = 10 * 1024 * 1024 // 10MB
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/jpg',
      'image/png'
    ]

    const validFiles = []
    const errors = []

    files.forEach((file) => {
      // Check file size
      if (file.size > maxFileSize) {
        errors.push(`${file.name}: File size exceeds 10MB limit`)
        return
      }

      // Check file type
      if (!allowedTypes.includes(file.type)) {
        errors.push(`${file.name}: Unsupported file type. Please upload PDF, DOC, DOCX, JPG, or PNG files`)
        return
      }

      // Check for duplicates
      const isDuplicate = uploadedFiles.some(existingFile => 
        existingFile.name === file.name && existingFile.size === file.size
      )
      
      if (isDuplicate) {
        errors.push(`${file.name}: This file has already been uploaded`)
        return
      }

      validFiles.push({
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
        id: Date.now() + Math.random(),
      })
    })

    // Show validation errors
    if (errors.length > 0) {
      setSubmitMessage(`Validation errors: ${errors.join('; ')}`)
      setSubmitError(true)
    }

    // Add valid files
    if (validFiles.length > 0) {
      setUploadedFiles((prev) => [...prev, ...validFiles])
      if (errors.length === 0) {
        setSubmitMessage("")
        setSubmitError(false)
      }
    }
  }

  const deleteFile = (index) => {
    setUploadedFiles((prev) => {
      const newFiles = [...prev]
      // Clean up preview URL
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview)
      }
      newFiles.splice(index, 1)
      return newFiles
    })
  }

  const replaceFile = (index) => {
    setReplacingFileIndex(index)
    replaceFileInputRef.current?.click()
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (type) => {
    if (type.startsWith("image/")) return "🖼️"
    if (type.includes("pdf")) return "📄"
    if (type.includes("word") || type.includes("document")) return "📝"
    return "📎"
  }

  // Form content component
  const FormContent = () => (
    <div className="flex flex-col h-full">
      {/* Main content */}
      <div className="flex-1 px-6 py-6 pt-2">
        {/* Description */}
        <div className="mb-8 pb-4 border-b border-gray-100">
          <p className="text-sm text-gray-600 leading-relaxed">
            Upload your claim documents (PDF, scanned images) for processing. The system will automatically extract key information including Claim Reference Number, Amount, Date, Insurer, and Provider ID. Duplicate claims will be detected and flagged.
          </p>
        </div>

        {/* Upload Area */}
        <div
          className={`
            relative bg-[#F7F7F7] rounded-xl p-4 text-center transition-all duration-200 cursor-pointer
            ${dragActive ? "bg-green-50 border-2 border-green-300 border-dashed" : ""}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleFileSelect}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            multiple
          />
          <input
            ref={replaceFileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={handleReplaceFileChange}
          />
          <div className="flex flex-col items-center space-y-4">
            {/* Upload Icon */}
            <div className="w-16 h-16 flex items-center justify-center">
              <Image src="/Image.png" width={50} height={50} alt="Upload" />
            </div>
            {/* Upload Text */}
            <div className="space-y-2">
              <p className="text-sm text-gray-700">
                Drag 'n' drop your claim documents here or{" "}
                <span className="text-green-600 font-medium">click here to upload</span>
              </p>
              <p className="text-xs text-gray-500">PDF, DOC, DOCX, JPG, JPEG, PNG (Max. 10MB each)</p>
              <p className="text-xs text-gray-400">
                System will extract: Claim Ref No, Amount, Date, Insurer, Provider ID
              </p>
            </div>
          </div>
        </div>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Uploaded Files ({uploadedFiles.length})</h3>
            <div className="space-y-2">
              {uploadedFiles.map((fileData, index) => (
                <div
                  key={fileData.id}
                  className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    {fileData.preview ? (
                      <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0">
                        <img
                          src={fileData.preview || "/placeholder.svg"}
                          alt={fileData.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded flex-shrink-0">
                        <span className="text-lg">{getFileIcon(fileData.type)}</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{fileData.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(fileData.size)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        replaceFile(index)
                      }}
                      className="h-8 w-8 p-0 hover:bg-blue-50"
                    >
                      <Edit className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteFile(index)
                      }}
                      className="h-8 w-8 p-0 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Message */}
        {submitMessage && (
          <div
            className={`mt-4 p-3 rounded-lg text-sm ${
              submitError
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-green-50 text-green-700 border border-green-200"
            }`}
          >
            {submitMessage}
          </div>
        )}

        {/* Extraction Results */}
        {showExtractionResults && extractionResults.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-3">
              📊 Extracted Invoice Data
            </h4>
            {extractionResults.map((result, index) => (
              <div key={index} className="space-y-2">
                <div className="text-xs text-blue-700">
                  <strong>File:</strong> {result.filename}
                  {result.processingTime && (
                    <span className="ml-2">
                      <strong>Processing time:</strong> {result.processingTime.toFixed(2)}s
                    </span>
                  )}
                </div>
                {result.data && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    {result.data.claimNumber && (
                      <div className="bg-white p-2 rounded border">
                        <strong>Claim Number:</strong> {result.data.claimNumber}
                      </div>
                    )}
                    {result.data.insuranceName && (
                      <div className="bg-white p-2 rounded border">
                        <strong>Insurance:</strong> {result.data.insuranceName}
                      </div>
                    )}
                    {result.data.patientName && (
                      <div className="bg-white p-2 rounded border">
                        <strong>Patient:</strong> {result.data.patientName}
                      </div>
                    )}
                    {result.data.invoiceNumber && (
                      <div className="bg-white p-2 rounded border">
                        <strong>Invoice #:</strong> {result.data.invoiceNumber}
                      </div>
                    )}
                    {result.data.outOfPocketPercentage && (
                      <div className="bg-white p-2 rounded border">
                        <strong>Out-of-Pocket:</strong> {result.data.outOfPocketPercentage}
                      </div>
                    )}
                    {result.data.maxCoverage && (
                      <div className="bg-white p-2 rounded border">
                        <strong>Max Coverage:</strong> {result.data.maxCoverage}
                      </div>
                    )}
                    {result.data.submissionDate && (
                      <div className="bg-white p-2 rounded border">
                        <strong>Submission Date:</strong> {result.data.submissionDate}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Terms and conditions */}
      <div className="px-6 pb-6">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="terms"
            checked={agreedToTerms}
            onCheckedChange={setAgreedToTerms}
            className="mt-0.5 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
          />
          <div className="text-sm text-gray-600 leading-relaxed">
            By continuing you agree to Envoy's
            <span className="text-[#03A84E] underline cursor-pointer"> Terms of Service</span>{" "}
            <span className="text-[#03A84E] underline cursor-pointer"> Privacy Policy</span>
          </div>
        </div>
      </div>
    </div>
  )

  // Header component
  const HeaderContent = () => (
    <div className="flex items-center justify-between px-6 py-4 pb-0">
      <h1 className="text-lg font-semibold text-gray-900">Submit invoice</h1>
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCancel}>
        <X className="h-4 w-4 text-gray-600" />
      </Button>
    </div>
  )

  // Footer component
  const FooterContent = () => (
    <div className="px-6 py-4 border-t border-gray-100 bg-white">
      <div className="flex justify-between ">
        <Button
          variant="outline"
          onClick={handleCancel}
          className="h-10 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg bg-white"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={!agreedToTerms || isSubmitting}
          className="h-10 bg-gray-900 text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg"
        >
          <File className="fill-white" />
          {isSubmitting ? "Uploading..." : "Submit Invoice"}
        </Button>
      </div>
    </div>
  )

  // Mobile drawer
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-full p-0 flex flex-col bg-white">
          <SheetHeader className="p-0 bg-white shrink-0">
            <HeaderContent />
          </SheetHeader>
          <div className="flex-1 overflow-y-auto">
            <FormContent />
          </div>
          <SheetFooter className="p-0 bg-white shrink-0">
            <FooterContent />
          </SheetFooter>
        </SheetContent>
      </Sheet>
    )
  }

  // Desktop sidebar
  return (
    <Sidebar
      side="right"
      collapsible="none"
      className="w-full max-w-md mr-4 rounded-2xl shadow-xl border border-gray-200 overflow-hidden bg-white"
      style={{
        position: "fixed",
        top: "16px",
        right: "16px",
        bottom: "16px",
        width: "calc(100% - 32px)",
        maxWidth: "448px",
        height: "calc(100vh - 32px)",
        zIndex: 500,
      }}
    >
      <SidebarHeader className="p-0 bg-white">
        <HeaderContent />
      </SidebarHeader>
      <SidebarContent className="p-0 overflow-y-auto bg-white">
        <FormContent />
      </SidebarContent>
      <SidebarFooter className="p-0 bg-white">
        <FooterContent />
      </SidebarFooter>
    </Sidebar>
  )
}

export default InvoiceUploadDialog
