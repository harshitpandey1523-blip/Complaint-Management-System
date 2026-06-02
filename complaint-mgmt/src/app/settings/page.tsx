"use client";

import { Topbar } from "@/components/layout/topbar";
import { useUser } from "@/lib/user-context";
import { ROLE_CONFIG } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const {
    currentUserId,
    currentRole,
    users,
    setCurrentUserId,
    setCurrentRole,
  } = useUser();

  return (
    <div className="flex-1">
      <Topbar title="Settings" />

      <div className="p-8 max-w-2xl space-y-6 animate-fade-in">
        {/* Role Switcher */}
        <Card className="border-border/50 bg-card/80">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              User & Role
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Switch between users to test different role-based views. This
              controls which features are visible and what actions are
              available.
            </p>
          </CardHeader>
          <CardContent className="space-y-1">
            {users.map((user) => {
              const isActive = user.id === currentUserId;
              const roleConfig = ROLE_CONFIG[user.role];

              return (
                <button
                  key={user.id}
                  onClick={() => {
                    setCurrentUserId(user.id);
                    setCurrentRole(user.role);
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 text-left ${
                    isActive
                      ? "bg-primary/10 border border-primary/20 shadow-sm"
                      : "hover:bg-muted/50 border border-transparent"
                  }`}
                >
                  <Avatar className="h-9 w-9">
                    <AvatarFallback
                      className={`text-xs font-bold ${
                        isActive
                          ? "bg-primary/20 text-primary"
                          : "bg-muted"
                      }`}
                    >
                      {user.avatar || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{user.name}</p>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-soft" />
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {user.name.toLowerCase().replace(" ", ".")}@company.com
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`${roleConfig?.bgColor} ${roleConfig?.color} border-0 text-[10px]`}
                  >
                    {roleConfig?.label}
                  </Badge>
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* Role Permissions */}
        <Card className="border-border/50 bg-card/80">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              Role Permissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(
                [
                  {
                    role: "ADMIN",
                    perms: [
                      "View all complaints",
                      "Change status & priority",
                      "Assign agents",
                      "Add internal notes",
                      "View analytics dashboard",
                      "Create complaints on behalf of customers",
                    ],
                  },
                  {
                    role: "AGENT",
                    perms: [
                      "View assigned complaints",
                      "Change status & priority",
                      "Add internal notes",
                      "Reply to customers",
                      "View analytics dashboard",
                    ],
                  },
                  {
                    role: "CUSTOMER",
                    perms: [
                      "Submit new complaints",
                      "View own complaints",
                      "Reply to agents",
                      "Track complaint status",
                    ],
                  },
                ] as const
              ).map(({ role, perms }) => {
                const roleConfig = ROLE_CONFIG[role];
                const isCurrentRole = currentRole === role;

                return (
                  <div key={role}>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        variant="outline"
                        className={`${roleConfig.bgColor} ${roleConfig.color} border-0 text-[10px]`}
                      >
                        {roleConfig.label}
                      </Badge>
                      {isCurrentRole && (
                        <span className="text-[10px] text-primary font-medium">
                          (current)
                        </span>
                      )}
                    </div>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5 pl-1">
                      {perms.map((perm) => (
                        <li
                          key={perm}
                          className="text-xs text-muted-foreground flex items-center gap-1.5"
                        >
                          <span className="text-emerald-400">✓</span>
                          {perm}
                        </li>
                      ))}
                    </ul>
                    <Separator className="mt-3 bg-border/30" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card className="border-border/50 bg-card/80">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/25">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold">ResolvX v1.0</p>
                <p className="text-xs text-muted-foreground">
                  E-Commerce Complaint Management System
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Built with Next.js · Prisma · shadcn/ui · Tailwind CSS
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
