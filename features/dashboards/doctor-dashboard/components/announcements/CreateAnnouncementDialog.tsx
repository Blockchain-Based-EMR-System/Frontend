"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { Clinic } from "../../types/clinic.types";
import { CreateAnnouncementRequest } from "../../types/announcement.types";
import { useCreateAnnouncement } from "../../query/useAnnouncements.query";
import { useLanguage } from "@/contexts/LanguageProvider";

const DAYS = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

interface WorkingDayEntry {
  day_of_week: string;
  start_time: string;
  end_time: string;
}

interface CreateAnnouncementDialogProps {
  open: boolean;
  onClose: () => void;
  clinics: Clinic[];
}

export function CreateAnnouncementDialog({
  open,
  onClose,
  clinics,
}: CreateAnnouncementDialogProps) {
  const t = useTranslations("doctorDashboard");
  const tFields = useTranslations("fields");
  const {locale} = useLanguage();
  const { mutate: create, isPending } = useCreateAnnouncement();

  const [clinicId, setClinicId] = useState("");
  const [workingDays, setWorkingDays] = useState<WorkingDayEntry[]>([
    { day_of_week: "SUNDAY", start_time: "09:00", end_time: "17:00" },
  ]);
  const [gender, setGender] = useState<"MALE" | "FEMALE" | "">("");
  const [maxAge, setMaxAge] = useState("");
  const [yearsExp, setYearsExp] = useState("");
  const [notes, setNotes] = useState("");

  const addDay = () => {
    setWorkingDays((prev) => [
      ...prev,
      { day_of_week: "MONDAY", start_time: "09:00", end_time: "17:00" },
    ]);
  };

  const removeDay = (idx: number) => {
    setWorkingDays((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateDay = (
    idx: number,
    field: keyof WorkingDayEntry,
    value: string,
  ) => {
    setWorkingDays((prev) =>
      prev.map((d, i) => (i === idx ? { ...d, [field]: value } : d)),
    );
  };

  const handleSubmit = () => {
    if (!clinicId || workingDays.length === 0) return;

    const payload: CreateAnnouncementRequest = {
      clinic_id: clinicId,
      working_days: workingDays,
      ...(gender ? { gender } : {}),
      ...(maxAge ? { max_age: parseInt(maxAge) } : {}),
      ...(yearsExp ? { years_of_experience: parseInt(yearsExp) } : {}),
      ...(notes ? { notes } : {}),
    };

    create(payload, {
      onSuccess: () => {
        onClose();
        setClinicId("");
        setWorkingDays([
          { day_of_week: "SUNDAY", start_time: "09:00", end_time: "17:00" },
        ]);
        setGender("MALE");
        setMaxAge("");
        setYearsExp("");
        setNotes("");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("announcements.postNew")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Clinic */}
          <div className="space-y-1.5">
            <Select value={clinicId} onValueChange={setClinicId}>
              <SelectTrigger dir={locale === "ar" ? "rtl" : "ltr"}>
                <SelectValue
                  placeholder={t("announcements.createForm.selectClinic")}
                />
              </SelectTrigger>
              <SelectContent>
                {clinics.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Working Days */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>{t("announcements.createForm.workingDays")}</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addDay}
                className="flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                {t("announcements.createForm.addDay")}
              </Button>
            </div>

            {workingDays.map((wd, idx) => (
              <div
                key={idx}
                className="grid grid-cols-[1fr_auto_auto_auto] gap-2 items-center"
              >
                <Select
                  value={wd.day_of_week}
                  onValueChange={(v) => updateDay(idx, "day_of_week", v)}
                >
                  <SelectTrigger className="text-sm" dir={locale === "ar" ? "rtl" : "ltr"}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent dir={locale === "ar" ? "rtl" : "ltr"}>
                    {DAYS.map((d) => (
                      <SelectItem key={d} value={d}>
                        {t(`schedule.days.${d.toLowerCase()}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="time"
                  value={wd.start_time}
                  onChange={(e) => updateDay(idx, "start_time", e.target.value)}
                  className="w-28 text-sm"
                />
                <Input
                  type="time"
                  value={wd.end_time}
                  onChange={(e) => updateDay(idx, "end_time", e.target.value)}
                  className="w-28 text-sm"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeDay(idx)}
                  disabled={workingDays.length === 1}
                  className="h-8 w-8 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            {/* Gender */}
            <div className="space-y-1.5">
              <Select
                value={gender}
                onValueChange={(v) => setGender(v as "MALE" | "FEMALE")}
              >
                <SelectTrigger dir={locale === "ar" ? "rtl" : "ltr"}>
                  <SelectValue
                    placeholder={t("announcements.createForm.selectGender")}
                  />
                </SelectTrigger>
                <SelectContent dir={locale === "ar" ? "rtl" : "ltr"}>
                  <SelectItem value="MALE">{tFields("male")}</SelectItem>
                  <SelectItem value="FEMALE">{tFields("female")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Max age */}
            <div className="space-y-1.5">
              <Input
                type="number"
                min="18"
                max="70"
                value={maxAge}
                onChange={(e) => setMaxAge(e.target.value)}
                placeholder={t("announcements.createForm.maxAgePlaceholder")}
              />
            </div>

            {/* Years of experience */}
            <div className="space-y-1.5">
              <Input
                type="number"
                min="0"
                value={yearsExp}
                onChange={(e) => setYearsExp(e.target.value)}
                placeholder={t("announcements.createForm.yearsPlaceholder")}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder={t("announcements.createForm.notesPlaceholder")}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
            />
          </div>

          <Button
            className="w-full"
            disabled={!clinicId || workingDays.length === 0 || isPending}
            onClick={handleSubmit}
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t("announcements.createForm.submitting")}
              </>
            ) : (
              t("announcements.createForm.submit")
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
