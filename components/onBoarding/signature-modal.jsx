"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"



export function SignatureModal({ open, onOpenChange }) {
  const [signatureText, setSignatureText] = useState("")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Signature</DialogTitle>
          <DialogDescription>Choose how you'd like to add your signature to the document.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="type" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="type">Type</TabsTrigger>
            <TabsTrigger value="draw">Draw</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
          </TabsList>

          <TabsContent value="type" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signature">Type your signature</Label>
              <Input
                id="signature"
                placeholder="Enter your full name"
                value={signatureText}
                onChange={(e) => setSignatureText(e.target.value)}
                className="text-2xl font-script"
              />
            </div>
            <div className="p-4 border rounded-lg bg-gray-50">
              <div className="text-3xl font-script text-center py-4">
                {signatureText || "Your signature will appear here"}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="draw" className="space-y-4">
            <div className="space-y-2">
              <Label>Draw your signature</Label>
              <div className="border rounded-lg bg-white h-40 flex items-center justify-center">
                <div className="text-gray-500 text-center">
                  <div>Click and drag to draw your signature</div>
                  <div className="text-sm mt-1">Drawing functionality would be implemented here</div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Clear
              </Button>
              <Button variant="outline" size="sm">
                Undo
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <div className="space-y-2">
              <Label>Upload signature image</Label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <div className="text-gray-500">
                  <div>Drag and drop your signature image here</div>
                  <div className="text-sm mt-1">or click to browse files</div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)}>Add Signature</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
