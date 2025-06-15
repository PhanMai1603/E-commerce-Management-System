import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutGrid, Users2, ChartNoAxesCombined,
  Truck, ShoppingBag, UserRoundCog, TicketPercent,
  Shirt,
  Package2,
  MessageSquareHeart,
  RefreshCcw,
  CreditCard,
  MessageCircle,
} from "lucide-react";

interface SidebarProps {
  showSidebar: boolean;
}

const sidebarGroups = [
  {
    title: "Chung",
    links: [
      { title: "Dashboard", icon: ChartNoAxesCombined, href: "/dashboard" },
      { title: "Danh mục", icon: LayoutGrid, href: "/dashboard/categories" },
      { title: "Thuộc tính", icon: Package2, href: "/dashboard/attribute" },
      { title: "Sản phẩm", icon: Shirt, href: "/dashboard/products" },
      { title: "Đơn hàng", icon: ShoppingBag, href: "/dashboard/orders" },
      { title: "Mã giảm giá", icon: TicketPercent, href: "/dashboard/coupons" },
      { title: "Đánh giá", icon: MessageSquareHeart, href: "/dashboard/review" },
    ],
  },
  {
    title: "Người dùng",
    links: [
      { title: "Người dùng", icon: Users2, href: "/dashboard/users" },
      { title: "Vai trò", icon: UserRoundCog, href: "/dashboard/role" },
    ],
  },
  {
    title: "Khác",
    links: [
      { title: "Giao hàng", icon: Truck, href: "/dashboard/delivery" },
      { title: "Hoàn hàng", icon: RefreshCcw, href: "/dashboard/refund" },
      { title: "Giao dịch", icon: CreditCard, href: "/dashboard/transactions" },
      { title: "Trò chuyện", icon: MessageCircle, href: "/dashboard/chat" }
    ],
  },
];


export default function Sidebar({ showSidebar }: SidebarProps) {
  return (
    <div
      className={clsx(
        "fixed flex flex-col w-[260px] h-screen top-0 z-50 border-r bg-card shadow-md transition-all ",
        {
          "-left-[260px] lg:left-0": !showSidebar,
          "left-0 shadow-black shadow-lg lg:shadow-none": showSidebar,
        }
      )}
    >
      {/* Logo */}
      <div className="p-4 flex justify-center items-center">
        <Link href="/dashboard">
          <Image
            src="/logo 2.png" // Đường dẫn logo
            alt="Logo"
            width={120} // Kích thước logo
            height={40}
            className="cursor-pointer"
          />
        </Link>
      </div>

      {/* Điều hướng Sidebar theo nhóm */}
      <nav className="p-4 space-y-3">
        {sidebarGroups.map((group, index) => (
          <div key={index}>
            <h2 className="px-4 py-1.5 text-sm font-medium text-gray-500">
              {group.title}
            </h2>
            <div className="space-y-0.5">
              {group.links.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className="flex items-center gap-2.5 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-all text-sm"
                >
                  <item.icon size={20} />
                  <span>{item.title}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>


    </div>
  );
}