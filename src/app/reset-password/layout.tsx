import type { Metadata } from "next";

import { createPageMetadata } from "@/lib/site-seo";

export const metadata: Metadata = createPageMetadata({
  description: "Reset your Tacklers Consulting Group portal password and return to your account securely.",
  noIndex: true,
  path: "/reset-password",
  title: "Reset Password | Tacklers Consulting Group",
});

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
