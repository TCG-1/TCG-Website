import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";

import { getAdminAccountForPortalUser } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const typeParam = requestUrl.searchParams.get("type");
  const nextPath = requestUrl.searchParams.get("next") ?? "/client-hub";
  const safeNextPath = nextPath.startsWith("/") ? nextPath : "/client-hub";

  const supabase = await createClient();

  if (tokenHash && typeParam) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: typeParam as EmailOtpType,
    });

    if (error) {
      return NextResponse.redirect(new URL("/sign-in?error=auth-link", requestUrl.origin));
    }

    if (typeParam === "recovery") {
      return NextResponse.redirect(new URL("/reset-password", requestUrl.origin));
    }

    if (typeParam === "email_change") {
      return NextResponse.redirect(new URL("/client-hub/settings?notice=email-updated", requestUrl.origin));
    }
  } else {
    if (!code) {
      return NextResponse.redirect(new URL("/sign-in?error=oauth", requestUrl.origin));
    }

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(new URL("/sign-in?error=oauth", requestUrl.origin));
    }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const adminUser = await getAdminAccountForPortalUser(user);

  if (adminUser) {
    return NextResponse.redirect(new URL("/admin", requestUrl.origin));
  }

  return NextResponse.redirect(new URL(safeNextPath, requestUrl.origin));
}
