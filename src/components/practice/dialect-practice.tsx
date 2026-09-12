"use client";

import { useEffect, useState } from "react";
import { postJson } from "@/lib/api";

type DialectResponse = { standard: string; dialect: string };

export function DialectPractice({ entryId }: { entryId: string }) {
  const [result, setResult] = useState<DialectResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    postJson<DialectResponse>("/api/practice/dialect", { entryId })
      .then(setResult)
      .catch(() => setError("Hob's ned hig'rennt — try again."))
      .finally(() => setLoading(false));
  }, [entryId]);

  if (loading) {
    return <p className="text-sm text-zinc-500">Moment, i schau grod nach…</p>;
  }
  if (error) {
    return <p className="text-sm text-red-600 dark:text-red-400">{error}</p>;
  }
  if (!result) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="mb-2 text-xs uppercase tracking-wide text-zinc-500">So sagt ma des bei uns</p>
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{result.dialect}</p>
      </div>
      <div className="rounded-lg border border-dashed border-zinc-300 p-4 dark:border-zinc-700">
        <p className="mb-2 text-xs uppercase tracking-wide text-zinc-500">Hochdeutsch, zum Vergleich</p>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {result.standard}
        </p>
      </div>
    </div>
  );
}
