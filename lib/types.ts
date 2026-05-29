export type AiTaskType = "expression_query" | "pattern_drilling" | "context_practice" | "verb_conjugation";

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
}

export interface ExpressionQueryInput {
  concept: string;
  locale?: "zh-TW" | "es";
}

export interface PatternDrillingInput {
  pattern: string;
  locale?: "zh-TW" | "es";
}

export interface ContextPracticeInput {
  scenario: string;
  promptText: string;
  locale?: "zh-TW" | "es";
}

export interface VerbConjugationInput {
  verb: string;
  locale?: "zh-TW" | "es";
}
