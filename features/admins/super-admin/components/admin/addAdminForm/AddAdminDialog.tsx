"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerPopover } from "@/components/common/DatePickerPopover";
import { useCreateAdmin } from "../../../query/useAdmin.query";
import { useToast } from "@/hooks/useToast";
import { CreateAdminRequest } from "../../../types/adminTypes";
import { addAdminSchema } from "./addAdminSchema";
import { useTranslations } from "next-intl";

interface AddAdminDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AddAdminDialog({ open, onClose }: AddAdminDialogProps) {
  const { toast } = useToast();
  const createAdminMutation = useCreateAdmin();
  const tAdmin = useTranslations("admin");
  const tCommon = useTranslations("common");
  const tAuth = useTranslations("auth");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CreateAdminRequest>({
    resolver: zodResolver(addAdminSchema),
  });

  const gender = watch("gender");
  const dateOfBirth = watch("date_of_birth");

  const onSubmit = async (data: CreateAdminRequest) => {
    try {
      const formattedData = {
        ...data,
        date_of_birth: data.date_of_birth
          ? new Date(data.date_of_birth).toISOString().split("T")[0]
          : "",
      };
      await createAdminMutation.mutateAsync(formattedData);
      toast({
        title: "Success",
        description: "Admin created successfully",
      });
      reset();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to create admin",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{tAdmin("addNewAdmin")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{tCommon("name")} *</Label>
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{tCommon("email")} *</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{tCommon("password")} *</Label>
              <Input id="password" type="password" {...register("password")} />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">{tCommon("phone")} *</Label>
              <Input id="phone" {...register("phone")} />
              {errors.phone && (
                <p className="text-sm text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">{tCommon("gender")} *</Label>
              <Select
                value={gender}
                onValueChange={(value) =>
                  setValue("gender", value as "MALE" | "FEMALE")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">{tAuth("male")}</SelectItem>
                  <SelectItem value="FEMALE">{tAuth("female")}</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-sm text-destructive">
                  {errors.gender.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_of_birth">{tCommon("dateOfBirth")} *</Label>
              <DatePickerPopover
                date={dateOfBirth ? new Date(dateOfBirth) : undefined}
                onDateChange={(date) =>
                  setValue("date_of_birth", date?.toISOString() || "")
                }
                placeholder="Pick date of birth"
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
            <Button type="submit" disabled={createAdminMutation.isPending}>
              {createAdminMutation.isPending ? tCommon("creating") : tCommon("create")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
