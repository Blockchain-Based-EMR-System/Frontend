"use client";

import { useRef } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, X, FileText } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { NurseJoinFormData } from "../../types/nurseJoinTypes";
import { useTranslations } from "next-intl";

interface FileUploadFieldProps {
  name: keyof NurseJoinFormData;
  label: string;
  description: string;
  file: File | null | undefined;
  error?: string;
  form: UseFormReturn<NurseJoinFormData>;
  isLoading: boolean;
  optional?: boolean;
}

export function FileUploadField({
  name,
  label,
  description,
  file,
  error,
  form,
  isLoading,
  optional = false,
}: FileUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { setValue } = form;
  const tFields = useTranslations("fields");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setValue(name, selectedFile as any, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
    e.target.value = "";
  };

  const handleRemoveFile = () => {
    setValue(name, undefined as any, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleClick = () => {
    if (!isLoading) {
      inputRef.current?.click();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor={String(name)}>{label}</Label>
        {optional && (
          <span className="text-xs text-muted-foreground">
            ({tFields("optional" as any) ?? "optional"})
          </span>
        )}
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>

      <input
        ref={inputRef}
        id={String(name)}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handleFileChange}
        disabled={isLoading}
      />

      <div
        className="border-2 border-dashed rounded-lg p-4 hover:border-primary/50 transition-colors cursor-pointer"
        onClick={handleClick}
      >
        {file ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">{file.name}</span>
                <span className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFile();
              }}
              disabled={isLoading}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-4">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {tFields("uploadPDF")}
            </p>
            <p className="text-xs text-muted-foreground">
              {tFields("onlyPDFAllowed")} · max 5MB
            </p>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
