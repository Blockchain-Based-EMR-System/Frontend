"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Users,
  UserCog,
  LayoutDashboard,
  Menu,
  X,
  Stethoscope,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";
import { useState } from "react";

interface SuperAdminLayoutProps {
  children: ReactNode;
}

export function SuperAdminLayout({ children }: SuperAdminLayoutProps) {
  const pathname = usePathname();
  const t = useTranslations("");
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    {
      name: "Dashboard",
      href: "/superadmin-dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Admins",
      href: "/superadmin-dashboard/admins",
      icon: UserCog,
    },
    {
      name: "Doctors",
      href: "/superadmin-dashboard/doctors",
      icon: Stethoscope,
    },
  ];

  const NavLinks = () => (
    <>
      {navigation.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setIsOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent",
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-background">
        <div className="flex h-16 items-center border-b px-6">
          <Link
            href="/superadmin-dashboard"
            className="flex items-center gap-2"
          >
            <Users className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">Super Admin</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          <NavLinks />
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="flex md:hidden h-16 items-center gap-4 border-b bg-background px-4">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation Menu</SheetTitle>
              </SheetHeader>
              <div className="flex h-16 items-center border-b px-6">
                <Link
                  href="/superadmin-dashboard"
                  className="flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <Users className="h-6 w-6 text-primary" />
                  <span className="text-lg font-semibold">Super Admin</span>
                </Link>
              </div>
              <nav className="flex-1 space-y-1 p-4">
                <NavLinks />
              </nav>
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">Super Admin</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 bg-muted/10 overflow-x-hidden overflow-y-auto">
          <div className="container mx-auto p-6 md:p-8 min-w-0">{children}</div>
        </main>
      </div>
    </div>
  );
}