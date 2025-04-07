"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePathname, useRouter } from "next/navigation";

import { resetPassword } from "@/app/api/auth";
import { toast } from "react-toastify";

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const pathName = usePathname();
  const router = useRouter();
  const resetToken = pathName.split("/").pop() || ""; // Lấy token từ URL

  const [formData, setFormData] = useState({
    resetToken: resetToken,
    newPassword: "",
  });

  const [loading, setLoading] = useState(false);

  // Xử lý thay đổi input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, newPassword: e.target.value }));
  };

  // Xử lý gửi form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.newPassword) {
      toast.error("Password cannot be empty!");
      return;
    }

    if (!formData.resetToken) {
      toast.error("Invalid reset token.");
      return;
    }

    setLoading(true);

    try {
      await resetPassword(formData);
      toast.success("Your password has been updated successfully. Please log in again.");
      router.push("/auth/login");
    } catch {
      toast.error("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Reset Your Password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your new password below.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            name="newPassword"
            type="password"
            placeholder="Enter new password"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "RESETING..." : "RESET PASSWORD"}
        </Button>
      </div>
      <div className="text-center text-sm">
        <a href="/auth/login" className="hover:underline">
          BACK
        </a>
      </div>
    </form>
  );
}
