import { runScheduledSeoHealthCheck } from "@/lib/seo-health";

export const runtime = "nodejs";

function isAuthorized(request: Request) {
  const vercelCron = request.headers.get("x-vercel-cron");
  if (vercelCron) {
    return true;
  }

  const bearer = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET?.trim();
  return Boolean(secret && bearer === `Bearer ${secret}`);
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const result = await runScheduledSeoHealthCheck();
    return Response.json(result);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unable to run SEO health check." },
      { status: 500 },
    );
  }
}
