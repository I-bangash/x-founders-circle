import { enUS, frFR } from "@clerk/localizations";
import type { LocalizationResource } from "@clerk/types";
import type { LocalePrefixMode } from "next-intl/routing";

export const AppConfig = {
  name: "Remarkable.sh",
  locales: ["en", "fr"],
  defaultLocale: "en",
  localePrefix: "as-needed" as LocalePrefixMode,
};

const supportedLocales: Record<string, LocalizationResource> = {
  en: enUS,
  fr: frFR,
};

export const ClerkLocalizations = {
  defaultLocale: enUS,
  supportedLocales,
};
