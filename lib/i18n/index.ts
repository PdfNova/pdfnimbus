import { en } from "./en";
import { es } from "./es";

export type Language = "en" | "es";
export type TranslationKey = keyof typeof en;

export const dictionaries = {
  en,
  es
} as const;
