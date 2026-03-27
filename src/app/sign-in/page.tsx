import { AdminSignInForm } from "@/components/auth/admin-sign-in-form";
import { Container } from "@/components/sections";

type SignInPageProps = {
  searchParams: Promise<{ error?: string | string[] }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const resolvedSearchParams = await searchParams;
  const initialMessage =
    resolvedSearchParams.error === "admin-config"
      ? "Admin access is not configured for this deployment yet."
      : "";

  return (
    <section className="section-gap">
      <Container>
        <div className="mx-auto max-w-xl">
          <AdminSignInForm initialMessage={initialMessage} />
        </div>
      </Container>
    </section>
  );
}
