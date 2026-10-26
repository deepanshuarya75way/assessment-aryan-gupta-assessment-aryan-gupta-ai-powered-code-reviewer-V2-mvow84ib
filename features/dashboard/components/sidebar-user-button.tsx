"use client";

import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { UserMenu, UserMenuUser } from "@/features/auth/components/user-menu";
import { cn } from "@/lib/utils";

type SidebarUserButtonProps = {
  user: UserMenuUser;
  plan?: string;
};

export function SidebarUserButton({ user, plan }: SidebarUserButtonProps) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <UserMenu
          user={user}
          plan={plan}
          variant="profile"
          className={cn(
            "w-full",
            "[&_button]:h-12 [&_button]:w-full [&_button]:justify-start [&_button]:gap-2 [&_button]:px-2",
            "[[data-collapsible=icon]_&_button]:justify-center [[data-collapsible=icon]_&_button]:gap-0 [[data-collapsible=icon]_&_button]:px-0",
          )}
        />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
