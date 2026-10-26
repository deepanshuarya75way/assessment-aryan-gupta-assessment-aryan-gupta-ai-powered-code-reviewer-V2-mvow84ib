import type { Metadata } from "next";

import { requireAuth } from "@/features/auth/actions";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { OverviewContent } from "@/features/overview/components/overview-content";
import { SetupChecklist } from "@/features/overview/components/setup-checklist";
import { getOverviewData } from "@/features/overview/server/overview";

export const metadata: Metadata = {
  title: "Overview · Dashboard",
};

const DashboardPage = async () => {
  const session = await requireAuth();
  const overview = await getOverviewData(session.user.id);

  // Until a PR has actually been seen there is nothing to chart, so the
  // checklist stands in for the dashboard rather than sitting above an
  // empty one.
  const setupComplete =
    overview.connected &&
    overview.stats.reposSynced > 0 &&
    overview.stats.pullRequestsTotal > 0;

  return (
    <>
      <DashboardHeader
        title="Overview"
        description={
          overview.accountLogin
            ? `Connected to ${overview.accountLogin}`
            : "Connect GitHub to start reviewing pull requests."
        }
      />
      {setupComplete ? (
        <OverviewContent initial={overview} />
      ) : (
        <SetupChecklist
          connected={overview.connected}
          accountLogin={overview.accountLogin}
          reposSynced={overview.stats.reposSynced}
          pullRequestsTotal={overview.stats.pullRequestsTotal}
        />
      )}
    </>
  );
};

export default DashboardPage;
