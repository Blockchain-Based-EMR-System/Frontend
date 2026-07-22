"use client";

import { useState, useEffect } from "react";

export const useBreakPoints = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false); 

  useEffect(() => {
        const updateBreakpoints = () => {
            const width = window.innerWidth;
            setIsMobile(width < 640);
            setIsTablet(width >= 640 && width < 1024);
            setIsDesktop(width >= 1024);
        }
        updateBreakpoints();
        window.addEventListener('resize', updateBreakpoints);
        return () => window.removeEventListener('resize', updateBreakpoints);
    }, []);

    return { isMobile, isTablet, isDesktop }
};