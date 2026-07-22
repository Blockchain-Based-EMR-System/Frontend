"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { LucideIcon, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";
import { useState, useEffect } from "react";

interface NavigationItem {
  nameKey: string;
  href: string;
  icon: LucideIcon;
}

interface SidebarProps {
  children: ReactNode;
  titleNameKey: string;
  titleIcon: LucideIcon;
  navigationItems: NavigationItem[];
  translationNamespace: string;
  dashboardHref: string;
}

const handleExpandToggle = (
  isExpanded: boolean,
  setIsExpanded: (value: boolean) => void,
) => {
  setIsExpanded(!isExpanded);
};

export function Sidebar({
  children,
  titleNameKey,
  titleIcon: TitleIcon,
  navigationItems,
  translationNamespace,
  dashboardHref,
}: SidebarProps) {
  const pathname = usePathname();
  const t = useTranslations(translationNamespace);
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Find current page name from navigation items
  const currentPage = navigationItems.find((item) => pathname === item.href);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("sidebarExpanded");
    if (saved !== null) {
      setIsExpanded(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("sidebarExpanded", JSON.stringify(isExpanded));
    }
  }, [isExpanded, mounted]);

  const NavLinks = () => (
    <>
      {navigationItems.map((item) => {
        const isActive = pathname === item.href;
        const ItemIcon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setIsOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent",
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <ItemIcon className="h-5 w-5" />
            {isExpanded && t(item.nameKey)}
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex ${isExpanded ? "w-64" : "w-20"} flex-col border-r bg-background transition-width duration-300`}
      >
        <div className="flex h-16 items-center border-b px-6">
          <button
            className="flex items-center gap-2 hover:cursor-pointer"
            onClick={() => handleExpandToggle(isExpanded, setIsExpanded)}
          >
            <TitleIcon className="h-6 w-6 text-primary" />
            {isExpanded && (
              <span className="text-lg font-semibold">{t(titleNameKey)}</span>
            )}
          </button>
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
                  href={dashboardHref}
                  className="flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <TitleIcon className="h-6 w-6 text-primary" />
                  <span className="text-lg font-semibold">
                    {t(titleNameKey)}
                  </span>
                </Link>
              </div>
              <nav className="flex-1 space-y-1 p-4">
                <NavLinks />
              </nav>
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <TitleIcon className="h-6 w-6 text-primary shrink-0" />
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-base font-semibold shrink-0">
                {t(titleNameKey)}
              </span>
              {currentPage && (
                <>
                  <span className="text-base text-muted-foreground shrink-0 px-2">
                  /
                  </span>
                  <span className="text-sm font-medium text-muted-foreground truncate">
                    {t(currentPage.nameKey)}
                  </span>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 bg-muted/10 overflow-x-hidden overflow-y-auto">
          <div className="container mx-auto p-6 md:p-8 min-w-0 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
