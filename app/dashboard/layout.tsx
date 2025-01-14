import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header
          className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-white"
        >
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>
        
        <main className="flex flex-1 flex-col gap-4 p-4 pt-16">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
