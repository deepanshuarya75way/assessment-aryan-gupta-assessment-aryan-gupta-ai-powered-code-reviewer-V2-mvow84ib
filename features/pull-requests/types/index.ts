import type { PullRequestStatus } from "@/features/dashboard/lib/types";

/** Tab options on the pull request list. */
export type PullRequestFilter = "all" | "queued" | "reviewed" | "rate_limited";

/** One row in the pull request table. */
export type PullRequestListItem = {
  id: string;
  repoFullName: string;
  prNumber: number;
  title: string;
  authorLogin: string | null;
  baseBranch: string;
  status: PullRequestStatus;
  /** ISO timestamps, serialized on the server so polled JSON matches. */
  createdAt: string;
  updatedAt: string;
  reviewedAt: string | null;
  /** True when a review body exists, without shipping the body to the list. */
  hasReview: boolean;
  url: string;
};

/** A single pull request plus its stored review markdown. */
export type PullRequestDetail = PullRequestListItem & {
  headSha: string;
  reviewComment: string | null;
};

/** Tab counts, computed against the active search but ignoring the filter. */
export type PullRequestCounts = Record<PullRequestFilter, number>;

/** One page of results returned by `/api/pull-requests`. */
export type PullRequestPage = {
  pullRequests: PullRequestListItem[];
  counts: PullRequestCounts;
  page: number;
  hasMore: boolean;
};
