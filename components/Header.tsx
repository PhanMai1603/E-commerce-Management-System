"use client";

import { CircleUser, PanelRightOpen } from "lucide-react";
import { ModeToggle } from "@/components/ui/mode-toggle"; // Import nút đổi chế độ
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";

interface HeaderProps {
  showSideBar: boolean;
  setShowSideBar: (showSideBar: boolean) => void;
}

export default function Header({ showSideBar, setShowSideBar }: HeaderProps) {
  return (
    <div className="sticky w-full left-0 top-0 z-30">
      <div className="flex h-14 items-center gap-4 border-b bg-card dark:bg-black px-4 lg:h-[60px] lg:px-6">
        {/* Nút mở Sidebar */}
        <button
          className="flex w-8 h-8 lg:hidden rounded-md bg-white hover:bg-[#F1F6F9] hover:shadow-md justify-center items-center transition-all"
          onClick={() => setShowSideBar(!showSideBar)}
        >
          <PanelRightOpen className="text-xl" />
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
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
