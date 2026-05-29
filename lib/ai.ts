import { env, getRequiredEnv } from "@/lib/env";
import { buildUserPrompt, systemPromptByTask } from "@/lib/prompts";
import type { AiTaskType, TokenUsage } from "@/lib/types";

export async function runAiTask(task: AiTaskType, payload: Record<string, unknown>) {
  const response = await fetch(`${env.deepseekBaseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getRequiredEnv("DEEPSEEK_API_KEY")}`
    },
    body: JSON.stringify({
      model: env.deepseekModel,
      messages: [
        { role: "system", content: systemPromptByTask[task] },
        { role: "user", content: buildUserPrompt(task, payload) }
      ],
      temperature: 0.4,
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`DeepSeek request failed (${response.status}): ${errorText}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string | null } }>;
    usage?: {
      prompt_tokens?: number;
      completion_tokens?: number;
      total_tokens?: number;
    };
  };

  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) {
    throw new Error("AI returned empty response.");
  }

  return { rawText: text, parsed: JSON.parse(text), usage: extractTokenUsage(data.usage) };
}

function extractTokenUsage(
  usageMetadata: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number } | undefined
): TokenUsage {
  const inputTokens = usageMetadata?.prompt_tokens ?? 0;
  const outputTokens = usageMetadata?.completion_tokens ?? 0;
  const totalTokens = usageMetadata?.total_tokens ?? inputTokens + outputTokens;
  return { inputTokens, outputTokens, totalTokens };
}
