// components/orders/OrderStatusModal.tsx
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import React from "react";

interface OrderStatusModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const OrderStatusModal = ({ open, onClose, onConfirm }: OrderStatusModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 className="text-lg font-semibold mb-2">Confirm Order Status Update</h2>
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to update the status of this order? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>Confirm</Button>
        </div>
      </div>
    </div>
  );
};
