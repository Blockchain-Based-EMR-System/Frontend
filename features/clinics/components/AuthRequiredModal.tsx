"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthRequiredModal({ isOpen, onClose }: AuthRequiredModalProps) {
  const t = useTranslations("clinics.authModal");
  const router = useRouter();

  const handleSignIn = () => {
    onClose();
    router.push("/login");
  };

  const handleSignUp = () => {
    onClose();
    router.push("/register");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("message")}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="secondary"
            onClick={handleSignUp}
            className="w-full sm:w-auto"
          >
            {t("signUp")}
          </Button>
          <Button onClick={handleSignIn} className="w-full sm:w-auto">
            {t("signIn")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
