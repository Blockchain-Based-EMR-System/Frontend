"use client";

import { useTranslations } from "next-intl";
import { useLanguage } from "@/contexts/LanguageProvider";
import { useTheme } from "@/contexts/ThemeProvider";
import { useUiPreferences } from "@/contexts/UiPreferencesProvider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type Locale = "en" | "ar";
type Theme = "light" | "dark";

export function GeneralSettingsForm() {
  const t = useTranslations("settings");
  const { locale, setLocale } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { interactiveBackgroundEnabled, setInteractiveBackgroundEnabled } =
    useUiPreferences();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{t("generalSection.title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-6 pb-6 border-b">
          <div className="space-y-1">
            <Label
              htmlFor="settings-language"
              className="text-base font-medium"
            >
              {t("generalSection.languageTitle")}
            </Label>
            <p className="text-sm text-muted-foreground">
              {t("generalSection.languageDescription")}
            </p>
          </div>
          <Select
            value={locale}
            onValueChange={(value) => setLocale(value as Locale)}
          >
            <SelectTrigger
              dir={locale === "ar" ? "rtl" : "ltr"}
              id="settings-language"
              className="w-full md:w-[260px]"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">{t("generalSection.english")}</SelectItem>
              <SelectItem value="ar">{t("generalSection.arabic")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-6 pb-6 border-b">
          <div className="space-y-1">
            <Label htmlFor="settings-theme" className="text-base font-medium">
              {t("generalSection.themeTitle")}
            </Label>
            <p className="text-sm text-muted-foreground">
              {t("generalSection.themeDescription")}
            </p>
          </div>
          <Select
            value={theme}
            onValueChange={(value) => setTheme(value as Theme)}
          >
            <SelectTrigger
              dir={locale === "ar" ? "rtl" : "ltr"}
              id="settings-theme"
              className="w-full md:w-[260px]"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">{t("generalSection.light")}</SelectItem>
              <SelectItem value="dark">{t("generalSection.dark")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-6">
          <div className="space-y-1">
            <Label
              htmlFor="settings-interactive-background"
              className="text-base font-medium"
            >
              {t("generalSection.interactiveBackgroundTitle")}
            </Label>
            <p className="text-sm text-muted-foreground">
              {t("generalSection.interactiveBackgroundDescription")}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox
              id="settings-interactive-background"
              checked={interactiveBackgroundEnabled}
              onCheckedChange={(checked) =>
                setInteractiveBackgroundEnabled(checked === true)
              }
            />
            <Label
              htmlFor="settings-interactive-background"
              className="cursor-pointer"
            >
              {t("generalSection.interactiveBackgroundLabel")}
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
