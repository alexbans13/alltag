import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { languageLabel } from "@/lib/languages";
import type { Entry } from "@/lib/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function preview(text: string, maxLength = 140) {
  const trimmed = text.trim().replace(/\s+/g, " ");
  return trimmed.length > maxLength ? `${trimmed.slice(0, maxLength)}…` : trimmed;
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: entries } = await supabase
    .from("entries")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<Entry[]>();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-start gap-4 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div>
          <h1 className="text-xl font-semibold">Write today&apos;s entry</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Write about your day, then practice saying it in your target language.
          </p>
        </div>
        <Link
          href="/entries/new"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Write today&apos;s entry
        </Link>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Past entries
        </h2>
        {!entries || entries.length === 0 ? (
          <p className="rounded-lg border border-dashed border-zinc-300 p-6 text-sm text-zinc-500 dark:border-zinc-700">
            No entries yet — write your first one above.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {entries.map((entry) => (
              <li key={entry.id}>
                <Link
                  href={`/entries/${entry.id}`}
                  className="block rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
                >
                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <span>{formatDate(entry.created_at)}</span>
                    <span>
                      {languageLabel(entry.target_language)} · {entry.level}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-zinc-800 dark:text-zinc-200">
                    {preview(entry.text)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
