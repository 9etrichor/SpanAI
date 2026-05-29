import { NextResponse } from "next/server";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { hasSupabaseEnv } from "@/lib/env";

export async function GET() {
  const deepseek = process.env.DEEPSEEK_API_KEY;
  const supabaseUrl = process.env.SUPABASE_URL;
  const cwd = process.cwd();
  const envPath = join(cwd, ".env.local");
  const envExists = existsSync(envPath);
  const envPreview = envExists
    ? readFileSync(envPath, "utf8")
        .split(/\r?\n/)
        .slice(0, 6)
        .map((line) =>
          line.startsWith("DEEPSEEK_API_KEY=") ? "DEEPSEEK_API_KEY=***masked***" : line
        )
    : [];

  return NextResponse.json({
    ok: true,
    envCheck: {
      deepseekConfigured: Boolean(deepseek),
      deepseekPrefix: deepseek ? deepseek.slice(0, 3) : null,
      supabaseConfigured: hasSupabaseEnv(),
      supabaseUrlConfigured: Boolean(supabaseUrl),
      cwd,
      envPath,
      envExists,
      envPreview
    }
  });
}
