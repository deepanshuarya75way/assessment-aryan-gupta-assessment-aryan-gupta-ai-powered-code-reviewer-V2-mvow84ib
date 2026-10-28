import {validate, type Group} from "@/features/pull-requests/lib/filters"
import { NextResponse } from "next/server";

import { getServerSession } from "@/features/auth/actions";
import { getUserInstallationId } from "@/features/github/server/installation";
import {
  emptyPullRequestPage,
  isPullRequestFilter,
  listPullRequests,
} from "@/features/pull-requests/server/pull-requests";

export async function GET(request: Request) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);

  // The filter goes straight into a status lookup, so validate it against the
  // known set rather than trusting the query string.
  const rawFilter = searchParams.get("filter");
  const filter = isPullRequestFilter(rawFilter) ? rawFilter : "all";
  const search = searchParams.get("search")?.trim() ?? "";
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));

  const installationId = await getUserInstallationId(session.user.id);

  if(raw) {
    try {
      advanced = JSON.parse(raw);
    } catch {}
    const error = !advanced || raw.length > 8000 ? "Invalid filter" : validate(advanced);
    if(error) return NextResponse.json({error}, {status: 400});
  }

  if (!installationId) {
    return NextResponse.json(emptyPullRequestPage(page));
  }

  const data = await listPullRequests(installationId, {
    filter,
    search,
    page,
    advanced,
  });

  return NextResponse.json(data);
}
