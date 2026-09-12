export const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;

export type CefrLevel = (typeof CEFR_LEVELS)[number];

export function isCefrLevel(value: string): value is CefrLevel {
  return (CEFR_LEVELS as readonly string[]).includes(value);
}

export function nextLevelUp(level: CefrLevel): CefrLevel {
  const index = CEFR_LEVELS.indexOf(level);
  return CEFR_LEVELS[Math.min(index + 1, CEFR_LEVELS.length - 1)];
}

const LEVEL_DESCRIPTIONS: Record<CefrLevel, string> = {
  A1: "beginner: very short, simple sentences, the most common everyday words only",
  A2: "elementary: short sentences, common vocabulary, simple connectors (and, but, because)",
  B1: "intermediate: everyday vocabulary, some subordinate clauses, can describe experiences and opinions",
  B2: "upper-intermediate: wider vocabulary, more complex sentence structure, idiomatic expressions used naturally",
  C1: "advanced: nuanced vocabulary, complex sentence structures, natural idiomatic phrasing",
  C2: "near-native: full range of vocabulary and grammar, precise and idiomatic",
};

export function levelDescription(level: CefrLevel): string {
  return LEVEL_DESCRIPTIONS[level];
}
