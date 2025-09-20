const MASTER = {
  PROPUCCA: {
    LOGO: "/propucca/logo.jpg",
    API_URL: "http://localhost:8000",
    ASSETS_PREFIX: "https://d3qxgh6bzrp5u9.cloudfront.net",

    THEME: "forestWhisper",

    CURRENCY: {
      NAME: "DOLLAR",
      SYMBOL: "$",
    },

    COUNTRY: "India",

    LOGIN: {
      BG: "/propucca/login-bg.jpg",
      TITLE: "PROPUCCA",
    },

    FAVICON: {
      IMAGE: "/propucca/logo.jpg",
      TITLE: "CAN",
    },

    DISABLED_FEATURES: [],
  },
};

export const CONFIG = process.env.NEXT_PUBLIC_CLIENT
  ? // @ts-ignore
    MASTER[process.env.NEXT_PUBLIC_CLIENT]
  : MASTER["PROPUCCA"];
