const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ??
  "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export function hasSupabasePublicConfig() {
  return Boolean(supabaseUrl && supabasePublishableKey);
}

export function hasSupabaseAdminConfig() {
  return Boolean(supabaseUrl && supabaseServiceRoleKey);
}

export function getSupabasePublicConfig() {
  if (!hasSupabasePublicConfig()) {
    throw new Error(
      "Supabase public config is missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY).",
    );
  }

  return {
    supabaseUrl,
    supabasePublishableKey,
  };
}

export function getSupabaseAdminConfig() {
  if (!hasSupabaseAdminConfig()) {
    throw new Error(
      "Supabase admin config is missing. Set NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  return {
    supabaseUrl,
    supabaseServiceRoleKey,
  };
}
