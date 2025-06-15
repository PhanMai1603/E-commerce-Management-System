"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePathname, useRouter } from "next/navigation";

import { resetPassword } from "@/app/api/auth";
import { toast } from "react-toastify";
import Link from "next/link";

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const pathName = usePathname();
  const router = useRouter();
  const resetToken = pathName.split("/").pop() || "";

  const [formData, setFormData] = useState({
    resetToken: resetToken,
    newPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, newPassword: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.newPassword) {
      toast.error("Mật khẩu không được để trống!");
      return;
    }

    if (!formData.resetToken) {
      toast.error("Token đặt lại không hợp lệ.");
      return;
    }

    setLoading(true);

    try {
      await resetPassword(formData);
      toast.success("Đổi mật khẩu thành công. Vui lòng đăng nhập lại.");
      router.push("/");
    } catch {
      toast.error("Đặt lại mật khẩu thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Đặt lại mật khẩu</h1>
        <p className="text-sm text-muted-foreground">
          Vui lòng nhập mật khẩu mới của bạn bên dưới.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="newPassword">Mật khẩu mới</Label>
          <Input
            id="newPassword"
            name="newPassword"
            type="password"
            placeholder="Nhập mật khẩu mới"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "ĐANG XỬ LÝ..." : "ĐẶT LẠI MẬT KHẨU"}
        </Button>
      </div>
      <div className="text-center text-sm">
        <Link href="/" className="hover:underline">
          Quay lại
        </Link>
      </div>
    </form>
  );
}
