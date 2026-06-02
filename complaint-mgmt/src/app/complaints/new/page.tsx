"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Topbar } from "@/components/layout/topbar";
import { useUser } from "@/lib/user-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { BACKEND_URL } from "@/lib/api";

export default function NewComplaintPage() {
  const router = useRouter();
  const { currentUserId, users } = useUser();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    subject: "",
    description: "",
    category: "OTHER",
    priority: "MEDIUM",
    orderId: "",
    customerId: "",
  });

  const customers = users.filter((u) => u.role === "CUSTOMER");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subject.trim() || !form.description.trim()) {
      toast.error("Please fill in subject and description");
      return;
    }

    setSubmitting(true);
    const res = await fetch(`${BACKEND_URL}/api/complaints`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        customerId: form.customerId || currentUserId,
        orderId: form.orderId || null,
      }),
    });

    if (res.ok) {
      const complaint = await res.json();
      toast.success("Complaint created successfully");
      router.push(`/complaints/${complaint.id}`);
    } else {
      toast.error("Failed to create complaint");
    }
    setSubmitting(false);
  };

  return (
    <div className="flex-1">
      <Topbar title="New Complaint" />

      <div className="p-8 max-w-2xl animate-fade-in">
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
                    d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              Submit a New Complaint
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Customer Selection (for admin/agent) */}
              {customers.length > 0 && (
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">
                    Customer
                  </Label>
                  <Select
                    value={form.customerId}
                    onValueChange={(v) =>
                      setForm({ ...form, customerId: v || "" })
                    }
                  >
                    <SelectTrigger className="bg-muted/30 border-border/50">
                      <SelectValue placeholder="Select customer (or leave for current user)" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Subject */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">
                  Subject <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="Brief description of the issue"
                  value={form.subject}
                  onChange={(e) =>
                    setForm({ ...form, subject: e.target.value })
                  }
                  className="bg-muted/30 border-border/50"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  placeholder="Provide detailed information about your complaint. Include order numbers, dates, and any relevant details."
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="min-h-[140px] bg-muted/30 border-border/50 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Category */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Category</Label>
                  <Select
                    value={form.category}
                    onValueChange={(v) =>
                      setForm({ ...form, category: v || "OTHER" })
                    }
                  >
                    <SelectTrigger className="bg-muted/30 border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PRODUCT_DEFECT">
                        🔧 Product Defect
                      </SelectItem>
                      <SelectItem value="SHIPPING_DELAY">
                        📦 Shipping Delay
                      </SelectItem>
                      <SelectItem value="WRONG_ITEM">
                        🔄 Wrong Item
                      </SelectItem>
                      <SelectItem value="REFUND_REQUEST">
                        💰 Refund Request
                      </SelectItem>
                      <SelectItem value="BILLING_ISSUE">
                        💳 Billing Issue
                      </SelectItem>
                      <SelectItem value="ACCOUNT_ISSUE">
                        👤 Account Issue
                      </SelectItem>
                      <SelectItem value="OTHER">📋 Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Priority */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Priority</Label>
                  <Select
                    value={form.priority}
                    onValueChange={(v) =>
                      setForm({ ...form, priority: v || "MEDIUM" })
                    }
                  >
                    <SelectTrigger className="bg-muted/30 border-border/50">
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

                {/* Order ID */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">
                    Order ID{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                    placeholder="ORD-XXXX-XXXX"
                    value={form.orderId}
                    onChange={(e) =>
                      setForm({ ...form, orderId: e.target.value })
                    }
                    className="bg-muted/30 border-border/50"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="border-border/50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="gradient-primary text-white border-0 hover:opacity-90"
                >
                  {submitting ? "Creating..." : "Submit Complaint"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
