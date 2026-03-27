import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

import { getSupabasePublicConfig, hasSupabasePublicConfig } from "@/lib/supabase/config";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  if (!hasSupabasePublicConfig()) {
    return response;
  }

  const { supabasePublishableKey, supabaseUrl } = getSupabasePublicConfig();

  const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        response = NextResponse.next({
          request,
        });

        cookiesToSet.forEach(({ name, options, value }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  await supabase.auth.getClaims();
  response.headers.set("Cache-Control", "private, no-store");

  return response;
}
