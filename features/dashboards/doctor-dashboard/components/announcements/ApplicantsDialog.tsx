"use client";

import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Phone,
  Mail,
  FileText,
  Loader2,
  UserCheck,
  Briefcase,
} from "lucide-react";
import {
  useAnnouncementApplicants,
  useApproveApplicant,
  useRejectApplicant,
} from "../../query/useAnnouncements.query";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageProvider";

interface ApplicantsDialogProps {
  announcementId: string | null;
  onClose: () => void;
}

export function ApplicantsDialog({
  announcementId,
  onClose,
}: ApplicantsDialogProps) {
  const t = useTranslations("doctorDashboard");
  const tFields = useTranslations("fields");
  const { locale } = useLanguage();
  const { data, isLoading } = useAnnouncementApplicants(announcementId);
  const { mutate: approve } = useApproveApplicant();
  const { mutate: reject } = useRejectApplicant();
  const [actionId, setActionId] = useState<string | null>(null);

  const applicants = data?.data ?? [];

  const handleApprove = (applicantId: string) => {
    if (!announcementId) return;
    setActionId(applicantId + "_approve");
    approve(
      { applicantId, announcementId },
      { onSettled: () => setActionId(null) },
    );
  };

  const handleReject = (applicantId: string) => {
    if (!announcementId) return;
    setActionId(applicantId + "_reject");
    reject(
      { applicantId, announcementId },
      { onSettled: () => setActionId(null) },
    );
  };

  return (
    <Dialog open={!!announcementId} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("announcements.applicants")}</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4 mt-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border rounded-xl p-4 space-y-3">
                {/* Header row */}
                <div className="flex items-start gap-3">
                  <Skeleton className="h-11 w-11 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-5 w-14 rounded-full" />
                      <Skeleton className="h-5 w-10 rounded-full" />
                    </div>
                    <div className="flex gap-4">
                      <Skeleton className="h-3 w-36" />
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-28" />
                    </div>
                  </div>
                </div>
                {/* Brief */}
                <div className="space-y-1">
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-14 w-full rounded-md" />
                </div>
                <Skeleton className="h-px w-full" />
                {/* Actions */}
                <div className="flex gap-2">
                  <Skeleton className="h-9 flex-1 rounded-md" />
                  <Skeleton className="h-9 flex-1 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        ) : applicants.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <UserCheck className="h-10 w-10 text-muted-foreground/50" />
            <p className="font-medium">{t("announcements.noApplicants")}</p>
            <p className="text-sm text-muted-foreground">
              {t("announcements.noApplicantsDesc")}
            </p>
          </div>
        ) : (
          <div className="space-y-4 mt-2">
            {applicants.map((applicant) => {
              const initials = applicant.name
                .split(" ")
                .slice(0, 2)
                .map((n) => n[0])
                .join("")
                .toUpperCase();
              const isApprovingThis = actionId === applicant.id + "_approve";
              const isRejectingThis = actionId === applicant.id + "_reject";
              const isBusy = !!actionId;

              return (
                <div
                  key={applicant.id}
                  className="border rounded-xl p-4 space-y-3"
                >
                  {/* Header */}
                  <div className="flex items-start gap-3">
                    <Avatar className="h-11 w-11">
                      <AvatarImage
                        src={applicant.profilePic ?? undefined}
                        alt={applicant.name}
                      />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold">{applicant.name}</p>
                        <Badge variant="outline" className="text-xs">
                          {applicant.gender === "MALE"
                            ? tFields("male")
                            : tFields("female")}
                        </Badge>
                        {applicant.age && (
                          <Badge variant="outline" className="text-xs">
                            {applicant.age} {locale === "ar" ? "سنة" : "yrs"}
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {applicant.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {applicant.phone}
                        </span>
                        {applicant.years_of_experience != null && (
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-3 w-3" />
                            {applicant.years_of_experience}{" "}
                            {locale === "ar" ? "سنة خبرة" : "Years Experience"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Brief */}
                  {applicant.brief && (
                    <div>
                      <h3 className="font-medium text-sm">
                        {locale === "ar"
                          ? "نبذة عن المتقدم"
                          : "Applicant Brief"}
                      </h3>
                      <p className="bg-secondary/50 mt-1 p-2 rounded-md text-sm text-muted-foreground line-clamp-3 flex items-start gap-1.5">
                        {applicant.brief}
                      </p>
                    </div>
                  )}

                  {/* Documents */}
                  <div className="flex flex-wrap gap-2 text-xs">
                    {applicant.nationalCardUrl && (
                      <a
                        href={applicant.nationalCardUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline underline-offset-8 flex items-center gap-1"
                      >
                        <FileText className="h-3 w-3" />
                        {locale === "ar" ? "البطاقة الوطنية" : "National Card"}
                      </a>
                    )}
                    {applicant.bonusFileUrl && (
                      <a
                        href={applicant.bonusFileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline underline-offset-8 flex items-center gap-1"
                      >
                        <FileText className="h-3 w-3" />
                        {locale === "ar" ? "ملف اضافي" : "Bonus File"}
                      </a>
                    )}
                  </div>

                  <Separator />

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      disabled={isBusy}
                      onClick={() => handleApprove(applicant.id)}
                    >
                      {isApprovingThis ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                          {t("announcements.approving")}
                        </>
                      ) : (
                        t("announcements.approve")
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex-1"
                      disabled={isBusy}
                      onClick={() => handleReject(applicant.id)}
                    >
                      {isRejectingThis ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                          {t("announcements.rejecting")}
                        </>
                      ) : (
                        t("announcements.reject")
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
