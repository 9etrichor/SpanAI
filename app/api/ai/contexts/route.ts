import { NextRequest } from "next/server";
import { runAiTask } from "@/lib/ai";
import { assertDailyLimit, saveUsageLog } from "@/lib/usage";
import { fail, getUserIdFromHeaders, ok } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      scenario?: string;
      promptText?: string;
      locale?: "zh-TW" | "es";
    };
    if (!body.scenario?.trim()) {
      return fail("Missing scenario.", 400);
    }

    const userId = getUserIdFromHeaders(req.headers);
    await assertDailyLimit(userId);

    const result = await runAiTask("context_practice", {
      scenario: body.scenario.trim(),
      promptText: body.promptText ?? "",
      locale: body.locale ?? "zh-TW"
    });

    await saveUsageLog({
      userId,
      task: "context_practice",
      usage: result.usage,
      requestPayload: body
    });

    return ok(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown server error";
    const status = message.includes("Daily token limit") ? 429 : 500;
    return fail(message, status);
  }
}
