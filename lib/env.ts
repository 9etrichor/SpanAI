type RequiredEnv =
  | "DEEPSEEK_API_KEY"
  | "SUPABASE_URL"
  | "SUPABASE_ANON_KEY"
  | "SUPABASE_SERVICE_ROLE_KEY";

export function getRequiredEnv(name: RequiredEnv): string {
  const value = process.env[name];
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
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

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
