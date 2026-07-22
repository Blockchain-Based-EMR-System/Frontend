"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, Search, Calendar, Stethoscope } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageProvider";

export function HowItWorksSection() {
  const { locale } = useLanguage();
  const t = useTranslations("home.howItWorks");

  const steps = [
    {
      icon: UserPlus,
      key: "step1",
      number: "01",
    },
    {
      icon: Search,
      key: "step2",
      number: "02",
    },
    {
      icon: Calendar,
      key: "step3",
      number: "03",
    },
    {
      icon: Stethoscope,
      key: "step4",
      number: "04",
    },
  ];

  return (
    <section className="py-20 lg:py-32 lg:max-w-7xl lg:mx-auto">
      <div className="container mx-auto px-4 lg:px-0">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">{t("title")}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            return (
              <div key={step.key} className="relative">
                {index < steps.length - 1 && (
                  <div className={`hidden lg:block absolute top-16  w-[80%] h-0.5 bg-linear-to-r from-primary/50 to-primary/20 ${locale === "ar" ? "right-[60%]" : "left-[60%]"}`} />
                )}

                <Card className="text-center transition-all hover:scale-105 duration-300 ease-in-out border-transparent hover:border-primary">
                  <CardContent className="pt-6 pb-6">
                    <div className="relative inline-flex items-center justify-center">
                      <div className="text-7xl font-bold text-primary mb-5">
                        {step.number}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {t(`${step.key}.title`)}
                    </h3>
                    <p className="text-muted-foreground">
                      {t(`${step.key}.description`)}
                    </p>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
