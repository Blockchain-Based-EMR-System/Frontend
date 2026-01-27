"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  User as UserIcon,
  LogOut,
  Settings,
  Upload,
  Camera,
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

interface UserProfileDropdownProps {
  user: User;
  onLogout?: () => void;
}

export function UserProfileDropdown({
  user,
}: UserProfileDropdownProps) {
  const tCommon = useTranslations("common");
  const logoutMutation = useLogout();
  const { toast } = useToast();
  const [profileImage, setProfileImage] = useState<string | null>(
    user.profileImage || null
  );
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      toast({
        title: "Profile image updated",
        description:
          "Your profile image has been updated successfully (locally for now)",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload profile image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
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

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-3 cursor-pointer">
            <span className="text-sm text-muted-foreground hidden md:block">
              {tCommon("welcome")}, {user.name.split(" ")[0]}
            </span>
            <div className="relative">
              <Avatar className="h-9 w-9 ring-2 ring-offset-2 ring-primary/20 hover:ring-primary/40 transition-all">
                <AvatarImage src={profileImage || undefined} alt={user.name} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5 border border-primary/20">
                <Camera className="h-3 w-3 text-primary" />
              </div>
            </div>
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-64" align="end" sideOffset={8}>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={profileImage || undefined}
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
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                {isUploading ? "Uploading..." : "Change Photo"}
              </Button>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link
              href="/dashboard"
              className="cursor-pointer flex items-center"
            >
              <UserIcon className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
              {tCommon("dashboard")}
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/settings" className="cursor-pointer flex items-center">
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
    </>
  );
}