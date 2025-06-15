/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { loginRequest, checkAdmin } from "@/app/api/auth";
import { useAuth } from "@/app/context/AppContext";
import useDeviceInfo from "@/hooks/useDeviceInfo";

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"form">) {
  const [formData, setFormData] = useState({
    email: "shareandcaret@gmail.com",
    password: "ShareAndCare2024",
  });
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const router = useRouter();
  const { setIsLogin } = useAuth();
  const { deviceToken, deviceName, browserName } = useDeviceInfo();

  useEffect(() => {
    setIsClient(true);
    setIsLogin(false);
  }, [setIsLogin]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("accessToken");
    const refreshToken = urlParams.get("refreshToken");
    const userId = urlParams.get("userId");

    if (accessToken && refreshToken && userId) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userId", userId);
      localStorage.setItem("tokenTimestamp", Date.now().toString());
      localStorage.setItem("isLogin", "true");

      setIsLogin(true);

      checkAdmin(userId, accessToken)
        .then((isAdmin) => {
          if (isAdmin) {
            toast.success("Đăng nhập bằng Google thành công!");
            router.push("/dashboard");
          } else {
            toast.error("Bạn không có quyền quản trị!");
          }
        })
        .catch(() => toast.error("Lỗi kiểm tra quyền quản trị."));
    }
  }, [router, setIsLogin]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await loginRequest({
        email: formData.email,
        password: formData.password,
        deviceToken,
        deviceName,
      });

      toast.success("Đăng nhập thành công!");
      setIsLogin(true);

      const currentTime = Date.now();

      localStorage.setItem("accessToken", response.tokens.accessToken);
      localStorage.setItem("refreshToken", response.tokens.refreshToken);
      localStorage.setItem("userId", response.user.id);
      localStorage.setItem("tokenTimestamp", currentTime.toString());
      localStorage.setItem("isLogin", "true");

      const accessToken = response.tokens.accessToken;
      const userId = response.user.id;

      const isAdmin = await checkAdmin(userId, accessToken);

      if (isAdmin) {
        router.push("/dashboard");
      } else {
        toast.error("Bạn không có quyền quản trị!");
      }
    } catch {
      toast.error("Đăng nhập thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isClient && (
        <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Đăng nhập tài khoản</h1>
            <p className="text-sm text-muted-foreground">
              Vui lòng nhập email và mật khẩu để đăng nhập
            </p>
          </div>
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="nhap@email.com"
                required
                onChange={handleChange}
                value={formData.email}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Mật khẩu</Label>
                <a
                  href="/auth/forgot-password"
                  className="ml-auto text-sm underline-offset-4 hover:underline"
                >
                  Quên mật khẩu?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                name="password"
                required
                onChange={handleChange}
                value={formData.password}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "ĐANG ĐĂNG NHẬP..." : "ĐĂNG NHẬP"}
            </Button>
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">
                Hoặc đăng nhập bằng
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-3 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
              onClick={() => {
                window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google?deviceToken=${deviceToken}&deviceName=${browserName}&isPanel=true`;
              }}
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google icon"
                className="w-5 h-5"
              />
              <span className="text-sm font-medium text-gray-700">Đăng nhập với Google</span>
            </Button>
          </div>
        </form>
      )}
    </>
  );
}
