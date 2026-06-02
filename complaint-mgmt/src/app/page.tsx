"use client";

import { useEffect, useState } from "react";
import { Topbar } from "@/components/layout/topbar";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/complaints/status-badge";
import { PriorityIndicator } from "@/components/complaints/priority-indicator";
import { CATEGORY_CONFIG } from "@/lib/constants";
import Link from "next/link";
import { BACKEND_URL } from "@/lib/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";

interface DashboardData {
  totalOpen: number;
  todayNew: number;
  totalComplaints: number;
  resolvedComplaints: number;
  avgResolutionHours: number;
  slaBreach: number;
  statusCounts: Record<string, number>;
  priorityCounts: Record<string, number>;
  categoryCounts: Record<string, number>;
  dailyTrend: { date: string; count: number; resolved: number }[];
  agentPerformance: {
    id: string;
    name: string;
    avatar: string | null;
    total: number;
    resolved: number;
    inProgress: number;
  }[];
  recentComplaints: {
    id: string;
    subject: string;
    status: string;
    priority: string;
    category: string;
    createdAt: string;
    customer: { name: string; avatar: string | null };
    assignedTo: { name: string; avatar: string | null } | null;
  }[];
}

const CHART_COLORS = [
  "oklch(0.7 0.18 270)",
  "oklch(0.72 0.16 170)",
  "oklch(0.75 0.13 50)",
  "oklch(0.68 0.18 320)",
  "oklch(0.65 0.13 140)",
  "oklch(0.7 0.15 200)",
  "oklch(0.6 0.2 30)",
];

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = () => {
    setLoading(true);
    setError(null);
    fetch(`${BACKEND_URL}/api/dashboard`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch dashboard:", err);
        setError("Unable to connect to backend. Make sure the backend server is running on port 4000.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (error) {
    return (
      <div className="flex-1">
        <Topbar title="Dashboard" />
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
              onClick={fetchDashboard}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className="flex-1">
        <Topbar title="Dashboard" />
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="h-32 bg-card/50 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const categoryData = Object.entries(data.categoryCounts).map(
    ([key, value]) => ({
      name: CATEGORY_CONFIG[key as keyof typeof CATEGORY_CONFIG]?.label || key,
      value,
      icon: CATEGORY_CONFIG[key as keyof typeof CATEGORY_CONFIG]?.icon || "📋",
    })
  );

  const priorityData = [
    { name: "Low", value: data.priorityCounts.LOW || 0, color: "#71717a" },
    { name: "Medium", value: data.priorityCounts.MEDIUM || 0, color: "#60a5fa" },
    { name: "High", value: data.priorityCounts.HIGH || 0, color: "#fbbf24" },
    { name: "Urgent", value: data.priorityCounts.URGENT || 0, color: "#f43f5e" },
  ];

  const trendData = data.dailyTrend.map((d) => ({
    ...d,
    date: new Date(d.date).toLocaleDateString("en", {
      weekday: "short",
    }),
  }));

  return (
    <div className="flex-1">
      <Topbar title="Dashboard" />

      <div className="p-8 space-y-6 animate-fade-in">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
          <KpiCard
            title="Open Tickets"
            value={data.totalOpen}
            subtitle={`${data.totalComplaints} total`}
            gradient="gradient-primary"
            icon={
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
            trend={{ value: 12, label: "vs last week" }}
            delay={0}
          />
          <KpiCard
            title="Avg Resolution"
            value={`${data.avgResolutionHours}h`}
            subtitle="Average time to resolve"
            gradient="gradient-success"
            icon={
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            trend={{ value: -8, label: "improvement" }}
            delay={60}
          />
          <KpiCard
            title="Today's New"
            value={data.todayNew}
            subtitle="Tickets created today"
            gradient="gradient-warning"
            icon={
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            delay={120}
          />
          <KpiCard
            title="SLA Breaches"
            value={data.slaBreach}
            subtitle="Open > 48 hours"
            gradient="gradient-danger"
            icon={
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            }
            delay={180}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Ticket Trend */}
          <Card className="lg:col-span-2 border-border/50 bg-card/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">
                Ticket Volume — Last 7 Days
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.7 0.18 270)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="oklch(0.7 0.18 270)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.72 0.16 170)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="oklch(0.72 0.16 170)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.02 270)" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "oklch(0.6 0.02 270)" }} />
                  <YAxis tick={{ fontSize: 11, fill: "oklch(0.6 0.02 270)" }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.17 0.02 270)",
                      border: "1px solid oklch(0.25 0.025 270)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="oklch(0.7 0.18 270)"
                    fill="url(#colorCount)"
                    strokeWidth={2}
                    name="New"
                  />
                  <Area
                    type="monotone"
                    dataKey="resolved"
                    stroke="oklch(0.72 0.16 170)"
                    fill="url(#colorResolved)"
                    strokeWidth={2}
                    name="Resolved"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card className="border-border/50 bg-card/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">
                By Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.17 0.02 270)",
                      border: "1px solid oklch(0.25 0.025 270)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {categoryData.slice(0, 4).map((item, i) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                        }}
                      />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Priority Distribution */}
          <Card className="border-border/50 bg-card/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">
                Priority Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={priorityData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.02 270)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "oklch(0.6 0.02 270)" }} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "oklch(0.6 0.02 270)" }} width={55} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.17 0.02 270)",
                      border: "1px solid oklch(0.25 0.025 270)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent Complaints */}
          <Card className="lg:col-span-2 border-border/50 bg-card/80">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold">
                Recent Complaints
              </CardTitle>
              <Link
                href="/complaints"
                className="text-xs text-primary hover:underline"
              >
                View all →
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.recentComplaints.map((complaint) => (
                  <Link
                    key={complaint.id}
                    href={`/complaints/${complaint.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                        {complaint.customer.avatar || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                        {complaint.subject}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {complaint.customer.name} •{" "}
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <PriorityIndicator priority={complaint.priority as "LOW" | "MEDIUM" | "HIGH" | "URGENT"} />
                      <StatusBadge status={complaint.status as "OPEN" | "IN_PROGRESS" | "AWAITING_CUSTOMER" | "RESOLVED" | "CLOSED"} />
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Agent Performance */}
        <Card className="border-border/50 bg-card/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">
              Agent Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.agentPerformance.map((agent) => (
                <div
                  key={agent.id}
                  className="flex items-center gap-3 p-4 rounded-lg bg-muted/30 border border-border/30"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/15 text-primary text-xs font-bold">
                      {agent.avatar || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{agent.name}</p>
                    <div className="flex gap-3 mt-1">
                      <span className="text-[11px] text-muted-foreground">
                        <span className="font-semibold text-foreground">{agent.total}</span> assigned
                      </span>
                      <span className="text-[11px] text-emerald-400">
                        <span className="font-semibold">{agent.resolved}</span> resolved
                      </span>
                      <span className="text-[11px] text-amber-400">
                        <span className="font-semibold">{agent.inProgress}</span> active
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">
                      {agent.total > 0 ? Math.round((agent.resolved / agent.total) * 100) : 0}%
                    </p>
                    <p className="text-[10px] text-muted-foreground">resolved</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
