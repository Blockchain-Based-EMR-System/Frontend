"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ClinicWithDoctors,
  SimpleDoctorInClinic,
} from "../../types/appointments.types";
import {
  MapPin,
  Phone,
  Clock,
  CreditCard,
  ChevronDown,
  ChevronUp,
  Building2,
} from "lucide-react";
import { useAppointmentNavigationStore } from "@/stores/useAppointmentNavigationStore";
import { AuthRequiredModal } from "../AuthRequiredModal";
import { useUserStore } from "@/stores/useUserStore";
import { getTimeIn12HourFormat, getInitials } from "@/lib/helpers";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageProvider";

interface ClinicCardProps {
  clinic: ClinicWithDoctors;
}

export function ClinicCard({ clinic }: ClinicCardProps) {
  const t = useTranslations("clinics.clinicCard");
  const tCommon = useTranslations("clinics");
  const tGeneral = useTranslations("common");
  const tFields = useTranslations("fields");
  const { locale } = useLanguage();
  const router = useRouter();
  const { user } = useUserStore();
  const { setSelectedDoctor, setSelectedClinic } =
    useAppointmentNavigationStore();
  const [showAllDoctors, setShowAllDoctors] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const doctors = clinic.doctors || [];

  const displayedDoctors = showAllDoctors ? doctors : doctors.slice(0, 3);
  const hasMoreDoctors = doctors.length > 3;

  const handleDoctorClick = (doctor: SimpleDoctorInClinic) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    const doctorWithClinics = {
      ...doctor,
      specialization: "",
      clinics: [clinic],
    };

    setSelectedDoctor(doctorWithClinics);
    setSelectedClinic(clinic);

    document.cookie = "ScheduleNavigation=valid; path=/; max-age=300";
    router.push("/clinics/schedule");
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-start justify-between">
            <span>{clinic.name}</span>
            {clinic.canPayOnline && (
              <Badge variant="default" className="flex items-center gap-1">
                <CreditCard className="h-3 w-3" />
                {t("onlinePayment")}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <Building2 className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
              <span>{clinic.address}</span>
            </div>
            <Link
              href={clinic.address_maps_link}
              target="_blank"
              className="flex items-start font-bold gap-2"
            >
              <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
              <span className="text-primary">
                {locale === "ar" ? "الاتجاهات" : "Directions"}
              </span>
            </Link>
            {clinic.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span dir="ltr">{clinic.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="flex gap-1">
                <span>
                  {getTimeIn12HourFormat(clinic.opening_at, locale)}{" "}
                </span>
                {t("to")}
                <span >
                  {getTimeIn12HourFormat(clinic.closing_at, locale)}
                </span>
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium">
              {t("doctors")} ({doctors.length})
            </h4>

            {doctors.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {tCommon("noDoctorsFound")}
              </p>
            ) : (
              <>
                <div className="space-y-2">
                  {displayedDoctors.map((doctor) => (
                    <Button
                      key={doctor.id}
                      variant="outline"
                      className="w-full h-auto p-3 justify-start hover:cursor-pointer"
                      onClick={() => handleDoctorClick(doctor)}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={doctor.profilePic || undefined}
                            alt={doctor.name}
                          />
                          <AvatarFallback>
                            {getInitials(doctor.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`flex-1 ${locale === "ar" ? "text-right" : "text-left"}`}
                        >
                          <div className="font-medium">
                            {tGeneral("doctor")} {doctor.name}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {tFields("fees")}: {doctor.fees} {tGeneral("egp")}
                          </div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>

                {hasMoreDoctors && (
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => setShowAllDoctors(!showAllDoctors)}
                  >
                    {showAllDoctors ? (
                      <>
                        <ChevronUp className="h-4 w-4 mr-2" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4 mr-2" />
                        {t("viewAllDoctors")} ({doctors.length - 3} more)
                      </>
                    )}
                  </Button>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <AuthRequiredModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}
