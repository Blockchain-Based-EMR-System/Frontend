"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useUserStore } from "@/stores/useUserStore";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/common/ThemeSwitcher";
import { UserProfileDropdown } from "@/components/common/UserProfileDropdown";

export function Navbar() {
  const tCommon = useTranslations("common");
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

  const navLinks = [
    { href: "/clinics", label: tCommon("clinics") },
    { href: "/contact", label: tCommon("contactUs") },
  ];

  return (
    <nav
      ref={menuRef}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60"
    >
      <div className="container flex h-16 items-center justify-between px-4 md:mx-auto md:max-w-7xl">
        <Link
          href="/"
          className="flex items-center space-x-2 rtl:space-x-reverse"
        >
          <div className="flex items-center">
            <span className="text-2xl font-bold bg-linear-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              MedicBridge
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6 rtl:space-x-reverse">
          {/* Nav Links */}
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}

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
                <Link href="/login">{tCommon("login")}</Link>
              </Button>
              <Button asChild>
                <Link href="/register">{tCommon("signup")}</Link>
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
        <div className="flex md:hidden items-center gap-2">
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
        <div className="md:hidden absolute top-16 left-0 right-0 z-40 bg-background border-b shadow-lg">
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
                      {tCommon("login")}
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/register" onClick={() => setIsOpen(false)}>
                      {tCommon("signup")}
                    </Link>
                  </Button>
                </div>
              )}

              {/* Navigation Links */}
              <div className="flex flex-col space-y-3 px-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-sm flex items-center px-2 py-1 rounded-md hover:bg-accent transition-colors"
                  >
                    <span className="font-medium">{link.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
