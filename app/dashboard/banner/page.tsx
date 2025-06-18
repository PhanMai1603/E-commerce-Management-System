/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import BannerList from "./banner-form";

const POSITION_OPTIONS = [
  { value: "ALL", label: "Tất cả" },
  { value: "SLIDE", label: "Slide" },
  { value: "FOOTER", label: "Footer" },
  { value: "CATEGORY", label: "Category" },
];

export default function BannerPage() {
  const [userId, setUserId] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [position, setPosition] = useState<"ALL" | "SLIDE" | "FOOTER" | "CATEGORY">("ALL");

  useEffect(() => {
    setUserId(localStorage.getItem("userId") || "");
    setAccessToken(localStorage.getItem("accessToken") || "");
  }, []);

  if (!userId || !accessToken) return <div>Vui lòng đăng nhập lại!</div>;

  return (
    <div>
      <div className="mb-4">
        <label className="font-medium mr-2">Vị trí banner:</label>
        <select
          value={position}
          onChange={e => setPosition(e.target.value as any)}
          className="border px-2 py-1 rounded"
        >
          {POSITION_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <BannerList
        userId={userId}
        accessToken={accessToken}
        position={position === "ALL" ? undefined : position}
      />
    </div>
  );
}
