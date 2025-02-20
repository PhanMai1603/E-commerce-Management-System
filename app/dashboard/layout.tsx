"use client";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Suspense, useState } from "react";
import clsx from "clsx";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [showSidebar, setShowSidebar] = useState<boolean>(false);

  return (
    
    <div className="w-full min-h-screen bg-muted/40">
      <Header showSideBar={showSidebar} setShowSideBar={setShowSidebar} />
      <Sidebar showSidebar={showSidebar} />

      {/* Dims background when SideBar active */}
      <div
        onClick={() => setShowSidebar(!showSidebar)}
        className={clsx(
          "fixed lg:hidden w-screen h-screen top-0 left-0 z-40 duration-200 bg-gray-500/80",
          {
            invisible: !showSidebar,
            visible: showSidebar,
          }
        )}
      ></div>

      {/* Displays other views */}
      <div className="ml-0 lg:ml-[250px] transition-all p-4">
        <Suspense>{children}</Suspense>
      </div>
    </div>
  );
}
