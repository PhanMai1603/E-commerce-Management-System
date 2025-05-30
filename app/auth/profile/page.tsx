/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { uploadAvatar } from "@/app/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Cropper from "react-easy-crop";

export default function UploadAvatarPage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedAvatarUrl = localStorage.getItem("avatarUrl");
    if (storedAvatarUrl) setAvatarUrl(storedAvatarUrl);
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const maxSize = 2 * 1024 * 1024;
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

      if (file.size > maxSize) {
        toast.error("File size exceeds 2MB.");
        return;
      }
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please select a valid image file (JPEG, PNG, GIF).");
        return;
      }

      setSelectedImage(file);
      setImageSrc(URL.createObjectURL(file));
    }
  };

  const handleCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    console.log(croppedArea, croppedAreaPixels);
    setCroppedImage(imageSrc); // Temporary, replace with actual cropping logic
  }, [imageSrc]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedImage) {
      toast.error("Please select an image to upload.");
      return;
    }

    setIsUploading(true);
    try {
      const userId = localStorage.getItem("userId");
      const accessToken = localStorage.getItem("accessToken");
      if (!userId || !accessToken) {
        toast.error("User not logged in.");
        setIsUploading(false);
        return;
      }

      const response = await uploadAvatar({ file: selectedImage }, userId, accessToken);
      if (response.image_url) {
        toast.success("Avatar uploaded successfully!");
        setAvatarUrl(response.image_url);
        localStorage.setItem("avatarUrl", response.image_url);
        router.push("/dashboard");
      } else {
        toast.error("Avatar upload failed.");
      }
    } catch {
      toast.error("An error occurred during the upload.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Upload Your Avatar</h1>
        <div className="mb-4">
          {imageSrc ? (
            <div className="relative w-64 h-64 mx-auto">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
              />
            </div>
          ) : avatarUrl && !selectedImage ? (
            <img src={avatarUrl} alt="Current Avatar" className="w-32 h-32 mx-auto rounded-full border shadow-md object-cover" />
          ) : (
            <div className="w-32 h-32 mx-auto bg-gray-200 rounded-full flex items-center justify-center text-gray-500">No Image</div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input type="file" accept="image/*" onChange={handleImageChange} className="block w-full px-4 py-2 border border-gray-300 rounded-lg cursor-pointer" />
          <Button type="submit" className="w-full" disabled={isUploading}>
            {isUploading ? "Uploading..." : "Upload Avatar"}
          </Button>
          <Button
            type="button" // THÊM DÒNG NÀY
            variant="secondary"
            className="w-full"
            onClick={() => router.back()}
          >
            Cancel
          </Button>

        </form>
      </div>
    </div>
  );
}