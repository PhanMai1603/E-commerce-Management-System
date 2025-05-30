"use client";
import React, { useEffect, useState } from "react";
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
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const router = useRouter();
  const { setIsLogin } = useAuth();
  const { deviceToken, deviceName, browserName } = useDeviceInfo();

  useEffect(() => {
    setIsClient(true);
    setIsLogin(false);
  }, [setIsLogin]);

  // 👇 Handle Google Redirect Login
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
            toast.success("Login with Google successful!");
            router.push("/dashboard");
          } else {
            toast.error("You do not have admin privileges!");
          }
        })
        .catch(() => toast.error("Error checking admin privileges."));
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

      toast.success("Login successful!");
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
        toast.error("You do not have admin privileges!");
      }
    } catch {
      toast.error("Login failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isClient && (
        <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Login to your account</h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="m@example.com"
                required
                onChange={handleChange}
                value={formData.email}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="/auth/forgot-password"
                  className="ml-auto text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
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
              {loading ? "LOGGING IN..." : "LOGIN"}
            </Button>
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
            <button
              onClick={() => {
                window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google?deviceToken=${deviceToken}&deviceName=${browserName}&isPanel=true`;
              }}
              type="button"
            >
              Sign in with Google
            </button>

          </div>
        </form>
      )}
    </>
  );
}
