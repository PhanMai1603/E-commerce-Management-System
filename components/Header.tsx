/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { CircleUser, Menu } from "lucide-react";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Input } from "./ui/input";
import { toast } from "react-toastify";
import { logoutRequest } from "@/app/api/auth";
import { changePassword } from "@/app/api/user";  // Import API đổi mật khẩu
import { useRouter } from "next/navigation";


interface HeaderProps {
  showSideBar: boolean;
  setShowSideBar: (showSideBar: boolean) => void;
}

export default function Header({ showSideBar, setShowSideBar }: HeaderProps) {
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    const storedAvatar = localStorage.getItem("avatarUrl");
    console.log(storedAvatar);  // Add this line to debug
    if (storedAvatar) setAvatar(storedAvatar);
  
    const handleStorageChange = () => {
      setAvatar(localStorage.getItem("avatarUrl"));
    };
  
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);
  

  const handleChangePassword = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem("userId");
      const accessToken = localStorage.getItem("accessToken");

      if (!userId || !accessToken) {
        toast.error("Bạn chưa đăng nhập hoặc thông tin không hợp lệ!");
        return;
      }

      await changePassword({ oldPassword, newPassword }, userId, accessToken);
      toast.success("Password changed successfully!");
      setOpenDialog(false);
      setOldPassword("");
      setNewPassword("");
    } catch {
      // toast.error("Failed to change password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const accessToken = localStorage.getItem("accessToken");

      if (!userId || !accessToken) {
        toast.error("You are not logged in or the information is invalid!");
        return;
      }

      await logoutRequest(userId, accessToken);
      toast.success("Log out successfully!");

      localStorage.removeItem("userId");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("tokenTimestamp");

      router.push("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An error occurred while logging out.Please try again.");
    }
  };

  return (
    <div className="sticky w-full left-0 top-0 z-30">
      <div className="flex h-14 items-center gap-4 border-b bg-card dark:bg-black px-4 lg:h-[60px] lg:px-6">
        {/* Nút mở Sidebar */}
        <button
          className="flex w-8 h-8 lg:hidden rounded-md bg-white hover:bg-[#F1F6F9] hover:shadow-md justify-center items-center transition-all"
          onClick={() => setShowSideBar(!showSideBar)}
        >
          <Menu className="text-xl" />
        </button>

        <div className="flex flex-1 justify-end items-center relative gap-4">
          {/* Nút chuyển đổi chế độ sáng/tối */}
          <ModeToggle />

          {/* Mini Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
              {avatar ? (
  <img src={avatar} alt="User Avatar" className="w-8 h-8 rounded-full object-cover" />
) : (
  <CircleUser className="h-5 w-5" />
)}

              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/auth/profile")}>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setOpenDialog(true)}>Change Password</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Dialog Đổi Mật Khẩu */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-md p-6 rounded-xl border border-gray-200 shadow-lg">
          <DialogHeader className="text-center">
            <DialogTitle className="text-xl font-semibold text-gray-800">Change Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 mt-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Old Password</label>
              <Input
                type="password"
                placeholder="Enter old password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="rounded-md border-gray-300 focus:ring focus:ring-gray-300"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">New Password</label>
              <Input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="rounded-md border-gray-300 focus:ring focus:ring-gray-300"
              />
            </div>
          </div>
          <DialogFooter className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleChangePassword} disabled={loading}>
              {loading ? "SAVE..." : "SAVE"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
