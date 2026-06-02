import { Badge } from "@/components/ui/badge";
import { STATUS_CONFIG } from "@/lib/constants";
import type { Status } from "@/generated/prisma/client";

export function StatusBadge({ status }: { status: Status }) {
  const config = STATUS_CONFIG[status];
  return (
    <Badge
      variant="outline"
      className={`${config.bgColor} ${config.color} border font-medium text-xs transition-all duration-200 hover:scale-105`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.color.replace("text-", "bg-")} mr-1.5 animate-pulse-soft`} />
      {config.label}
    </Badge>
  );
}
