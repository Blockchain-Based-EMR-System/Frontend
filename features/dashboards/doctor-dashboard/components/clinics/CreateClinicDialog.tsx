"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
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
import { Checkbox } from "@/components/ui/checkbox";
import { createClinicSchema, ClinicFormData } from "./clinicSchema";
import { useCreateClinic } from "../../query/useClinics.query";
import { useTranslations as useFieldTranslations } from "next-intl";

interface CreateClinicDialogPresentationalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ClinicFormData) => void;
  isLoading: boolean;
}

function CreateClinicDialogPresentational({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: CreateClinicDialogPresentationalProps) {
  const t = useTranslations("doctorDashboard.clinicForm");
  const tFields = useFieldTranslations("fields");
  const tCommon = useTranslations("common");

  const form = useForm<ClinicFormData>({
    resolver: zodResolver(createClinicSchema(tFields)),
    defaultValues: {
      name: "",
      address: "",
      address_maps_link: "",
      phone: "",
      opening_at: "09:00",
      closing_at: "17:00",
      fees: 200,
      canPayOnline: false,
    },
  });

  const handleSubmit = (data: ClinicFormData) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("createTitle")}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>{t("clinicName")}</FormLabel>
                  <FormControl className="mt-1">
                    <Input
                      placeholder={t("clinicNamePlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>{t("address")}</FormLabel>
                  <FormControl className="mt-1">
                    <Input placeholder={t("addressPlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address_maps_link"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>{t("addressMapsLink")}</FormLabel>
                  <FormControl className="mt-1">
                    <Input
                      placeholder={t("addressMapsLinkPlaceholder")}
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>{t("phone")}</FormLabel>
                  <FormControl className="mt-1">
                    <Input placeholder={t("phonePlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="opening_at"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>{t("openingAt")}</FormLabel>
                    <FormControl className="mt-1">
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="closing_at"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>{t("closingAt")}</FormLabel>
                    <FormControl className="mt-1">
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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

            <FormField
              control={form.control}
              name="canPayOnline"
              render={({ field }: { field: any }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>{t("canPayOnline")}</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                {tCommon("cancel")}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? tCommon("creating") : t("createClinic")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

interface CreateClinicDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateClinicDialog({
  open,
  onOpenChange,
}: CreateClinicDialogProps) {
  const createClinic = useCreateClinic();

  const handleSubmit = (data: ClinicFormData) => {
    createClinic.mutate(data, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <CreateClinicDialogPresentational
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      isLoading={createClinic.isPending}
    />
  );
}
