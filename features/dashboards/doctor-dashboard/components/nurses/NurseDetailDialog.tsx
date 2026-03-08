"use client";

import { useTranslations } from "next-intl";
import { DoctorNurse } from "../../types/nurse.types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileText, MapPin, Clock } from "lucide-react";
import { getInitials, getTimeIn12HourFormat } from "@/lib/helpers";
import { useLanguage } from "@/contexts/LanguageProvider";

interface NurseDetailDialogProps {
  nurse: DoctorNurse;
  open: boolean;
  onClose: () => void;
}

export function NurseDetailDialog({
  nurse,
  open,
  onClose,
}: NurseDetailDialogProps) {
  const t = useTranslations("doctorDashboard.nurses");
  const tFields = useTranslations("fields");
  const tSchedule = useTranslations("doctorDashboard.schedule");
  const { locale } = useLanguage();

  const handleOpenDocument = (url: string | null | undefined) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const documents = [
    {
      label: t("nationalCard"),
      url: nurse.nationalCardUrl,
    },
    {
      label: t("bonusFile"),
      url: nurse.bonusFileUrl,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("nurseDetails")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={nurse.profilePic ?? undefined}
                alt={nurse.name}
              />
              <AvatarFallback className="text-lg">
                {getInitials(nurse.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{nurse.name}</h3>
              <p className="text-sm text-muted-foreground">{nurse.email}</p>
            </div>
          </div>

          {/* Basic Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {tFields("phoneNumber")}
              </p>
              <p className="text-base">{nurse.phone || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {tFields("gender")}
              </p>
              <p className="text-base">
                {nurse.gender === "MALE"
                  ? tFields("male")
                  : nurse.gender === "FEMALE"
                    ? tFields("female")
                    : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {t("age")}
              </p>
              <p className="text-base">{nurse.age}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {t("yearsOfExperience")}
              </p>
              <p className="text-base">
                {nurse.years_of_experience}{" "}
                <span className="text-muted-foreground text-sm">
                  {t("years")}
                </span>
              </p>
            </div>
          </div>

          {/* Brief */}
          {nurse.brief && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {t("brief")}
              </p>
              <p className="text-sm leading-relaxed">{nurse.brief}</p>
            </div>
          )}

          <Separator />

          {/* Clinics */}
          <div>
            <h4 className="text-base font-semibold mb-3">{t("clinics")}</h4>
            {nurse.clinics.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t("noClinics")}</p>
            ) : (
              <div className="space-y-4">
                {nurse.clinics.map((clinic) => (
                  <div
                    key={clinic.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="font-medium">{clinic.name}</h5>
                      {clinic.address_maps_link && (
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={clinic.address_maps_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1"
                          >
                            <MapPin className="h-3 w-3" />
                            {t("viewMap")}
                          </a>
                        </Button>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {clinic.address}
                    </p>
                    {clinic.working_days.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          {t("workingDays")}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {clinic.working_days.map((wd, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-1.5 bg-muted rounded-md px-2 py-1 text-sm"
                            >
                              <span className="font-medium">
                                {tSchedule(
                                  `days.${wd.day_of_week.toLowerCase()}`,
                                )}
                              </span>
                              <span className="text-muted-foreground">·</span>
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                {getTimeIn12HourFormat(wd.start_time, locale)} –{" "}
                                {getTimeIn12HourFormat(wd.end_time, locale)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Documents */}
          <div>
            <h4 className="text-base font-semibold mb-3">{t("documents")}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {documents.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{doc.label}</p>
                      {!doc.url && (
                        <p className="text-xs text-muted-foreground">
                          {t("notProvided")}
                        </p>
                      )}
                    </div>
                  </div>
                  {doc.url && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDocument(doc.url)}
                    >
                      {t("viewDocument")}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
