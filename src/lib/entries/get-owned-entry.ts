import { createClient } from "@/lib/supabase/server";
import type { Entry } from "@/lib/types";

export async function getOwnedEntry(
  entryId: string,
): Promise<{ entry: Entry } | { error: "unauthorized" | "not_found" }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "unauthorized" };
  }

  const { data: entry } = await supabase
    .from("entries")
    .select("*")
    .eq("id", entryId)
    .eq("user_id", user.id)
    .maybeSingle<Entry>();

  if (!entry) {
    return { error: "not_found" };
  }

  return { entry };
}
