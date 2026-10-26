import type { Metadata } from "next";

import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { PullRequestList } from "@/features/pull-requests/components/pull-request-list";

export const metadata: Metadata = {
  title: "Pull requests · Dashboard",
};

const PullRequestsPage = () => {
  return (
    <>
      <DashboardHeader
        title="Pull requests"
        description="Every pull request the reviewer has seen, and its review."
      />
      <PullRequestList />
    </>
  );
};

export default PullRequestsPage;
