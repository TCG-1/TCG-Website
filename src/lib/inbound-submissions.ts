import { buildDetailList, buildTextSummary, renderEmailShell } from "@/lib/branded-email";
import { getAdminInboxEmail, sendEmail } from "@/lib/smtp";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type InquiryKind =
	| "discovery_call"
	| "lean_training"
	| "on_site_assessment"
	| "general_contact"
	| "job_application";

type InquirySubmissionInput = {
	kind: InquiryKind;
	fullName: string;
	email: string;
	companyName?: string | null;
	phone?: string | null;
	roleTitle?: string | null;
	preferredContactMethod?: string | null;
	message: string;
	detailFields?: Record<string, string | null | undefined>;
};

type CareerLeadInput = {
	fullName: string;
	email: string;
	phone?: string | null;
	location?: string | null;
	linkedinUrl?: string | null;
	portfolioUrl?: string | null;
	coverNote?: string | null;
	jobTitle: string;
	resumeFilename: string;
};

function normalizeText(value: unknown) {
	return typeof value === "string" ? value.trim() : "";
}

function normalizeOptionalText(value: unknown) {
	const normalized = normalizeText(value);
	return normalized || null;
}

function toTitle(value: string) {
	return value
		.replace(/[_-]+/g, " ")
		.replace(/\b\w/g, (match) => match.toUpperCase());
}

function isValidEmail(value: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function toSource(kind: InquiryKind) {
	switch (kind) {
		case "discovery_call":
			return "discovery-call";
		case "lean_training":
			return "lean-training";
		case "on_site_assessment":
			return "on-site-assessment";
		case "job_application":
			return "career-application";
		default:
			return "contact-form";
	}
}

function toEnquiryType(kind: InquiryKind) {
	switch (kind) {
		case "discovery_call":
			return "Discovery Call";
		case "lean_training":
			return "Lean Training";
		case "on_site_assessment":
			return "On-site Assessment";
		case "job_application":
			return "Job Application";
		default:
			return "General Contact";
	}
}

function toAdminSubject(kind: InquiryKind, companyOrRole: string, fullName: string) {
	switch (kind) {
		case "job_application":
			return `New job application: ${companyOrRole} — ${fullName}`;
		case "discovery_call":
			return `New discovery call request: ${companyOrRole} — ${fullName}`;
		case "lean_training":
			return `New lean training enquiry: ${companyOrRole} — ${fullName}`;
		case "on_site_assessment":
			return `New on-site assessment request: ${companyOrRole} — ${fullName}`;
		default:
			return `New contact enquiry: ${companyOrRole} — ${fullName}`;
	}
}

function buildStructuredMessage({
	detailFields = {},
	message,
	preferredContactMethod,
	roleTitle,
}: {
	detailFields?: Record<string, string | null | undefined>;
	message: string;
	preferredContactMethod?: string | null;
	roleTitle?: string | null;
}) {
	const sections: string[] = [];

	if (roleTitle) {
		sections.push(`Role\n${roleTitle}`);
	}

	if (preferredContactMethod) {
		sections.push(`Preferred contact method\n${preferredContactMethod}`);
	}

	Object.entries(detailFields).forEach(([key, value]) => {
		const normalizedValue = normalizeOptionalText(value);

		if (!normalizedValue) {
			return;
		}

		sections.push(`${toTitle(key)}\n${normalizedValue}`);
	});

	sections.push(`Message\n${message}`);

	return sections.join("\n\n");
}


async function createAdminNotifications({
	body,
	metadata,
	title,
}: {
	body: string;
	metadata: Record<string, unknown>;
	title: string;
}) {
	const supabase = createSupabaseAdminClient();

	if (!supabase) {
		return;
	}

	const { data: admins, error: adminsError } = await supabase
		.from("admin_accounts")
		.select("id")
		.in("status", ["active", "invited"]);

	if (adminsError || !admins?.length) {
		return;
	}

	await supabase.from("notifications").insert(
		admins.map((admin) => ({
			admin_account_id: admin.id,
			body,
			delivery_channel: "in_app",
			link_href: "/admin/leads",
			metadata,
			priority: "high",
			recipient_scope: "admin",
			sent_at: new Date().toISOString(),
			title,
		})),
	);
}

async function saveLead({
	companyName,
	email,
	enquiryType,
	fullName,
	message,
	phone,
	source,
}: {
	companyName?: string | null;
	email: string;
	enquiryType: string;
	fullName: string;
	message: string;
	phone?: string | null;
	source: string;
}) {
	const supabase = createSupabaseAdminClient();

	if (!supabase) {
		throw new Error(
			"Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY.",
		);
	}

	const { data: lead, error } = await supabase
		.from("lead_submissions")
		.insert([
			{
				company_name: companyName ?? null,
				email,
				enquiry_type: enquiryType,
				full_name: fullName,
				message,
				phone: phone ?? null,
				source,
				status: "new",
			},
		])
		.select("id, company_name, email, enquiry_type, full_name, source")
		.single();

	if (error || !lead) {
		throw new Error(error?.message ?? "Unable to save the enquiry.");
	}

	return { lead, supabase };
}

async function saveSupplementaryRecord({
	companyName,
	email,
	fullName,
	kind,
	message,
	phone,
}: {
	companyName?: string | null;
	email: string;
	fullName: string;
	kind: InquiryKind;
	message: string;
	phone?: string | null;
}) {
	const supabase = createSupabaseAdminClient();

	if (!supabase) {
		return;
	}

	try {
		if (kind === "general_contact") {
			await supabase.from("contact_submissions").insert([
				{
					company_name: companyName ?? null,
					full_name: fullName,
					message,
					phone: phone ?? null,
					source_page: "/contact",
					work_email: email,
				},
			]);
			return;
		}

		if (kind === "job_application") {
			return;
		}

		await supabase.from("discovery_requests").insert([
			{
				company_name: companyName ?? null,
				email,
				full_name: fullName,
				notes: message,
				phone: phone ?? null,
				request_type: kind,
			},
		]);
	} catch {
		// Keep lead capture resilient even if secondary tables are not available yet.
	}
}

export function validateInquirySubmission({
	companyName,
	email,
	kind,
	message,
	phone,
	preferredContactMethod,
	roleTitle,
}: {
	companyName?: string | null;
	email: string;
	kind: InquiryKind;
	message: string;
	phone?: string | null;
	preferredContactMethod?: string | null;
	roleTitle?: string | null;
}) {
	if (!isValidEmail(email)) {
		return "Please enter a valid work email address.";
	}

	if (kind !== "job_application" && !normalizeOptionalText(companyName)) {
		return "Please tell us which company or organisation you are enquiring from.";
	}

	if (kind !== "job_application" && !normalizeOptionalText(roleTitle)) {
		return "Please include your role so we can qualify the enquiry properly.";
	}

	if (normalizeOptionalText(preferredContactMethod)?.toLowerCase() === "phone" && !normalizeOptionalText(phone)) {
		return "Please include a phone number if you want us to call you back.";
	}

	if (!normalizeOptionalText(message)) {
		return "Please share a little more context so we can route your enquiry properly.";
	}

	return null;
}

export async function handleInquirySubmission(input: InquirySubmissionInput) {
	const fullName = normalizeText(input.fullName);
	const email = normalizeText(input.email).toLowerCase();
	const companyName = normalizeOptionalText(input.companyName);
	const phone = normalizeOptionalText(input.phone);
	const roleTitle = normalizeOptionalText(input.roleTitle);
	const preferredContactMethod = normalizeOptionalText(input.preferredContactMethod);
	const message = normalizeText(input.message);

	if (!fullName) {
		throw new Error("Please enter your full name.");
	}

	const validationError = validateInquirySubmission({
		companyName,
		email,
		kind: input.kind,
		message,
		phone,
		preferredContactMethod,
		roleTitle,
	});

	if (validationError) {
		throw new Error(validationError);
	}

	const structuredMessage = buildStructuredMessage({
		detailFields: input.detailFields,
		message,
		preferredContactMethod,
		roleTitle,
	});
	const enquiryType = toEnquiryType(input.kind);
	const source = toSource(input.kind);
	const companyOrRole = companyName ?? enquiryType;
	const detailRows = [
		{ label: "Submission type", value: enquiryType },
		{ label: "Name", value: fullName },
		{ label: "Email", value: email },
		...(companyName ? [{ label: "Company", value: companyName }] : []),
		...(phone ? [{ label: "Phone", value: phone }] : []),
		...(roleTitle ? [{ label: "Role", value: roleTitle }] : []),
		...(preferredContactMethod ? [{ label: "Preferred contact method", value: preferredContactMethod }] : []),
		...Object.entries(input.detailFields ?? {})
			.filter(([, value]) => normalizeOptionalText(value))
			.map(([key, value]) => ({ label: toTitle(key), value: normalizeText(value) })),
		{ label: "Message", value: message },
	];

	const { lead } = await saveLead({
		companyName,
		email,
		enquiryType,
		fullName,
		message: structuredMessage,
		phone,
		source,
	});

	void saveSupplementaryRecord({
		companyName,
		email,
		fullName,
		kind: input.kind,
		message: structuredMessage,
		phone,
	});

	const adminSubject = toAdminSubject(input.kind, companyOrRole, fullName);
	const adminIntro = `${fullName} has submitted a new ${toTitle(source)} enquiry through the website.`;
	const thanksSubject = `Thank you for contacting Tacklers Consulting Group`;
	const thanksIntro =
		input.kind === "general_contact"
			? "Thank you for getting in touch with Tacklers Consulting Group. We have your enquiry and will review the details before coming back with the best next step."
			: "Thank you for your enquiry. We have recorded the details and will review the right next step before replying with practical guidance.";

	const adminHtml = await renderEmailShell({
		intro: adminIntro,
		sections: `
			<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:20px;border-collapse:collapse;border:1px solid #f1e5e2;border-radius:16px;overflow:hidden;">
				${buildDetailList(detailRows)}
			</table>
			<p style="margin:22px 0 0;font-size:13px;line-height:1.7;color:#64748b;">Lead saved to the admin workspace with status <strong>New</strong>.</p>
		`,
		subject: adminSubject,
	});
	const thanksHtml = await renderEmailShell({
		intro: thanksIntro,
		sections: `
			<div style="margin-top:20px;border:1px solid #f1e5e2;border-radius:18px;padding:18px 20px;background:#fffaf1;">
				<div style="font-size:12px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#8e6200;">What happens next</div>
				<p style="margin:12px 0 0;font-size:14px;line-height:1.8;color:#475569;">We will review the context you shared, decide whether a discovery call, a more focused conversation, or a direct follow-up makes most sense, and come back to you as quickly as we can.</p>
			</div>
			<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:20px;border-collapse:collapse;border:1px solid #f1e5e2;border-radius:16px;overflow:hidden;">
				${buildDetailList(detailRows.filter((item) => item.label !== "Phone" || Boolean(phone)))}
			</table>
		`,
		subject: thanksSubject,
	});

	await Promise.allSettled([
		createAdminNotifications({
			body: `${fullName} submitted a ${toTitle(source)} enquiry.`,
			metadata: {
				email,
				leadId: lead.id,
				source,
			},
			title: adminSubject,
		}),
		sendEmail({
			html: adminHtml,
			replyTo: email,
			subject: adminSubject,
			text: `${adminIntro}\n\n${buildTextSummary(detailRows)}`,
			to: getAdminInboxEmail(),
		}),
		sendEmail({
			html: thanksHtml,
			replyTo: getAdminInboxEmail(),
			subject: thanksSubject,
			text: `${thanksIntro}\n\n${buildTextSummary(detailRows)}`,
			to: email,
		}),
	]);

	return {
		leadId: lead.id,
		message:
			input.kind === "general_contact"
				? "Thanks. Your message is with us and we will respond as soon as possible."
				: "Thanks. Your request has been received and we will come back with the right next step shortly.",
	};
}

export async function handleCareerApplicationLead(input: CareerLeadInput) {
	const fullName = normalizeText(input.fullName);
	const email = normalizeText(input.email).toLowerCase();
	const phone = normalizeOptionalText(input.phone);
	const jobTitle = normalizeText(input.jobTitle);
	const resumeFilename = normalizeText(input.resumeFilename);

	if (!fullName || !isValidEmail(email) || !jobTitle) {
		return;
	}

	const message = buildStructuredMessage({
		detailFields: {
			linkedin_url: normalizeOptionalText(input.linkedinUrl),
			location: normalizeOptionalText(input.location),
			portfolio_url: normalizeOptionalText(input.portfolioUrl),
			resume_filename: resumeFilename,
			role_applied_for: jobTitle,
		},
		message:
			normalizeOptionalText(input.coverNote) ??
			`Candidate applied for ${jobTitle}. Review CV and supporting links in the applications workspace.`,
	});

	const { lead } = await saveLead({
		email,
		enquiryType: toEnquiryType("job_application"),
		fullName,
		message,
		phone,
		source: toSource("job_application"),
	});

	const detailRows = [
		{ label: "Application type", value: "Job Application" },
		{ label: "Candidate", value: fullName },
		{ label: "Email", value: email },
		{ label: "Role applied for", value: jobTitle },
		...(phone ? [{ label: "Phone", value: phone }] : []),
		...(normalizeOptionalText(input.location) ? [{ label: "Location", value: normalizeText(input.location) }] : []),
		...(normalizeOptionalText(input.linkedinUrl)
			? [{ label: "LinkedIn", value: normalizeText(input.linkedinUrl) }]
			: []),
		...(normalizeOptionalText(input.portfolioUrl)
			? [{ label: "Portfolio", value: normalizeText(input.portfolioUrl) }]
			: []),
		{ label: "Resume", value: resumeFilename },
	];

	const adminSubject = toAdminSubject("job_application", jobTitle, fullName);
	const adminHtml = await renderEmailShell({
		intro: `${fullName} has submitted a new application for ${jobTitle}.`,
		sections: `
			<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:20px;border-collapse:collapse;border:1px solid #f1e5e2;border-radius:16px;overflow:hidden;">
				${buildDetailList(detailRows)}
			</table>
			<p style="margin:22px 0 0;font-size:13px;line-height:1.7;color:#64748b;">The application has also been mirrored into the lead queue for commercial visibility.</p>
		`,
		subject: adminSubject,
	});
	const thanksHtml = await renderEmailShell({
		intro: `Thank you for applying to Tacklers Consulting Group for the ${jobTitle} opportunity. We have your details and CV, and our team will review the application carefully.`,
		sections: `
			<div style="margin-top:20px;border:1px solid #f1e5e2;border-radius:18px;padding:18px 20px;background:#fffaf1;">
				<div style="font-size:12px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#8e6200;">Next steps</div>
				<p style="margin:12px 0 0;font-size:14px;line-height:1.8;color:#475569;">If there is a strong fit, we will contact you using the details you provided. If we are not actively moving forward now, we may still keep your profile in view for future roles.</p>
			</div>
			<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:20px;border-collapse:collapse;border:1px solid #f1e5e2;border-radius:16px;overflow:hidden;">
				${buildDetailList(detailRows)}
			</table>
		`,
		subject: "Thank you for your application to Tacklers Consulting Group",
	});

	await Promise.allSettled([
		createAdminNotifications({
			body: `${fullName} applied for ${jobTitle}.`,
			metadata: {
				email,
				leadId: lead.id,
				source: toSource("job_application"),
			},
			title: adminSubject,
		}),
		sendEmail({
			html: adminHtml,
			replyTo: email,
			subject: adminSubject,
			text: `New application received.\n\n${buildTextSummary(detailRows)}`,
			to: getAdminInboxEmail(),
		}),
		sendEmail({
			html: thanksHtml,
			replyTo: getAdminInboxEmail(),
			subject: "Thank you for your application to Tacklers Consulting Group",
			text: `Thank you for applying for ${jobTitle}. We have received your details and CV.`,
			to: email,
		}),
	]);
}
