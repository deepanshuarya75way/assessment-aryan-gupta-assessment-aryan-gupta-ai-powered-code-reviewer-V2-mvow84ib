import { NextResponse } from "next/server";

import { getServerSession } from "@/features/auth/actions";
import { getUserInstallationId } from "@/features/github/server/installation";
import { getOverviewLive } from "@/features/overview/server/overview";

export async function GET() {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // A disconnected user still gets a valid zero-state rather than an error,
  // so the polling client never has to special-case a failed response.
  const installationId = await getUserInstallationId(session.user.id);
  const live = await getOverviewLive(session.user.id, installationId);

  return NextResponse.json(live);
}
