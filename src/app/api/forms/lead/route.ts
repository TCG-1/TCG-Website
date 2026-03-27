import { handleInquirySubmission } from "@/lib/inbound-submissions";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      companyName?: string;
      detailFields?: Record<string, string>;
      email?: string;
      fullName?: string;
      kind?: "discovery_call" | "lean_training" | "on_site_assessment" | "general_contact";
      message?: string;
      phone?: string;
      preferredContactMethod?: string;
      roleTitle?: string;
      website?: string;
    };

    if (typeof body.website === "string" && body.website.trim()) {
      return Response.json(
        {
          message: "Thanks. Your request has been received and we will come back with the right next step shortly.",
          ok: true,
        },
        { status: 200 },
      );
    }

    if (
      body.kind !== "discovery_call" &&
      body.kind !== "lean_training" &&
      body.kind !== "on_site_assessment" &&
      body.kind !== "general_contact"
    ) {
      return Response.json({ error: "Invalid enquiry type." }, { status: 400 });
    }

    const payload = await handleInquirySubmission({
      companyName: body.companyName,
      detailFields: body.detailFields,
      email: body.email ?? "",
      fullName: body.fullName ?? "",
      kind: body.kind,
      message: body.message ?? "",
      phone: body.phone,
      preferredContactMethod: body.preferredContactMethod,
      roleTitle: body.roleTitle,
    });

    return Response.json({ ok: true, ...payload }, { status: 201 });
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Unable to submit your request right now.",
      },
      { status: 400 },
    );
  }
}
