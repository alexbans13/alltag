import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserLanguageLevel } from "@/lib/user-level";
import { DEFAULT_LANGUAGE } from "@/lib/languages";
import { EntryForm } from "@/components/entry-form";

export default async function NewEntryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const defaultLevel = await getUserLanguageLevel(user.id, DEFAULT_LANGUAGE);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold">Today&apos;s entry</h1>
      <EntryForm defaultLanguage={DEFAULT_LANGUAGE} defaultLevel={defaultLevel} />
    </div>
  );
}
