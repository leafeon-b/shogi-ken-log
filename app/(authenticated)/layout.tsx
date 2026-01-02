import { AppSidebar } from "@/app/components/app-sidebar";
import Footer from "@/app/components/footer";
import Header from "@/app/components/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getSession } from "@/server/application/auth/session";
import { redirect } from "next/navigation";

type AuthenticatedLayoutProps = {
  children: React.ReactNode;
};

export default async function AuthenticatedLayout({
  children,
}: AuthenticatedLayoutProps) {
  const session = await getSession();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-svh w-full">
        <AppSidebar />
        <SidebarInset className="flex min-w-0 w-full max-w-none flex-1 flex-col overflow-hidden">
          <Header />
          <main className="w-full flex-1 overflow-auto p-6">{children}</main>
          <Footer />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
