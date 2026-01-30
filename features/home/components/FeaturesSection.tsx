"use client";

import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  Video,
  Shield,
  Clock,
  FolderOpen,
  Bell,
  Activity,
  Bot,
  FileText,
  AlertTriangle,
} from "lucide-react";

export function FeaturesSection() {
  const t = useTranslations("home.features");

  const patientFeatures = [
    {
      icon: Calendar,
      key: "offlineAppointments",
    },
    {
      icon: Video,
      key: "onlineAppointments",
    },
    {
      icon: Clock,
      key: "queueTracker",
    },
    {
      icon: FolderOpen,
      key: "userPortal",
    },
    {
      icon: Bell,
      key: "medicineAlerts",
    },
    {
      icon: Activity,
      key: "dailyTracking",
    },
  ];

  const doctorFeatures = [
    {
      icon: FileText,
      key: "aiSummary",
      badge: t("aiPowered"),
    },
    {
      icon: AlertTriangle,
      key: "drugConflict",
    },
    {
      icon: Bot,
      key: "chatbot",
    },
  ];

  return (
    <section className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 lg:max-w-7xl lg:px-0">
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Shield className="h-4 w-4" />
            <span>{t("blockchainBadge")}</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            {t("blockchainTitle")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("blockchainDescription")}
          </p>
        </div>

        <div className="mb-16 lg:mb-32">
          <h3 className="text-2xl lg:text-3xl font-bold mb-8 text-center">
            {t("patientFeatures")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patientFeatures.map((feature) => {
              const Icon = feature.icon;
              return (  
                <Card
                  key={feature.key}
                  className="hover:scale-105 transition-all duration-500 ease-in-out hover:border-primary"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <CardTitle>{t(`${feature.key}.title`)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {t(`${feature.key}.description`)}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-2xl lg:text-3xl font-bold mb-8 text-center">
            {t("doctorFeatures")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctorFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.key}
                  className="hover:scale-105 transition-all duration-500 ease-in-out hover:border-primary"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <CardTitle>{t(`${feature.key}.title`)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {t(`${feature.key}.description`)}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
