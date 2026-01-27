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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SpecializationSelect } from "@/components/common/SpecializationSelect";
import { DatePickerPopover } from "@/components/common/DatePickerPopover";
import { useCreateDoctor } from "../../../query/useDoctor.query";
import { useToast } from "@/hooks/useToast";
import { CreateDoctorRequest } from "../../../types/doctorTypes";
import { addDoctorSchema } from "./addDoctorSchema";

type AddDoctorForm = z.infer<typeof addDoctorSchema>;

interface AddDoctorDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AddDoctorDialog({ open, onClose }: AddDoctorDialogProps) {
  const { toast } = useToast();
  const createDoctorMutation = useCreateDoctor();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<AddDoctorForm>({
    resolver: zodResolver(addDoctorSchema),
  });

  const gender = watch("gender");
  const specialization = watch("specialization");
  const dateOfBirth = watch("date_of_birth");

  const onSubmit = async (data: AddDoctorForm) => {
    try {
      // Format date to YYYY-MM-DD
      const formattedData = {
        ...data,
        date_of_birth: data.date_of_birth
          ? new Date(data.date_of_birth).toISOString().split("T")[0]
          : "",
      };
      await createDoctorMutation.mutateAsync(
        formattedData as CreateDoctorRequest
      );
      toast({
        title: "Success",
        description: "Doctor created successfully",
      });
      reset();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to create doctor",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Doctor</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input id="phone" {...register("phone")} />
              {errors.phone && (
                <p className="text-sm text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
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
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-sm text-destructive">
                  {errors.gender.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_of_birth">Date of Birth *</Label>
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

            <div className="space-y-2 col-span-2">
              <Label htmlFor="specialization">Specialization *</Label>
              <SpecializationSelect
                value={specialization}
                onValueChange={(value) => setValue("specialization", value)}
                placeholder="Search and select specialization"
              />
              {errors.specialization && (
                <p className="text-sm text-destructive">
                  {errors.specialization.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createDoctorMutation.isPending}>
              {createDoctorMutation.isPending ? "Creating..." : "Create Doctor"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
