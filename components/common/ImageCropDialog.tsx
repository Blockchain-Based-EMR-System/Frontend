"use client";

import { useState, useCallback } from "react";
import Cropper, { Area } from "react-easy-crop";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface ImageCropDialogProps {
  image: string;
  open: boolean;
  onClose: () => void;
  onCropComplete: (croppedImage: File) => void;
  locale: string;
}

export function ImageCropDialog({
  image,
  open,
  onClose,
  onCropComplete,
  locale,
}: ImageCropDialogProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropChange = useCallback((crop: { x: number; y: number }) => {
    setCrop(crop);
  }, []);

  const onZoomChange = useCallback((zoom: number) => {
    setZoom(zoom);
  }, []);

  const onCropCompleteHandler = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  const createCroppedImage = async (): Promise<File | null> => {
    if (!croppedAreaPixels) return null;

    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const img = new Image();
      img.src = image;

      img.onload = () => {
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(null);
          return;
        }

        // Set canvas size to cropped area
        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;

        // Draw the cropped image
        ctx.drawImage(
          img,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
        );

        // Convert canvas to blob and then to file
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const file = new File([blob], "profile.jpg", {
                type: "image/jpeg",
              });
              resolve(file);
            } else {
              resolve(null);
            }
          },
          "image/jpeg",
          0.95,
        );
      };

      img.onerror = () => {
        resolve(null);
      };
    });
  };

  const handleSave = async () => {
    const croppedImage = await createCroppedImage();
    if (croppedImage) {
      onCropComplete(croppedImage);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {locale === "en"
              ? "Crop Profile Picture"
              : "اقتصاص صورة الملف الشخصي"}
          </DialogTitle>
        </DialogHeader>

        <div className="relative h-[400px] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropCompleteHandler}
            cropShape="round"
            showGrid={false}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            {locale === "en" ? "Zoom" : "تكبير/تصغير"}
          </label>
          <Slider
            value={[zoom]}
            onValueChange={(value) => setZoom(value[0])}
            min={1}
            max={3}
            step={0.1}
            className="w-full"
          />
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            {locale === "en" ? "Cancel" : "إلغاء"}
          </Button>
          <Button onClick={handleSave}>
            {locale === "en" ? "Save" : "حفظ"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
