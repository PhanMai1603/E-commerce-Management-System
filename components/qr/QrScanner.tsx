/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useRef } from "react";

interface QrScannerProps {
  onScanSuccess: (productCode: string) => void;
}

export default function QrScanner({ onScanSuccess }: QrScannerProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const scannerStarted = useRef(false);

  useEffect(() => {
    const elementId = "qr-reader";
    const container = document.getElementById(elementId);
    
    // Dọn DOM trước khi khởi tạo lại scanner
    if (container) {
      container.innerHTML = "";
    }

    // Tránh render nhiều lần
    if (scannerStarted.current) return;

    scannerRef.current = new Html5QrcodeScanner(
      elementId,
      { fps: 10, qrbox: 250 },
      false
    );

    scannerRef.current.render(
      (decodedText) => {
        scannerRef.current?.clear().catch(() => {});
        onScanSuccess(decodedText);
      },
      (errorMessage) => {
        // Không log gì cả để tránh spam
      }
    );

    scannerStarted.current = true;

    return () => {
      scannerRef.current?.clear().catch(() => {});
      scannerStarted.current = false;
    };
  }, [onScanSuccess]);

  return <div id="qr-reader" className="w-full" />;
}
