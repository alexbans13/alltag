import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { languageLabel, LANGUAGES } from "@/lib/languages";
import { ModePicker } from "@/components/mode-picker";
import type { Entry } from "@/lib/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function EntryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: entry } = await supabase
    .from("entries")
    .select("*")
    .eq("id", id)
    .maybeSingle<Entry>();

  if (!entry) {
    notFound();
  }

  const hasDialectMode =
    LANGUAGES.find((l) => l.code === entry.target_language)?.hasDialectMode ?? false;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <span>{formatDate(entry.created_at)}</span>
          <span>
            {languageLabel(entry.target_language)} · {entry.level}
          </span>
        </div>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
          {entry.text}
        </p>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Practice this entry
        </h2>
        <ModePicker entryId={entry.id} hasDialectMode={hasDialectMode} />
      </div>
    </div>
  );
}
