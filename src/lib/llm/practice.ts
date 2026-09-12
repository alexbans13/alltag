import { getAnthropicClient, LLM_MODEL, textFromMessage, extractJson } from "@/lib/llm/client";
import { levelDescription, type CefrLevel } from "@/lib/levels";
import { languageLabel, type LanguageCode } from "@/lib/languages";

const JSON_ONLY_INSTRUCTION =
  "Respond with ONLY raw JSON matching the schema below - no markdown code fences, no commentary before or after.";

export async function generateDirectTranslation({
  text,
  targetLanguage,
  level,
}: {
  text: string;
  targetLanguage: LanguageCode;
  level: CefrLevel;
}): Promise<{ translation: string }> {
  const client = getAnthropicClient();
  const langLabel = languageLabel(targetLanguage);

  const message = await client.messages.create({
    model: LLM_MODEL,
    max_tokens: 4096,
    system:
      `You are a ${langLabel} language tutor helping a learner practice by translating their own journal entries.\n` +
      `Rewrite the user's journal entry in ${langLabel}, calibrated to CEFR level ${level} (${levelDescription(level)}).\n` +
      `Keep the meaning, tone, and personal voice of the original. Use natural, idiomatic ${langLabel} that a real speaker at that level would produce - not a stiff literal translation.\n` +
      `${JSON_ONLY_INSTRUCTION}\nSchema: {"translation": string}`,
    messages: [{ role: "user", content: text }],
  });

  return extractJson(textFromMessage(message));
}

export async function splitIntoSentences({
  text,
}: {
  text: string;
}): Promise<{ sentences: string[] }> {
  const client = getAnthropicClient();

  const message = await client.messages.create({
    model: LLM_MODEL,
    max_tokens: 4096,
    system:
      "Split the user's text into a natural sequence of sentences (or short clauses for run-on sentences), preserving the original language and wording exactly - do not translate, correct, or alter the text.\n" +
      `${JSON_ONLY_INSTRUCTION}\nSchema: {"sentences": string[]}`,
    messages: [{ role: "user", content: text }],
  });

  return extractJson(textFromMessage(message));
}

export async function checkGuidedAttempt({
  sourceSentence,
  userAttempt,
  targetLanguage,
  level,
}: {
  sourceSentence: string;
  userAttempt: string;
  targetLanguage: LanguageCode;
  level: CefrLevel;
}): Promise<{ isGoodEnough: boolean; feedback: string; correctedVersion: string }> {
  const client = getAnthropicClient();
  const langLabel = languageLabel(targetLanguage);

  const message = await client.messages.create({
    model: LLM_MODEL,
    max_tokens: 2048,
    system:
      `You are a supportive ${langLabel} tutor for a learner at CEFR level ${level} (${levelDescription(level)}).\n` +
      `The learner is trying to express one sentence from their journal in ${langLabel}. You will get the original sentence (in the learner's native language) and their attempt in ${langLabel}.\n` +
      "Judge whether the attempt successfully communicates the meaning at a level appropriate for the learner - minor grammar slips that don't obscure meaning can still count as good enough. Give brief, encouraging, specific feedback (1-3 sentences) and always provide a natural corrected/model version in the target language.\n" +
      `${JSON_ONLY_INSTRUCTION}\nSchema: {"isGoodEnough": boolean, "feedback": string, "correctedVersion": string}`,
    messages: [
      {
        role: "user",
        content: `Original sentence: ${sourceSentence}\n\nLearner's ${langLabel} attempt: ${userAttempt}`,
      },
    ],
  });

  return extractJson(textFromMessage(message));
}

export async function generateVariants({
  text,
  targetLanguage,
  level,
}: {
  text: string;
  targetLanguage: LanguageCode;
  level: CefrLevel;
}): Promise<{ sentences: { original: string; variants: string[] }[] }> {
  const client = getAnthropicClient();
  const langLabel = languageLabel(targetLanguage);

  const message = await client.messages.create({
    model: LLM_MODEL,
    max_tokens: 4096,
    system:
      `You are a ${langLabel} tutor. For each sentence in the user's journal entry, provide 3-4 natural ${langLabel} phrasings of that sentence at CEFR level ${level} (${levelDescription(level)}).\n` +
      "Frame the variants as stylistic or nuance differences (e.g. more formal vs. casual, different word choice, different sentence structure) rather than right-vs-wrong options - all variants should be correct and natural.\n" +
      `${JSON_ONLY_INSTRUCTION}\nSchema: {"sentences": [{"original": string, "variants": string[]}]}`,
    messages: [{ role: "user", content: text }],
  });

  return extractJson(textFromMessage(message));
}

export async function generateDialect({
  text,
}: {
  text: string;
}): Promise<{ standard: string; dialect: string }> {
  const client = getAnthropicClient();

  const message = await client.messages.create({
    model: LLM_MODEL,
    max_tokens: 4096,
    system:
      "You render a journal entry in two forms of German: standard (Hochdeutsch) and playful Austrian dialect, as a family member from Austria might say it colloquially.\n" +
      "Keep both natural and readable; the dialect version should feel authentic and fun, not a caricature.\n" +
      `${JSON_ONLY_INSTRUCTION}\nSchema: {"standard": string, "dialect": string}`,
    messages: [{ role: "user", content: text }],
  });

  return extractJson(textFromMessage(message));
}
