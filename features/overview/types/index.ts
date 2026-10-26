import type {
  RepoSyncStatus,
  SubscriptionPlan,
} from "@/features/dashboard/lib/types";

/** Lifecycle of a pull request review, mirroring `PullRequest.status`. */
export type PullRequestStatus =
  | "pending"
  | "processing"
  | "reviewed"
  | "rate_limited";

/** One row in the "Recent pull requests" list. */
export type RecentPullRequest = {
  id: string;
  repoFullName: string;
  prNumber: number;
  title: string;
  authorLogin: string | null;
  status: PullRequestStatus;
  /** ISO timestamp — serialized on the server so polled JSON matches. */
  updatedAt: string;
  /** Direct link to the PR on GitHub. */
  url: string;
};

/** One row in the "Recent codebase syncs" list. */
export type RecentSync = {
  id: string;
  repoFullName: string;
  status: RepoSyncStatus;
  chunkCount: number;
  updatedAt: string;
};

/** Counters shown in the four stat tiles. */
export type OverviewStats = {
  reviewsUsed: number;
  /** `null` means unlimited (Pro plan). */
  reviewsLimit: number | null;
  reposSynced: number;
  /** Pull requests currently pending or processing. */
  inQueue: number;
  reviewedAllTime: number;
  /** Every PR we've ever seen — drives the setup-complete check. */
  pullRequestsTotal: number;
};

/** The slice that changes while the user watches. Polled every 10s. */
export type OverviewLive = {
  stats: OverviewStats;
  pullRequests: RecentPullRequest[];
  syncs: RecentSync[];
};

/** Live slice plus the account facts that only change on navigation. */
export type OverviewData = OverviewLive & {
  connected: boolean;
  accountLogin: string | null;
  plan: SubscriptionPlan;
};
