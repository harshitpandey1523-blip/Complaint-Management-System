"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: { value: number; label: string };
  gradient: string;
  delay?: number;
}

export function KpiCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  gradient,
  delay = 0,
}: KpiCardProps) {
  return (
    <Card
      className="relative overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-0.5"
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {title}
            </p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
            {trend && (
              <div className="flex items-center gap-1 mt-1">
                <span
                  className={cn(
                    "text-xs font-semibold",
                    trend.value >= 0 ? "text-emerald-400" : "text-rose-400"
                  )}
                >
                  {trend.value >= 0 ? "↑" : "↓"}{" "}
                  {Math.abs(trend.value)}%
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {trend.label}
                </span>
              </div>
            )}
          </div>
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shadow-lg",
              gradient
            )}
          >
            {icon}
          </div>
        </div>

        {/* Subtle gradient overlay */}
        <div
          className={cn(
            "absolute -right-8 -bottom-8 w-24 h-24 rounded-full opacity-10 blur-2xl",
            gradient
          )}
        />
      </CardContent>
    </Card>
  );
}
