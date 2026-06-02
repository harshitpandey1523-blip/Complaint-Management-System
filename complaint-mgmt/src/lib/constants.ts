import { Status, Priority, Category, Role } from "@/generated/prisma/client";

export const STATUS_CONFIG: Record<
  Status,
  { label: string; color: string; bgColor: string }
> = {
  OPEN: {
    label: "Open",
    color: "text-blue-400",
    bgColor: "bg-blue-500/15 border-blue-500/20",
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: "text-amber-400",
    bgColor: "bg-amber-500/15 border-amber-500/20",
  },
  AWAITING_CUSTOMER: {
    label: "Awaiting Customer",
    color: "text-purple-400",
    bgColor: "bg-purple-500/15 border-purple-500/20",
  },
  RESOLVED: {
    label: "Resolved",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/15 border-emerald-500/20",
  },
  CLOSED: {
    label: "Closed",
    color: "text-zinc-400",
    bgColor: "bg-zinc-500/15 border-zinc-500/20",
  },
};

export const PRIORITY_CONFIG: Record<
  Priority,
  { label: string; color: string; dotColor: string }
> = {
  LOW: { label: "Low", color: "text-zinc-400", dotColor: "bg-zinc-400" },
  MEDIUM: {
    label: "Medium",
    color: "text-blue-400",
    dotColor: "bg-blue-400",
  },
  HIGH: {
    label: "High",
    color: "text-amber-400",
    dotColor: "bg-amber-400",
  },
  URGENT: { label: "Urgent", color: "text-rose-400", dotColor: "bg-rose-400" },
};

export const CATEGORY_CONFIG: Record<Category, { label: string; icon: string }> =
  {
    PRODUCT_DEFECT: { label: "Product Defect", icon: "🔧" },
    SHIPPING_DELAY: { label: "Shipping Delay", icon: "📦" },
    WRONG_ITEM: { label: "Wrong Item", icon: "🔄" },
    REFUND_REQUEST: { label: "Refund Request", icon: "💰" },
    BILLING_ISSUE: { label: "Billing Issue", icon: "💳" },
    ACCOUNT_ISSUE: { label: "Account Issue", icon: "👤" },
    OTHER: { label: "Other", icon: "📋" },
  };

export const ROLE_CONFIG: Record<
  Role,
  { label: string; color: string; bgColor: string }
> = {
  ADMIN: {
    label: "Admin",
    color: "text-violet-400",
    bgColor: "bg-violet-500/15",
  },
  AGENT: {
    label: "Agent",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/15",
  },
  CUSTOMER: {
    label: "Customer",
    color: "text-zinc-400",
    bgColor: "bg-zinc-500/15",
  },
};
