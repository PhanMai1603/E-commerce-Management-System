/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
// components/QrScannerModal.tsx
"use client";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";

interface Props {
  onScanSuccess: (qrText: string) => void;
  onClose: () => void;
}

export default function QrScannerModal({ onScanSuccess, onClose }: Props) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: 250 }, false);

    scanner.render(
      (text) => {
        scanner.clear().then(() => {
          onScanSuccess(text);
          onClose();
        });
      },
      (error) => {
        // bạn có thể ghi log lỗi tại đây nếu muốn
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded w-[320px]">
        <h3 className="text-lg font-semibold mb-2">Quét mã QR</h3>
        <div id="qr-reader" className="w-full" />
        <button
          onClick={onClose}
          className="mt-4 w-full py-2 bg-red-600 text-white rounded"
        >
          Đóng
        </button>
      </div>
    </div>
  );
}
