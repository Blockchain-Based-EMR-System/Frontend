"use client";

import { useRef } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  User as UserIcon,
  LogOut,
  Settings,
  Upload,
  Camera,
  Trash2,
} from "lucide-react";
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
import { useToast } from "@/hooks/useToast";
import { useLogout } from "@/features/auth/login";
import {
  useUpdateProfilePicture,
  useDeleteProfilePicture,
} from "@/features/user";
import { getRoleDashboardPath } from "@/lib/auth";
import { useLanguage } from "@/contexts/LanguageProvider";

interface UserProfileDropdownProps {
  user: User;
  onLogout?: () => void;
}

export function UserProfileDropdown({ user }: UserProfileDropdownProps) {
  const language = useLanguage();
  const tCommon = useTranslations("common");
  const tDashboard = useTranslations("userDashboard");
  const logoutMutation = useLogout();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateProfilePictureMutation = useUpdateProfilePicture();
  const deleteProfilePictureMutation = useDeleteProfilePicture();

  const dashboardUrl = getRoleDashboardPath(user.role);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title:
          language.locale === "en" ? "Invalid file type" : "نوع ملف غير صالح",
        description:
          language.locale === "en"
            ? "Please upload an image file"
            : "يرجى تحميل ملف صورة",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title:
          language.locale === "en" ? "File too large" : "حجم الملف كبير جدًا",
        description:
          language.locale === "en"
            ? "Please upload an image smaller than 5MB"
            : "يرجى تحميل صورة أصغر من 5 ميغابايت",
        variant: "destructive",
      });
      return;
    }

    updateProfilePictureMutation.mutate(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDeleteImage = () => {
    if (!user.profilePicture) {
      toast({
        title:
          language.locale === "en"
            ? "No image to delete"
            : "لا توجد صورة لحذفها",
        description:
          language.locale === "en"
            ? "You don't have a profile picture set"
            : "ليس لديك صورة ملف شخصي محددة",
        variant: "destructive",
      });
      return;
    }

    deleteProfilePictureMutation.mutate();
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

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
                  {tCommon("welcome")}, {user.name.split(" ")[0]}
                </span>
                <div className="relative">
                  <Avatar className="h-9 w-9 ring-2 ring-offset-2 ring-primary/20 hover:ring-primary/40 transition-all">
                    <AvatarImage
                      src={user.profilePicture || undefined}
                      alt={user.name}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5 border border-primary/20">
                    <Camera className="h-3 w-3 text-primary" />
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-64" align="end" sideOffset={8}>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={user.profilePicture || undefined}
                        alt={user.name}
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
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      disabled={
                        updateProfilePictureMutation.isPending ||
                        deleteProfilePictureMutation.isPending
                      }
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                      {updateProfilePictureMutation.isPending
                        ? language.locale === "en" ? "Uploading..." : "جاري الرفع..."
                        : user.profilePicture
                          ? language.locale === "en" ? "Change" : "تغيير"
                          : language.locale === "en" ? "Upload" : "رفع"}
                    </Button>
                    {user.profilePicture && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="px-3"
                        disabled={
                          updateProfilePictureMutation.isPending ||
                          deleteProfilePictureMutation.isPending
                        }
                        onClick={handleDeleteImage}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link
                  href={dashboardUrl}
                  className="cursor-pointer flex items-center"
                >
                  <UserIcon className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                  {tDashboard("dashboard")}
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href="/settings"
                  className="cursor-pointer flex items-center"
                >
                  <Settings className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
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
                src={user.profilePicture || undefined}
                alt={user.name}
              />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>

          {/* Upload/Delete buttons */}
          <div className="flex gap-2 w-full px-4">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              disabled={
                updateProfilePictureMutation.isPending ||
                deleteProfilePictureMutation.isPending
              }
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
              {updateProfilePictureMutation.isPending
                ? language.locale === "en" ? "Uploading..." : "جاري الرفع..."
                : user.profilePicture
                  ? language.locale === "en" ? "Change" : "تغيير"
                  : language.locale === "en" ? "Upload" : "رفع"}
            </Button>
            {user.profilePicture && (
              <Button
                variant="outline"
                size="sm"
                className="px-3"
                disabled={
                  updateProfilePictureMutation.isPending ||
                  deleteProfilePictureMutation.isPending
                }
                onClick={handleDeleteImage}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </div>

          {/* Navigation buttons */}
          <div className="flex flex-col gap-1 w-full px-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              asChild
            >
              <Link href={dashboardUrl}>
                <UserIcon className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                {tDashboard("dashboard")}
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              asChild
            >
              <Link href="/settings">
                <Settings className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
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