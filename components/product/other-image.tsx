'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input';
import { Images, Trash2, X } from 'lucide-react';
import { useRef, useState } from 'react';
import Image from 'next/image';

interface SubImageFormProps {
  setSubImage: React.Dispatch<React.SetStateAction<File[] | undefined>>;
}

const SubImageForm: React.FC<SubImageFormProps> = ({ setSubImage }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const newFiles = Array.from(event.target.files);

    setSubImage(prevFiles => [...(prevFiles || []), ...newFiles]);

    const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
    setImages(prevImages => [...prevImages, ...newPreviewUrls]);
  };

  const handleDelete = (indexToRemove: number) => {
    setImages(prevImages => prevImages.filter((_, index) => index !== indexToRemove));
    setSubImage(prevFiles => prevFiles?.filter((_, index) => index !== indexToRemove));
  };

  const handleClear = () => {
    setImages([]);
    setSubImage(undefined);
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
    setSubImage(prevFiles => [...(prevFiles || []), ...newFiles]);

    const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
    setImages(prevImages => [...prevImages, ...newPreviewUrls]);
  };

  return (
    <Card className='col-span-5'>
      <CardHeader className='flex justify-between items-center'>
        <CardTitle className='text-base'>Add Product Other Image</CardTitle>
        <Button
          onClick={handleClear} 
          className='h-6'
        >
          <Trash2 />
        </Button>
      </CardHeader>

      <CardContent className={`w-full ${images.length === 0 ? '' : 'space-y-4'}`}>
        <div className='w-full flex gap-x-6'>
          {images.map((image, index) => (
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
            className={`relative w-auto flex justify-center items-center bg-white rounded-md border border-dashed border-gray-400 hover:cursor-pointer focus-visible:outline-none focus-visible:ring-0 group overflow-hidden ${images.length === 0 ? 'h-72 [&_svg]:size-8' : 'h-12 [&_svg]:size-5'}`}
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