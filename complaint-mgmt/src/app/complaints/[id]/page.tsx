"use client";

import { useEffect, useState, use, useCallback } from "react";
import { Topbar } from "@/components/layout/topbar";
import { StatusBadge } from "@/components/complaints/status-badge";
import { PriorityIndicator } from "@/components/complaints/priority-indicator";
import { CATEGORY_CONFIG, ROLE_CONFIG } from "@/lib/constants";
import { useUser } from "@/lib/user-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { BACKEND_URL } from "@/lib/api";
import type { Status, Priority, Role } from "@/generated/prisma/client";

interface Comment {
  id: string;
  content: string;
  isInternal: boolean;
  createdAt: string;
  user: { id: string; name: string; avatar: string | null; role: Role };
}

interface ComplaintDetail {
  id: string;
  subject: string;
  description: string;
  orderId: string | null;
  category: string;
  priority: Priority;
  status: Status;
  resolution: string | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  customer: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    role: Role;
  };
  assignedTo: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    role: Role;
  } | null;
  comments: Comment[];
}

export default function ComplaintDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { currentUserId, currentRole, users } = useUser();
  const [complaint, setComplaint] = useState<ComplaintDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const agents = users.filter((u) => u.role === "AGENT" || u.role === "ADMIN");

  const [error, setError] = useState<string | null>(null);

  const fetchComplaint = useCallback(() => {
    setLoading(true);
    setError(null);
    fetch(`${BACKEND_URL}/api/complaints/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setComplaint(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch complaint:", err);
        setError("Unable to load complaint details. Make sure the backend server is running.");
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    fetchComplaint();
  }, [fetchComplaint]);

  const updateComplaint = async (updates: Record<string, string | null>) => {
    const res = await fetch(`${BACKEND_URL}/api/complaints/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      const updated = await res.json();
      setComplaint((prev) => (prev ? { ...prev, ...updated } : prev));
      toast.success("Complaint updated");
    }
  };

  const addComment = async () => {
    if (!newComment.trim()) return;
    setSubmitting(true);
    const res = await fetch(`${BACKEND_URL}/api/complaints/${id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: newComment,
        userId: currentUserId,
        isInternal,
      }),
    });
    if (res.ok) {
      const comment = await res.json();
      setComplaint((prev) =>
        prev ? { ...prev, comments: [...prev.comments, comment] } : prev
      );
      setNewComment("");
      toast.success(isInternal ? "Internal note added" : "Reply sent");
    }
    setSubmitting(false);
  };

  if (error) {
    return (
      <div className="flex-1">
        <Topbar title="Complaint Details" />
        <div className="p-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4 max-w-md">
            <div className="w-16 h-16 mx-auto rounded-2xl gradient-danger flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Connection Error</h3>
            <p className="text-sm text-muted-foreground">{error}</p>
            <button
              onClick={fetchComplaint}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading || !complaint) {
    return (
      <div className="flex-1">
        <Topbar title="Complaint Details" />
        <div className="p-8">
          <div className="space-y-4">
            <div className="h-20 bg-muted/30 rounded-lg animate-pulse" />
            <div className="h-40 bg-muted/30 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const catConfig =
    CATEGORY_CONFIG[complaint.category as keyof typeof CATEGORY_CONFIG];

  return (
    <div className="flex-1">
      <Topbar title="Complaint Details" />

      <div className="p-8 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Header */}
            <Card className="border-border/50 bg-card/80">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <h1 className="text-xl font-bold leading-tight">
                      {complaint.subject}
                    </h1>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        variant="outline"
                        className="font-mono text-[10px] h-5 border-border/50"
                      >
                        {complaint.id.slice(0, 12)}
                      </Badge>
                      {complaint.orderId && (
                        <Badge
                          variant="outline"
                          className="text-[10px] h-5 border-border/50"
                        >
                          📦 {complaint.orderId}
                        </Badge>
                      )}
                      <Badge
                        variant="outline"
                        className="text-[10px] h-5 border-border/50"
                      >
                        {catConfig?.icon} {catConfig?.label}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <PriorityIndicator priority={complaint.priority} />
                    <StatusBadge status={complaint.status} />
                  </div>
                </div>

                <Separator className="my-4 bg-border/30" />

                <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {complaint.description}
                </div>

                <div className="flex items-center gap-4 mt-4 text-[11px] text-muted-foreground">
                  <span>
                    Created{" "}
                    {new Date(complaint.createdAt).toLocaleString("en", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                  {complaint.resolvedAt && (
                    <span className="text-emerald-400">
                      Resolved{" "}
                      {new Date(complaint.resolvedAt).toLocaleString("en", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Resolution (if exists) */}
            {complaint.resolution && (
              <Card className="border-emerald-500/20 bg-emerald-500/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Resolution
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {complaint.resolution}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Comments Timeline */}
            <Card className="border-border/50 bg-card/80">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">
                  Conversation ({complaint.comments.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {complaint.comments.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-6">
                    No comments yet. Start the conversation below.
                  </p>
                )}

                {complaint.comments.map((comment) => {
                  const roleConfig = ROLE_CONFIG[comment.user.role];
                  return (
                    <div
                      key={comment.id}
                      className={`relative pl-10 pb-4 border-l-2 last:border-l-0 ${
                        comment.isInternal
                          ? "border-amber-500/30"
                          : "border-border/30"
                      }`}
                    >
                      {/* Timeline dot */}
                      <div
                        className={`absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full ${
                          comment.isInternal
                            ? "bg-amber-500"
                            : "bg-primary"
                        }`}
                      />

                      <div
                        className={`rounded-lg p-3 ${
                          comment.isInternal
                            ? "bg-amber-500/5 border border-amber-500/15"
                            : "bg-muted/30 border border-border/30"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-5 w-5">
                              <AvatarFallback className="text-[8px] font-bold bg-primary/10 text-primary">
                                {comment.user.avatar || "?"}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-medium">
                              {comment.user.name}
                            </span>
                            <Badge
                              variant="outline"
                              className={`h-4 text-[8px] px-1 border-0 ${roleConfig?.bgColor} ${roleConfig?.color}`}
                            >
                              {roleConfig?.label}
                            </Badge>
                            {comment.isInternal && (
                              <Badge className="h-4 text-[8px] px-1 bg-amber-500/15 text-amber-400 border-0">
                                🔒 Internal
                              </Badge>
                            )}
                          </div>
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(comment.createdAt).toLocaleString(
                              "en",
                              { dateStyle: "short", timeStyle: "short" }
                            )}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {/* Add Comment */}
                <Separator className="bg-border/30" />
                <div className="space-y-3">
                  <Textarea
                    placeholder={
                      isInternal
                        ? "Add an internal note (only visible to agents & admins)..."
                        : "Type your reply..."
                    }
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[80px] bg-muted/30 border-border/50 resize-none"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {(currentRole === "AGENT" ||
                        currentRole === "ADMIN") && (
                        <Button
                          variant={isInternal ? "default" : "outline"}
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => setIsInternal(!isInternal)}
                        >
                          🔒 Internal Note
                        </Button>
                      )}
                    </div>
                    <Button
                      size="sm"
                      className="h-8"
                      onClick={addComment}
                      disabled={!newComment.trim() || submitting}
                    >
                      {submitting ? "Sending..." : "Send Reply"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Status Controls */}
            {(currentRole === "AGENT" || currentRole === "ADMIN") && (
              <Card className="border-border/50 bg-card/80">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">
                    Manage
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Status */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">
                      Status
                    </label>
                    <Select
                      value={complaint.status}
                      onValueChange={(value) =>
                        updateComplaint({ status: value })
                      }
                    >
                      <SelectTrigger className="h-8 text-xs bg-muted/30 border-border/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="OPEN">Open</SelectItem>
                        <SelectItem value="IN_PROGRESS">
                          In Progress
                        </SelectItem>
                        <SelectItem value="AWAITING_CUSTOMER">
                          Awaiting Customer
                        </SelectItem>
                        <SelectItem value="RESOLVED">Resolved</SelectItem>
                        <SelectItem value="CLOSED">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Priority */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">
                      Priority
                    </label>
                    <Select
                      value={complaint.priority}
                      onValueChange={(value) =>
                        updateComplaint({ priority: value })
                      }
                    >
                      <SelectTrigger className="h-8 text-xs bg-muted/30 border-border/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="URGENT">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Assigned Agent */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">
                      Assigned Agent
                    </label>
                    <Select
                      value={complaint.assignedTo?.id || "unassigned"}
                      onValueChange={(value) =>
                        updateComplaint({
                          assignedToId:
                            value === "unassigned" ? null : value,
                        })
                      }
                    >
                      <SelectTrigger className="h-8 text-xs bg-muted/30 border-border/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">
                          Unassigned
                        </SelectItem>
                        {agents.map((agent) => (
                          <SelectItem key={agent.id} value={agent.id}>
                            {agent.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Customer Info */}
            <Card className="border-border/50 bg-card/80">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">
                  Customer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/15 text-primary text-xs font-bold">
                      {complaint.customer.avatar || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {complaint.customer.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {complaint.customer.email}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assigned Agent Info */}
            {complaint.assignedTo && (
              <Card className="border-border/50 bg-card/80">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">
                    Assigned Agent
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-cyan-500/15 text-cyan-400 text-xs font-bold">
                        {complaint.assignedTo.avatar || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {complaint.assignedTo.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {complaint.assignedTo.email}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Details */}
            <Card className="border-border/50 bg-card/80">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">
                  Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Created</span>
                  <span>
                    {new Date(complaint.createdAt).toLocaleDateString(
                      "en",
                      { dateStyle: "medium" }
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Updated</span>
                  <span>
                    {new Date(complaint.updatedAt).toLocaleDateString(
                      "en",
                      { dateStyle: "medium" }
                    )}
                  </span>
                </div>
                {complaint.resolvedAt && (
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Resolved</span>
                    <span className="text-emerald-400">
                      {new Date(complaint.resolvedAt).toLocaleDateString(
                        "en",
                        { dateStyle: "medium" }
                      )}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Comments</span>
                  <span>{complaint.comments.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
