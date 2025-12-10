import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Toaster } from "@/components/ui/toaster";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <Sidebar />
      <div className="md:pl-64 flex flex-col min-h-screen transition-all duration-300 ease-in-out">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  );
}
