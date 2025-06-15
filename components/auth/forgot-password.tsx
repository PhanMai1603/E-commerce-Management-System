"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

import { forgotPassword } from '@/app/api/auth';
import { toast } from 'react-toastify';
import { ForgotPasswordData } from "@/interface/auth";
import { useState } from "react";

export function ForgotForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'form'>) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData: ForgotPasswordData = {
      email: event.currentTarget.email.value,
      isPanel: true,
    };

    setLoading(true);
    try {
      await forgotPassword(formData);
      toast.success('Đã gửi liên kết đặt lại mật khẩu thành công!');
    } catch {
      toast.error("Gửi liên kết thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={cn('flex flex-col gap-6', className)} onSubmit={handleSubmit} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Quên mật khẩu?</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Vui lòng nhập email mà bạn đã đăng ký, chúng tôi sẽ gửi liên kết đặt lại mật khẩu cho bạn.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="Nhập email của bạn" required />
        </div>
        <Button 
          type="submit" 
          className="w-full"
          disabled={loading}
        >
          {loading ? "ĐANG GỬI..." : "GỬI YÊU CẦU"}
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
