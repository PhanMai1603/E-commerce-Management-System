/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { uploadAvatar } from "@/app/api/auth";
import { getDefaultAddress } from "@/app/api/address";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Cropper from "react-easy-crop";
import { AddressResponse } from "@/interface/address";

export default function UploadAvatarPage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [address, setAddress] = useState<AddressResponse | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedAvatarUrl = localStorage.getItem("avatarUrl");
    if (storedAvatarUrl) setAvatarUrl(storedAvatarUrl);

    const fetchAddress = async () => {
      const userId = localStorage.getItem("userId") || "";
      const accessToken = localStorage.getItem("accessToken") || "";
      if (!userId || !accessToken) return;

      try {
        const res = await getDefaultAddress(userId, accessToken);
        setAddress(res);
      } catch {
        toast.error("Không thể tải địa chỉ mặc định");
      }
    };

    fetchAddress();
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

  const handleCropComplete = useCallback(
    (croppedArea: any, croppedAreaPixels: any) => {
      console.log(croppedArea, croppedAreaPixels);
      setCroppedImage(imageSrc);
    },
    [imageSrc]
  );

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
            Upload Your Avatar
          </h1>
          <p className="text-gray-600">Choose a photo that represents you best</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl border border-white/20 overflow-hidden">
          {/* Avatar Preview Section */}
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-8">
            <div className="flex justify-center mb-6">
              {imageSrc ? (
                <div className="relative">
                  <div className="w-80 h-80 rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
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
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-white rounded-full px-4 py-2 shadow-lg border">
                      <p className="text-sm text-gray-600">Drag to adjust • Scroll to zoom</p>
                    </div>
                  </div>
                </div>
              ) : avatarUrl && !selectedImage ? (
                <div className="relative group">
                  <img
                    src={avatarUrl}
                    alt="Current Avatar"
                    className="w-40 h-40 rounded-full object-cover shadow-2xl border-4 border-white group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <p className="text-white text-sm font-medium">Current Avatar</p>
                  </div>
                </div>
              ) : (
                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-inner border-4 border-dashed border-gray-300">
                  <div className="text-center">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-500 text-sm font-medium">No Image</p>
                  </div>
                </div>
              )}
            </div>

            {/* Zoom Control */}
            {imageSrc && (
              <div className="flex justify-center">
                <div className="bg-white rounded-full px-6 py-3 shadow-lg border flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Zoom:</span>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-32"
                  />
                  <span className="text-sm text-gray-600 font-mono">{zoom.toFixed(1)}x</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-8">
            {/* Address Information */}
            {address && (
              <div className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Delivery Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">📛</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Name</p>
                      <p className="font-medium text-gray-800">{address.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-semibold">📞</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                      <p className="font-medium text-gray-800">{address.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 md:col-span-2">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-semibold">📍</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Address</p>
                      <p className="font-medium text-gray-800">
                        {address.street}, {address.ward}, {address.district}, {address.city}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 font-semibold">🏷️</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Type</p>
                      <p className="font-medium text-gray-800 capitalize">{address.type}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Upload Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Choose your avatar image
                </label>
                <div className="relative">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full h-14 text-lg border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 focus:border-blue-500 transition-colors duration-200 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Supports JPEG, PNG, GIF up to 2MB
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  type="submit" 
                  disabled={isUploading}
                  className="flex-1 h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isUploading ? (
                    <div className="flex items-center space-x-2">
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Uploading...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span>Upload Avatar</span>
                    </div>
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1 sm:flex-none h-14 px-8 text-lg font-semibold border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 transform hover:scale-[1.02]"
                >
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Cancel</span>
                  </div>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}