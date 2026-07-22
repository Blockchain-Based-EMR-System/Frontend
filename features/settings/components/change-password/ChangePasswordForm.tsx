"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useLanguage } from "@/contexts/LanguageProvider";
import {
  createVerifyPasswordSchema,
  createChangePasswordSchema,
} from "./changePasswordSchema";
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
  useCheckPassword,
  useChangePassword,
} from "../../query/settings.query";
import { Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/useToast";

type VerifyPasswordFormValues = {
  currentPassword: string;
};

type ChangePasswordFormValues = {
  newPassword: string;
  confirmPassword: string;
};

export function ChangePasswordForm() {
  const t = useTranslations("settings");
  const tFields = useTranslations("fields");
  const tCommon = useTranslations("common");
  const { direction, locale } = useLanguage();
  const { toast } = useToast();
  const checkPasswordMutation = useCheckPassword();
  const changePasswordMutation = useChangePassword();

  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const verifyForm = useForm<VerifyPasswordFormValues>({
    resolver: zodResolver(createVerifyPasswordSchema(tFields)),
    defaultValues: {
      currentPassword: "",
    },
  });

  const changeForm = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(createChangePasswordSchema(tFields)),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onVerifySubmit = (data: VerifyPasswordFormValues) => {
    checkPasswordMutation.mutate(
      { password: data.currentPassword },
      {
        onSuccess: (response) => {
          if (response.data?.isMatch) {
            setIsPasswordVerified(true);
            setCurrentPassword(data.currentPassword);
            toast({
              title: locale === "en" ? "Success" : "نجاح",
              description:
                locale === "en"
                  ? "Password verified successfully"
                  : "تم التحقق من كلمة المرور بنجاح",
            });
          } else {
            toast({
              title: locale === "en" ? "Invalid Password" : "كلمة مرور خاطئة",
              description:
                locale === "en"
                  ? "The password you entered is incorrect"
                  : "كلمة المرور التي أدخلتها غير صحيحة",
              variant: "destructive",
            });
          }
        },
      },
    );
  };

  const onChangeSubmit = (data: ChangePasswordFormValues) => {
    changePasswordMutation.mutate(
      {
        currentPassword: currentPassword,
        newPassword: data.newPassword,
      },
      {
        onSuccess: () => {
          verifyForm.reset();
          changeForm.reset();
          setIsPasswordVerified(false);
          setCurrentPassword("");
          setShowCurrentPassword(false);
          setShowNewPassword(false);
          setShowConfirmPassword(false);
        },
      },
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("passwordSection.title")}</CardTitle>
        <CardDescription>{t("passwordSection.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        {!isPasswordVerified ? (
          <div className="space-y-4">
            <div className="p-4 text-center">
              <p className="text-lg font-medium">
                {t("passwordSection.verifyPasswordDescription") ||
                  "Please verify your current password before setting a new one."}
              </p>
            </div>

            <Form {...verifyForm}>
              <form
                onSubmit={verifyForm.handleSubmit(onVerifySubmit)}
                className="space-y-4"
              >
                <FormField
                  control={verifyForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showCurrentPassword ? "text" : "password"}
                            placeholder={t(
                              "passwordSection.currentPasswordPlaceholder",
                            )}
                            {...field}
                            disabled={checkPasswordMutation.isPending}
                            className="py-6"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowCurrentPassword(!showCurrentPassword)
                            }
                            className={`absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground ${direction === "rtl" ? "left-3 right-auto" : ""}`}
                            tabIndex={-1}
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={checkPasswordMutation.isPending}
                  >
                    {checkPasswordMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("passwordSection.verifying")}
                      </>
                    ) : (
                      t("passwordSection.verifyPassword")
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        ) : (
          <div className="space-y-4">
            <Form {...changeForm}>
              <form
                onSubmit={changeForm.handleSubmit(onChangeSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={changeForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showNewPassword ? "text" : "password"}
                            placeholder={t(
                              "passwordSection.newPasswordPlaceholder",
                            )}
                            {...field}
                            disabled={changePasswordMutation.isPending}
                            className="py-6"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className={`absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground ${direction === "rtl" ? "left-3 right-auto" : ""}`}
                            tabIndex={-1}
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={changeForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder={t(
                              "passwordSection.confirmPasswordPlaceholder",
                            )}
                            {...field}
                            disabled={changePasswordMutation.isPending}
                            className="py-6"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className={`absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground ${direction === "rtl" ? "left-3 right-auto" : ""}`}
                            tabIndex={-1}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsPasswordVerified(false);
                      setCurrentPassword("");
                      changeForm.reset();
                    }}
                    disabled={changePasswordMutation.isPending}
                  >
                    {tCommon("cancel") || "Cancel"}
                  </Button>
                  <Button
                    type="submit"
                    disabled={changePasswordMutation.isPending}
                  >
                    {changePasswordMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("passwordSection.changing")}
                      </>
                    ) : (
                      t("passwordSection.changePassword")
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
