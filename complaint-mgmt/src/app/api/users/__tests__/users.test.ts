import { describe, it, expect, vi } from "vitest";
import { prismaMock } from "../../../../__mocks__/prisma";
import { GET } from "../route";

describe("GET /api/users", () => {
  it("should return a list of users ordered by name", async () => {
    const mockUsers = [
      { id: "1", name: "Alice", email: "alice@test.com", role: "ADMIN", avatar: "A" },
      { id: "2", name: "Bob", email: "bob@test.com", role: "CUSTOMER", avatar: "B" },
    ] as any;

    prismaMock.user.findMany.mockResolvedValue(mockUsers);

    const response = await GET();
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toEqual(mockUsers);
    expect(prismaMock.user.findMany).toHaveBeenCalledWith({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
      },
      orderBy: { name: "asc" },
    });
  });

  it("should handle database error and return 500 status", async () => {
    prismaMock.user.findMany.mockRejectedValue(new Error("Database error"));

    const response = await GET();
    expect(response.status).toBe(500);

    const data = await response.json();
    expect(data).toEqual({ error: "Database error" });
  });
});
