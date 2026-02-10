"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Phone,
  Clock,
  DollarSign,
  CreditCard,
  Edit,
  Trash2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Clinic } from "../../types/clinic.types";
import { useLanguage } from "@/contexts/LanguageProvider";
import { getTimeIn12HourFormat } from "@/lib/helpers";

interface ClinicCardPresentationalProps {
  clinic: Clinic;
  onEdit: () => void;
  onDelete: () => void;
}

export function ClinicCardPresentational({
  clinic,
  onEdit,
  onDelete,
}: ClinicCardPresentationalProps) {
  const t = useTranslations("doctorDashboard.clinics");
  const tCard = useTranslations("doctorDashboard.clinics.clinicCard");
  const tCommon = useTranslations("common");
  const { locale } = useLanguage();

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{clinic.name}</h3>
            <div className="flex gap-2 mt-2">
              <Badge variant={clinic.is_active ? "default" : "secondary"}>
                {clinic.is_active ? t("active") : t("inactive")}
              </Badge>
              {clinic.isOwner && (
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800"
                >
                  {t("owner")}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-start gap-4 text-sm">
          <MapPin
            className={`h-4 w-4 ${locale === "en" ? "mt-0.5" : "mt-1"} text-muted-foreground shrink-0`}
          />
          <div className="flex-1">
            <p className="text-muted-foreground">{tCard("address")}</p>
            <p className="font-medium">{clinic.address}</p>
          </div>
        </div>

        <div className="flex items-start gap-4 text-sm">
          <Phone
            className={`h-4 w-4 ${locale === "en" ? "mt-0.5" : "mt-1"} text-muted-foreground shrink-0`}
          />
          <div className="flex-1">
            <p className="text-muted-foreground">{tCard("phone")}</p>
            <p className="font-medium">{clinic.phone}</p>
          </div>
        </div>

        <div className="flex items-start gap-4 text-sm">
          <Clock
            className={`h-4 w-4 ${locale === "en" ? "mt-0.5" : "mt-1"} text-muted-foreground shrink-0`}
          />
          <div className="flex-1">
            <p className="text-muted-foreground">{tCard("hours")}</p>
            <p className="font-medium">
              <span dir="ltr">
                {getTimeIn12HourFormat(clinic.opening_at)}
              </span>
              {" - "}
              <span dir="ltr">
                {getTimeIn12HourFormat(clinic.closing_at)}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 text-sm">
          <DollarSign
            className={`h-4 w-4 ${locale === "en" ? "mt-0.5" : "mt-1"} text-muted-foreground shrink-0`}
          />
          <div className="flex-1">
            <p className="text-muted-foreground">{tCard("fees")}</p>
            <p className="font-medium">
              {clinic.fees}
              <span>{locale === "en" ? "EGP" : " جنيه"}</span>
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 text-sm">
          <CreditCard
            className={`h-4 w-4 ${locale === "en" ? "mt-0.5" : "mt-1"} text-muted-foreground shrink-0`}
          />
          <div className="flex-1">
            <p className="text-muted-foreground">{tCard("onlinePayment")}</p>
            <p className="font-medium">
              {clinic.canPayOnline ? tCard("enabled") : tCard("disabled")}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-4 pt-3 border-t">
        <Button onClick={onEdit} variant="outline" size="sm" className="flex-1">
          <Edit className="h-4 w-4 mr-2" />
          {clinic.isOwner ? tCommon("edit") : tCard("editFees")}
        </Button>
        {clinic.isOwner && (
          <Button
            onClick={onDelete}
            variant="destructive"
            size="sm"
            className="flex-1"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {tCommon("delete")}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
