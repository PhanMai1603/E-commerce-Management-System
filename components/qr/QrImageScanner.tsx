"use client";
import { Html5Qrcode } from "html5-qrcode";
import { useRef } from "react";

interface QrImageScannerProps {
  onScanSuccess: (code: string) => void;
}

export default function QrImageScanner({ onScanSuccess }: QrImageScannerProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const html5Qr = new Html5Qrcode("qr-image-reader");

    try {
      const result = await html5Qr.scanFile(file, true);
      onScanSuccess(result); // trả mã QR cho component cha
    } catch (err) {
      alert("Không thể quét QR từ ảnh này.");
      console.error("Scan error:", err);
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        ref={fileRef}
        className="border p-2 rounded"
      />
      <div id="qr-image-reader" />
    </div>
  );
}
