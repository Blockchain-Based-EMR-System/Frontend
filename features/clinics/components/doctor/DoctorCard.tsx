"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DoctorWithClinics } from "../../types/appointments.types";
import { MapPin, Building2, Video } from "lucide-react";
import { useAppointmentNavigationStore } from "@/stores/useAppointmentNavigationStore";
import { useState } from "react";
import { AuthRequiredModal } from "../AuthRequiredModal";
import { useUserStore } from "@/stores/useUserStore";
import { useLanguage } from "@/contexts/LanguageProvider";
import { getInitials } from "@/lib/helpers";

interface DoctorCardProps {
  doctor: DoctorWithClinics;
  hideOnlineButton?: boolean;
}

export function DoctorCard({
  doctor,
  hideOnlineButton = false,
}: DoctorCardProps) {
  const t = useTranslations("clinics.doctorCard");
  const tCommon = useTranslations("common");
  const { locale } = useLanguage();
  const router = useRouter();
  const { setSelectedDoctor, setSelectedClinic } =
    useAppointmentNavigationStore();
  const { user } = useUserStore();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleClinicClick = (clinicId: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    const selectedClinic = doctor.clinics.find((c) => c.id === clinicId);
    setSelectedDoctor(doctor);
    setSelectedClinic(selectedClinic || null);

    document.cookie = "ScheduleNavigation=valid; path=/; max-age=300";
    router.push("/clinics/schedule");
  };

  const handleOnlineClick = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setSelectedDoctor(doctor);
    setSelectedClinic(null);

    document.cookie = "ScheduleNavigation=valid; path=/; max-age=300";
    router.push("/clinics/schedule");
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={doctor.profilePic || undefined}
                alt={doctor.name}
              />
              <AvatarFallback>
                <p className="text-2xl text-primary">
                  {getInitials(doctor.name)}
                </p>
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div>
                <h3 className="text-xl font-semibold">
                  {tCommon("doctor")} {doctor.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("specialization")}: {doctor.specialization}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 text-sm">
                <Badge variant="secondary">
                  {t("age")}: {doctor.age} {t("yearsOld")}
                </Badge>
                <Badge variant="default">
                  {t("fees")}: {doctor.fees} {t("egp")}
                </Badge>
              </div>
            </div>
          </div>

          {doctor.clinics && doctor.clinics.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                {t("clinics")} ({doctor.clinics.length})
              </h4>
              <div className="space-y-2">
                {doctor.clinics.map((clinic) => (
                  <Button
                    key={clinic.id}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3 hover:cursor-pointer"
                    onClick={() => handleClinicClick(clinic.id)}
                  >
                    <div className="flex-1">
                      <div className="font-medium">{clinic.name}</div>
                      <div className="flex items-start gap-2 text-xs text-muted-foreground mt-1">
                        <Building2 className="h-3 w-3 mt-0.5 shrink-0" />
                        <span>{clinic.address}</span>
                      </div>
                      <Link
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        href={clinic.address_maps_link}
                        target="_blank"
                        className="flex items-start gap-2 text-xs text-primary mt-1 w-fit font-bold"
                        rel="noopener noreferrer"
                      >
                        <MapPin className="h-3 w-3 mt-0.5 shrink-0" />
                        <span>
                          {locale === "en" ? "Directions" : "الاتجاهات"}
                        </span>
                      </Link>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {doctor.is_online && !hideOnlineButton && (
            <div className="mt-4">
              <Button
                className="w-full hover:cursor-pointer"
                variant="default"
                onClick={handleOnlineClick}
              >
                <Video className="h-4 w-4 mr-2" />
                {t("online")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AuthRequiredModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}
