import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/complaints — List complaints with filters, search, pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const assignedToId = searchParams.get("assignedToId");

    const where: Record<string, any> = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (category) where.category = category;
    if (assignedToId)
      where.assignedToId = assignedToId === "null" ? null : assignedToId;
    if (search) {
      where.OR = [
        { subject: { contains: search } },
        { id: { contains: search } },
        { orderId: { contains: search } },
      ];
    }

    const [complaints, total] = await Promise.all([
      prisma.complaint.findMany({
        where,
        include: {
          customer: { select: { id: true, name: true, avatar: true } },
          assignedTo: { select: { id: true, name: true, avatar: true } },
          _count: { select: { comments: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.complaint.count({ where }),
    ]);

    return NextResponse.json({
      complaints,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch complaints" },
      { status: 500 }
    );
  }
}

// POST /api/complaints — Create a new complaint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subject, description, category, priority, orderId, customerId } =
      body;

    if (!subject || !description || !customerId) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: subject, description, customerId",
        },
        { status: 400 }
      );
    }

    const complaint = await prisma.complaint.create({
      data: {
        subject,
        description,
        category: category || "OTHER",
        priority: priority || "MEDIUM",
        orderId: orderId || null,
        customerId,
      },
      include: {
        customer: { select: { id: true, name: true, avatar: true } },
      },
    });

    return NextResponse.json(complaint, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create complaint" },
      { status: 500 }
    );
  }
}
