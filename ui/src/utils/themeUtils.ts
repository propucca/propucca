import { CONFIG } from "@/config";

export const getThemeStyles = (themeName: string) => {
  const themes = {
    elegantMinimalist: {
      "--primaryColor": "#6D8EA0",
      "--secondaryColor": "#D4A373",
      "--bgColor": "#F9FAFB",
      "--textColor": "#333333",
      "--h3Color": "#b01527",
      "--lightPrimary": "#E0F7FA",
      "--lightSecondary": "#B2EBF2",
      "--darkPrimary": "#00796B",
      "--darkSecondary": "#004D40",
      "--darkLoginFromColor": "#2196F3",
      "--darkLoginToColor": "#4CAF50",
      "--darkLoginFromColorHover": "#1E88E5",
      "--darkLoginToColorHover": "#43A047",
      "--linkColor": "#4299e1",
      "--textGray": "#757575",
      "--textLightGreen": "#43A047",
      "--textDarkGreen": "#388E3C",
    },
    vibrantSunset: {
      "--primaryColor": "#FF4500",
      "--secondaryColor": "#FFD700",
      "--bgColor": "#FFF5EE",
      "--textColor": "#2F4F4F",
      "--h3Color": "#FF6347",
      "--lightPrimary": "#FFE4B5",
      "--lightSecondary": "#FFDAB9",
      "--darkPrimary": "#8B0000",
      "--darkSecondary": "#B22222",
      "--darkLoginFromColor": "#FF8C00",
      "--darkLoginToColor": "#FFA500",
      "--darkLoginFromColorHover": "#FF7F50",
      "--darkLoginToColorHover": "#FF4500",
      "--linkColor": "#FF69B4",
      "--textGray": "#696969",
      "--textLightGreen": "#32CD32",
      "--textDarkGreen": "#006400",
    },
    oceanBreeze: {
      "--primaryColor": "#00CED1",
      "--secondaryColor": "#20B2AA",
      "--bgColor": "#E0FFFF",
      "--textColor": "#2F4F4F",
      "--h3Color": "#4682B4",
      "--lightPrimary": "#AFEEEE",
      "--lightSecondary": "#B0E0E6",
      "--darkPrimary": "#008B8B",
      "--darkSecondary": "#5F9EA0",
      "--darkLoginFromColor": "#00BFFF",
      "--darkLoginToColor": "#1E90FF",
      "--darkLoginFromColorHover": "#00CED1",
      "--darkLoginToColorHover": "#4682B4",
      "--linkColor": "#5F9EA0",
      "--textGray": "#708090",
      "--textLightGreen": "#66CDAA",
      "--textDarkGreen": "#2E8B57",
    },
    forestWhisper: {
      "--primaryColor": "#228B22",
      "--secondaryColor": "#32CD32",
      "--bgColor": "#F0FFF0",
      "--textColor": "#2E8B57",
      "--h3Color": "#006400",
      "--lightPrimary": "#98FB98",
      "--lightSecondary": "#90EE90",
      "--darkPrimary": "#006400",
      "--darkSecondary": "#228B22",
      "--darkLoginFromColor": "#2E8B57",
      "--darkLoginToColor": "#3CB371",
      "--darkLoginFromColorHover": "#2E8B57",
      "--darkLoginToColorHover": "#3CB371",
      "--linkColor": "#228B22",
      "--textGray": "#556B2F",
      "--textLightGreen": "#8FBC8F",
      "--textDarkGreen": "#006400",
    },
    desertDusk: {
      "--primaryColor": "#DAA520",
      "--secondaryColor": "#CD853F",
      "--bgColor": "#FFF8DC",
      "--textColor": "#8B4513",
      "--h3Color": "#A0522D",
      "--lightPrimary": "#FFD700",
      "--lightSecondary": "#FFA07A",
      "--darkPrimary": "#8B4513",
      "--darkSecondary": "#A0522D",
      "--darkLoginFromColor": "#D2691E",
      "--darkLoginToColor": "#FF8C00",
      "--darkLoginFromColorHover": "#D2691E",
      "--darkLoginToColorHover": "#FF8C00",
      "--linkColor": "#CD853F",
      "--textGray": "#8B4513",
      "--textLightGreen": "#DEB887",
      "--textDarkGreen": "#A0522D",
    },
    southIndianDelight: {
      "--primaryColor": "#FBC02D",
      "--secondaryColor": "#8BC34A",
      "--bgColor": "#FFFDE7",
      "--textColor": "#424242",
      "--h3Color": "#D32F2F",
      "--lightPrimary": "#FFF59D",
      "--lightSecondary": "#DCEDC8",
      "--darkPrimary": "#F57F17",
      "--darkSecondary": "#558B2F",
      "--darkLoginFromColor": "#F9A825",
      "--darkLoginToColor": "#7CB342",
      "--darkLoginFromColorHover": "#F57F17",
      "--darkLoginToColorHover": "#558B2F",
      "--linkColor": "#FF7043",
      "--textGray": "#757575",
      "--textLightGreen": "#AED581",
      "--textDarkGreen": "#388E3C",
    },
  };

  return themes[themeName as keyof typeof themes] || themes.elegantMinimalist;
};

export const applyTheme = (themeName: string) => {
  const styles = getThemeStyles(themeName);
  const root = document.documentElement;

  Object.entries(styles).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });

  // Also apply to body for additional compatibility
  const body = document.body;
  Object.entries(styles).forEach(([property, value]) => {
    body.style.setProperty(property, value);
  });
};

export const getCurrentTheme = () => {
  return CONFIG?.THEME || "forestWhisper";
};
