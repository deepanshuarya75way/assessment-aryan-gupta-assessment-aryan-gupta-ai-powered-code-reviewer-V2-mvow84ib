"use server";

import { getServerSession } from "@/features/auth/actions";
import {
  cancelProSubscription,
  createProSubscription,
} from "@/features/billing/server/subscription";
import { redirect } from "next/navigation";

export type StartProSubscriptionResult =
  | { ok: true; subscriptionId: string }
  | { ok: false; message: string };

export type CancelSubscriptionResult =
  | { ok: true }
  | { ok: false; message: string };

export async function startProSubscription(): Promise<StartProSubscriptionResult> {
  const session = await getServerSession();

  if (!session) {
    redirect("/sign-in");
  }

  // redirect() stays outside the try: it works by throwing NEXT_REDIRECT, and
  // catching that would silently cancel the navigation.
  try {
    const { subscriptionId } = await createProSubscription(session.user.id);
    return { ok: true, subscriptionId };
  } catch (error) {
    console.error("createProSubscription failed", error);

    // Returned as data — thrown messages are stripped in production builds.
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Could not start checkout.",
    };
  }
}

export async function cancelSubscription(): Promise<CancelSubscriptionResult> {
  const session = await getServerSession();

  if (!session) {
    redirect("/sign-in");
  }

  try {
    await cancelProSubscription(session.user.id);
    return { ok: true };
  } catch (error) {
    console.error("cancelProSubscription failed", error);

    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Could not cancel subscription.",
    };
  }
}