import { assignTrainingPortalRole, removeTrainingPortalRole } from "@/lib/training-system";

export const runtime = "nodejs";

function toResponseError(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : fallback;
  const status = message === "Unauthorized." ? 401 : 500;
  return Response.json({ error: message || fallback }, { status });
}

type RolePayload = {
  accountId?: string;
  roleSlug?: "admin_owner" | "trainer" | "client_manager" | "learner";
  scope?: "admin" | "client";
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RolePayload;

    if (!body.accountId || !body.roleSlug || !body.scope) {
      return Response.json({ error: "Account, scope, and role are required." }, { status: 400 });
    }

    const role = await assignTrainingPortalRole({
      accountId: body.accountId,
      roleSlug: body.roleSlug,
      scope: body.scope,
    });

    return Response.json({ role }, { status: 201 });
  } catch (error) {
    return toResponseError(error, "Unable to assign the role right now.");
  }
}

export async function DELETE(request: Request) {
  try {
    const body = (await request.json()) as RolePayload;

    if (!body.accountId || !body.roleSlug || !body.scope) {
      return Response.json({ error: "Account, scope, and role are required." }, { status: 400 });
    }

    const result = await removeTrainingPortalRole({
      accountId: body.accountId,
      roleSlug: body.roleSlug,
      scope: body.scope,
    });

    return Response.json(result);
  } catch (error) {
    return toResponseError(error, "Unable to remove the role right now.");
  }
}
