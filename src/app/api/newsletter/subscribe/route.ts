import { updateNewsletterSubscription } from "@/lib/newsletter-subscription";
import { sendNewsletterSignupConfirmationEmail } from "@/lib/newsletter-email";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeOptionalText(value: unknown) {
  const normalized = normalizeText(value);
  return normalized || null;
}

function normalizeEmail(value: unknown) {
  return normalizeText(value).toLowerCase();
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function buildLeadMessage(sourcePage: string | null) {
  return sourcePage
    ? `Newsletter subscription captured from ${sourcePage}.`
    : "Newsletter subscription captured from the public site.";
}

async function syncNewsletterLead({
  companyName,
  email,
  fullName,
  sourcePage,
}: {
  companyName?: string | null;
  email: string;
  fullName: string;
  sourcePage?: string | null;
}) {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    throw new Error("Supabase admin client is not configured.");
  }

  const note = sourcePage
    ? `Newsletter subscription captured from ${sourcePage} on ${new Date().toISOString()}.`
    : `Newsletter subscription captured on ${new Date().toISOString()}.`;
  const message = buildLeadMessage(sourcePage ?? null);

  const { data: existingLead, error: existingLeadError } = await supabase
    .from("lead_submissions")
    .select("id, full_name, company_name, internal_notes")
    .eq("email", email)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingLeadError) {
    throw new Error(existingLeadError.message);
  }

  if (existingLead) {
    const existingNotes = normalizeText(existingLead.internal_notes ?? "");
    const nextNotes = existingNotes.includes(note) ? existingNotes : [existingNotes, note].filter(Boolean).join("\n");

    const { data: updatedLead, error: updatedLeadError } = await supabase
      .from("lead_submissions")
      .update({
        company_name: companyName ?? existingLead.company_name ?? null,
        full_name: fullName || existingLead.full_name,
        internal_notes: nextNotes || null,
      })
      .eq("id", existingLead.id)
      .select("id")
      .single();

    if (updatedLeadError || !updatedLead) {
      throw new Error(updatedLeadError?.message ?? "Unable to update the lead pipeline.");
    }

    return updatedLead.id as string;
  }

  const { data: createdLead, error: createdLeadError } = await supabase
    .from("lead_submissions")
    .insert([
      {
        company_name: companyName ?? null,
        email,
        enquiry_type: "Newsletter Subscription",
        full_name: fullName,
        message,
        source: "newsletter-subscription",
        status: "new",
      },
    ])
    .select("id")
    .single();

  if (createdLeadError || !createdLead) {
    throw new Error(createdLeadError?.message ?? "Unable to create the lead pipeline entry.");
  }

  return createdLead.id as string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const fullName = normalizeText(body.fullName);
    const email = normalizeEmail(body.email);
    const companyName = normalizeOptionalText(body.companyName);
    const sourcePage = normalizeOptionalText(body.sourcePage);
    const website = normalizeText(body.website);

    if (website) {
      return Response.json({
        email: "",
        emailSent: false,
        leadId: null,
        message: "Subscription recorded.",
      });
    }

    if (!fullName) {
      return Response.json({ error: "Please enter your full name." }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return Response.json({ error: "Please enter a valid work email address." }, { status: 400 });
    }

    const subscriptionSource = sourcePage ? `website:${sourcePage}` : "website:newsletter-section";

    const [subscription, leadId, emailResult] = await Promise.all([
      updateNewsletterSubscription({
        action: "subscribe",
        email,
        source: subscriptionSource,
      }),
      syncNewsletterLead({
        companyName,
        email,
        fullName,
        sourcePage,
      }),
      sendNewsletterSignupConfirmationEmail({
        companyName,
        email,
        fullName,
      }).then(
        () => true,
        () => false,
      ),
    ]);

    return Response.json({
      email: subscription.email,
      emailSent: emailResult,
      leadId,
      message: emailResult
        ? "Thanks. Your subscription is confirmed and a welcome email is on its way."
        : "Thanks. Your subscription has been recorded, but we could not send the confirmation email just yet.",
    });
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Unable to subscribe right now.",
      },
      { status: 500 },
    );
  }
}
