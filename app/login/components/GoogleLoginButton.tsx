"use client";

import { Button } from "@/components/ui/button";
import { Chrome } from "lucide-react";

interface GoogleLoginButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  text: string;
}

export function GoogleLoginButton({
  onClick,
  isLoading,
  text,
}: GoogleLoginButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={onClick}
      disabled={isLoading}
    >
      <Chrome className="mr-2 h-4 w-4" />
      {text}
    </Button>
  );
}
