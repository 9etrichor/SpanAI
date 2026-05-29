import { getSupabaseAdmin } from "@/lib/supabase";
import { env, hasSupabaseEnv } from "@/lib/env";
import type { AiTaskType, TokenUsage } from "@/lib/types";

export async function getTodayTokenUsage(userId: string): Promise<number> {
  if (!hasSupabaseEnv()) {
    return 0;
  }

  const supabaseAdmin = getSupabaseAdmin();
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabaseAdmin
    .from("usage_logs")
    .select("tokens_total")
    .eq("user_id", userId)
    .eq("usage_date", today);

  if (error) {
    throw new Error(`Failed to read token usage: ${error.message}`);
  }

  return data.reduce((sum, row) => sum + (row.tokens_total ?? 0), 0);
}

export async function assertDailyLimit(userId: string, requestedTokens = 0): Promise<void> {
  if (!hasSupabaseEnv()) {
    return;
  }

  try {
    const used = await getTodayTokenUsage(userId);
    if (used + requestedTokens > env.dailyTokenLimit) {
      throw new Error("Daily token limit reached.");
    }
  } catch (error) {
    // In local development, Supabase connectivity issues should not block AI query flow.
    if (error instanceof Error && error.message.includes("fetch failed")) {
      return;
    }
    throw error;
  }
}

export async function saveUsageLog(params: {
  userId: string;
  task: AiTaskType;
  usage: TokenUsage;
  requestPayload: Record<string, unknown>;
}): Promise<void> {
  if (!hasSupabaseEnv()) {
    return;
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();
    const today = new Date().toISOString().slice(0, 10);
    const { error } = await supabaseAdmin.from("usage_logs").insert({
      user_id: params.userId,
      usage_date: today,
      task_type: params.task,
      tokens_input: params.usage.inputTokens,
      tokens_output: params.usage.outputTokens,
      tokens_total: params.usage.totalTokens,
      request_payload: params.requestPayload
    });

    if (error) {
      throw new Error(`Failed to save usage log: ${error.message}`);
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes("fetch failed")) {
      return;
    }
    throw error;
  }
}
