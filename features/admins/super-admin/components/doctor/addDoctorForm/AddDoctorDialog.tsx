"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerPopover } from "@/components/common/DatePickerPopover";
import { useCreateDoctor } from "../../../query/useDoctor.query";
import { useToast } from "@/hooks/useToast";
import { useLanguage } from "@/contexts/LanguageProvider";
import { CreateDoctorRequest } from "../../../types/doctorTypes";
import { createAddDoctorSchema } from "./addDoctorSchema";
import { getLocalizedMessage } from "@/lib/helpers";
import { useTranslations } from "next-intl";

type AddDoctorForm = z.infer<ReturnType<typeof createAddDoctorSchema>>;

interface AddDoctorDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AddDoctorDialog({ open, onClose }: AddDoctorDialogProps) {
  const { toast } = useToast();
  const { locale, direction } = useLanguage();
  const tCommon = useTranslations("common");
  const tFields = useTranslations("fields");
  const tAdmin = useTranslations("superAdmin");
  const createDoctorMutation = useCreateDoctor();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<AddDoctorForm>({
    resolver: zodResolver(createAddDoctorSchema(tFields)),
  });

  const gender = watch("gender");
  const dateOfBirth = watch("date_of_birth");

  const onSubmit = async (data: AddDoctorForm) => {
    try {
      const formattedData = {
        ...data,
        date_of_birth: data.date_of_birth
          ? new Date(data.date_of_birth).toISOString().split("T")[0]
          : "",
      };
      const response = await createDoctorMutation.mutateAsync(
        formattedData as CreateDoctorRequest,
      );
      toast({
        title: "Success",
        description: getLocalizedMessage(response, locale),
      });
      reset();
      onClose();
    } catch (error: any) {
      const errorMessage = error?.response?.data
        ? getLocalizedMessage(error.response.data, locale)
        : error?.message || "Failed to create doctor";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{tAdmin("addDoctor")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Input
              id="name"
              placeholder={tFields("namePlaceholder")}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Input
                id="email"
                type="email"
                placeholder={tFields("emailPlaceholder")}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Input
                id="phone"
                placeholder={tFields("phoneNumberPlaceholder")}
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Select
                dir={direction}
                value={gender}
                onValueChange={(value) =>
                  setValue("gender", value as "MALE" | "FEMALE")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={tFields("selectGender")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">{tFields("male")}</SelectItem>
                  <SelectItem value="FEMALE">{tFields("female")}</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-sm text-destructive">
                  {errors.gender.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <DatePickerPopover
                date={dateOfBirth ? new Date(dateOfBirth) : undefined}
                onDateChange={(date) =>
                  setValue("date_of_birth", date?.toISOString() || "")
                }
                placeholder={tFields("pickDateOfBirth")}
                hasError={!!errors.date_of_birth}
                disableFutureDates
                fromYear={1950}
                toYear={new Date().getFullYear() - 18}
              />
              {errors.date_of_birth && (
                <p className="text-sm text-destructive">
                  {errors.date_of_birth.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              {tCommon("cancel")}
            </Button>
            <Button type="submit" disabled={createDoctorMutation.isPending}>
              {createDoctorMutation.isPending
                ? tAdmin("addingDoctor")
                : tAdmin("addDoctor")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
