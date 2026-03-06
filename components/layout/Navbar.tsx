"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Menu,
  X,
  ChevronDown,
  Stethoscope,
  HeartPulse,
  Bell,
  LucideIcon,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useUserStore } from "@/stores/useUserStore";
import { Role } from "@/types";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/common/ThemeSwitcher";
import { UserProfileDropdown } from "@/components/common/UserProfileDropdown";
import Logo from "../common/Logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NavLink = {
  href: string;
  label: string;
  icon?: LucideIcon | null;
};

export function Navbar() {
  const tCommon = useTranslations("common");
  const tAuth = useTranslations("auth");
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated } = useUserStore();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const isNurse = isAuthenticated && user?.role === Role.NURSE;
  const isJoinPage = pathname.startsWith("/join");
  const isJoinDoctorPage = pathname.startsWith("/join/doctor");
  const isJoinNursePage = pathname.startsWith("/join/nurse");

  const navLinks: NavLink[] = [
    { href: "/clinics", label: tCommon("clinics"), icon: null },
    ...(isNurse
      ? [{ href: "/announcements", label: tCommon("announcements"), icon: Bell }]
      : []),
    { href: "/contact", label: tCommon("contactUs"), icon: null },
  ];

  return (
    <nav
      ref={menuRef}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60"
    >
      <div className="container flex h-16 items-center justify-between px-4 mx-auto lg:px-0 lg:max-w-7xl">
        <Link
          href="/"
          className="flex items-center space-x-2 rtl:space-x-reverse"
        >
          <div className="flex items-center">
            <span className="inline-block md:hidden">
              <Logo size={100} />
            </span>
            <span className="hidden md:inline-block lg:hidden">
              <Logo size={130} />
            </span>
            <span className="hidden lg:inline-block">
              <Logo size={160} />
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-6 rtl:space-x-reverse">
          {/* Nav Links */}
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive ? "text-primary underline underline-offset-8" : ""
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary focus:outline-none ${
                  isJoinPage ? "text-primary underline underline-offset-8" : ""
                }`}
              >
                {tCommon("join")}
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem asChild>
                <Link
                  href="/join/doctor"
                  className={`flex items-center gap-2 cursor-pointer ${
                    isJoinDoctorPage ? "text-primary" : ""
                  }`}
                >
                  <Stethoscope
                    className={`h-4 w-4 ${isJoinDoctorPage ? "text-primary" : ""}`}
                  />
                  {tCommon("joinAsDoctor")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/join/nurse"
                  className={`flex items-center gap-2 cursor-pointer ${
                    isJoinNursePage ? "text-primary" : ""
                  }`}
                >
                  <HeartPulse
                    className={`h-4 w-4 ${isJoinNursePage ? "text-primary" : ""}`}
                  />
                  {tCommon("joinAsNurse")}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Auth Section */}
          {isAuthenticated && user ? (
            <div className="flex items-center space-x-3 rtl:space-x-reverse border-l pl-6 rtl:border-l-0 rtl:border-r rtl:pr-6 rtl:pl-0">
              <UserProfileDropdown
                user={user}
                onLogout={() => useUserStore.getState().clearUser()}
              />
            </div>
          ) : (
            <div className="flex items-center gap-2 border-l pl-6 rtl:border-l-0 rtl:border-r rtl:pr-6 rtl:pl-0">
              <Button variant="ghost" asChild>
                <Link href="/login">{tAuth("login")}</Link>
              </Button>
              <Button asChild>
                <Link href="/register">{tAuth("signUp")}</Link>
              </Button>
            </div>
          )}

          {/* Language & Theme Switchers */}
          <div className="flex items-center gap-2 border-l pl-6 rtl:border-l-0 rtl:border-r rtl:pr-6 rtl:pl-0 rtl:mr-6 rtl:ml-0">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex lg:hidden items-center gap-2">
          <LanguageSwitcher />
          <ThemeSwitcher />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="lg:hidden absolute top-16 left-0 right-0 z-40 bg-background border-b shadow-lg">
          <div className="container px-4 py-6">
            <div className="flex flex-col space-y-6">
              {/* User Section for Mobile */}
              {isAuthenticated && user ? (
                <div className="pb-4 border-b">
                  <UserProfileDropdown
                    user={user}
                    onLogout={() => {
                      useUserStore.getState().clearUser();
                      setIsOpen(false);
                    }}
                  />
                </div>
              ) : (
                <div className="flex flex-col space-y-2 pb-4 border-b">
                  <Button asChild className="w-full">
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      {tAuth("login")}
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/register" onClick={() => setIsOpen(false)}>
                      {tAuth("signUp")}
                    </Link>
                  </Button>
                </div>
              )}

              {/* Navigation Links */}
              <div className="flex flex-col space-y-3 px-2">
                {navLinks.map((link) => {
                  const isActive =
                    pathname === link.href ||
                    (link.href !== "/" && pathname.startsWith(link.href));
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`text-sm flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-accent transition-colors ${
                        isActive ? "text-primary font-semibold" : ""
                      }`}
                    >
                      {Icon && <Icon className="h-4 w-4" />}
                      <span className="font-medium">{link.label}</span>
                    </Link>
                  );
                })}

                <Link
                  href="/join/doctor"
                  onClick={() => setIsOpen(false)}
                  className={`text-sm flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-accent transition-colors ${
                    pathname.startsWith("/join/doctor")
                      ? "text-primary font-semibold"
                      : ""
                  }`}
                >
                  <Stethoscope className="h-4 w-4" />
                  <span className="font-medium">{tCommon("joinAsDoctor")}</span>
                </Link>

                <Link
                  href="/join/nurse"
                  onClick={() => setIsOpen(false)}
                  className={`text-sm flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-accent transition-colors ${
                    pathname.startsWith("/join/nurse")
                      ? "text-primary font-semibold"
                      : ""
                  }`}
                >
                  <HeartPulse className="h-4 w-4" />
                  <span className="font-medium">{tCommon("joinAsNurse")}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}