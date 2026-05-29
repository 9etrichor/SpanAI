import { NextRequest } from "next/server";
import { runAiTask } from "@/lib/ai";
import { assertDailyLimit, saveUsageLog } from "@/lib/usage";
import { fail, getUserIdFromHeaders, ok } from "@/lib/api";

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { verb?: string; locale?: "zh-TW" | "es" };
    if (!body.verb?.trim()) {
      return fail("Missing verb.", 400);
    }

    const userId = getUserIdFromHeaders(req.headers);
    await assertDailyLimit(userId);

    const result = await runAiTask("verb_conjugation", {
      verb: body.verb.trim(),
      locale: body.locale ?? "zh-TW"
    });

    await saveUsageLog({
      userId,
      task: "verb_conjugation",
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
