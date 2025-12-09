import { useTranslations } from "next-intl";

export function Footer() {

  const t = useTranslations("");

  return (
    <footer className="w-full flex flex-col gap-3 items-center border-t bg-background/50 px-4 py-6 text-center text-muted-foreground backdrop-blur-sm">
        <p className="text-2xl font-bold bg-linear-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            MedicBridge
        </p>
        <p className="text-base">
            {t("slogan")}
        </p>
        <div className="flex gap-2 items-center text-sm">
            <p dir="ltr">
                &copy; 2025
                <a href="/" className="px-1 font-bold bg-linear-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    MedicBridge
                </a> 
            </p>
            <p>
                {t("allRightsReserved")}
            </p>
        </div>
    </footer>
  );
}