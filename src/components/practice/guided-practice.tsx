"use client";

import { useEffect, useState } from "react";
import { postJson } from "@/lib/api";

type Feedback = { isGoodEnough: boolean; feedback: string; correctedVersion: string };

export function GuidedPractice({ entryId }: { entryId: string }) {
  const [sentences, setSentences] = useState<string[] | null>(null);
  const [index, setIndex] = useState(0);
  const [attempt, setAttempt] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    postJson<{ sentences: string[] }>("/api/practice/guided/sentences", { entryId })
      .then((data) => setSentences(data.sentences))
      .catch(() => setError("Couldn't load this entry's sentences. Try again."))
      .finally(() => setLoading(false));
  }, [entryId]);

  async function submitAttempt() {
    if (!sentences || !attempt.trim()) return;
    setChecking(true);
    setError(null);
    try {
      const data = await postJson<Feedback>("/api/practice/guided/check", {
        entryId,
        sourceSentence: sentences[index],
        userAttempt: attempt,
      });
      setFeedback(data);
    } catch {
      setError("Couldn't check your attempt. Try again.");
    } finally {
      setChecking(false);
    }
  }

  function nextSentence() {
    setIndex((i) => i + 1);
    setAttempt("");
    setFeedback(null);
  }

  if (loading) {
    return <p className="text-sm text-zinc-500">Loading sentences…</p>;
  }
  if (error && !sentences) {
    return <p className="text-sm text-red-600 dark:text-red-400">{error}</p>;
  }
  if (!sentences || sentences.length === 0) {
    return <p className="text-sm text-zinc-500">No sentences to practice.</p>;
  }

  if (index >= sentences.length) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">
        Nice work — you made it through all {sentences.length} sentences.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs uppercase tracking-wide text-zinc-500">
        Sentence {index + 1} of {sentences.length}
      </p>
      <div className="rounded-lg border border-zinc-200 bg-white p-4 text-sm dark:border-zinc-800 dark:bg-zinc-900">
        {sentences[index]}
      </div>

      <textarea
        value={attempt}
        onChange={(e) => setAttempt(e.target.value)}
        rows={3}
        placeholder="Your attempt in the target language…"
        disabled={checking}
        className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
      />

      {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}

      {!feedback ? (
        <button
          type="button"
          onClick={submitAttempt}
          disabled={checking || !attempt.trim()}
          className="self-start rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {checking ? "Checking…" : "Check my attempt"}
        </button>
      ) : (
        <div className="flex flex-col gap-3">
          <div
            className={`rounded-lg border p-4 text-sm ${
              feedback.isGoodEnough
                ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200"
                : "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200"
            }`}
          >
            <p>{feedback.feedback}</p>
            <p className="mt-2 text-xs uppercase tracking-wide opacity-70">A natural version</p>
            <p className="mt-1">{feedback.correctedVersion}</p>
          </div>
          <div className="flex gap-3">
            {!feedback.isGoodEnough ? (
              <button
                type="button"
                onClick={() => setFeedback(null)}
                className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium dark:border-zinc-700"
              >
                Try again
              </button>
            ) : null}
            <button
              type="button"
              onClick={nextSentence}
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {index + 1 >= sentences.length ? "Finish" : "Next sentence"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
