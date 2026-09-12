"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isCefrLevel } from "@/lib/levels";
import { isLanguageCode } from "@/lib/languages";
import { setUserLanguageLevel } from "@/lib/user-level";

export type UpdateLevelState = {
  error?: string;
  saved?: boolean;
};

export async function updateLevelAction(
  _prevState: UpdateLevelState,
  formData: FormData,
): Promise<UpdateLevelState> {
  const language = String(formData.get("language") ?? "");
  const level = String(formData.get("level") ?? "");

  if (!isLanguageCode(language) || !isCefrLevel(level)) {
    return { error: "Invalid language or level." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  await setUserLanguageLevel(user.id, language, level);
  revalidatePath("/settings");
  revalidatePath("/entries/new");

  return { saved: true };
}
