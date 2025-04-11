/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Images, Trash2, X } from 'lucide-react'

interface SubImageFormProps {
  subImages?: string[] // from API or existing product
  setProduct: (prev: any) => void // update product state in parent
}

const SubImageForm: React.FC<SubImageFormProps> = ({ subImages = [], setProduct }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [fileList, setFileList] = useState<File[]>([])
  const [isDragOver, setIsDragOver] = useState(false)

  // On initial render, populate preview URLs from existing product
  useEffect(() => {
    setPreviewUrls(subImages)
  }, [subImages])

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      fileList.forEach(file => URL.revokeObjectURL(URL.createObjectURL(file)))
    }
  }, [fileList])

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const addFiles = (newFiles: File[]) => {
    const newUrls = newFiles.map(file => URL.createObjectURL(file))

    setFileList(prev => [...prev, ...newFiles])
    setPreviewUrls(prev => [...prev, ...newUrls])
    setProduct((prev: any) => ({
      ...prev,
      newSubImages: [...(prev.newSubImages || []), ...newFiles], // for uploading
    }))
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      addFiles(Array.from(event.target.files))
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(false)
    const droppedFiles = Array.from(event.dataTransfer.files)
    addFiles(droppedFiles)
  }

  const handleDelete = (index: number) => {
    const isFile = index >= subImages.length // everything after subImages is a file

    if (isFile) {
      const fileIndex = index - subImages.length
      setFileList(prev => prev.filter((_, i) => i !== fileIndex))
      setProduct((prev: any) => ({
        ...prev,
        newSubImages: prev.newSubImages?.filter((_: any, i: number) => i !== fileIndex),
      }))
    } else {
      setProduct((prev: any) => ({
        ...prev,
        subImages: prev.subImages?.filter((_: string, i: number) => i !== index),
      }))
    }

    setPreviewUrls(prev => prev.filter((_, i) => i !== index))
  }

  const handleClear = () => {
    setPreviewUrls([])
    setFileList([])
    setProduct((prev: any) => ({
      ...prev,
      subImages: [],
      newSubImages: [],
    }))
  }

  return (
    <Card className="col-span-5">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-base">Edit Product Other Images</CardTitle>
        <Button 
        onClick={handleClear} 
        className="h-6" 
        variant="destructive">
          <Trash2 className="w-4 h-4" />
        </Button>
      </CardHeader>

      <CardContent className={previewUrls.length > 0 ? 'space-y-4' : ''}>
        {previewUrls.length > 0 && (
          <div className="flex gap-4 flex-wrap">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative group w-32 h-32 border rounded-md overflow-hidden">
                <Image
                  src={url}
                  alt={`Other image ${index + 1}`}
                  width={128}
                  height={128}
                  className="object-contain w-full h-full"
                />
                <Button
                  type="button"
                  onClick={() => handleDelete(index)}
                  className="absolute top-1 right-1 p-1 bg-red-500 hover:bg-red-600 rounded-full text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="w-auto">
          <div
            onClick={handleClick}
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragOver(true)
            }}
            onDragLeave={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragOver(false)
            }}
            onDrop={handleDrop}
            className={`relative flex justify-center items-center bg-white rounded-md border border-dashed border-gray-400 hover:cursor-pointer overflow-hidden transition-all
              ${previewUrls.length === 0 ? 'h-72' : 'h-12'} 
              group`}
          >
            <div
              className={`absolute bottom-0 left-0 w-full bg-gray-600/10 transition-all duration-300 group-hover:h-full ${
                isDragOver ? 'h-full' : 'h-0'
              }`}
            />
            <Images className="text-gray-400 group-hover:text-gray-500" />
          </div>
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={handleChange}
            ref={fileInputRef}
            className="hidden"
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default SubImageForm
