import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

type RequiredEnv =
  | "DEEPSEEK_API_KEY"
  | "SUPABASE_URL"
  | "SUPABASE_ANON_KEY"
  | "SUPABASE_SERVICE_ROLE_KEY";

export function getRequiredEnv(name: RequiredEnv): string {
  const value = process.env[name] ?? getLocalEnvValue(name);
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export const env = {
  dailyTokenLimit: Number(process.env.DAILY_TOKEN_LIMIT ?? 120000),
  defaultLocale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE ?? "zh-TW",
  deepseekBaseUrl: process.env.DEEPSEEK_BASE_URL ?? "https://api.deepseek.com/v1",
  deepseekModel: process.env.DEEPSEEK_MODEL ?? "deepseek-chat"
};

export function hasSupabaseEnv() {
  const url = process.env.SUPABASE_URL ?? getLocalEnvValue("SUPABASE_URL");
  const anonKey = process.env.SUPABASE_ANON_KEY ?? getLocalEnvValue("SUPABASE_ANON_KEY");
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? getLocalEnvValue("SUPABASE_SERVICE_ROLE_KEY");

  // Ignore template placeholders from .env.example.
  const hasPlaceholder =
    url?.includes("your-project.supabase.co") ||
    anonKey === "your_anon_key" ||
    serviceRoleKey === "your_service_role_key";

  if (hasPlaceholder) {
    return false;
  }

  return Boolean(
    url &&
      anonKey &&
      serviceRoleKey
  );
}

let localEnvCache: Record<string, string> | null = null;

function getLocalEnvValue(name: string): string | undefined {
  if (localEnvCache === null) {
    localEnvCache = parseDotenvFile();
  }
  return localEnvCache[name];
}

function parseDotenvFile(): Record<string, string> {
  const envPath = join(process.cwd(), ".env.local");
  if (!existsSync(envPath)) {
    return {};
  }

  const rawBuffer = readFileSync(envPath);
  const text = decodeEnvBuffer(rawBuffer).replace(/\u0000/g, "");

  const result: Record<string, string> = {};
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const index = trimmed.indexOf("=");
    if (index <= 0) {
      continue;
    }

    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^"(.*)"$/, "$1");
    result[key] = value;
  }

  return result;
}

function decodeEnvBuffer(rawBuffer: Buffer): string {
  if (rawBuffer.length >= 2 && rawBuffer[0] === 0xff && rawBuffer[1] === 0xfe) {
    return new TextDecoder("utf-16le").decode(rawBuffer);
  }
  if (rawBuffer.length >= 2 && rawBuffer[0] === 0xfe && rawBuffer[1] === 0xff) {
    return new TextDecoder("utf-16be").decode(rawBuffer);
  }

  // Heuristic: UTF-16 LE/BE without BOM will contain many NUL bytes.
  const sampleSize = Math.min(rawBuffer.length, 512);
  let oddNull = 0;
  let evenNull = 0;
  for (let i = 0; i < sampleSize; i++) {
    if (rawBuffer[i] === 0x00) {
      if (i % 2 === 0) {
        evenNull += 1;
      } else {
        oddNull += 1;
      }
    }
  }

  // ASCII text in UTF-16LE has NUL mostly in odd bytes.
  if (oddNull > sampleSize * 0.2 && oddNull > evenNull * 3) {
    return new TextDecoder("utf-16le").decode(rawBuffer);
  }
  // ASCII text in UTF-16BE has NUL mostly in even bytes.
  if (evenNull > sampleSize * 0.2 && evenNull > oddNull * 3) {
    return new TextDecoder("utf-16be").decode(rawBuffer);
  }

  return new TextDecoder("utf-8").decode(rawBuffer);
}
