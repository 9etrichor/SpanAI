import { NextResponse } from "next/server";
import { hasSupabaseEnv } from "@/lib/env";

export const runtime = 'edge';

export async function GET() {
  const deepseek = process.env.DEEPSEEK_API_KEY;
  const supabaseUrl = process.env.SUPABASE_URL;

  return NextResponse.json({
    ok: true,
    envCheck: {
      deepseekConfigured: Boolean(deepseek),
      deepseekPrefix: deepseek ? deepseek.slice(0, 3) : null,
      supabaseConfigured: hasSupabaseEnv(),
      supabaseUrlConfigured: Boolean(supabaseUrl)
    }
  });
}
