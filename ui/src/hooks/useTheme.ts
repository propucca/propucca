import { useEffect } from "react";
import { CONFIG } from "@/config";
import { applyTheme, getCurrentTheme } from "@/utils/themeUtils";

export const useTheme = () => {
  useEffect(() => {
    // Apply theme using CSS custom properties
    const themeName = getCurrentTheme();
    applyTheme(themeName);

    // Also apply theme class for CSS-based approach
    const themeClass = CONFIG.THEME;

    // Remove any existing theme classes
    document.body.className = document.body.className
      .split(" ")
      .filter(
        (cls) =>
          ![
            "elegantMinimalist",
            "vibrantSunset",
            "oceanBreeze",
            "forestWhisper",
            "desertDusk",
            "southIndianDelight",
          ].includes(cls),
      )
      .join(" ");

    // Add the current theme class
    if (themeClass) {
      document.body.classList.add(themeClass);
    }
  }, []);

  return {
    currentTheme: CONFIG.THEME,
    setTheme: (theme: string) => {
      // Apply theme using CSS custom properties
      applyTheme(theme);

      // Remove existing theme classes
      document.body.className = document.body.className
        .split(" ")
        .filter(
          (cls) =>
            ![
              "elegantMinimalist",
              "vibrantSunset",
              "oceanBreeze",
              "forestWhisper",
              "desertDusk",
              "southIndianDelight",
            ].includes(cls),
        )
        .join(" ");

      // Add new theme class
      document.body.classList.add(theme);
    },
  };
};
