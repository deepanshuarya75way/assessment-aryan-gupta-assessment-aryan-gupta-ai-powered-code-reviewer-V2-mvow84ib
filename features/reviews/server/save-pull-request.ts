import { prisma } from "@/lib/db";
import { PullRequestWebhookPayload } from "@/features/github/server/webhook-handler";

function getAuthorLogin(user: { login: string } | null): string | null {
  if (!user) {
    return null;
  }

  return user.login;
}

// it is a db save fn
export async function savePullRequest(payload: PullRequestWebhookPayload) {
  const repoFullName = payload.repository.full_name;
  const prNumber = payload.pull_request.number;

  return prisma.pullRequest.upsert({
    where: {
      repoFullName_prNumber: { repoFullName, prNumber },
    },
    create: {
      installationId: payload.installation.id,
      repoFullName,
      prNumber,
      title: payload.pull_request.title,
      authorLogin: getAuthorLogin(payload.pull_request.user),
      headSha: payload.pull_request.head.sha,
      baseBranch: payload.pull_request.base.ref,
      status: "pending",
    },
    update: {
      title: payload.pull_request.title,
      headSha: payload.pull_request.head.sha,
      status: "pending",
    },
  });
}
