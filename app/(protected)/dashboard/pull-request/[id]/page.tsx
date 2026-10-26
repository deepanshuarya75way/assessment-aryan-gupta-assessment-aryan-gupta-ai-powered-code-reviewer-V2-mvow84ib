import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ExternalLink } from "lucide-react";

import { requireAuth } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { DASHBOARD_ROUTES } from "@/features/dashboard/lib/routes";
import {
  PR_STATUS_LABEL,
  PR_STATUS_TONE,
  statusBadge,
} from "@/features/dashboard/lib/status-style";
import { getUserInstallationId } from "@/features/github/server/installation";
import { ReviewMarkdown } from "@/features/pull-requests/components/review-markdown";
import { ReviewRefresher } from "@/features/pull-requests/components/review-refresher";
import { getPullRequestDetail } from "@/features/pull-requests/server/pull-requests";
import type { PullRequestDetail } from "@/features/pull-requests/types";

type PullRequestDetailPageProps = {
  params: Promise<{ id: string }>;
};

/** Message shown in place of a review that does not exist yet. */
function getPendingMessage(status: PullRequestDetail["status"]) {
  if (status === "processing") {
    return "Review in progress. This page updates itself every few seconds.";
  }

  if (status === "rate_limited") {
    return "This pull request was skipped because the monthly free limit was reached. Upgrade to Pro to review it.";
  }

  return "Queued for review. This page updates itself every few seconds.";
}

const PullRequestDetailPage = async ({
  params,
}: PullRequestDetailPageProps) => {
  const { id } = await params;
  const session = await requireAuth();
  const installationId = await getUserInstallationId(session.user.id);

  if (!installationId) {
    notFound();
  }

  const pullRequest = await getPullRequestDetail(installationId, id);

  if (!pullRequest) {
    notFound();
  }

  const reviewedAt = pullRequest.reviewedAt
    ? format(new Date(pullRequest.reviewedAt), "MMM d, yyyy 'at' h:mm a")
    : null;

  return (
    <>
      <DashboardHeader
        title={pullRequest.title}
        description={`${pullRequest.repoFullName} #${pullRequest.prNumber}`}
      />

      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={DASHBOARD_ROUTES.pullRequest}
            className="text-xs text-muted-foreground hover:text-foreground hover:underline"
          >
            ← All pull requests
          </Link>
          <span className="text-border">|</span>
          <span className={statusBadge(PR_STATUS_TONE[pullRequest.status])}>
            {PR_STATUS_LABEL[pullRequest.status]}
          </span>
          <span className="text-xs text-muted-foreground">
            {pullRequest.authorLogin ? `by ${pullRequest.authorLogin} · ` : ""}
            into {pullRequest.baseBranch} ·{" "}
            <code className="bg-muted px-1 py-0.5">
              {pullRequest.headSha.slice(0, 7)}
            </code>
          </span>
          <Button asChild size="sm" variant="outline" className="ml-auto">
            <a href={pullRequest.url} target="_blank" rel="noopener noreferrer">
              View on GitHub
              <ExternalLink data-icon="inline-end" />
            </a>
          </Button>
        </div>

        <div className="border border-border">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="text-sm font-medium">AI review</h2>
            {reviewedAt ? (
              <span className="text-xs text-muted-foreground">
                {reviewedAt}
              </span>
            ) : null}
          </div>

          <div className="p-6">
            {pullRequest.reviewComment ? (
              <ReviewMarkdown content={pullRequest.reviewComment} />
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  {getPendingMessage(pullRequest.status)}
                </p>
                {pullRequest.status === "rate_limited" ? (
                  <Button asChild size="sm" className="mt-4">
                    <Link href={DASHBOARD_ROUTES.settings}>Upgrade to Pro</Link>
                  </Button>
                ) : (
                  <ReviewRefresher />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PullRequestDetailPage;
