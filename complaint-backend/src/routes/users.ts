import { Hono } from "hono";
import { prisma } from "../lib/prisma";

const router = new Hono();

router.get("/", async (c) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
      },
      orderBy: { name: "asc" },
    });
    return c.json(users);
  } catch (error: any) {
    return c.json({ error: error.message || "Failed to fetch users" }, 500);
  }
});

export default router;
