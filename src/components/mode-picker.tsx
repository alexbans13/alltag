import Link from "next/link";
import type { PracticeMode } from "@/lib/types";

const MODES: {
  mode: PracticeMode;
  title: string;
  description: string;
  requiresDialectSupport?: boolean;
}[] = [
  {
    mode: "translate",
    title: "Direct translation",
    description: "See your whole entry rewritten at your level, on demand.",
  },
  {
    mode: "guided",
    title: "Guided, sentence by sentence",
    description: "Try each sentence yourself; get corrections before moving on.",
  },
  {
    mode: "variants",
    title: "A few ways to say it",
    description: "3–4 natural phrasings per sentence, side by side.",
  },
  {
    mode: "dialect",
    title: "So sagt ma des bei uns",
    description: "See it in Austrian dialect, just for fun.",
    requiresDialectSupport: true,
  },
];

export function ModePicker({
  entryId,
  hasDialectMode,
}: {
  entryId: string;
  hasDialectMode: boolean;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {MODES.filter((m) => !m.requiresDialectSupport || hasDialectMode).map((m) => (
        <Link
          key={m.mode}
          href={`/entries/${entryId}/practice/${m.mode}`}
          className="flex flex-col gap-1 rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
        >
          <span className="text-sm font-semibold">{m.title}</span>
          <span className="text-xs text-zinc-600 dark:text-zinc-400">{m.description}</span>
        </Link>
      ))}
    </div>
  );
}
