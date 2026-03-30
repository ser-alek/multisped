import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["mk", "en"],
  defaultLocale: "mk",
  localeDetection: false,
});
