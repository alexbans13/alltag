import { createClient } from "@/lib/supabase/server";
import { isCefrLevel, type CefrLevel } from "@/lib/levels";
import type { LanguageCode } from "@/lib/languages";

const DEFAULT_LEVEL: CefrLevel = "B1";

export async function getUserLanguageLevel(
  userId: string,
  language: LanguageCode,
): Promise<CefrLevel> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("user_language_levels")
    .select("level")
    .eq("user_id", userId)
    .eq("language", language)
    .maybeSingle();

  if (data && isCefrLevel(data.level)) {
    return data.level;
  }

  return DEFAULT_LEVEL;
}

export async function setUserLanguageLevel(
  userId: string,
  language: LanguageCode,
  level: CefrLevel,
) {
  const supabase = await createClient();
  await supabase
    .from("user_language_levels")
    .upsert(
      { user_id: userId, language, level, updated_at: new Date().toISOString() },
      { onConflict: "user_id,language" },
    );
}
