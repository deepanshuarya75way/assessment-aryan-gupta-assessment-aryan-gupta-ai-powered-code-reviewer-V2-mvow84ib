"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink, Loader2 } from "lucide-react";

import { DASHBOARD_ROUTES } from "@/features/dashboard/lib/routes";
import { statusBadge } from "@/features/dashboard/lib/status-style";
import type { RepoSyncStatus } from "@/features/dashboard/lib/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  OverviewData,
  OverviewLive,
  PullRequestStatus,
  RecentPullRequest,
  RecentSync,
} from "../types";

/** How often the live slice is refetched, in milliseconds. */
const POLL_INTERVAL = 10_000;

/** Percentage of the free quota at which the usage bar turns amber. */
const NEAR_CAP_PERCENT = 80;

type Tone = "success" | "warning" | "danger" | "info" | "neutral";

const PR_STATUS_TONE: Record<PullRequestStatus, Tone> = {
  reviewed: "success",
  processing: "info",
  pending: "neutral",
  rate_limited: "danger",
};

/** `statusBadge` capitalizes but does not un-snake, so labels are explicit. */
const PR_STATUS_LABEL: Record<PullRequestStatus, string> = {
  reviewed: "reviewed",
  processing: "processing",
  pending: "queued",
  rate_limited: "rate limited",
};

const SYNC_STATUS_TONE: Record<RepoSyncStatus, Tone> = {
  synced: "success",
  syncing: "info",
  pending: "neutral",
  failed: "danger",
};

function timeAgo(isoDate: string) {
  return formatDistanceToNow(new Date(isoDate), { addSuffix: true });
}

function StatTile({
  label,
  value,
  hint,
  children,
}: {
  label: string;
  value: string | number;
  hint?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-none border border-border p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold tabular-nums">{value}</p>
      {children}
      {hint ? (
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

/**
 * Monthly review quota. Pro users see a plain count; free users get a bar that
 * escalates from neutral to amber to red as the limit approaches.
 */
function UsageTile({ used, limit }: { used: number; limit: number | null }) {
  if (limit === null) {
    return (
      <StatTile
        label="Reviews this month"
        value={used}
        hint="Unlimited on Pro"
      />
    );
  }

  const percent = Math.min(100, Math.round((used / limit) * 100));
  const atCap = used >= limit;

  let barClass = "bg-primary";

  if (atCap) {
    barClass = "bg-red-500";
  } else if (percent >= NEAR_CAP_PERCENT) {
    barClass = "bg-amber-500";
  }

  return (
    <StatTile label="Reviews this month" value={`${used} / ${limit}`}>
      <div className="mt-3 h-1.5 w-full overflow-hidden bg-muted">
        <div
          className={cn("h-full transition-all", barClass)}
          style={{ width: `${percent}%` }}
        />
      </div>
      {atCap ? (
        <Link
          href={DASHBOARD_ROUTES.settings}
          className="mt-2 inline-block text-xs font-medium text-red-600 hover:underline dark:text-red-400"
        >
          Limit reached — upgrade to Pro
        </Link>
      ) : (
        <p className="mt-2 text-xs text-muted-foreground">
          {limit - used} left on the Free plan
        </p>
      )}
    </StatTile>
  );
}

function ListCard({
  title,
  action,
  href,
  empty,
  children,
}: {
  title: string;
  action: string;
  href: string;
  empty: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col rounded-none border border-border">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-sm font-medium">{title}</h2>
        <Link
          href={href}
          className="text-xs text-muted-foreground hover:text-foreground hover:underline"
        >
          {action}
        </Link>
      </div>
      {empty ? (
        <p className="px-4 py-8 text-center text-sm text-muted-foreground">
          Nothing here yet.
        </p>
      ) : (
        <ul>{children}</ul>
      )}
    </section>
  );
}

function PullRequestRow({ pullRequest }: { pullRequest: RecentPullRequest }) {
  return (
    <li className="flex items-center gap-3 border-b border-border px-4 py-3 last:border-b-0">
      <div className="min-w-0 flex-1">
        <a
          href={pullRequest.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 truncate text-sm font-medium hover:underline"
        >
          <span className="truncate">{pullRequest.title}</span>
          <ExternalLink className="size-3 shrink-0 text-muted-foreground" />
        </a>
        <p className="truncate text-xs text-muted-foreground">
          {pullRequest.repoFullName} #{pullRequest.prNumber}
          {pullRequest.authorLogin ? ` · ${pullRequest.authorLogin}` : ""}
        </p>
      </div>

      <span
        className={statusBadge(
          PR_STATUS_TONE[pullRequest.status],
          "shrink-0 gap-1",
        )}
      >
        {pullRequest.status === "processing" ? (
          <Loader2 className="size-3 animate-spin" />
        ) : null}
        {PR_STATUS_LABEL[pullRequest.status]}
      </span>

      <span className="hidden shrink-0 whitespace-nowrap text-xs text-muted-foreground sm:block">
        {timeAgo(pullRequest.updatedAt)}
      </span>
    </li>
  );
}

function SyncRow({ sync }: { sync: RecentSync }) {
  return (
    <li className="flex items-center gap-3 border-b border-border px-4 py-3 last:border-b-0">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{sync.repoFullName}</p>
        <p className="truncate text-xs text-muted-foreground">
          {sync.chunkCount > 0
            ? `${sync.chunkCount.toLocaleString()} chunks indexed`
            : "Not indexed yet"}
        </p>
      </div>

      <span className={statusBadge(SYNC_STATUS_TONE[sync.status], "shrink-0")}>
        {sync.status}
      </span>

      <span className="hidden shrink-0 whitespace-nowrap text-xs text-muted-foreground sm:block">
        {timeAgo(sync.updatedAt)}
      </span>
    </li>
  );
}

/**
 * Overview body. Server-rendered data seeds the query cache, then the live
 * slice refetches on an interval so queued reviews visibly progress.
 */
export function OverviewContent({ initial }: { initial: OverviewData }) {
  const { data } = useQuery({
    queryKey: ["overview", "live"],
    queryFn: async (): Promise<OverviewLive> => {
      const response = await fetch("/api/overview");

      if (!response.ok) {
        throw new Error("Failed to load overview");
      }

      return response.json();
    },
    initialData: {
      stats: initial.stats,
      pullRequests: initial.pullRequests,
      syncs: initial.syncs,
    },
    refetchInterval: POLL_INTERVAL,
  });

  const { stats, pullRequests, syncs } = data;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <UsageTile used={stats.reviewsUsed} limit={stats.reviewsLimit} />
        <StatTile
          label="Repositories synced"
          value={stats.reposSynced}
          hint="Synced repos get full codebase context"
        />
        <StatTile
          label="In queue"
          value={stats.inQueue}
          hint={stats.inQueue > 0 ? "Updating every 10s" : "Nothing waiting"}
        />
        <StatTile
          label="Reviews all time"
          value={stats.reviewedAllTime}
          hint="Across every connected repository"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ListCard
          title="Recent pull requests"
          action="View all"
          href={DASHBOARD_ROUTES.pullRequest}
          empty={pullRequests.length === 0}
        >
          {pullRequests.map((pullRequest) => (
            <PullRequestRow key={pullRequest.id} pullRequest={pullRequest} />
          ))}
        </ListCard>

        <ListCard
          title="Recent codebase syncs"
          action="Manage repos"
          href={DASHBOARD_ROUTES.repos}
          empty={syncs.length === 0}
        >
          {syncs.map((sync) => (
            <SyncRow key={sync.id} sync={sync} />
          ))}
        </ListCard>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button asChild size="sm" variant="outline">
          <Link href={DASHBOARD_ROUTES.repos}>Sync a repository</Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href={DASHBOARD_ROUTES.github}>Manage GitHub App</Link>
        </Button>
        {initial.plan === "free" ? (
          <Button asChild size="sm">
            <Link href={DASHBOARD_ROUTES.settings}>Upgrade to Pro</Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
