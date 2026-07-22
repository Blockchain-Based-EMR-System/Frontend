import { useTranslations } from "next-intl";
import Logo from "../common/Logo";
import Link from "next/link";

export function Footer() {

  const tCommon = useTranslations("common");

  return (
    <footer className="w-full flex flex-col gap-3 items-center border-t bg-background/50 px-4 py-6 text-center text-muted-foreground backdrop-blur-sm">
        <Link href={"/"} className="hover:opacity-70 transition-all duration-300 ease-in-out">
            <Logo size={100} />
        </Link>
        <p className="text-base">
            {tCommon("slogan")}
        </p>
        <div className="flex gap-2 items-center text-sm">
            <p>
                {tCommon("allRightsReserved")}
            </p>
        </div>
    </footer>
  );
}