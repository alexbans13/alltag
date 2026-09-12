"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isCefrLevel } from "@/lib/levels";
import { isLanguageCode, DEFAULT_LANGUAGE } from "@/lib/languages";
import { setUserLanguageLevel } from "@/lib/user-level";

export type CreateEntryState = {
  error?: string;
};

export async function createEntryAction(
  _prevState: CreateEntryState,
  formData: FormData,
): Promise<CreateEntryState> {
  const text = String(formData.get("text") ?? "").trim();
  const targetLanguageRaw = String(formData.get("target_language") ?? DEFAULT_LANGUAGE);
  const levelRaw = String(formData.get("level") ?? "");

  if (!text) {
    return { error: "Write something before saving." };
  }
  if (!isLanguageCode(targetLanguageRaw)) {
    return { error: "Unsupported target language." };
  }
  if (!isCefrLevel(levelRaw)) {
    return { error: "Choose a valid CEFR level." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const { data: entry, error } = await supabase
    .from("entries")
    .insert({
      user_id: user.id,
      text,
      target_language: targetLanguageRaw,
      level: levelRaw,
    })
    .select("id")
    .single();

  if (error || !entry) {
    return { error: error?.message ?? "Could not save entry." };
  }

  await setUserLanguageLevel(user.id, targetLanguageRaw, levelRaw);

  revalidatePath("/dashboard");
  redirect(`/entries/${entry.id}`);
}
