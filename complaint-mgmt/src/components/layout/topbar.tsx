"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useUser } from "@/lib/user-context";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROLE_CONFIG } from "@/lib/constants";

export function Topbar({ title }: { title: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { currentRole, users, currentUserId, setCurrentUserId, setCurrentRole } =
    useUser();

  const currentUser = users.find((u) => u.id === currentUserId);
  const roleConfig = ROLE_CONFIG[currentRole];

  return (
    <header className="h-16 border-b border-border/50 flex items-center justify-between px-8 glass">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      </div>

      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-lg"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {mounted && theme === "dark" ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </Button>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                className="h-auto p-1.5 pr-3 rounded-lg gap-2.5"
              >
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-primary/15 text-primary text-[10px] font-bold">
                    {currentUser?.avatar || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="text-xs font-medium leading-none">
                    {currentUser?.name || "Loading..."}
                  </p>
                  <Badge
                    variant="outline"
                    className={`mt-0.5 h-4 text-[9px] px-1 ${roleConfig?.bgColor} ${roleConfig?.color} border-0`}
                  >
                    {roleConfig?.label}
                  </Badge>
                </div>
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-52">
            <div className="px-2 py-1.5 text-xs text-muted-foreground font-medium">
              Switch User
            </div>
            {users.map((user) => (
              <DropdownMenuItem
                key={user.id}
                onClick={() => {
                  setCurrentUserId(user.id);
                  setCurrentRole(user.role);
                }}
                className="gap-2"
              >
                <Avatar className="h-5 w-5">
                  <AvatarFallback className="text-[8px] font-bold bg-muted">
                    {user.avatar}
                  </AvatarFallback>
                </Avatar>
                <span className="flex-1 text-xs">{user.name}</span>
                <Badge
                  variant="outline"
                  className={`h-4 text-[8px] px-1 ${ROLE_CONFIG[user.role]?.bgColor} ${ROLE_CONFIG[user.role]?.color} border-0`}
                >
                  {ROLE_CONFIG[user.role]?.label}
                </Badge>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
