"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ImageLightboxDialogProps {
  open: boolean;
  onClose: () => void;
  imageSrc: string | null;
  title: string;
}

export function ImageLightboxDialog({
  open,
  onClose,
  imageSrc,
  title,
}: ImageLightboxDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {imageSrc ? (
          <div className="max-h-[70vh] overflow-auto rounded-md border">
            <img
              src={imageSrc}
              alt={title}
              className="h-auto w-full object-contain"
            />
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
