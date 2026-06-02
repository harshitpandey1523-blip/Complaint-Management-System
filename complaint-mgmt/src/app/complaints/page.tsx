"use client";

import { useEffect, useState, useCallback } from "react";
import { Topbar } from "@/components/layout/topbar";
import { StatusBadge } from "@/components/complaints/status-badge";
import { PriorityIndicator } from "@/components/complaints/priority-indicator";
import { CATEGORY_CONFIG } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { BACKEND_URL } from "@/lib/api";
import type { Status, Priority, Category } from "@/generated/prisma/client";

interface Complaint {
  id: string;
  subject: string;
  status: Status;
  priority: Priority;
  category: Category;
  orderId: string | null;
  createdAt: string;
  updatedAt: string;
  customer: { id: string; name: string; avatar: string | null };
  assignedTo: { id: string; name: string; avatar: string | null } | null;
  _count: { comments: number };
}

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const [error, setError] = useState<string | null>(null);

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("limit", "10");
      if (search) params.set("search", search);
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (priorityFilter !== "all") params.set("priority", priorityFilter);
      if (categoryFilter !== "all") params.set("category", categoryFilter);

      const res = await fetch(`${BACKEND_URL}/api/complaints?${params}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setComplaints(data.complaints);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Failed to fetch complaints:", err);
      setError("Unable to load complaints. Make sure the backend server is running.");
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, priorityFilter, categoryFilter]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  // Reset to page 1 on filter change
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, priorityFilter, categoryFilter]);

  return (
    <div className="flex-1">
      <Topbar title="Complaints" />

      <div className="p-8 space-y-4 animate-fade-in">
        {/* Error State */}
        {error && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="p-4 flex items-center justify-between">
              <p className="text-sm text-destructive">{error}</p>
              <Button variant="outline" size="sm" className="h-7 text-xs shrink-0" onClick={fetchComplaints}>
                Retry
              </Button>
            </CardContent>
          </Card>
        )}
        {/* Filters */}
        <Card className="border-border/50 bg-card/80">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 min-w-[220px]">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <Input
                  placeholder="Search by subject, ID, or order..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9 bg-muted/30 border-border/50"
                />
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v || "all")}>
                <SelectTrigger className="w-[160px] h-9 bg-muted/30 border-border/50">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="AWAITING_CUSTOMER">
                    Awaiting Customer
                  </SelectItem>
                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>

              {/* Priority Filter */}
              <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v || "all")}>
                <SelectTrigger className="w-[140px] h-9 bg-muted/30 border-border/50">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>

              {/* Category Filter */}
              <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v || "all")}>
                <SelectTrigger className="w-[170px] h-9 bg-muted/30 border-border/50">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="PRODUCT_DEFECT">Product Defect</SelectItem>
                  <SelectItem value="SHIPPING_DELAY">Shipping Delay</SelectItem>
                  <SelectItem value="WRONG_ITEM">Wrong Item</SelectItem>
                  <SelectItem value="REFUND_REQUEST">Refund Request</SelectItem>
                  <SelectItem value="BILLING_ISSUE">Billing Issue</SelectItem>
                  <SelectItem value="ACCOUNT_ISSUE">Account Issue</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>

              <Badge variant="outline" className="h-9 px-3 border-border/50">
                {total} result{total !== 1 ? "s" : ""}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Complaints Table */}
        <Card className="border-border/50 bg-card/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Complaint
                  </th>
                  <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Category
                  </th>
                  <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Assigned
                  </th>
                  <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? [...Array(5)].map((_, i) => (
                      <tr
                        key={i}
                        className="border-b border-border/30"
                      >
                        <td colSpan={7} className="p-3">
                          <div className="h-10 bg-muted/30 rounded animate-pulse" />
                        </td>
                      </tr>
                    ))
                  : complaints.map((complaint) => {
                      const catConfig =
                        CATEGORY_CONFIG[complaint.category];
                      return (
                        <tr
                          key={complaint.id}
                          className="border-b border-border/30 hover:bg-muted/30 transition-colors group"
                        >
                          <td className="p-3">
                            <Link
                              href={`/complaints/${complaint.id}`}
                              className="block"
                            >
                              <p className="text-sm font-medium group-hover:text-primary transition-colors truncate max-w-[280px]">
                                {complaint.subject}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] text-muted-foreground font-mono">
                                  {complaint.id.slice(0, 8)}...
                                </span>
                                {complaint.orderId && (
                                  <Badge
                                    variant="outline"
                                    className="h-4 text-[9px] px-1 border-border/50"
                                  >
                                    {complaint.orderId}
                                  </Badge>
                                )}
                                {complaint._count.comments > 0 && (
                                  <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                                    💬 {complaint._count.comments}
                                  </span>
                                )}
                              </div>
                            </Link>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="bg-primary/10 text-primary text-[8px] font-bold">
                                  {complaint.customer.avatar || "?"}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-muted-foreground">
                                {complaint.customer.name}
                              </span>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="text-xs">
                              {catConfig?.icon} {catConfig?.label}
                            </span>
                          </td>
                          <td className="p-3">
                            <PriorityIndicator
                              priority={complaint.priority}
                            />
                          </td>
                          <td className="p-3">
                            <StatusBadge status={complaint.status} />
                          </td>
                          <td className="p-3">
                            {complaint.assignedTo ? (
                              <div className="flex items-center gap-1.5">
                                <Avatar className="h-5 w-5">
                                  <AvatarFallback className="bg-muted text-[8px] font-bold">
                                    {complaint.assignedTo.avatar || "?"}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-muted-foreground">
                                  {complaint.assignedTo.name.split(" ")[0]}
                                </span>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground/50">
                                Unassigned
                              </span>
                            )}
                          </td>
                          <td className="p-3">
                            <span className="text-xs text-muted-foreground">
                              {new Date(
                                complaint.createdAt
                              ).toLocaleDateString("en", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-3 border-t border-border/50">
              <p className="text-xs text-muted-foreground">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() =>
                    setPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
