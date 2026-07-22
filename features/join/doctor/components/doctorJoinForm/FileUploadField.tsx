"use client";

import { useRef } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, X, FileText } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { DoctorJoinFormData } from "../../types/doctorJoinTypes";
import { useLanguage } from "@/contexts/LanguageProvider";
import { useTranslations } from "next-intl";

interface FileUploadFieldProps {
  name: keyof DoctorJoinFormData;
  label: string;
  description: string;
  file: File | null | undefined;
  error?: string;
  form: UseFormReturn<DoctorJoinFormData>;
  isLoading: boolean;
}

export function FileUploadField({
  name,
  label,
  description,
  file,
  error,
  form,
  isLoading,
}: FileUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { locale } = useLanguage();
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
    setValue(name, null as any, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleClick = () => {
    if (!file && !isLoading) {
      inputRef.current?.click();
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <p className="text-sm text-muted-foreground">{description}</p>

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
            <div className="text-center">
              <p className="text-sm font-medium text-primary mb-1">
                {tFields("chooseFile")}
              </p>
              <p className="text-xs text-muted-foreground">
                {locale === "ar"
                  ? "PDF فقط، الحد الأقصى 5 ميجابايت"
                  : "PDF only, max 5MB"}
              </p>
            </div>
          </div>
        )}
        <input
          ref={inputRef}
          id={name}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          className="hidden"
          disabled={isLoading}
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
