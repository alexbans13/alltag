"use client";

import { useEffect, useState } from "react";
import { postJson } from "@/lib/api";

type VariantSentence = { original: string; variants: string[] };

export function VariantsPractice({ entryId }: { entryId: string }) {
  const [sentences, setSentences] = useState<VariantSentence[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    postJson<{ sentences: VariantSentence[] }>("/api/practice/variants", { entryId })
      .then((data) => setSentences(data.sentences))
      .catch(() => setError("Couldn't generate phrasing variants. Try again."))
      .finally(() => setLoading(false));
  }, [entryId]);

  if (loading) {
    return <p className="text-sm text-zinc-500">Generating variants…</p>;
  }
  if (error) {
    return <p className="text-sm text-red-600 dark:text-red-400">{error}</p>;
  }
  if (!sentences || sentences.length === 0) {
    return <p className="text-sm text-zinc-500">Nothing to show.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      {sentences.map((sentence, i) => (
        <div key={i} className="flex flex-col gap-2">
          <p className="text-sm text-zinc-500">{sentence.original}</p>
          <ul className="flex flex-col gap-2">
            {sentence.variants.map((variant, j) => (
              <li
                key={j}
                className="rounded-lg border border-zinc-200 bg-white p-3 text-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                {variant}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
