"use client";
import React, { useEffect, useState } from "react";
import BannerList from "./banner-form";

export default function BannerPage() {
  const [userId, setUserId] = useState("");
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    setUserId(localStorage.getItem("userId") || "");
    setAccessToken(localStorage.getItem("accessToken") || "");
  }, []);

  if (!userId || !accessToken) return <div>Vui lòng đăng nhập lại!</div>;

  // Không cần truyền position nữa!
  return (
    <BannerList userId={userId} accessToken={accessToken} />
  );
}
