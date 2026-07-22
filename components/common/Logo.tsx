"use client";

import LogoImgLight from "@/assets/logoLight.png";
import LogoImgDark from "@/assets/logoDark.png";
import Image from "next/image";
import { useTheme } from "@/contexts/ThemeProvider";

interface LogoProps {
    size?: number;
}

export default function Logo({ size = 40 }: LogoProps) {

    const { theme } = useTheme();
    const LogoImg = theme === "dark" ? LogoImgDark : LogoImgLight;
  return (
    <div>
      <Image src={LogoImg.src} alt="HoloCura Logo"  height={size} width={size} />
    </div>
  );
}