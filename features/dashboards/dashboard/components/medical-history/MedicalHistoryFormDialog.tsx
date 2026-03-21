"use client";

import { useEffect, useMemo, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { DatePickerPopover } from "@/components/common/DatePickerPopover";
import {
  ImageValidationError,
  fileToDataUrl,
  validateImageBatch,
} from "@/lib/imageUtils";
import {
  buildMedicalHistoryName,
  MedicalHistoryCategory,
  MedicalHistoryRecord,
  UpsertMedicalHistoryRequest,
} from "../../types/medicalHistory.types";
import {
  createMedicalHistorySchema,
  MedicalHistoryFormValues,
} from "./medicalHistorySchema";
import { useToast } from "@/hooks/useToast";
import {
  FileText,
  FlaskConical,
  Image as ImageIcon,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageProvider";

interface MedicalHistoryFormDialogProps {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  record: MedicalHistoryRecord | null;
  isPending: boolean;
  onSubmit: (payload: UpsertMedicalHistoryRequest) => Promise<void>;
  tMedicalHistory: (key: string) => string;
  tCommon: (key: string) => string;
}

const CATEGORY_ICONS: Record<
  MedicalHistoryCategory,
  React.ComponentType<{ className?: string }>
> = {
  LAB: FlaskConical,
  SCAN: ImageIcon,
  GENERAL: FileText,
};

const EMPTY_VALUES: MedicalHistoryFormValues = {
  category: "GENERAL",
  title: "",
  description: "",
  date: new Date(),
  notes: "",
  images: [],
};

export function MedicalHistoryFormDialog({
  open,
  onClose,
  mode,
  record,
  isPending,
  onSubmit,
  tMedicalHistory,
  tCommon,
}: MedicalHistoryFormDialogProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();
  const { locale } = useLanguage();

  const schema = useMemo(
    () => createMedicalHistorySchema(tMedicalHistory),
    [tMedicalHistory],
  );

  const form = useForm<MedicalHistoryFormValues>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY_VALUES,
  });

  const watchedImages = form.watch("images");

  useEffect(() => {
    if (!open) {
      return;
    }

    if (mode === "edit" && record) {
      const parsedDate = new Date(record.content.date);
      form.reset({
        category: record.content.category,
        title: record.content.title,
        description: record.content.description,
        date: Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate,
        notes: record.content.notes || "",
        images: record.content.images || [],
      });
      return;
    }

    form.reset(EMPTY_VALUES);
  }, [open, mode, record, form]);

  const getValidationMessage = (error: ImageValidationError): string => {
    if (error === "invalid-type") {
      return tMedicalHistory("validation.imageTypeInvalid");
    }

    if (error === "file-too-large") {
      return tMedicalHistory("validation.imageTooLarge");
    }

    return tMedicalHistory("validation.tooManyImages");
  };

  const handleImagesSelected = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const fileList = event.target.files;
    if (!fileList || fileList.length === 0) {
      return;
    }

    const files = Array.from(fileList);
    const currentImages = form.getValues("images") || [];
    const { acceptedFiles, issues } = validateImageBatch(files, {
      currentCount: currentImages.length,
    });

    if (issues.length > 0) {
      const issueTypes = Array.from(
        new Set(issues.map((issue) => issue.error)),
      );
      issueTypes.forEach((issueType) => {
        toast({
          title: tMedicalHistory("imageUploadError"),
          description: getValidationMessage(issueType),
          variant: "destructive",
        });
      });
    }

    if (acceptedFiles.length > 0) {
      try {
        const encodedImages = await Promise.all(
          acceptedFiles.map((file) => fileToDataUrl(file)),
        );

        form.setValue("images", [...currentImages, ...encodedImages], {
          shouldDirty: true,
          shouldValidate: true,
        });
      } catch {
        toast({
          title: tMedicalHistory("imageUploadError"),
          description: tMedicalHistory("validation.imageReadFailed"),
          variant: "destructive",
        });
      }
    }

    event.target.value = "";
  };

  const handleRemoveImage = (imageIndex: number) => {
    const nextImages = (form.getValues("images") || []).filter(
      (_, index) => index !== imageIndex,
    );
    form.setValue("images", nextImages, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const submitHandler = async (values: MedicalHistoryFormValues) => {
    await onSubmit({
      name: buildMedicalHistoryName(values.category),
      content: {
        category: values.category,
        title: values.title,
        description: values.description,
        date: format(values.date, "yyyy-MM-dd"),
        ...(values.notes?.trim() ? { notes: values.notes.trim() } : {}),
        ...(values.images.length > 0 ? { images: values.images } : {}),
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create"
              ? tMedicalHistory("createTitle")
              : tMedicalHistory("editTitle")}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submitHandler)}
            className="space-y-4 pt-2"
          >
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>{tMedicalHistory("category")}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="grid grid-cols-1 gap-3 md:grid-cols-3"
                    >
                      {(
                        ["LAB", "SCAN", "GENERAL"] as MedicalHistoryCategory[]
                      ).map((categoryValue) => {
                        const CategoryIcon = CATEGORY_ICONS[categoryValue];
                        const cardId = `medical-history-category-${categoryValue.toLowerCase()}`;

                        return (
                          <Label
                            key={categoryValue}
                            htmlFor={cardId}
                            className="mt-1 cursor-pointer rounded-lg border p-3 transition-colors hover:border-primary"
                          >
                            <div className="flex items-center gap-2">
                              <RadioGroupItem
                                id={cardId}
                                value={categoryValue}
                              />
                              <CategoryIcon className="h-4 w-4" />
                              <span>
                                {tMedicalHistory(
                                  `categories.${categoryValue.toLowerCase()}`,
                                )}
                              </span>
                            </div>
                          </Label>
                        );
                      })}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {tMedicalHistory("recordTitle")}
                    <span className={`${locale === "ar" ? "mr-1" : "ml-1"} text-destructive`}>
                      *
                    </span>
                  </FormLabel>
                  <FormControl className="mt-1">
                    <Input
                      placeholder={tMedicalHistory("recordTitlePlaceholder")}
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {tMedicalHistory("recordDescription")}
                    <span className={`${locale === "ar" ? "mr-1" : "ml-1"} text-destructive`}>
                      *
                    </span>
                  </FormLabel>
                  <FormControl className="mt-1">
                    <Textarea
                      placeholder={tMedicalHistory(
                        "recordDescriptionPlaceholder",
                      )}
                      className="min-h-28"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{tMedicalHistory("recordDate")}</FormLabel>
                  <DatePickerPopover
                    date={field.value}
                    onDateChange={field.onChange}
                    placeholder={tMedicalHistory("recordDatePlaceholder")}
                    hasError={!!form.formState.errors.date}
                    disableFutureDates={true}
                    fromYear={1940}
                    toYear={new Date().getFullYear()}
                    disabled={isPending}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tMedicalHistory("notes")}</FormLabel>
                  <FormControl className="mt-1">
                    <Textarea
                      placeholder={tMedicalHistory("notesPlaceholder")}
                      className="min-h-20"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="images"
              render={() => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>{tMedicalHistory("images")}</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isPending}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {tMedicalHistory("uploadImages")}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {tMedicalHistory("imagesHint")}
                  </p>
                  <FormControl>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      className="hidden"
                      onChange={handleImagesSelected}
                    />
                  </FormControl>

                  {watchedImages.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                      {watchedImages.map((imageSrc, imageIndex) => (
                        <div
                          key={`${imageSrc}-${imageIndex}`}
                          className="relative overflow-hidden rounded-md border"
                        >
                          <img
                            src={imageSrc}
                            alt={`${tMedicalHistory("imageAlt")} ${imageIndex + 1}`}
                            className="h-20 w-full object-cover"
                          />
                          <button
                            type="button"
                            className="absolute right-1 top-1 rounded-full bg-background/90 p-1 text-destructive"
                            onClick={() => handleRemoveImage(imageIndex)}
                            aria-label={tMedicalHistory("removeImage")}
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isPending}
              >
                {tCommon("cancel")}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {mode === "create"
                      ? tMedicalHistory("creating")
                      : tMedicalHistory("updating")}
                  </>
                ) : mode === "create" ? (
                  tMedicalHistory("createAction")
                ) : (
                  tMedicalHistory("updateAction")
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
