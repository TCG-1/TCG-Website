import { NextResponse } from "next/server";

import { getAdminAccountForPortalUser } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const nextPath = requestUrl.searchParams.get("next") ?? "/client-hub";
  const safeNextPath = nextPath.startsWith("/") ? nextPath : "/client-hub";

  if (!code) {
    return NextResponse.redirect(new URL("/sign-in?error=oauth", requestUrl.origin));
  }

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(new URL("/sign-in?error=oauth", requestUrl.origin));
  }

  const adminUser = await getAdminAccountForPortalUser(user);

  if (adminUser) {
    return NextResponse.redirect(new URL("/admin", requestUrl.origin));
  }

  return NextResponse.redirect(new URL(safeNextPath, requestUrl.origin));
}
