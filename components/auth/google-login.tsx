"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAccessToken } from "@/app/api/token";
import { checkAdmin } from "@/app/api/auth";
import { useAuth } from "@/app/context/AppContext";
import { toast } from "react-toastify";

export function GoogleLoginHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setIsLogin } = useAuth();
  const hasFetched = useRef(false);

  const userId = searchParams.get("userId");
  const refreshToken = searchParams.get("refreshToken");

  useEffect(() => {
    const storedIsLogin = localStorage.getItem("isLogin");
    if (storedIsLogin === "true") {
      setIsLogin(true);
    }

    if (userId && refreshToken && !hasFetched.current) {
      hasFetched.current = true;

      const fetchToken = async () => {
        try {
          const response = await getAccessToken(userId, refreshToken);
          const accessToken = response.tokens.accessToken;

          const isAdmin = await checkAdmin(userId, accessToken);
          if (!isAdmin) {
            toast.error("Bạn không có quyền quản trị!");
            return;
          }

          const currentTime = Date.now();
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", response.tokens.refreshToken);
          localStorage.setItem("userId", userId);
          localStorage.setItem("tokenTimestamp", currentTime.toString());
          localStorage.setItem("isLogin", "true");

          setIsLogin(true);
          toast.success("Đăng nhập thành công!");

          router.push("/dashboard");
        } catch (err) {
          console.error("Lỗi đăng nhập Google:", err);
          toast.error("Đăng nhập thất bại!");
        }
      };

      fetchToken();
    }
  }, [userId, refreshToken, setIsLogin, router]);

  return null;
}
