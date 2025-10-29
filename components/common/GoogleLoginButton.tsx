"use client";

import { Button } from "@/components/ui/button";
import { Chrome } from "lucide-react";

interface GoogleLoginButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  text: string;
  iconSize?: number;
}

export function GoogleLoginButton({
  onClick,
  isLoading,
  text,
  iconSize = 4,
}: GoogleLoginButtonProps) {
  return (
    <Button
      type="button"
      variant="default"
      className="w-full flex justify-center items-center gap-2"
      onClick={onClick}
      disabled={isLoading}
    >
      <Chrome className={`h-${iconSize} w-${iconSize}`} />
      {text}
    </Button>
  );
}
