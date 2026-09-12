"use client";

import { useEffect, useState } from "react";
import { postJson } from "@/lib/api";
import type { CefrLevel } from "@/lib/levels";

type TranslateResponse = { translation: string; level: CefrLevel };

export function TranslatePractice({ entryId }: { entryId: string }) {
  const [levelUp, setLevelUp] = useState(false);
  const [result, setResult] = useState<TranslateResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function fetchTranslation(useLevelUp: boolean) {
    setLoading(true);
    setError(null);
    postJson<TranslateResponse>("/api/practice/translate", {
      entryId,
      levelUp: useLevelUp,
    })
      .then(setResult)
      .catch(() => setError("Couldn't generate a translation. Try again."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    postJson<TranslateResponse>("/api/practice/translate", { entryId, levelUp: false })
      .then(setResult)
      .catch(() => setError("Couldn't generate a translation. Try again."))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={levelUp}
            onChange={(e) => {
              setLevelUp(e.target.checked);
              fetchTranslation(e.target.checked);
            }}
          />
          Preview at the next level up
        </label>
        <button
          type="button"
          onClick={() => fetchTranslation(levelUp)}
          disabled={loading}
          className="text-zinc-600 underline hover:text-zinc-900 disabled:opacity-50 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          Regenerate
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-zinc-500">Generating…</p>
      ) : error ? (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : result ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="mb-2 text-xs uppercase tracking-wide text-zinc-500">
            Level {result.level}
          </p>
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{result.translation}</p>
        </div>
      ) : null}
    </div>
  );
}
