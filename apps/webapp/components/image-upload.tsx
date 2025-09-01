"use client"

import { useState, useCallback } from 'react'
import { uploadToIPFS, getIPFSUrl } from '@/lib/ipfs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Image as ImageIcon, Upload, X } from 'lucide-react'
import { toast } from 'sonner'

interface ImageUploadProps {
  onUploadComplete: (ipfsHash: string, imageUrl: string) => void
  label?: string
  description?: string
}

export function ImageUpload({ onUploadComplete, label = "Upload Image", description }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit')
      return
    }

    // Create preview
    const preview = URL.createObjectURL(file)
    setPreviewUrl(preview)
    setFileName(file.name)

    setIsUploading(true)
    try {
      const ipfsHash = await uploadToIPFS(file)
      const imageUrl = getIPFSUrl(ipfsHash)
      onUploadComplete(ipfsHash, imageUrl)
      toast.success('Image uploaded successfully!')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload image')
      setPreviewUrl(null)
      setFileName(null)
    } finally {
      setIsUploading(false)
    }
  }, [onUploadComplete])

  const removeImage = useCallback(() => {
    setPreviewUrl(null)
    setFileName(null)
    onUploadComplete('', '')
  }, [onUploadComplete])

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {description && <p className="text-sm text-gray-500">{description}</p>}
      
      {previewUrl ? (
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-full h-48 object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={removeImage}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="p-2 bg-black/50 text-white text-xs truncate">
                {fileName}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
            className="hidden"
            id="image-upload"
          />
          <Label 
            htmlFor="image-upload" 
            className="cursor-pointer flex flex-col items-center justify-center"
          >
            <div className="p-3 bg-blue-100 rounded-full mb-3">
              <ImageIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="font-medium text-gray-700">
              {isUploading ? 'Uploading...' : 'Click to upload'}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {isUploading ? 'Please wait...' : 'PNG, JPG, GIF up to 5MB'}
            </p>
            <Button 
              type="button" 
              variant="outline" 
              className="mt-3"
              disabled={isUploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? 'Uploading...' : 'Select Image'}
            </Button>
          </Label>
        </div>
      )}
    </div>
  )
}