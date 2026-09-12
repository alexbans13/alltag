import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Entry, PracticeMode } from "@/lib/types";
import { LANGUAGES } from "@/lib/languages";
import { TranslatePractice } from "@/components/practice/translate-practice";
import { GuidedPractice } from "@/components/practice/guided-practice";
import { VariantsPractice } from "@/components/practice/variants-practice";
import { DialectPractice } from "@/components/practice/dialect-practice";

const MODE_TITLES: Record<PracticeMode, string> = {
  translate: "Direct translation",
  guided: "Guided, sentence by sentence",
  variants: "A few ways to say it",
  dialect: "So sagt ma des bei uns",
};

function isPracticeMode(value: string): value is PracticeMode {
  return value in MODE_TITLES;
}

export default async function PracticePage({
  params,
}: {
  params: Promise<{ id: string; mode: string }>;
}) {
  const { id, mode } = await params;

  if (!isPracticeMode(mode)) {
    notFound();
  }

  const supabase = await createClient();
  const { data: entry } = await supabase
    .from("entries")
    .select("*")
    .eq("id", id)
    .maybeSingle<Entry>();

  if (!entry) {
    notFound();
  }

  if (mode === "dialect") {
    const hasDialectMode =
      LANGUAGES.find((l) => l.code === entry.target_language)?.hasDialectMode ?? false;
    if (!hasDialectMode) {
      notFound();
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href={`/entries/${entry.id}`} className="text-sm text-zinc-500 hover:underline">
          ← Back to entry
        </Link>
        <h1 className="mt-2 text-xl font-semibold">{MODE_TITLES[mode]}</h1>
      </div>

      {mode === "translate" ? (
        <TranslatePractice entryId={entry.id} />
      ) : mode === "guided" ? (
        <GuidedPractice entryId={entry.id} />
      ) : mode === "variants" ? (
        <VariantsPractice entryId={entry.id} />
      ) : (
        <DialectPractice entryId={entry.id} />
      )}
    </div>
  );
}
