import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/complaints/[id] — Single complaint detail
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const complaint = await prisma.complaint.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
                role: true,
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!complaint) {
      return NextResponse.json(
        { error: "Complaint not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(complaint);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch complaint details" },
      { status: 500 }
    );
  }
}

// PATCH /api/complaints/[id] — Update complaint attributes
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, priority, category, assignedToId, resolution } = body;

    const data: Record<string, any> = {};
    if (status !== undefined) data.status = status;
    if (priority !== undefined) data.priority = priority;
    if (category !== undefined) data.category = category;
    if (assignedToId !== undefined) data.assignedToId = assignedToId || null;
    if (resolution !== undefined) data.resolution = resolution;

    // Auto-set resolvedAt when status changes to RESOLVED/CLOSED
    if (status === "RESOLVED" || status === "CLOSED") {
      data.resolvedAt = new Date();
    } else if (
      status &&
      ["OPEN", "IN_PROGRESS", "AWAITING_CUSTOMER"].includes(status)
    ) {
      data.resolvedAt = null; // Reset resolvedAt if reopened
    }

    const complaint = await prisma.complaint.update({
      where: { id },
      data,
      include: {
        customer: { select: { id: true, name: true, avatar: true } },
        assignedTo: { select: { id: true, name: true, avatar: true } },
      },
    });

    return NextResponse.json(complaint);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update complaint" },
      { status: 500 }
    );
  }
}
