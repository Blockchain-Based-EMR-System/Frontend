"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageProvider";

export function CTASection() {
  const { locale } = useLanguage();
  const t = useTranslations("home.cta");

  return (
    <section className="py-20 lg:py-32 lg:max-w-7xl mx-auto">
      <div className="container mx-auto px-4 lg:px-0">
        <Card className="relative overflow-hidden bg-linear-to-br from-primary/10 via-primary/5 to-secondary/10 border-primary/20">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
            <div className="absolute top-10 right-10 w-32 h-32 bg-primary rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-32 w-40 h-40 bg-secondary rounded-full blur-3xl" />
          </div>

          <div className="relative p-12 lg:p-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              <span>{t("badge")}</span>
            </div>

            <h2 className="text-3xl lg:text-5xl font-bold mb-4 max-w-3xl mx-auto">
              {t("title")}
            </h2>

            <p className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t("description")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-base group" asChild>
                <Link href="/register">
                  {t("getStarted")}
                  {locale === "ar" ? <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300 ease-in-out" /> 
                                    : <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300 ease-in-out" />}
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base" asChild>
                <Link href="/login">{t("signIn")}</Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
