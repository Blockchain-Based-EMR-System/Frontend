"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Clinic } from "../../types/clinic.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateClinicFees } from "../../api/clinics.api";
import { toast } from "@/hooks/useToast";
import { useLanguage } from "@/contexts/LanguageProvider";
import { CLINICS_QUERY_KEY } from "../../query/useClinics.query";

const createFeesSchema = (tFields: any) =>
  z.object({
    fees: z
      .number()
      .min(0, { message: tFields("feesMinValue") })
      .positive({ message: tFields("feesRequired") }),
  });

type FeesFormData = z.infer<ReturnType<typeof createFeesSchema>>;

interface EditClinicFeesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clinic: Clinic;
}

export function EditClinicFeesDialog({
  open,
  onOpenChange,
  clinic,
}: EditClinicFeesDialogProps) {
  const t = useTranslations("doctorDashboard.clinicForm");
  const tFields = useTranslations("fields");
  const tCommon = useTranslations("common");
  const { locale } = useLanguage();
  const queryClient = useQueryClient();

  const form = useForm<FeesFormData>({
    resolver: zodResolver(createFeesSchema(tFields)),
    defaultValues: {
      fees: clinic.fees,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        fees: clinic.fees,
      });
    }
  }, [open, clinic, form]);

  const updateFeesMutation = useMutation({
    mutationFn: (data: FeesFormData) => updateClinicFees(clinic.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CLINICS_QUERY_KEY] });
      toast({
        title: locale === "ar" ? "نجح" : "Success",
        description:
          locale === "ar"
            ? "تم تحديث رسوم العيادة بنجاح"
            : "Clinic fees updated successfully",
      });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: locale === "ar" ? "خطأ" : "Error",
        description:
          error.message ||
          (locale === "ar"
            ? "فشل في تحديث رسوم العيادة"
            : "Failed to update clinic fees"),
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: FeesFormData) => {
    updateFeesMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("editFeesTitle")}</DialogTitle>
          <DialogDescription>{clinic.name}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="fees"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>{t("fees")}</FormLabel>
                  <FormControl className="mt-1">
                    <Input
                      type="number"
                      placeholder={t("feesPlaceholder")}
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={updateFeesMutation.isPending}
              >
                {tCommon("cancel")}
              </Button>
              <Button type="submit" disabled={updateFeesMutation.isPending}>
                {updateFeesMutation.isPending
                  ? tCommon("submitting")
                  : t("updateFees")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
