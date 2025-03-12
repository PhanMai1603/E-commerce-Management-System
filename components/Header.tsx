import { CircleUser, Menu } from "lucide-react";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { toast } from "react-toastify";
import { logoutRequest } from "@/app/api/auth"; 
import { useRouter } from "next/navigation";

interface HeaderProps {
  showSideBar: boolean;
  setShowSideBar: (showSideBar: boolean) => void;
}

export default function Header({ showSideBar, setShowSideBar }: HeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const accessToken = localStorage.getItem("accessToken");

      if (!userId || !accessToken) {
        toast.error("Bạn chưa đăng nhập hoặc thông tin không hợp lệ!");
        return;
      }

      await logoutRequest(userId, accessToken);
      toast.success("Đăng xuất thành công!");

      localStorage.removeItem("userId");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("tokenTimestamp");

      router.push("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Có lỗi xảy ra khi đăng xuất.");
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
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/auth/profile")}>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/auth/change-password")}>Change Password</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
