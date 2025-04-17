import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";
import { 
 LayoutGrid, Users2, ChartNoAxesCombined, 
Truck, ShoppingBag, UserRoundCog, TicketPercent,
  Shirt,
  Package2, 
} from "lucide-react";

interface SidebarProps {
  showSidebar: boolean;
}

const sidebarGroups = [
  {
    title: "General",
    links: [
      { title: "Dashboard", icon: ChartNoAxesCombined, href: "/dashboard" },
      { title: "Category", icon: LayoutGrid, href: "/dashboard/categories" },
      { title: "Attributes", icon: Package2, href: "/dashboard/attribute" },
      { title: "Products", icon: Shirt, href: "/dashboard/products" },
      { title: "Orders", icon: ShoppingBag, href: "/dashboard/orders" },
      { title: "Coupons", icon: TicketPercent, href: "/dashboard/coupons" },

    ],
  },
  {
    title: "User",
    links: [
      { title: "Users", icon: Users2, href: "/dashboard/users" },
      { title: "Roles", icon: UserRoundCog, href: "/dashboard/role" },
     
    ],
  },
  {
    title: "Other",
    links: [
      { title: "Delivery", icon: Truck, href: "/dashboard/delivery" },
    ],
  },
];

export default function Sidebar({ showSidebar }: SidebarProps) {
  return (
    <div
      className={clsx(
        "fixed flex flex-col w-[260px] h-screen top-0 z-50 border-r bg-card shadow-md transition-all",
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
      <nav className="p-4 space-y-4">
        {sidebarGroups.map((group, index) => (
          <div key={index}>
            <h2 className="px-4 py-2 text-sm font-medium text-gray-500 ">
              {group.title}
            </h2>
            <div className="space-y-1">
              {group.links.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-all"
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
