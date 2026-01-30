"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Shield, Calendar } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageProvider";

export function HeroSection() {
  const { locale } = useLanguage();  
  const t = useTranslations("home");

  return (
    <section className="relative overflow-hidden bg-linear-to-br from-primary/5 via-background to-secondary/5 py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Shield className="h-4 w-4" />
            <span>{t("hero.badge")}</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl">
            <span>
                {t("hero.titleSub1")}
            </span>
            <br />
            <span className="bg-linear-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                {t("hero.titleSub2")}
            </span>
          </h1>

          <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl">
            {t("hero.description")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button size="lg" className="text-base group" asChild>
              <Link href="/register">
                <Calendar className="mr-2 h-5 w-5 group-hover:-translate-y-1 transition-transform duration-300 ease-in-out" />
                {t("hero.bookAppointment")}
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-base group" asChild>
              <Link href="/join/doctor">
                {t("hero.joinAsDoctor")}
                {locale === "ar" ? <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300 ease-in-out" /> 
                : <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300 ease-in-out" />}
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t w-full max-w-3xl">
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-primary">
                50+
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {t("hero.stats.doctors")}
              </div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-primary">
                500+
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {t("hero.stats.patients")}
              </div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-primary">
                1000+
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {t("hero.stats.appointments")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
