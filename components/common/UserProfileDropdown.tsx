"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { User as UserIcon, LogOut, Settings } from "lucide-react";
import { User } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/features/auth/login";
import { getRoleDashboardPath } from "@/lib/auth";
import { getInitials } from "@/lib/helpers";
import { usePathname } from "next/navigation";

interface UserProfileDropdownProps {
  user: User;
  onLogout?: () => void;
}

export function UserProfileDropdown({ user }: UserProfileDropdownProps) {
  const tCommon = useTranslations("common");
  const tDashboard = useTranslations("userDashboard");
  const logoutMutation = useLogout();
  const pathname = usePathname();

  const dashboardUrl = getRoleDashboardPath(user.role);
  const isOnDashboard = pathname === dashboardUrl;
  const isOnSettings = pathname.includes("/settings");

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <>
      <div className="flex flex-col items-center gap-2">
        {/* Desktop: Dropdown Menu */}
        <div className="hidden lg:block">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-3 h-auto p-2 hover:bg-transparent hover:cursor-pointer"
              >
                <span className="text-sm text-muted-foreground">
                  {tCommon("welcome")},{" "}
                  {user.role === "DOCTOR"
                    ? tCommon("doctor") + user.name.split(" ")[0]
                    : user.name.split(" ")[0]}
                </span>
                <Avatar className="h-9 w-9 ring-2 ring-offset-2 ring-primary/20 hover:ring-primary/40 transition-all">
                  <AvatarImage
                    src={user.photo_url || user.profilePicture || undefined}
                    alt={user.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-64" align="end" sideOffset={8}>
              <DropdownMenuLabel className="font-normal">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={user.photo_url || user.profilePicture || undefined}
                      alt={user.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-base">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link
                  href={dashboardUrl}
                  className={`cursor-pointer flex items-center ${isOnDashboard ? "text-primary" : ""}`}
                >
                  <UserIcon className={ `h-4 w-4 ltr:mr-2 rtl:ml-2 ${isOnDashboard ? "text-primary" : ""}` } />
                  {tDashboard("dashboard")}
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href="/settings/profile"
                  className={`cursor-pointer flex items-center ${isOnSettings ? "text-primary" : ""}`}
                >
                  <Settings className= {`h-4 w-4 ltr:mr-2 rtl:ml-2 ${isOnSettings ? "text-primary" : ""}`} />
                  {tCommon("settings")}
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                {tCommon("logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-col lg:hidden gap-3 w-full">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-2">
            <Avatar className="h-12 w-12 ring-2 ring-offset-2 ring-primary/20">
              <AvatarImage
                src={user.photo_url || user.profilePicture || undefined}
                alt={user.name}
                className="object-cover"
              />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <p className="text-sm font-medium">
                {user.role === "DOCTOR"
                  ? tCommon("doctor") + user.name.split(" ")[0]
                  : user.name.split(" ")[0]}
              </p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex flex-col gap-1 w-full px-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              asChild
            >
              <Link href={dashboardUrl} className={`flex items-center ${isOnDashboard ? "text-primary" : ""}`}>
                <UserIcon className={ `h-4 w-4 ltr:mr-2 rtl:ml-2 ${isOnDashboard ? "text-primary" : ""}` } />
                {tDashboard("dashboard")}
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              asChild
            >
              <Link href="/settings/profile" className={`flex items-center ${isOnSettings ? "text-primary" : ""}`}>
                <Settings className={ `h-4 w-4 ltr:mr-2 rtl:ml-2 ${isOnSettings ? "text-primary" : ""}` } />
                {tCommon("settings")}
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
              {tCommon("logout")}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
