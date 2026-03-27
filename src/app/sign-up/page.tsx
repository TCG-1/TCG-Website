import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { createPageMetadata } from "@/lib/site-seo";

const signUpSeo = {
  description:
    "Create a Tacklers Consulting Group portal account, then access your dashboard, documents, and live programme updates.",
  image: "/media/Cost-Management-f9a07bf6.jpeg",
  title: "Create Account | Tacklers Consulting Group",
} as const;

export const metadata: Metadata = createPageMetadata({
  description: signUpSeo.description,
  image: signUpSeo.image,
  noIndex: true,
  path: "/sign-up",
  title: signUpSeo.title,
});

export default function SignUpPage() {
  redirect("/sign-in?mode=sign-up");
}
