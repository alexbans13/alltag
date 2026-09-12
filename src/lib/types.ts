import type { CefrLevel } from "@/lib/levels";
import type { LanguageCode } from "@/lib/languages";

export type Entry = {
  id: string;
  user_id: string;
  text: string;
  target_language: LanguageCode;
  level: CefrLevel;
  created_at: string;
};

export type PracticeMode = "translate" | "guided" | "variants" | "dialect";
