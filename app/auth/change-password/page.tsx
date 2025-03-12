"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { changePassword } from "@/app/api/user";

const ChangePasswordPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserId(localStorage.getItem("userId") || "");
      setAccessToken(localStorage.getItem("accessToken") || "");
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!userId || !accessToken) {
      toast.error("Vui lòng đăng nhập lại để tiếp tục!");
      setLoading(false);
      return;
    }

    try {
      await changePassword(
        { oldPassword: formData.currentPassword, newPassword: formData.newPassword },
        userId,
        accessToken
      );
      toast.success("Đổi mật khẩu thành công!");
      setFormData({ currentPassword: "", newPassword: "" });
    } catch{
      toast.error( "Đổi mật khẩu thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-center mb-4">Đổi Mật Khẩu</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
            <Input
              id="currentPassword"
              type="password"
              name="currentPassword"
              required
              onChange={handleChange}
              value={formData.currentPassword}
            />
          </div>
          <div>
            <Label htmlFor="newPassword">Mật khẩu mới</Label>
            <Input
              id="newPassword"
              type="password"
              name="newPassword"
              required
              onChange={handleChange}
              value={formData.newPassword}
            />
          </div>
          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Quay lại
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Đang đổi..." : "Đổi mật khẩu"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
