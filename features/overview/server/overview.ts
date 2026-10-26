import { getUsageSummary } from "@/features/billing/server/usage";
import { getUserSubscription } from "@/features/billing/server/subscription";
import {
  getInstallationStatus,
  getUserInstallationId,
} from "@/features/github/server/installation";
import type { RepoSyncStatus } from "@/features/dashboard/lib/types";
import { prisma } from "@/lib/db";
import type { OverviewData, OverviewLive, PullRequestStatus } from "../types";

/** How many rows each activity list shows. */
const RECENT_LIMIT = 5;

/** Statuses meaning a review is queued but not finished. */
const QUEUED_STATUSES = ["pending", "processing"];

function buildPullRequestUrl(repoFullName: string, prNumber: number) {
  return `https://github.com/${repoFullName}/pull/${prNumber}`;
}

/**
 * Reads the polled slice of the overview.
 *
 * Every timestamp is returned as an ISO string so the server-rendered props
 * and the `/api/overview` JSON response have exactly the same shape.
 *
 * @param userId - Signed-in user id.
 * @param installationId - GitHub installation id, or null when disconnected.
 */
export async function getOverviewLive(
  userId: string,
  installationId: number | null,
): Promise<OverviewLive> {
  const usage = await getUsageSummary(userId);

  if (installationId === null) {
    return {
      stats: {
        reviewsUsed: usage.used,
        reviewsLimit: usage.limit,
        reposSynced: 0,
        inQueue: 0,
        reviewedAllTime: 0,
        pullRequestsTotal: 0,
      },
      pullRequests: [],
      syncs: [],
    };
  }

  const [
    reposSynced,
    inQueue,
    reviewedAllTime,
    pullRequestsTotal,
    recentPullRequests,
    recentSyncs,
  ] = await Promise.all([
    prisma.repoSync.count({ where: { installationId, status: "synced" } }),
    prisma.pullRequest.count({
      where: { installationId, status: { in: QUEUED_STATUSES } },
    }),
    prisma.pullRequest.count({ where: { installationId, status: "reviewed" } }),
    prisma.pullRequest.count({ where: { installationId } }),
    prisma.pullRequest.findMany({
      where: { installationId },
      orderBy: { updatedAt: "desc" },
      take: RECENT_LIMIT,
      select: {
        id: true,
        repoFullName: true,
        prNumber: true,
        title: true,
        authorLogin: true,
        status: true,
        updatedAt: true,
      },
    }),
    prisma.repoSync.findMany({
      where: { installationId },
      orderBy: { updatedAt: "desc" },
      take: RECENT_LIMIT,
      select: {
        id: true,
        repoFullName: true,
        status: true,
        chunkCount: true,
        updatedAt: true,
      },
    }),
  ]);

  return {
    stats: {
      reviewsUsed: usage.used,
      reviewsLimit: usage.limit,
      reposSynced,
      inQueue,
      reviewedAllTime,
      pullRequestsTotal,
    },
    pullRequests: recentPullRequests.map((pullRequest) => ({
      id: pullRequest.id,
      repoFullName: pullRequest.repoFullName,
      prNumber: pullRequest.prNumber,
      title: pullRequest.title,
      authorLogin: pullRequest.authorLogin,
      status: pullRequest.status as PullRequestStatus,
      updatedAt: pullRequest.updatedAt.toISOString(),
      url: buildPullRequestUrl(pullRequest.repoFullName, pullRequest.prNumber),
    })),
    syncs: recentSyncs.map((sync) => ({
      id: sync.id,
      repoFullName: sync.repoFullName,
      status: sync.status as RepoSyncStatus,
      chunkCount: sync.chunkCount,
      updatedAt: sync.updatedAt.toISOString(),
    })),
  };
}

/**
 * Everything the overview page renders on first paint.
 *
 * @param userId - Signed-in user id.
 */
export async function getOverviewData(userId: string): Promise<OverviewData> {
  const [installation, subscription, installationId] = await Promise.all([
    getInstallationStatus(userId),
    getUserSubscription(userId),
    getUserInstallationId(userId),
  ]);

  const live = await getOverviewLive(userId, installationId);

  return {
    ...live,
    connected: installation.connected,
    accountLogin: installation.accountLogin,
    plan: subscription.plan,
  };
}
