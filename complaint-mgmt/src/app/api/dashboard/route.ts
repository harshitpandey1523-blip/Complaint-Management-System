import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Status counts
    const statusCounts = await prisma.complaint.groupBy({
      by: ["status"],
      _count: true,
    });

    // Priority counts
    const priorityCounts = await prisma.complaint.groupBy({
      by: ["priority"],
      _count: true,
    });

    // Category counts
    const categoryCounts = await prisma.complaint.groupBy({
      by: ["category"],
      _count: true,
    });

    // Total open (not resolved/closed)
    const totalOpen = await prisma.complaint.count({
      where: { status: { notIn: ["RESOLVED", "CLOSED"] } },
    });

    // Today's new
    const todayNew = await prisma.complaint.count({
      where: { createdAt: { gte: today } },
    });

    // Total complaints
    const totalComplaints = await prisma.complaint.count();

    // Resolved complaints
    const resolvedComplaints = await prisma.complaint.count({
      where: { status: { in: ["RESOLVED", "CLOSED"] } },
    });

    // Average resolution time (for resolved complaints)
    const resolvedWithTime = await prisma.complaint.findMany({
      where: {
        resolvedAt: { not: null },
      },
      select: {
        createdAt: true,
        resolvedAt: true,
      },
    });

    let avgResolutionHours = 0;
    if (resolvedWithTime.length > 0) {
      const totalHours = resolvedWithTime.reduce((acc, comp) => {
        const diff =
          (comp.resolvedAt!.getTime() - comp.createdAt.getTime()) / 3600000;
        return acc + diff;
      }, 0);
      avgResolutionHours = Math.round(totalHours / resolvedWithTime.length);
    }

    // Daily trend (last 7 days)
    const allComplaints = await prisma.complaint.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true, status: true },
    });

    const dailyTrend: { date: string; count: number; resolved: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 86400000);
      const dateStr = date.toISOString().split("T")[0];
      const dayStart = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
      const dayEnd = new Date(dayStart.getTime() + 86400000);

      const dayComplaints = allComplaints.filter(
        (comp) => comp.createdAt >= dayStart && comp.createdAt < dayEnd
      );

      dailyTrend.push({
        date: dateStr,
        count: dayComplaints.length,
        resolved: dayComplaints.filter((comp) =>
          ["RESOLVED", "CLOSED"].includes(comp.status)
        ).length,
      });
    }

    // Agent performance
    const agents = await prisma.user.findMany({
      where: { role: { in: ["AGENT", "ADMIN"] } },
      select: {
        id: true,
        name: true,
        avatar: true,
        complaintsAssigned: {
          select: { status: true },
        },
      },
    });

    const agentPerformance = agents.map((agent) => ({
      id: agent.id,
      name: agent.name,
      avatar: agent.avatar,
      total: agent.complaintsAssigned.length,
      resolved: agent.complaintsAssigned.filter((comp) =>
        ["RESOLVED", "CLOSED"].includes(comp.status)
      ).length,
      inProgress: agent.complaintsAssigned.filter(
        (comp) => comp.status === "IN_PROGRESS"
      ).length,
    }));

    // Recent complaints
    const recentComplaints = await prisma.complaint.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        customer: { select: { name: true, avatar: true } },
        assignedTo: { select: { name: true, avatar: true } },
      },
    });

    // SLA breaches (open > 48h)
    const slaBreach = await prisma.complaint.count({
      where: {
        status: { notIn: ["RESOLVED", "CLOSED"] },
        createdAt: { lt: new Date(now.getTime() - 48 * 3600000) },
      },
    });

    return NextResponse.json({
      totalOpen,
      todayNew,
      totalComplaints,
      resolvedComplaints,
      avgResolutionHours,
      slaBreach,
      statusCounts: statusCounts.reduce(
        (acc, s) => ({ ...acc, [s.status]: s._count }),
        {} as Record<string, number>
      ),
      priorityCounts: priorityCounts.reduce(
        (acc, p) => ({ ...acc, [p.priority]: p._count }),
        {} as Record<string, number>
      ),
      categoryCounts: categoryCounts.reduce(
        (acc, cat) => ({ ...acc, [cat.category]: cat._count }),
        {} as Record<string, number>
      ),
      dailyTrend,
      agentPerformance,
      recentComplaints,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
