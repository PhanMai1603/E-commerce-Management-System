'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Images, Trash2, X } from 'lucide-react'
import { ProductUpdate } from '@/interface/product'

interface SubImageFormProps {
  subImages: string[];
  updatedProduct: ProductUpdate;
  setUpdatedProduct: React.Dispatch<React.SetStateAction<ProductUpdate>>;
}

const SubImageForm: React.FC<SubImageFormProps> = ({ subImages, updatedProduct, setUpdatedProduct }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [displayImages, setDisplayImages] = useState<string[]>(updatedProduct.subImages ?? subImages);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    const isEqual = (displayImages: string[], subImages: string[]) => {
      if (displayImages.length !== subImages.length) return false;
      return displayImages.every((value: string, index: number) => value === subImages[index]);
    };

    if (!isEqual(displayImages, subImages)) {
      setUpdatedProduct(prev => ({
        ...prev,
        subImages: displayImages,
      }));
    }
  }, [displayImages, subImages, setUpdatedProduct]);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const newFiles = Array.from(event.target.files);

    const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
    setDisplayImages(prevImages => [...prevImages, ...newPreviewUrls]);
  };

  const handleDelete = (indexToRemove: number) => {
    setDisplayImages(prevImages => prevImages.filter((_, index) => index !== indexToRemove));
  };

  const handleClear = () => {
    setDisplayImages([]);
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);

    const newFiles = Array.from(event.dataTransfer.files);

    const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
    setDisplayImages(prevImages => [...prevImages, ...newPreviewUrls]);
  };

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

      <CardContent className={`w-full ${displayImages.length === 0 ? '' : 'space-y-4'}`}>
        <div className='w-full flex gap-x-6'>
          {displayImages.map((image, index) => (
            <div key={index} className='relative group'>
              <Image
                src={image}
                alt={image}
                width={1000}
                height={1000}
                className='w-full h-56 object-contain rounded-md'
              />
              <Button
                onClick={() => handleDelete(index)}
                className='absolute h-auto -top-2 -right-2 p-1 bg-red-300 hover:bg-red-500 [&_svg]:size-4'
              >
                <X />
              </Button>
            </div>
          ))}
        </div>
        <div className='w-auto'>
          <div
            className={`relative w-auto flex justify-center items-center bg-white rounded-md border border-dashed border-gray-400 hover:cursor-pointer focus-visible:outline-none focus-visible:ring-0 group overflow-hidden ${displayImages.length === 0 ? 'h-72 [&_svg]:size-8' : 'h-12 [&_svg]:size-5'}`}
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className={`absolute bottom-0 left-0 w-full bg-gray-600/10 transition-all duration-300 group-hover:h-full ${isDragOver ? 'h-full' : 'h-0'}`} />
            <Images className='text-gray-400 group-hover:text-gray-500' />
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

export default SubImageForm;
