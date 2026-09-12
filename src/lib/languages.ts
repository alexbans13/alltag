export type LanguageCode = "de";

export const LANGUAGES: { code: LanguageCode; label: string; hasDialectMode: boolean }[] = [
  { code: "de", label: "German", hasDialectMode: true },
];

export function isLanguageCode(value: string): value is LanguageCode {
  return LANGUAGES.some((language) => language.code === value);
}

export function languageLabel(code: string): string {
  return LANGUAGES.find((language) => language.code === code)?.label ?? code;
}

export const DEFAULT_LANGUAGE: LanguageCode = "de";
