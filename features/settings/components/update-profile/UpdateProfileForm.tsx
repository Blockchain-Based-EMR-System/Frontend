"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useLanguage } from "@/contexts/LanguageProvider";
import { createUpdateProfileSchema } from "./updateProfileSchema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerPopover } from "@/components/common/DatePickerPopover";
import { ImageCropDialog } from "@/components/common/ImageCropDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUpdateProfile } from "../../query/settings.query";
import {
  useUpdateProfilePicture,
  useDeleteProfilePicture,
} from "@/features/user";
import { useUserStore } from "@/stores/useUserStore";
import { useToast } from "@/hooks/useToast";
import { format } from "date-fns";
import { Loader2, Upload, Trash2 } from "lucide-react";
import { getInitials } from "@/lib/helpers";
import {
  fileToDataUrl,
  validateImageFile,
  DEFAULT_MAX_IMAGE_SIZE_BYTES,
} from "@/lib/imageUtils";

type ProfileFormValues = {
  name: string;
  phone: string;
  gender: "MALE" | "FEMALE";
  dateOfBirth: Date;
  availability_type?: "ONLINE" | "OFFLINE" | "BOTH";
};

export function UpdateProfileForm() {
  const t = useTranslations("settings");
  const tFields = useTranslations("fields");
  const { direction, locale } = useLanguage();
  const { user } = useUserStore();
  const { toast } = useToast();
  const updateProfileMutation = useUpdateProfile();
  const updateProfilePictureMutation = useUpdateProfilePicture();
  const deleteProfilePictureMutation = useDeleteProfilePicture();

  const [imageToCrop, setImageToCrop] = useState<string | null>(null);

  const isDoctor = user?.role === "DOCTOR";

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(createUpdateProfileSchema(tFields, isDoctor)),
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      gender: user?.gender || undefined,
      dateOfBirth: user?.date_of_birth
        ? new Date(user.date_of_birth)
        : undefined,
      availability_type:
        isDoctor && user?.doctor?.availability_type
          ? user.doctor.availability_type
          : undefined,
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        phone: user.phone || "",
        gender: user.gender || undefined,
        dateOfBirth: user.date_of_birth
          ? new Date(user.date_of_birth)
          : undefined,
        availability_type:
          isDoctor && user.doctor?.availability_type
            ? user.doctor.availability_type
            : undefined,
      });
    }
  }, [user, isDoctor, form]);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validationError = validateImageFile(file);

    if (validationError === "invalid-type") {
      toast({
        title: locale === "en" ? "Invalid file type" : "نوع ملف غير صالح",
        description:
          locale === "en"
            ? "Please upload an image file"
            : "يرجى تحميل ملف صورة",
        variant: "destructive",
      });
      return;
    }

    if (validationError === "file-too-large") {
      toast({
        title: locale === "en" ? "File too large" : "حجم الملف كبير جدًا",
        description:
          locale === "en"
            ? `Please upload an image smaller than ${Math.floor(DEFAULT_MAX_IMAGE_SIZE_BYTES / (1024 * 1024))}MB`
            : "يرجى تحميل صورة أصغر من 5 ميغابايت",
        variant: "destructive",
      });
      return;
    }

    try {
      const imageDataUrl = await fileToDataUrl(file);
      setImageToCrop(imageDataUrl);
    } catch {
      toast({
        title: locale === "en" ? "Error" : "خطأ",
        description:
          locale === "en"
            ? "Failed to process selected image"
            : "تعذر معالجة الصورة المحددة",
        variant: "destructive",
      });
    }
  };

  const handleCropComplete = (croppedImage: File) => {
    updateProfilePictureMutation.mutate(croppedImage);
    setImageToCrop(null);
  };

  const handleDeleteImage = () => {
    if (!user?.photo_url && !user?.profilePicture) {
      toast({
        title: locale === "en" ? "No image to delete" : "لا توجد صورة لحذفها",
        description:
          locale === "en"
            ? "You don't have a profile picture set"
            : "ليس لديك صورة ملف شخصي محددة",
        variant: "destructive",
      });
      return;
    }

    deleteProfilePictureMutation.mutate();
  };

  const onSubmit = (data: ProfileFormValues) => {
    const payload: any = {
      name: data.name,
      phone: data.phone,
      gender: data.gender,
      date_of_birth: format(data.dateOfBirth, "yyyy-MM-dd"),
    };

    if (isDoctor && "availability_type" in data) {
      payload.availability_type = data.availability_type;
    }

    updateProfileMutation.mutate(payload);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{t("profileSection.title")}</CardTitle>
          <CardDescription>{t("profileSection.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center gap-4 pb-6 border-b">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={user?.photo_url || user?.profilePicture || undefined}
                  alt={user?.name}
                />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-3xl">
                  {getInitials(user?.name || "U")}
                </AvatarFallback>
              </Avatar>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    document.getElementById("profile-picture-upload")?.click()
                  }
                  disabled={updateProfilePictureMutation.isPending}
                >
                  {updateProfilePictureMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  {t("profileSection.uploadImage")}
                </Button>
                {(user?.photo_url || user?.profilePicture) && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleDeleteImage}
                    disabled={deleteProfilePictureMutation.isPending}
                  >
                    {deleteProfilePictureMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 mr-2" />
                    )}
                    {t("profileSection.removeImage")}
                  </Button>
                )}
              </div>
              <input
                id="profile-picture-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Profile Form */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("profileSection.name")}</FormLabel>
                      <FormControl className="mt-1">
                        <Input
                          placeholder={t("profileSection.namePlaceholder")}
                          {...field}
                          disabled={updateProfileMutation.isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("profileSection.phone")}</FormLabel>
                      <FormControl className="mt-1">
                        <Input
                          dir={direction}
                          placeholder={t("profileSection.phonePlaceholder")}
                          {...field}
                          disabled={updateProfileMutation.isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("profileSection.gender")}</FormLabel>
                      <Select
                        dir={direction}
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={updateProfileMutation.isPending}
                      >
                        <FormControl className="mt-1">
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t("profileSection.selectGender")}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MALE">
                            {t("profileSection.male")}
                          </SelectItem>
                          <SelectItem value="FEMALE">
                            {t("profileSection.female")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>{t("profileSection.dateOfBirth")}</FormLabel>
                      <DatePickerPopover
                        date={field.value}
                        onDateChange={field.onChange}
                        placeholder={t("profileSection.pickDateOfBirth")}
                        disabled={updateProfileMutation.isPending}
                        hasError={!!form.formState.errors.dateOfBirth}
                        fromYear={1940}
                        toYear={new Date().getFullYear() - 18}
                        disableFutureDates={true}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {isDoctor && (
                  <FormField
                    control={form.control}
                    name="availability_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("profileSection.availabilityType")}
                        </FormLabel>
                        <Select
                          dir={direction}
                          onValueChange={field.onChange}
                          value={field.value as string | undefined}
                          disabled={updateProfileMutation.isPending}
                        >
                          <FormControl className="mt-1">
                            <SelectTrigger>
                              <SelectValue
                                placeholder={t(
                                  "profileSection.selectAvailabilityType",
                                )}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ONLINE">
                              {t("profileSection.online")}
                            </SelectItem>
                            <SelectItem value="OFFLINE">
                              {t("profileSection.offline")}
                            </SelectItem>
                            <SelectItem value="BOTH">
                              {t("profileSection.both")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                  >
                    {updateProfileMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("profileSection.updating")}
                      </>
                    ) : (
                      t("profileSection.saveChanges")
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>

      {imageToCrop && (
        <ImageCropDialog
          image={imageToCrop}
          open={!!imageToCrop}
          onClose={() => {
            setImageToCrop(null);
          }}
          onCropComplete={handleCropComplete}
          locale={locale}
        />
      )}
    </>
  );
}
