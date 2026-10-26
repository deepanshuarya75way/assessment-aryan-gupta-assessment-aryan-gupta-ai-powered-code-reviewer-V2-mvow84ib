import type { PullRequestStatus } from "@/features/dashboard/lib/types";
import { prisma } from "@/lib/db";
import type {
  PullRequestDetail,
  PullRequestFilter,
  PullRequestListItem,
  PullRequestPage,
} from "../types";

const PAGE_SIZE = 20;

/** Which `PullRequest.status` values each tab includes. `all` means no filter. */
const FILTER_STATUSES: Record<PullRequestFilter, string[] | null> = {
  all: null,
  queued: ["pending", "processing"],
  reviewed: ["reviewed"],
  rate_limited: ["rate_limited"],
};

export function isPullRequestFilter(
  value: string | null,
): value is PullRequestFilter {
  return value !== null && value in FILTER_STATUSES;
}

function buildPullRequestUrl(repoFullName: string, prNumber: number) {
  return `https://github.com/${repoFullName}/pull/${prNumber}`;
}

type PullRequestRow = {
  id: string;
  repoFullName: string;
  prNumber: number;
  title: string;
  authorLogin: string | null;
  baseBranch: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  reviewedAt: Date | null;
  reviewComment: string | null;
};

function toListItem(row: PullRequestRow): PullRequestListItem {
  return {
    id: row.id,
    repoFullName: row.repoFullName,
    prNumber: row.prNumber,
    title: row.title,
    authorLogin: row.authorLogin,
    baseBranch: row.baseBranch,
    status: row.status as PullRequestStatus,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    reviewedAt: row.reviewedAt?.toISOString() ?? null,
    hasReview: Boolean(row.reviewComment),
    url: buildPullRequestUrl(row.repoFullName, row.prNumber),
  };
}

/** Empty result used when the GitHub App is not connected. */
export function emptyPullRequestPage(page = 1): PullRequestPage {
  return {
    pullRequests: [],
    counts: { all: 0, queued: 0, reviewed: 0, rate_limited: 0 },
    page,
    hasMore: false,
  };
}

/**
 * Reads one page of pull requests for an installation.
 *
 * Tab counts are computed with the search applied but the filter ignored, so
 * the numbers stay meaningful while the user switches tabs.
 */
export async function listPullRequests(
  installationId: number,
  options: { filter: PullRequestFilter; search: string; page: number },
): Promise<PullRequestPage> {
  const { filter, search, page } = options;

  const searchWhere = search
    ? {
        OR: [
          { repoFullName: { contains: search, mode: "insensitive" as const } },
          { title: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const baseWhere = { installationId, ...searchWhere };
  const statuses = FILTER_STATUSES[filter];
  const filteredWhere = statuses
    ? { ...baseWhere, status: { in: statuses } }
    : baseWhere;

  const [grouped, rows, total] = await Promise.all([
    prisma.pullRequest.groupBy({
      by: ["status"],
      where: baseWhere,
      _count: { _all: true },
    }),
    prisma.pullRequest.findMany({
      where: filteredWhere,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        repoFullName: true,
        prNumber: true,
        title: true,
        authorLogin: true,
        baseBranch: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        reviewedAt: true,
        reviewComment: true,
      },
    }),
    prisma.pullRequest.count({ where: filteredWhere }),
  ]);

  const byStatus: Record<string, number> = {};

  for (const group of grouped) {
    byStatus[group.status] = group._count._all;
  }

  return {
    pullRequests: rows.map(toListItem),
    counts: {
      all: Object.values(byStatus).reduce((sum, count) => sum + count, 0),
      queued: (byStatus.pending ?? 0) + (byStatus.processing ?? 0),
      reviewed: byStatus.reviewed ?? 0,
      rate_limited: byStatus.rate_limited ?? 0,
    },
    page,
    hasMore: page * PAGE_SIZE < total,
  };
}

/**
 * Reads one pull request with its review body.
 *
 * Scoped to `installationId` as well as `id` — the id comes from the URL, so
 * this query is what stops one user reading another user's review.
 *
 * @returns The pull request, or null when it does not belong to this account.
 */
export async function getPullRequestDetail(
  installationId: number,
  id: string,
): Promise<PullRequestDetail | null> {
  const row = await prisma.pullRequest.findFirst({
    where: { id, installationId },
    select: {
      id: true,
      repoFullName: true,
      prNumber: true,
      title: true,
      authorLogin: true,
      baseBranch: true,
      headSha: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      reviewedAt: true,
      reviewComment: true,
    },
  });

  if (!row) {
    return null;
  }

  return {
    ...toListItem(row),
    headSha: row.headSha,
    reviewComment: row.reviewComment,
  };
}
