import { requireAuth } from "@/features/auth/actions";
import { getUserSubscription } from "@/features/billing/server/subscription";
import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";
import { PLAN_DETAILS } from "@/features/settings/lib/plan-details";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth();
  const subscription = await getUserSubscription(session.user.id);

  return (
    <DashboardShell
      user={session.user}
      plan={PLAN_DETAILS[subscription.plan].label}
    >
      {children}
    </DashboardShell>
  );
}
