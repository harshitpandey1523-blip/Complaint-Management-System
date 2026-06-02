import { PRIORITY_CONFIG } from "@/lib/constants";
import type { Priority } from "@/generated/prisma/client";

export function PriorityIndicator({ priority }: { priority: Priority }) {
  const config = PRIORITY_CONFIG[priority];
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full ${config.dotColor} ${priority === "URGENT" ? "animate-pulse-soft" : ""}`} />
      <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
    </div>
  );
}
