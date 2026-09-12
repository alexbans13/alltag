import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserLanguageLevel } from "@/lib/user-level";
import { LANGUAGES } from "@/lib/languages";
import { LevelForm } from "@/components/level-form";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const levels = await Promise.all(
    LANGUAGES.map(async (language) => ({
      language,
      level: await getUserLanguageLevel(user.id, language.code),
    })),
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Settings</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Set your self-reported CEFR level per language. This is used as the default for
          new entries and for practice modes.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        {levels.map(({ language, level }) => (
          <LevelForm
            key={language.code}
            languageCode={language.code}
            languageLabel={language.label}
            currentLevel={level}
          />
        ))}
      </div>
    </div>
  );
}
