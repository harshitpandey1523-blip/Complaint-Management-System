import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/complaints/[id]/comments — Add a comment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { content, userId, isInternal = false } = body;

    if (!content || !userId) {
      return NextResponse.json(
        { error: "Missing required fields: content, userId" },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        isInternal,
        complaintId: id,
        userId,
      },
      include: {
        user: {
          select: { id: true, name: true, avatar: true, role: true },
        },
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to add comment" },
      { status: 500 }
    );
  }
}
