import { Hono } from "hono";
import { prisma } from "../lib/prisma";

const router = new Hono();

// 1. GET / - List complaints with filters, search, pagination
router.get("/", async (c) => {
  try {
    const status = c.req.query("status");
    const priority = c.req.query("priority");
    const category = c.req.query("category");
    const search = c.req.query("search");
    const page = parseInt(c.req.query("page") || "1");
    const limit = parseInt(c.req.query("limit") || "10");
    const assignedToId = c.req.query("assignedToId");

    const where: Record<string, any> = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (category) where.category = category;
    if (assignedToId) where.assignedToId = assignedToId === "null" ? null : assignedToId;
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

    return c.json({
      complaints,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    return c.json({ error: error.message || "Failed to fetch complaints" }, 500);
  }
});

// 2. POST / - Create a new complaint
router.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const { subject, description, category, priority, orderId, customerId } = body;

    if (!subject || !description || !customerId) {
      return c.json({ error: "Missing required fields: subject, description, customerId" }, 400);
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

    return c.json(complaint, 201);
  } catch (error: any) {
    return c.json({ error: error.message || "Failed to create complaint" }, 500);
  }
});

// 3. GET /:id - Single complaint detail
router.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const complaint = await prisma.complaint.findUnique({
      where: { id },
      include: {
        customer: { select: { id: true, name: true, email: true, avatar: true, role: true } },
        assignedTo: { select: { id: true, name: true, email: true, avatar: true, role: true } },
        comments: {
          include: {
            user: { select: { id: true, name: true, avatar: true, role: true } },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!complaint) {
      return c.json({ error: "Complaint not found" }, 404);
    }

    return c.json(complaint);
  } catch (error: any) {
    return c.json({ error: error.message || "Failed to fetch complaint details" }, 500);
  }
});

// 4. PATCH /:id - Update complaint attributes
router.patch("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
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
    } else if (status && ["OPEN", "IN_PROGRESS", "AWAITING_CUSTOMER"].includes(status)) {
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

    return c.json(complaint);
  } catch (error: any) {
    return c.json({ error: error.message || "Failed to update complaint" }, 500);
  }
});

// 5. POST /:id/comments - Add timeline comment
router.post("/:id/comments", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const { content, userId, isInternal = false } = body;

    if (!content || !userId) {
      return c.json({ error: "Missing required fields: content, userId" }, 400);
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        isInternal,
        complaintId: id,
        userId,
      },
      include: {
        user: { select: { id: true, name: true, avatar: true, role: true } },
      },
    });

    return c.json(comment, 201);
  } catch (error: any) {
    return c.json({ error: error.message || "Failed to add comment" }, 500);
  }
});

export default router;
